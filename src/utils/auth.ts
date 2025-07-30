"use server";

import { getUser } from "@/actions/user/getUser";
import { ApiResponse } from "@/types/api";
import { User } from "@prisma/client";

export const checkAuth = async (): Promise<ApiResponse<User>> => {
  try {
    const userResult = await getUser();

    if (!userResult.success || !userResult.data) {
      return {
        success: false,
        message: userResult.message || "ユーザー情報の取得に失敗しました",
        data: null,
      };
    }

    return {
      success: true,
      message: "ユーザー情報の取得に成功しました",
      data: userResult.data,
    };
  } catch (error) {
    console.error("checkAuth error:", error);
    return {
      success: false,
      message: "認証に失敗しました",
      data: null,
    };
  }
};
