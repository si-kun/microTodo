import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import TodoDialog from "../TodoDialog";
import userEvent from "@testing-library/user-event";

jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn(),
}));

describe("DateCard Component", () => {
  const user = userEvent.setup();

  const setupHelpers = {
    openDialog: async () => {
      render(<TodoDialog mode="create" />);

      const triggerButton = screen.getByRole("button", {
        name: "Todoを作成する",
      });
      await user.click(triggerButton);
    },

    // 要素を取得
    dateCardElement: () => ({
      deadlineCheckbox: screen.getByTestId("deadline-checkbox"),
      startDateInput: screen.getByRole("button", { name: "開始日" }),
      endDateInput: screen.getByRole("button", { name: "終了日" }),
      dateInputsContainer: screen.queryByTestId("date-inputs-container"),
    }),
  };

  it("デフォルトは日付未定にチェックが入っていない", async () => {
    await setupHelpers.openDialog();

    const { deadlineCheckbox, startDateInput, endDateInput } =
      setupHelpers.dateCardElement();

    await waitFor(() => {
      expect(deadlineCheckbox).not.toBeChecked();
      expect(startDateInput).toBeInTheDocument();
      expect(endDateInput).toBeInTheDocument();
    });
  });

  it("日付未定にチェックを入れると開始日と終了日が非表示になる", async () => {
    await setupHelpers.openDialog();

    const { deadlineCheckbox, startDateInput, endDateInput } =
      setupHelpers.dateCardElement();

    fireEvent.click(deadlineCheckbox);

    await waitFor(() => {
      expect(deadlineCheckbox).toBeChecked();
      expect(startDateInput).not.toBeInTheDocument();
      expect(endDateInput).not.toBeInTheDocument();
    });
  });

  // it("開始日を選択すると日付選択ができる", async () => {
  //   await setupHelpers.openDialog();

  //   const { startDateInput } = setupHelpers.dateCardElement();

  //   console.log("開始日ボタンを探す")
  //   console.log("開始日ボタン", startDateInput)
  //   console.log("開始日ボタンをクリックする")
  //   await user.click(startDateInput);
  //   console.log("カレンダーが表示される")

  //   await user.click(startDateInput);


  // })
});
