import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import TodoDialog from "../TodoDialog";
import userEvent from "@testing-library/user-event";

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

  it("レンダリング時に、要素が存在すること", () => {});
});
