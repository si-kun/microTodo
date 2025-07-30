"use server"

import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"
import { ApiResponse } from "@/types/api"
import { User } from "@prisma/client"

export const getUser = async () : Promise<ApiResponse<User>> => {
  try {

    const supabase = await createClient()

    const { data, error } = await supabase.auth.getUser()

    if (error) {
      console.error("認証エラー:", error)
      return {
        success: false,
        message: "ユーザーの取得に失敗しました",
        data: null
      }
    }

    if (!data.user) {
      return {
        success: false,
        message: "ログインが必要です",
        data: null
      }
    }

    //prismaのUserを取得
    const prismaUser = await prisma.user.findUnique({
      where: {
        id: data.user.id,
      },
    })

    if (!prismaUser) {
      return {
        success: false,
        message: "ユーザー情報が見つかりません",
        data: null
      }
    }

    return {
      success: true,
      message: "ユーザーの取得に成功しました",
      data: prismaUser,
    }

  } catch (error) {
    console.error("Get user failed:", error)
    return {
      success: false,
      message: "ユーザー情報の取得に失敗しました",
      data: null
    }
  }
}