import '@testing-library/jest-dom'
import { render, screen } from "@testing-library/react";
import { useAtomValue } from "jotai"
import TodoProgress from "../components/TodoProgress";

// jotaiのモック
jest.mock("jotai", () => ({
    ...jest.requireActual("jotai"),
    useAtomValue: jest.fn()
}))

const mockUseAtomValue = useAtomValue as jest.MockedFunction<typeof useAtomValue>;

describe("TodoProgress", () => {
    beforeEach(() => {
        mockUseAtomValue.mockClear();
    })

    it("Todo数が0の時、0%と表示される", () => {

        mockUseAtomValue.mockReturnValue([])

        render(<TodoProgress />)

        expect(screen.getByText("全体: 0件")).toBeInTheDocument()
        expect(screen.getByText("完了: 0件")).toBeInTheDocument()
        expect(screen.getByText("0%")).toBeInTheDocument()
    })

    it("完了が50%の場合", () => {

        mockUseAtomValue.mockReturnValue([
            { completed: true},
            { completed: false},
        ])

        render(<TodoProgress />)

        expect(screen.getByText("全体: 2件")).toBeInTheDocument()
        expect(screen.getByText("完了: 1件")).toBeInTheDocument()
        expect(screen.getByText("50%")).toBeInTheDocument()

    })
})