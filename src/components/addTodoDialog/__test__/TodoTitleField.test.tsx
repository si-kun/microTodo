import "@testing-library/jest-dom";
import userEvent from '@testing-library/user-event'
import { render, screen } from "@testing-library/react";
import TodoTitleField from "../components/TodoTitleField";
import { useForm } from "react-hook-form";

jest.mock("react-hook-form", () => ({
  ...jest.requireActual("react-hook-form"),
  useForm: jest.fn(),
}));

const errors = {};

const mockUseForm = useForm as jest.MockedFunction<typeof useForm>;
const register = jest.fn(() => ({ name: "title", onChange: jest.fn(), onBlur: jest.fn(), ref: jest.fn() }));

describe("TodoTitleField", () => {
  beforeEach(() => {
    mockUseForm.mockReset();
    register.mockClear();
  });

  it("input入力ができる", async () => {

    mockUseForm.mockReturnValue({
        register,
        formState: {errors}
    } as any);

    const mockRegister = register as jest.MockedFunction<typeof register>

    render(
      <TodoTitleField errors={errors} register={mockRegister as any} isReadOnly={false} />
    );

    const input = screen.getByPlaceholderText("Create New Todo");
    expect(input).toBeInTheDocument();

    await userEvent.type(input, "test")
    expect(input).toHaveValue("test")
  });
});
