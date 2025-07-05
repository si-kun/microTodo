"use server"

import { createClient } from "@/lib/supabase/server"

export const getUser = async () => {
  try {

    const supabase = await createClient()

    const { data, error } = await supabase.auth.getUser()

    if (error) {
      console.error("認証エラー:", error)
      return {
        success: false,
        message: "ユーザーの取得に失敗しました",
        user: null
      }
    }

    if (!data.user) {
      return {
        success: false,
        message: "ログインが必要です",
        user: null
      }
    }

    return {
      success: true,
      message: "ユーザーの取得に成功しました",
      user: data.user,
    }

  } catch (error) {
    console.error("Get user failed:", error)
    return {
      success: false,
      message: "ユーザー情報の取得に失敗しました",
      user: null
    }
  }
}