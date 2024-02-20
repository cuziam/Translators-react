// TranslateSource.test.jsx
import { describe, it, expect, test, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import Translate from "../src/client/components/main/Translate";
import TranslateSource from "../src/client/components/main/TranslateSource";
import {
  TranslateContext,
  AppContext,
} from "../src/client/components/main/Context";

//Translate 컴포넌트의 context를 그대로 사용하기 위한 mock context
const mockContext = {
  updateSourceConfig: vi.fn(),
  webSocketRef: { current: { emit: vi.fn() } },
  updateShouldTranslate: vi.fn(),
  updateShouldHistoryOpen: vi.fn(),
  sourceConfig: {
    sourceLang: "en",
    sourceText: "",
    supportedLangs: ["en", "ko", "ja", "zh-CN", "zh-TW", "es", "fr", "de"],
    history: [],
  },
};
const mockAppContext = {
  updateShouldAiChatOpen: vi.fn(),
};

Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
  MediaDevices: {
    getUserMedia: vi.fn().mockResolvedValue({}),
  },
});

describe("TranslateSource", () => {
  // `window.alert`를 모킹하기 위한 설정
  beforeEach(() => {
    window.alert = vi.fn();
  });

  // 테스트 후 `window.alert`를 원래 상태로 복원
  afterEach(() => {
    window.alert.mockRestore();
  });

  it("copy to clipboard button working", async () => {
    render(
      <AppContext.Provider value={mockAppContext}>
        <TranslateContext.Provider value={mockContext}>
          <TranslateSource />
        </TranslateContext.Provider>
      </AppContext.Provider>
    );
    const editarea = screen.getByRole("textbox");
    const copyTextButton = screen.getByTitle("Copy");

    fireEvent.change(editarea, { target: { value: "Text input is here..." } });
    fireEvent.click(copyTextButton);
    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
    expect(window.alert).toHaveBeenCalledTimes(1);
  });

  it("tts request button working", async () => {
    render(
      <AppContext.Provider value={mockAppContext}>
        <TranslateContext.Provider value={mockContext}>
          <TranslateSource />
        </TranslateContext.Provider>
      </AppContext.Provider>
    );
    const editarea = screen.getByRole("textbox");
    const ttsButton = screen.getByTitle("Text to Speech");

    fireEvent.change(editarea, { target: { value: "Text input is here..." } });
    fireEvent.click(ttsButton);
    expect(mockContext.webSocketRef.current.emit).toHaveBeenCalledTimes(1);
  });

  it("Speech to Text button working", async () => {
    render(
      <AppContext.Provider value={mockAppContext}>
        <TranslateContext.Provider value={mockContext}>
          <TranslateSource />
        </TranslateContext.Provider>
      </AppContext.Provider>
    );
    const sttButton = screen.getByTitle("Speech to text");

    fireEvent.click(sttButton);
    expect(mockContext.updateShouldTranslate).toHaveBeenCalledTimes(1);
    expect(mockContext.webSocketRef.current.emit).toHaveBeenCalledTimes(1);
  });
});
