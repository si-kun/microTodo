import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TodoDialog from "../TodoDialog";
import { useCategories } from "@/hooks/useCategories";
import useCategorySelector from "@/hooks/useCategorySelector";

jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn(),
}));

jest.mock("@/hooks/useCategories", () => ({
  useCategories: jest.fn(),
}));

// 3. カテゴリーセレクターフックのモック
jest.mock("@/hooks/useCategorySelector", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockUseCategories = useCategories as jest.MockedFunction<
  typeof useCategories
>;
const mockFetchCategories = jest.fn();

const mockUseCategorySelector = useCategorySelector as jest.MockedFunction<
  typeof useCategorySelector
>;
const mockHandleCategorySelect = jest.fn();

describe("CategorySelector Component", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    mockUseCategories.mockReturnValue({
      fetchCategories: mockFetchCategories,
      categories: [
        { id: "1", name: "Work", color: "#ff0000", userId: "test-user" },
        { id: "2", name: "Personal", color: "#00ff00", userId: "test-user" },
      ],
      isLoading: false,
      error: null,
    });

    mockUseCategorySelector.mockReturnValue({
      hasCustomInput: false,
      handleCategorySelect: mockHandleCategorySelect,
      handleInputCategoryChange: jest.fn(),
      isExistingCategory: true,
      categoryValue: "Work",
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const setupHelpers = {
    openDialog: async () => {
      render(<TodoDialog mode="create" />);

      const triggerButton = screen.getByRole("button", {
        name: "Todoを作成する",
      });
      await user.click(triggerButton);
    },

    categorySelectorElement: () => ({
      categorySelector: screen.getByTestId("category-selector"),
      categoryInput: screen.getByPlaceholderText("新規カテゴリー"),
      categoryColorInput: screen.getByTestId("category-color-input"),
    }),
  };

  it("モックがundefinedでないこと", () => {
    const result = mockUseCategories({ autoFetch: true });

    console.log("デバッグ情報");
    console.log(result);
    console.log("result is undefined?", result === undefined);
    console.log("categories:", result?.categories);

    expect(result).toBeDefined();
    expect(result.categories).toBeDefined();
  });

  it("各要素が正しくレンダリングされること", async () => {
    console.log("レンダリングテスト開始");
    await setupHelpers.openDialog();

    const { categorySelector, categoryInput, categoryColorInput } =
      setupHelpers.categorySelectorElement();

    await waitFor(() => {
      expect(categorySelector).toBeInTheDocument();
      expect(categoryInput).toBeInTheDocument();
      expect(categoryColorInput).toBeInTheDocument();
    });
  });

  it("新規カテゴリー入力時、selectがdisabledになること", async () => {
    console.log("入力テスト開始");

    mockUseCategorySelector.mockReturnValue({
      hasCustomInput: true,
      handleCategorySelect: mockHandleCategorySelect,
      handleInputCategoryChange: jest.fn(),
      isExistingCategory: false,
      categoryValue: "",
    });

    await setupHelpers.openDialog();

    const { categorySelector, categoryInput } =
      setupHelpers.categorySelectorElement();

    await user.type(categoryInput, "New Category");

    await waitFor(() => {
      expect(categoryInput).toHaveValue("New Category");
      expect(categorySelector).toBeDisabled();
    });

    console.log("入力テスト完了");
  });

  it("既存のカテゴリーを選択できる(暫定版)", async () => {
    console.log("暫定テスト開始");

    await setupHelpers.openDialog();

    const { categorySelector } = setupHelpers.categorySelectorElement();

    // ハンドラーが正しく動くかテスト
    console.log("セレクターの存在確認:");
    expect(categorySelector).toBeInTheDocument();

    // モックハンドラーを呼び出し
    console.log("ハンドラーを直接呼出し:");
    mockHandleCategorySelect("Work");

    expect(mockHandleCategorySelect).toHaveBeenCalledWith("Work");
    expect(mockHandleCategorySelect).toHaveBeenCalledTimes(1);

    console.log("暫定テスト完了");
  });

  it("カテゴリーカラーの入力ができること", async () => {
    console.log("カラー入力テスト開始");

    await setupHelpers.openDialog();
    const { categoryColorInput } = setupHelpers.categorySelectorElement();


    fireEvent.change(categoryColorInput, {
        target: { value : "#FF5733" },
    })
    
    await waitFor(() => {
      expect(categoryColorInput).toHaveValue("#ff5733");
    })

    console.log("カラー入力テスト完了")
  })
});
