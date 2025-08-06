import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { useAtom } from "jotai";
import SearchTodo from "../components/SearchTodo";

jest.mock("jotai", () => ({
  ...jest.requireActual("jotai"),
  useAtom: jest.fn(),
}));

const mockUseAtom = useAtom as jest.MockedFunction<typeof useAtom>;

describe("SearchTodo", () => {
  beforeEach(() => {
    mockUseAtom.mockClear();
  });

  it("初期状態は空", () => {
    const mockSetSearchTerm = jest.fn();
    mockUseAtom.mockReturnValue(["", mockSetSearchTerm] as any);

    render(<SearchTodo />);

    expect(screen.getByPlaceholderText("Search Todo...")).toBeInTheDocument();
  });

  it("文字を入力するとsetSearchTermが呼ばれる", () => {
    const mockSetSearchTerm = jest.fn();
    mockUseAtom.mockReturnValue(["test", mockSetSearchTerm] as any);

    render(<SearchTodo />);

    const input = screen.getByPlaceholderText("Search Todo...");
    fireEvent.change(input, { target: { value: "新しい検索語" } });

    expect(mockSetSearchTerm).toHaveBeenCalledWith("新しい検索語");
  });

  it("複数回入力できる", () => {
    const mockSetSearchTerm = jest.fn();
    mockUseAtom.mockReturnValue(["test", mockSetSearchTerm] as any);

    render(<SearchTodo />);

    const input = screen.getByPlaceholderText("Search Todo...");
    fireEvent.change(input, { target: { value: "world" } });
    fireEvent.change(input, { target: { value: "hello" } });

    expect(mockSetSearchTerm).toHaveBeenCalledTimes(2);
    expect(mockSetSearchTerm).toHaveBeenNthCalledWith(1, "world");
    expect(mockSetSearchTerm).toHaveBeenNthCalledWith(2, "hello");
  });
});
