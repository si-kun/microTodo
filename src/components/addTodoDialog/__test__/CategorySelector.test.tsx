import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import CategorySelector from '../components/CategorySelector'
import { useForm } from 'react-hook-form'
import userEvent from '@testing-library/user-event'

jest.mock("react-hook-form", () => ({
    ...jest.requireActual("react-hook-form"),
    useForm: jest.fn(),
}))

jest.mock("@/hooks/useCategories", () => ({
    useCategories: () => ({
        categories: [
            {id: 1, name: "仕事"},
            {id: 2, nae: "プライベート"},
            {id: 3, name: "その他"}
        ]
    })
}))

const mockUseForm = useForm as jest.MockedFunction<typeof useForm>
const register = jest.fn()
const watch = jest.fn()
const setValue = jest.fn()


describe("CategorySelector", () => {

    beforeEach(() => {
        mockUseForm.mockClear()
        register.mockClear()
        watch.mockClear()
        setValue.mockClear()
    })

    it("カテゴリーが選択できる", async () => {

        mockUseForm.mockReturnValue({
            register,
            watch,
            setValue,
        } as any)

        render(<CategorySelector register={register} isReadOnly={false} watch={watch} setValue={setValue} />)

        // カテゴリー選択が存在する
        const select = screen.getByRole("combobox")
        expect(select).toBeInTheDocument()

        // カテゴリーが選択できる
        const trigger = screen.getByText("Select a Category")
        expect(trigger).toBeInTheDocument()

        userEvent.click(trigger)
    })

})