import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import TodoDialog from "../TodoDialog";
import { render, screen, waitFor } from "@testing-library/react";

jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn(),
}));

describe("TodoTitleField Component", () => {
  const user = userEvent.setup();

  const setupHelpers = {
    openDialog: async () => {
      render(<TodoDialog mode="create" />);

      // ダイアログを開く
      const openButton = screen.getByRole("button", { name: "Todoを作成する" });
      await user.click(openButton);
    },
    // 要素を取得
    titleFieldElement: () => ({
      input: screen.getByPlaceholderText("Create New Todo"),
    }),
  };

  it("タイトル入力フィールドが存在する", async () => {
    await setupHelpers.openDialog();

    const { input } = setupHelpers.titleFieldElement();
    expect(input).toBeInTheDocument();
  });

  it("タイトル入力フィールドが編集可能である", async () => {
    await setupHelpers.openDialog();

    const { input } = setupHelpers.titleFieldElement();

    user.type(input, "test");

    await waitFor(() => {
      expect(input).toHaveValue("test");
    });
  });
});
