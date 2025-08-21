import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import TodoList from "../TodoList";

// supabase のモック
jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn(),
}));

// Mocking the actions
// deleteTodo toggleTodo
jest.mock("@/actions/todo/deleteTodo");
jest.mock("@/actions/todo/toggleTodo");

// Mocking the costom hooks
jest.mock("@/hooks/useTodos");

// Jotaiフックのみモック
jest.mock("jotai", () => ({
  ...jest.requireActual("jotai"),
  useAtomValue: jest.fn(),
  useAtom: jest.fn(),
  useSetAtom: jest.fn(),
}));

// Mocking the libraries
jest.mock("react-hot-toast");

describe("TodoList Component", () => {
  // モック関数の取得
  const mockUseTodos = jest.requireMock("@/hooks/useTodos").useTodos;
  const mockUseAtomValue = jest.requireMock("jotai").useAtomValue;

  beforeEach(() => {
    // テスト前にモック関数をクリア
    jest.clearAllMocks();
  });

  // テスト用のヘルパー関数
  const createMockTodo = ({
    id = "mock-1",
    completed = false,
    title = "テストTodo",
  } = {}) => {
    const todo = {
      id,
      title,
      completed,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
      hasDeadline: false,
      startDate: null,
      dueDate: null,
      isPriority: "normal",
      userId: "test-user",
      categoryId: "cat-1",
      tags: [],
      category: {
        name: "仕事",
        color: "#ff0000",
      },
      checkList: [],
    };

    return todo;
  };

  const mockEmptyUseTodos = {
    todos: [],
    isLoading: false,
    error: null,
    fetchTodos: jest.fn(),
    updateTodoInState: jest.fn(),
    addTodoToState: jest.fn(),
    removeTodoFromState: jest.fn(),
    completedCount: 0,
    totalCount: 0,
  };

  const setupTest = (filter = "all", searchTerm = "", todos = [] as any) => {
    mockUseAtomValue.mockClear();
    mockUseAtomValue
      .mockReturnValueOnce(filter)
      .mockReturnValueOnce(searchTerm)
      .mockReturnValueOnce(filter)
      .mockReturnValueOnce(searchTerm);

    mockUseTodos.mockReturnValue({
      ...mockEmptyUseTodos, // オブジェクトのスプレッド
      todos,
    });
  };

  const createMockTodos = (pattern = "mixed") => {
    switch (pattern) {
      case "mixed":
        return [
          createMockTodo({
            id: "mock-1",
            completed: false,
            title: "テストTodo",
          }),
          createMockTodo({
            id: "mock-2",
            completed: true,
            title: "完了したTodo",
          }),
          createMockTodo({
            id: "mock-3",
            completed: false,
            title: "未完了のTodo",
          }),
        ];
      case "allCompleted":
        return [
          createMockTodo({
            id: "mock-1",
            completed: true,
            title: "完了したTodo1",
          }),
          createMockTodo({
            id: "mock-2",
            completed: true,
            title: "完了したTodo2",
          }),
        ];
      case "allIncomplete":
        return [
          createMockTodo({
            id: "mock-1",
            completed: false,
            title: "未完了のTodo1",
          }),
          createMockTodo({
            id: "mock-2",
            completed: false,
            title: "未完了のTodo2",
          }),
        ];
    }
  };

  describe("初期表示", () => {
    it("初期状態での表示", async () => {
      setupTest("all", "", []);

      render(<TodoList />);

      await waitFor(() => {
        // 初期状態では何も表示されないことを確認
        expect(screen.queryByText("Todoがありません")).toBeInTheDocument();
      });
    });
  });

  describe("フィルターのテスト", () => {
    it("フィルターが全てのとき、Todoが表示される", async () => {
      setupTest("all", "", createMockTodos());

      render(<TodoList />);

      await waitFor(() => {
        expect(screen.getByText("テストTodo")).toBeInTheDocument();
        expect(screen.getByText("完了したTodo")).toBeInTheDocument();
        expect(screen.getByText("未完了のTodo")).toBeInTheDocument();
      });
    });

    it("完了フィルター: 未完了Todoは表示されない", async () => {
      setupTest("completed", "", createMockTodos("incomplete"));

      render(<TodoList />);

      await waitFor(() => {
        expect(
          screen.getByText("フィルターに該当するTodoがありません")
        ).toBeInTheDocument();
      });
    });

    it("完了フィルター: 2つの完了Todoのみ表示される", async () => {
      setupTest("completed", "", createMockTodos("allCompleted"));

      render(<TodoList />);

      await waitFor(() => {
        expect(screen.getAllByRole("listitem")).toHaveLength(2);
        expect(screen.getByText("完了したTodo1")).toBeInTheDocument();
        expect(screen.getByText("完了したTodo2")).toBeInTheDocument();
      });
    });

    it("未完了フィルター: 完了Todoは表示されない", async () => {
      setupTest("incomplete", "", createMockTodos("allIncomplete"));

      render(<TodoList />);

      await waitFor(() => {
        expect(screen.getAllByRole("listitem")).toHaveLength(2);
        expect(screen.getByText("未完了のTodo1")).toBeInTheDocument();
        expect(screen.getByText("未完了のTodo2")).toBeInTheDocument();
      });
    });
  });

  describe("検索機能テスト", () => {
    it("検索フィルターが適用されている場合、該当するTodoを表示する", async () => {
      setupTest("all", "テスト", createMockTodos());

      render(<TodoList />);

      await waitFor(() => {
        expect(screen.getByText("テストTodo")).toBeInTheDocument();
        expect(screen.queryByText("完了したTodo")).not.toBeInTheDocument();
      });
    });

    it("検索語が存在しない場合、Todoが表示されない", async () => {
      setupTest("all", "存在しない検索語", [createMockTodo()]);

      render(<TodoList />);

      await waitFor(() => {
        expect(
          screen.getByText("検索に該当するTodoがありません")
        ).toBeInTheDocument();
        expect(screen.queryByText("テストTodo")).not.toBeInTheDocument();
      });
    });
  });

  describe("検索、フィルター両方のテスト", () => {
    it("検索とフィルターが両方正しい場合、該当のTodoを表示する", async () => {
      setupTest("incomplete", "テスト", createMockTodos());

      render(<TodoList />);

      await waitFor(() => {
        expect(screen.getByText("テストTodo")).toBeInTheDocument();
        expect(screen.queryByText("完了したTodo")).not.toBeInTheDocument();
        expect(screen.queryByText("未完了のTodo")).not.toBeInTheDocument();
      });
    });

    it("フィルターが適用されており、検索語がヒットしない場合、Todoが表示されない", async () => {
      setupTest("completed", "存在しない検索語", createMockTodos());

      render(<TodoList />);

      await waitFor(() => {
        expect(
          screen.getByText("該当するTodoがありません")
        ).toBeInTheDocument();
        expect(screen.queryByText("完了したTodo")).not.toBeInTheDocument();
      });
    });

    it("検索語は存在し、フィルターが間違っている場合、Todoが表示されない", async () => {
      setupTest("completed", "テスト", createMockTodos());

      render(<TodoList />);

      await waitFor(() => {
        expect(
          screen.getByText("該当するTodoがありません")
        ).toBeInTheDocument();
        expect(screen.queryByText("テストTodo")).not.toBeInTheDocument();
      });
    });
  });

  describe("エッジケース", () => {
    it("空文字検索は全てのTodoが表示される", async () => {
      setupTest("all", "", createMockTodos("mixed"));

      render(<TodoList />);

      await waitFor(() => {
        expect(screen.getByText("テストTodo")).toBeInTheDocument();
        expect(screen.getAllByRole("listitem")).toHaveLength(3);
      });
    });

    it("スペースのみの検索語は全てのTodoが表示される", async () => {
      setupTest("all", " ", createMockTodos("mixed"));

      render(<TodoList />);

      await waitFor(() => {
        expect(screen.getByText("テストTodo")).toBeInTheDocument();
        expect(screen.getAllByRole("listitem")).toHaveLength(3);
      });
    });
  });
});
