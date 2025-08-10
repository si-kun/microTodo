import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import AuthForm from "../AuthForm";
import userEvent from "@testing-library/user-event";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/actions/user/signin", () => ({
  signin: jest.fn(),
}));

jest.mock("@/actions/user/signup", () => ({
  signup: jest.fn(),
}));

jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn(),
}));

describe("AuthForm", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("要素の確認", async () => {
    render(<AuthForm authType="signin" />);
    const submitButton = screen.getByRole("button", { name: "サインイン" });
    const mailInput =
      screen.getByPlaceholderText("メールアドレスを入力してください");
    const passwordInput =
      screen.getByPlaceholderText("パスワードを入力してください");
    expect(mailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  it("空で送信を試みる", async () => {
    render(<AuthForm authType="signin" />);
    const submitButton = screen.getByRole("button", { name: "サインイン" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("有効なメールアドレスを入力してください")
      ).toBeInTheDocument();
      expect(
        screen.getByText("パスワードは6文字以上で入力してください")
      ).toBeInTheDocument();
    });
  });

  it("サインインの送信", async () => {
    const mockSignin = jest.requireMock("@/actions/user/signin").signin;
    mockSignin.mockResolvedValue({
      success: true,
      message: "サインインが完了しました。",
    });

    render(<AuthForm authType="signin" />);

    const submitButton = screen.getByRole("button", { name: "サインイン" });
    const mailInput =
      screen.getByPlaceholderText("メールアドレスを入力してください");
    const passwordInput =
      screen.getByPlaceholderText("パスワードを入力してください");

    await user.type(mailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSignin).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  // サインアップテスト
  it("サインアップの要素確認", async () => {

    render(<AuthForm authType="signup" />);

    const submitButton = screen.getByRole("button", { name: "新規登録"});
    const userNameInput = screen.getByPlaceholderText("ユーザーネームを入力してください");
    const mailInput = screen.getByPlaceholderText("メールアドレスを入力してください");
    const passwordInput = screen.getByPlaceholderText("パスワードを入力してください");
    const avatarInput = screen.getByPlaceholderText("アバター画像の選択してください");
    expect(userNameInput).toBeInTheDocument();
    expect(mailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(avatarInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  })

  it("サインアップを空で送信を試みる", async () => {

    render(<AuthForm authType="signup" />);

    const submitButton = screen.getByRole("button", { name: "新規登録" });
    await user.click(submitButton);

    // バリデーションメッセージ
    await waitFor(() => {
      expect(screen.getByText("ユーザー名は必須です")).toBeInTheDocument();
      expect(screen.getByText("有効なメールアドレスを入力してください")).toBeInTheDocument();
      expect(screen.getByText("パスワードは6文字以上で入力してください")).toBeInTheDocument();
    })
  })

  it("サインアップの送信", async () => {

    const mockSignup = jest.requireMock("@/actions/user/signup").signup;

    mockSignup.mockResolvedValue({
      success: true,
      message: "新規登録が完了しました",
    })
    render(<AuthForm authType="signup" />);

    const submitButton = screen.getByRole("button", { name: "新規登録"});
    const userNameInput = screen.getByPlaceholderText("ユーザーネームを入力してください");
    const mailInput = screen.getByPlaceholderText("メールアドレスを入力してください");
    const passwordInput = screen.getByPlaceholderText("パスワードを入力してください");
    const avatarInput = screen.getByPlaceholderText("アバター画像の選択してください");

    await user.type(userNameInput, "testuser");
    await user.type(mailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.upload(avatarInput, new File(["test"], "avatar.png", { type: "image/png" }));

    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      })
    })
  })
});
