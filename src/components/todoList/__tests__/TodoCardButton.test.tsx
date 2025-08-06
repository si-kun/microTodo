import { render, screen, fireEvent } from "@testing-library/react";
import TodoCardButton from "../components/TodoCardButton";
import "@testing-library/jest-dom";

describe("TodoCardButton", () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it("ボタンが正しくレンダリングされる", () => {
    render(<TodoCardButton buttonName="テストボタン" onClick={mockOnClick} />);

    expect(screen.getByText("テストボタン")).toBeInTheDocument();
  });

  it("クリック時にonClickが呼ばれる", () => {
    render(<TodoCardButton buttonName="削除" onClick={mockOnClick} />);

    const button = screen.getByText("削除");
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("destructiveバリアントが適用される", () => {
    render(
      <TodoCardButton
        buttonName="削除"
        onClick={mockOnClick}
        variant="destructive"
      />
    );

    const button = screen.getByText("削除");
    expect(button).toHaveClass("bg-destructive");
  });
});
