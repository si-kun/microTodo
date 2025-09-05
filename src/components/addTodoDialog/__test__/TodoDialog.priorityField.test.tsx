import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import TodoDialog from "../TodoDialog";
import userEvent from "@testing-library/user-event";

jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn()
}))

describe("priorityField Component", () => {
  const user = userEvent.setup();
  const setupHelpers = {
    openDialog: async () => {
      render(<TodoDialog mode="create" />);

      const triggerButton = screen.getByRole("button", {
        name: "Todoを作成する",
      });

      await user.click(triggerButton);
    },

    priorityElement: () => ({
      low: screen.getByRole("radio", { name: "低" }),
      medium: screen.getByRole("radio", { name: "中" }),
      high: screen.getByRole("radio", { name: "高" }),
    }),
  };

  it("レンダリング時に要素が存在し、初期値は低になっている", async() => {

    console.log("初期状態テスト開始")
    await setupHelpers.openDialog();

    const { low, medium, high } = setupHelpers.priorityElement();

    // 要素確認
    await waitFor(() => {
      expect(low).toBeInTheDocument();
      expect(medium).toBeInTheDocument();
      expect(high).toBeInTheDocument();
    })
    console.log("✅全ての要素確認OK")

    // 初期値確認
    await waitFor(() => {
      expect(low).toHaveClass("border-green-600");
      expect(medium).toHaveClass("border-gray-200");
      expect(high).toHaveClass("border-gray-200");
    })
    console.log("✅初期値は[低]が選択されている")
  });

  it("別の優先度を選択できる", async() => {
    console.log("優先度選択テスト開始")
    await setupHelpers.openDialog();

    const { low, medium, high } = setupHelpers.priorityElement();

    await user.click(medium);

    // 中を選択
    console.log("中を選択中...")
    await waitFor(() => {
      expect(medium).toHaveClass("border-yellow-600");
      expect(low).toHaveClass("border-gray-200");
      expect(high).toHaveClass("border-gray-200");
    })
    console.log("✅中の選択成功")

    // 高を選択
    console.log("高を選択中...")
    await user.click(high);
    await waitFor(() => {
      expect(high).toHaveClass("border-red-600");
      expect(medium).toHaveClass("border-gray-200");
      expect(low).toHaveClass("border-gray-200");
    })
    console.log("✅高の選択成功")

    // 低を選択
    console.log("低を選択中...")
    await user.click(low);

    await waitFor(() => {
      expect(low).toHaveClass("border-green-600");
      expect(high).toHaveClass("border-gray-200");
      expect(medium).toHaveClass("border-gray-200");
    })
    console.log("✅低の選択成功")
  })


});
