import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import SourceBar from "..src/client/components/SourceBar";

describe("<SourceBar />", () => {
  it("renders without crashing", () => {
    render(<SourceBar />);
  });

  // 여기에 추가적인 테스트 케이스를 구현할 수 있습니다.
});
