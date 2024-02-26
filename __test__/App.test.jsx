import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, cleanup, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../src/client/store/index";
import App from "../src/client/App";
import userEvent from "@testing-library/user-event";

describe("<App />", () => {
  beforeEach(() => {
    global.navigator.clipboard = {
      writeText: vi.fn(),
    };
    global.alert = vi.fn();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("renders without crashing and receives redux store", () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
  });

  it("can send translate request and receive a response", async () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    const sourceText = "Hello, World!";
    const sourceEditarea = await screen.getByTestId("sourceEditarea");
    await userEvent.type(sourceEditarea, sourceText);

    // 번역 결과를 기다림
    await waitFor(
      () => {
        const targetEditareas = screen.getAllByTestId("targetEditarea");
        targetEditareas.forEach((editarea) => {
          const text = editarea.textContent;
          expect(text).toBeTruthy(); // 더 강력한 검사
          expect(text).not.toBe("...");
          expect(text).not.toBeNull();
          expect(text).not.toBeUndefined();
        });
      },
      { timeout: 5000 }
    ); // 5초 동안 대기
  }, 10000);

  it("can copy the text", async () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    const copyButtons = screen.getAllByTitle("Copy");
    for (const button of copyButtons) {
      await userEvent.click(button);
    }

    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(
      copyButtons.length
    );
    expect(alert).toHaveBeenCalledTimes(copyButtons.length);
  });

  //tools test
  it("can send tts request and receive a response", async () => {});

  it("can send spt request and receive a response", async () => {});

  it("can show and hide the history", async () => {});

  it("can show and hide Aichat", async () => {});

  it("can send aichat request and receive a response", async () => {});
});
