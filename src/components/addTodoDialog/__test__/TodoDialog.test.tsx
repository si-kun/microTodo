import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import TodoDialog from "../TodoDialog";
import userEvent from "@testing-library/user-event";

jest.mock("@/actions/todo/addTodo", () => ({
  addTodo: jest.fn(),
}));

jest.mock("@/actions/todo/updateTodo", () => ({
  updateTodo: jest.fn(),
}));

jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn(),
}));

jest.mock("jotai", () => ({
  atom: jest.fn(),
  useAtomValue: jest.fn(),
  useSetAtom: jest.fn(),
  useAtom: jest.fn(() => [[{}], jest.fn()]),
}));

jest.mock("@/hooks/useCategories", () => ({
  useCategories: jest.fn(() => ({
    categories: [
      { id: "1", name: "Work", color: "#ff0000" },
      { id: "2", name: "Personal", color: "#00ff00" },
    ],
    isLoading: false,
    error: null,
  })),
}));
describe("TodoDialog", () => {
  const user = userEvent.setup();

  async function openTodoDialog() {
    render(<TodoDialog mode="create" />);

    const trigger = screen.getByText("Todoを作成する");
    expect(trigger).toBeInTheDocument();

    await user.click(trigger);
  }

  it("トリガーボタンをクリックしたらダイアログが開く", async () => {
    await openTodoDialog();

    expect(await screen.findByText("Todo Title")).toBeInTheDocument();
  });

  it("各入力欄に入力できる", async () => {
    await openTodoDialog();

    const input =  screen.getByPlaceholderText("Create New Todo");
    await user.type(input, "New Todo Item");
    expect(input).toHaveValue("New Todo Item");

    // 日付のInputを取得
    const startDateInput =  screen.getByTestId("select-startDate");
    const dueDateInput =  screen.getByTestId("select-dueDate");

    await user.click(startDateInput);
    const startCalendar = await screen.findByRole("grid");
    expect(startCalendar).toBeInTheDocument();

    // 開始日のカレンダーから日付を選択
    const startDayButton = await screen.getByRole("button", {
      name: /August 1st/,
    });
    await user.click(startDayButton);

    await waitFor(() => {
      expect(startDateInput).toHaveTextContent("2025/8/1");
      expect(screen.queryByRole("grid")).not.toBeInTheDocument();
    });

    // 終了日のカレンダーから日付を選択
    await user.click(dueDateInput);
    const dueDayButton =  screen.getByRole("button", {
      name: /August 27th/,
    });
    await user.click(dueDayButton);
    await waitFor(() => {
      expect(dueDateInput).toHaveTextContent("2025/8/27");
      expect(screen.queryByRole("grid")).not.toBeInTheDocument();
    });
  });

  it("カテゴリーのカラーが正しく反映される", async () => {
    await openTodoDialog();

    const categoryColorInput = screen.getByTestId("category-color-input");
    expect(categoryColorInput).toBeInTheDocument();
    await user.click(categoryColorInput);
    fireEvent.change(categoryColorInput, { target: { value: "#ff0000" } });

    await waitFor(() => {
      expect(categoryColorInput).toHaveValue("#ff0000");
    });
  });

  it("カテゴリーの選択ができる", async () => {
    await openTodoDialog();

    const categoryTrigger = screen.getByRole("combobox");
    expect(categoryTrigger).toBeInTheDocument();

    fireEvent.click(categoryTrigger);

    const workCategory = await screen.findByRole("option", {name: "Work"});
    expect(workCategory).toBeInTheDocument();

    fireEvent.click(workCategory);
    await waitFor(() => {
      expect(categoryTrigger).toHaveTextContent("Work");
    });
  });

  it("新規カテゴリーの入力ができる", async () => {
    await openTodoDialog();

    const newCategoryInput = screen.getByPlaceholderText("新規カテゴリー")
    expect(newCategoryInput).toBeInTheDocument();

    await user.type(newCategoryInput, "Test")
    expect(newCategoryInput).toHaveValue("Test");

    // セレクトがdisabledになっていることを確認
    const categorySelect = screen.getByRole("combobox")
    expect(categorySelect).toBeDisabled();
  })

  it("チェックリストの追加と削除", async () => {
    await openTodoDialog();

    const addChecklistTrigger = screen.getByText("チェックリストを追加する");
    expect(addChecklistTrigger).toBeInTheDocument();
    

    await user.click(addChecklistTrigger);
    
    const checklistInput = screen.getByPlaceholderText("チェックリストのタイトル");
    expect(checklistInput).toBeInTheDocument();
    const checklistCount = screen.getByTestId("checkCount");
    expect(checklistCount).toBeInTheDocument();

    await user.type(checklistInput, "Checklist Item 1");
    expect(checklistInput).toHaveValue("Checklist Item 1");

    const addChecklistButton = screen.getByTestId("addChecklist-button");
    expect(addChecklistButton).toBeInTheDocument();
    await user.click(addChecklistButton);
    expect(screen.getByText("Checklist Item 1")).toBeInTheDocument();
    expect(checklistInput).toHaveValue("");

    // isCompletedのチェックボックスが表示されていることを確認
    const checklistCheckbox = screen.getByTestId("checklist-1");
    expect(checklistCheckbox).toBeInTheDocument();
    expect(checklistCount).toHaveTextContent("チェックリストの数 0 / 1");
    await user.click(checklistCheckbox);
    expect(checklistCheckbox).toBeChecked();
    expect(checklistCount).toHaveTextContent("チェックリストの数 1 / 1");

    // 削除テスト
    const deleteButton = screen.getByTestId("deleteChecklist-1");
    expect(deleteButton).toBeInTheDocument();
    await user.click(deleteButton);
    expect(screen.getByText("チェックリストが登録されていません")).toBeInTheDocument();

    // チェックリストダイアログを閉じる
    const closeButton = screen.getByTestId("closeChecklistDialog-button");
    expect(closeButton).toBeInTheDocument();
    await user.click(closeButton);
    expect(addChecklistTrigger).toBeInTheDocument();
  })

  it("優先度の切り替え", async() => {

    await openTodoDialog();

    const priorityTitle = screen.getByText("優先度を選択")
    expect(priorityTitle).toBeInTheDocument();

    const priorityLow = screen.getByRole("radio", { name: "低"});
    expect(priorityLow).toBeInTheDocument();
    const priorityMedium = screen.getByRole("radio", { name: "中"});
    expect(priorityMedium).toBeInTheDocument();
    const priorityHigh = screen.getByRole("radio", { name: "高"});
    expect(priorityHigh).toBeInTheDocument();

    await user.click(priorityMedium);
    expect(priorityMedium).toHaveClass("border-yellow-600 bg-yellow-200")

    await user.click(priorityHigh);
    expect(priorityHigh).toHaveClass("border-red-600 bg-red-200");
    expect(priorityMedium).toHaveClass("border-gray-200 hover:border-gray-300")

    await user.click(priorityLow);
    expect(priorityLow).toHaveClass("border-green-600 bg-green-200");
    expect(priorityMedium).toHaveClass("border-gray-200 hover:border-gray-300");
    expect(priorityHigh).toHaveClass("border-gray-200 hover:border-gray-300");

  })

  it("送信ボタンをクリックしてTodoを作成", async () => {

    await openTodoDialog();

    const TodoInput= screen.getByPlaceholderText("Create New Todo");
    expect(TodoInput).toBeInTheDocument();

    const submitButton = screen.getByRole("button", { name : "Todo Create"})
    expect(submitButton).toBeInTheDocument();

    // 空の状態
    await user.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText("タスク名は必須です")).toBeInTheDocument();
      TodoInput.focus();
    })

    // 入力して送信
    user.type(TodoInput, "New Todo Item")
    await user.click(submitButton);
    await waitFor(() => {
      expect(TodoInput).toHaveValue("New Todo Item");
    })

  }) 
});
 