import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import TodoDialog from "../TodoDialog";
import userEvent from "@testing-library/user-event";
import toast from "react-hot-toast";

jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn(),
}));

jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: {
    success: jest.fn(() => ({ id: "success-id" })),
    error: jest.fn(() => ({ id: "error-id" })),
    loading: jest.fn(() => ({ id: "loading-id" })),
  },
}));

jest.mock("react-hot-toast", () => ({
  error: jest.fn(),
  success: jest.fn(),
}))

const mockedToast = jest.mocked(toast);

describe("TodoDialog Component mode create", () => {
  const user = userEvent.setup();

  const openDialog = async () => {
    const openTrigger = await screen.findByRole("button", {
      name: "Todoを作成する",
    });

    await user.click(openTrigger);
  };
  describe("TodoDialog", () => {
    it("TodoDialogが正しく開かれる", async () => {
      render(<TodoDialog mode={"create"} />);

      openDialog();

      await waitFor(() => {
        expect(
          screen.getByText(
            "新しいTodoを作成します。必要な情報を入力してください。"
          )
        ).toBeInTheDocument();
      });
    });
  });

  describe("TodoTitleField", () => {
    it("タイトル入力欄が正しく表示される", async () => {
      render(<TodoDialog mode={"create"} />);

      openDialog();

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText("Create New Todo")
        ).toBeInTheDocument();
      });
    });
  });

  // ChecklistDialogのテスト完了
  describe("ChecklistDialog", () => {
    // 共通のセットアップ関数
    const setupHelpers = {
      // ダイアログを開く
      openTodoDialog: async () => {
        render(<TodoDialog mode={"create"} />);
        const openTrigger = await screen.getByRole("button", {
          name: "Todoを作成する",
        });
        await user.click(openTrigger);
      },

      // チェックリストダイアログまで開く
      openChecklistDialog: async () => {
        await setupHelpers.openTodoDialog();

        const checklistTrigger = screen.getByRole("button", {
          name: "チェックリストを追加する",
        });
        await user.click(checklistTrigger);

        // チェックリストダイアログが開いているか確認
        await waitFor(() => {
          expect(
            screen.getByText("チェックリスト項目の作成")
          ).toBeInTheDocument();
        });
      },

      // チェックリストダイアログの要素を取得
      getChecklistElements: () => ({
        input: screen.getByPlaceholderText("チェックリストのタイトル"),
        addButton: screen.getByTestId("addChecklist-button"),
        closeButton: screen.getByTestId("closeChecklistDialog-button"),
      }),

      // チェックリストアイテムを追加
      addChecklistItem: async (title: string) => {
        const { input, addButton } = setupHelpers.getChecklistElements();

        fireEvent.change(input, { target: { value: title } });
        fireEvent.click(addButton);

        // 追加されたことを確認
        await waitFor(() => {
          expect(screen.getByText(title)).toBeInTheDocument();
          expect(input).toHaveValue("");
        });
      },

      // 複数のチェックリストアイテムの追加
      addMultipleItems: async (titles: string[]) => {
        for (const title of titles) {
          await setupHelpers.addChecklistItem(title);
        }
      },
    };
    it("ChecklistDialogが正しく開かれ、初期状態は何もない", async () => {
      await setupHelpers.openChecklistDialog();

      await waitFor(() => {
        expect(
          screen.getByText("チェックリストが登録されていません")
        ).toBeInTheDocument();
      });
    });

    it("新しいチェックリストを追加できる", async () => {
      await setupHelpers.openChecklistDialog();
      await setupHelpers.addChecklistItem("fireEventテスト");

      expect(screen.getByText("fireEventテスト")).toBeInTheDocument();
    });

    it("複数のチェックリストが追加できる", async () => {
      await setupHelpers.openChecklistDialog();

      await setupHelpers.addMultipleItems([
        "fireEventテスト1",
        "fireEventテスト2",
        "fireEventテスト3",
      ]);

      await waitFor(() => {
        expect(screen.getByText("fireEventテスト1")).toBeInTheDocument();
        expect(screen.getByText("fireEventテスト2")).toBeInTheDocument();
        expect(screen.getByText("fireEventテスト3")).toBeInTheDocument();
      });
    });

    it("チェックリストの削除ができる", async () => {
      await setupHelpers.openChecklistDialog();

      await setupHelpers.addChecklistItem("fireEventテスト");
      const deleteButton = screen.getByTestId("deleteChecklist-1");

      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(screen.queryByText("fireEventテスト")).not.toBeInTheDocument();
        expect(
          screen.getByText("チェックリストが登録されていません")
        ).toBeInTheDocument();
      });
    });

    it("チェックリストの完了、未完了が切り替えられる", async () => {
      await setupHelpers.openChecklistDialog();

      await setupHelpers.addChecklistItem("fireEventテスト");
      const checklistItem = screen.getByTestId("checklist-1");

      // 初期状態は未完了
      await waitFor(() => {
        expect(checklistItem).not.toBeChecked();
      });

      // クリックして完了にする
      fireEvent.click(checklistItem);

      await waitFor(() => {
        expect(checklistItem).toBeChecked();
      });
    });

    it("checklistDialogを閉じることができる", async () => {
      await setupHelpers.openChecklistDialog();
      const { closeButton } = setupHelpers.getChecklistElements();
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(
          screen.queryByText("チェックリストを追加する")
        ).toBeInTheDocument();
      });
    });

     it('checklistDialogを閉じてもチェックリストが残っている', async() => {
      await setupHelpers.openChecklistDialog()

      await setupHelpers.addChecklistItem("checklistDialogを閉じても残っている");

      await waitFor(() => {
        expect(
          screen.getByText("checklistDialogを閉じても残っている")
        ).toBeInTheDocument();
      });

      const {closeButton} = setupHelpers.getChecklistElements();
      fireEvent.click(closeButton);


      // チェックリストダイアログが閉じられているか確認
      await waitFor(() => {
        expect(
          screen.getByText("チェックリストを追加する")
        ).toBeInTheDocument();
      });

      // 再度チェックリストを開いて、チェックリストが残っているか確認
      const checklistTrigger = screen.getByRole("button", {
        name: "チェックリストを追加する",
      });
      fireEvent.click(checklistTrigger);

      await waitFor(() => {
        expect(screen.getByText("checklistDialogを閉じても残っている")).toBeInTheDocument();
      })
    });

    it("空の状態でチェックリストを追加するとエラーがでる", async() => {
      await setupHelpers.openChecklistDialog();

      const { addButton } = setupHelpers.getChecklistElements();
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(mockedToast.error).toHaveBeenCalledWith("タイトルが入力されていません");
      })
    })
  });

  describe("DateCard", () => {});

  describe("CategorySelector", () => {});

  describe("PriorityField", () => {});

  describe("TodoDialogFooter", () => {});
});

