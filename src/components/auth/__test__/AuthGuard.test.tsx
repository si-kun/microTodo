import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import AuthGuard from "../AuthGuard";

jest.mock("@/actions/user/getUser", () => ({
  getUser: jest.fn(),
}));

jest.mock("jotai", () => ({
  atom: jest.fn(),
  useAtom: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

describe("AuthGuard", () => {
  const mockReplace = jest.fn();
  const mockSetUser = jest.fn();

  beforeEach(() => {
    const { useRouter } = jest.requireMock("next/navigation");
    useRouter.mockReturnValue({
      replace: mockReplace,
    });

    jest.clearAllMocks();
  });

  it("未認証ユーザーはサインインページにリダイレクトされる", async () => {
    const mockGetUser = jest.requireMock("@/actions/user/getUser").getUser;
    const mockUseRouter = jest.requireMock("next/navigation").useRouter;
    const mockReplace = jest.fn();

    mockGetUser.mockResolvedValue({
      success: false,
      message: "ログインが必要です",
      data: null,
    });

    mockUseRouter.mockReturnValue({
      replace: mockReplace,
    });

    const { useAtom } = jest.requireMock("jotai");
    useAtom.mockReturnValue([null, mockSetUser]);

    render(
      <AuthGuard>
        <div data-testid="protected-content">秘密の内容</div>
      </AuthGuard>
    );

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/signin");
    });

    expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
  });

  it("認証済みのユーザーはコンテンツにアクセスできる", async () => {
    const mockGetUser = jest.requireMock("@/actions/user/getUser").getUser;
    const mockUseRouter = jest.requireMock("next/navigation").useRouter;
    const mockReplace = jest.fn();

    const mockUser = { id: "123", name: "Test User" };
    mockGetUser.mockResolvedValue({
      success: true,
      message: "ユーザーの取得に成功しました",
      data: mockUser,
    });

    mockUseRouter.mockReturnValue({
      replace: mockReplace,
    });

    const { useAtom } = jest.requireMock("jotai");
    useAtom.mockReturnValue([mockUser, mockSetUser]);

    render(
      <AuthGuard>
        <div data-testid="protected-content">秘密の内容</div>
      </AuthGuard>
    );

    await waitFor(() => {
        expect(mockSetUser).toHaveBeenCalledWith(mockUser);
    })

    expect(screen.getByTestId("protected-content")).toBeInTheDocument();

  });
});
