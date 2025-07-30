"use client"

import { getAllCategory } from "@/actions/category/getAllCategory"
import { categoryAtom } from "@/atom/category"
import { userAtom } from "@/atom/user"
import { useAtom, useAtomValue } from "jotai"
import { useCallback, useEffect, useState } from "react"

interface UseCategoriesProps {
    autoFetch? : boolean
}

export const useCategories = ({autoFetch}:UseCategoriesProps) => {

    const user = useAtomValue(userAtom)
    const [categories, setCategories] = useAtom(categoryAtom)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchCategories = useCallback(async () => {

        if(!user) return

        try {
            setIsLoading(true)
            setError(null)

            const result = await getAllCategory(user.id)

            if(!result.success || !result.data) {
                const errorMessage = result.message || "カテゴリーの取得に失敗しました"
                setError(errorMessage)
                return false
            }

            setCategories(result.data)

        } catch(error) {
            const errorMessage = "予期しないエラーが発生しました"
            console.error(error)
            setError(errorMessage)
            return false
        } finally {
            setIsLoading(false)
        }
    },[user, setCategories])

    useEffect(() => {
        if(autoFetch) {
            fetchCategories()
        }
    },[autoFetch,fetchCategories])

    return {
        fetchCategories,
        categories,
        isLoading,
        error,
    }
}