import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useAtom, useAtomValue } from "jotai";
import SelectFilterTodos from "../components/SelectFilterTodos";

jest.mock("jotai", () => ({
  ...jest.requireActual("jotai"),
  useAtomValue: jest.fn(),
  useAtom: jest.fn(),
}));

const mockUseAtomValue = useAtomValue as jest.MockedFunction<
  typeof useAtomValue
>;

const mockUseAtom = useAtom as jest.MockedFunction<typeof useAtom>;

describe("SelectFilterTodos", () => {
  beforeEach(() => {
    mockUseAtomValue.mockClear();
    mockUseAtom.mockClear();
  });

  it("フィルター選択肢が表示される", async () => {
    mockUseAtomValue.mockReturnValue([]);
    const mockSetFilter = jest.fn();
    mockUseAtom.mockReturnValue(["all", mockSetFilter] as any);

    render(<SelectFilterTodos />);

    const select = screen.getByRole("combobox");
    fireEvent.click(select);

    await waitFor(() => {
      expect(select).toHaveAttribute("aria-expanded", "true");
    });

    await waitFor(() => {
      expect(document.body).toHaveTextContent("すべて(0)");
      expect(document.body).toHaveTextContent("未完了(0)");
      expect(document.body).toHaveTextContent("完了(0)");
    });
  });

  it("Todoありのリストで数が正しく表示される", async () => {
    mockUseAtomValue.mockReturnValue([
      { id: 1, completed: false },
      { id: 2, completed: true },
      { id: 3, completed: false },
    ]);

    const mockSetFilter = jest.fn();
    mockUseAtom.mockReturnValue(["all", mockSetFilter] as any);

    render(<SelectFilterTodos />);

    const select = screen.getByRole("combobox");
    fireEvent.click(select);

    await waitFor(() => {
      expect(select).toHaveAttribute("aria-expanded", "true");
    });

    await waitFor(() => {
      expect(document.body).toHaveTextContent("すべて(3)");
      expect(document.body).toHaveTextContent("未完了(2)");
      expect(document.body).toHaveTextContent("完了(1)");
    });
  });

  it("フィルターが変更される", async () => {
    const mockSetFilter = jest.fn();
    mockUseAtom.mockReturnValue(["all", mockSetFilter] as any);

    render(<SelectFilterTodos />);

    const select = screen.getByRole("combobox");
    fireEvent.click(select);

    await waitFor(() => {
      expect(select).toHaveAttribute("aria-expanded", "true");
    });

    const completeOption = screen.getByRole("option", { name: "完了(1)" });
    fireEvent.click(completeOption);

    expect(mockSetFilter).toHaveBeenCalledWith("completed");
  });
});
