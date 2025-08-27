import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import ChecklistDialog from "../ChecklistDialog";
import userEvent from "@testing-library/user-event";

const user = userEvent.setup();

jest.mock("react-hot-toast");

// jest.mock("react-hook-form", () => ({
//   ...jest.requireActual("react-hook-form"),
//   setValue: jest.fn(),
// }));

const createMockChecklist = ({
  title = "テストチェックリスト",
  order = 1,
  completed = false,
} = {}) => {
  const checklist = {
    title,
    order,
    completed,
  };

  return checklist;
};

const defaultMockSetValue = jest.fn();

const createMockProps = ({
  checkList = [] as any[],
  setValue = defaultMockSetValue,
  triggerText = "チェックリストを追加する",
} = {}) => {
  return {
    checkList,
    setValue,
    triggerText,
  };
};

const openChecklistDialog = async (
  triggerText = "チェックリストを追加する"
) => {
  const triggerButton = screen.getByRole("button", { name: triggerText });
  expect(triggerButton).toBeInTheDocument();

  await user.click(triggerButton);

  await waitFor(() => {
    expect(screen.getByText("チェックリスト項目の作成")).toBeInTheDocument();
  });
};

describe("ChecklistDialog Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("チェックリストの開閉", () => {
    it("チェックダイアログが開く", async () => {
      render(<ChecklistDialog {...createMockProps()} />);

      await openChecklistDialog();
    });

    it("チェックダイアログが閉じる", async () => {
      render(<ChecklistDialog {...createMockProps()} />);

      await openChecklistDialog();

      const closeButton = screen.getByTestId("closeChecklistDialog-button");
      expect(closeButton).toBeInTheDocument();
      await user.click(closeButton);

      await waitFor(() => {
        expect(
          screen.queryByText("チェックリスト項目の作成")
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("setValueの確認", () => {
    it("チェックリストの追加", async () => {
      const mockSetValue = jest.fn();

      render(
        <ChecklistDialog {...createMockProps({ setValue: mockSetValue })} />
      );

      await openChecklistDialog();

      const checklistInput =
        screen.getByPlaceholderText("チェックリストのタイトル");
      const addChecklistButton = screen.getByTestId("addChecklist-button");
      expect(checklistInput).toBeInTheDocument();
      expect(addChecklistButton).toBeInTheDocument();

      await user.type(checklistInput, "チェックリスト項目1");
      expect(checklistInput).toHaveValue("チェックリスト項目1");

      await user.click(addChecklistButton);

      expect(mockSetValue).toHaveBeenCalledWith("checkList", [
        {
          title: "チェックリスト項目1",
          order: 1,
          completed: false,
        },
      ]);

      await waitFor(() => {
        expect(checklistInput).toHaveValue("");
      });
    });
  });

  describe("チェックリストの表示", () => {
    it("空のチェックリストの場合、何も表示されない", async () => {
      render(<ChecklistDialog {...createMockProps()} />);

      await openChecklistDialog();

      await waitFor(() => {
        expect(
          screen.getByText("チェックリストが登録されていません")
        ).toBeInTheDocument();
      });
    });

    it("既存のチェックリストがある場合、表示される", async () => {
      const mockCheckList = [
        createMockChecklist({
          title: "チェックリスト項目1",
          order: 1,
          completed: false,
        }),
        createMockChecklist({
          title: "チェックリスト項目2",
          order: 2,
          completed: true,
        }),
      ];

      render(
        <ChecklistDialog {...createMockProps({ checkList: mockCheckList })} />
      );

      await openChecklistDialog();

      await waitFor(() => {
        expect(screen.getByText("チェックリスト項目1")).toBeInTheDocument();
        expect(screen.getByText("チェックリスト項目2")).toBeInTheDocument();
        expect(screen.getByTestId("checkCount")).toHaveTextContent(
          "チェックリストの数 1 / 2"
        );
      });
    });
  });

  describe("チェックリストの操作", () => {
    it("完了状態の切り替え", async () => {
      const mockSetValue = jest.fn();

      const mockCheckList = [
        createMockChecklist({
          title: "チェックリスト項目1",
          order: 1,
          completed: false,
        }),
      ];

      render(
        <ChecklistDialog
          {...createMockProps({
            checkList: mockCheckList,
            setValue: mockSetValue,
          })}
        />
      );

      await openChecklistDialog();
      expect(screen.getByText("チェックリスト項目1")).toBeInTheDocument();

      expect(
        screen.getByRole("checkbox", { name: "チェックリスト項目1" })
      ).not.toBeChecked();

      await user.click(
        screen.getByRole("checkbox", { name: "チェックリスト項目1" })
      );

      await waitFor(() => {
        expect(mockSetValue).toHaveBeenCalledWith("checkList", [
          { title: "チェックリスト項目1", order: 1, completed: true },
        ]);
      });
    });

    it("チェックリストの削除", async () => {
      const mockSetValue = jest.fn();

      const mockCheckList = [
        createMockChecklist({
          title: "チェックリスト項目1",
          order: 1,
          completed: false,
        }),
      ];

      render(
        <ChecklistDialog
          {...createMockProps({
            checkList: mockCheckList,
            setValue: mockSetValue,
          })}
        />
      );
      await openChecklistDialog();

      expect(screen.getByText("チェックリスト項目1")).toBeInTheDocument();

      const deleteButton = screen.getByTestId("deleteChecklist-1")

      await user.click(deleteButton);

      await waitFor(() => {
        expect(mockSetValue).toHaveBeenCalledWith("checkList",[])
      })
    });
  });
});
