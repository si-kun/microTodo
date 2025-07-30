"use server";

import { prisma } from "@/lib/prisma";
import { AuthResponse } from "@/types/api";
import { checkAuth } from "@/utils/auth";

export const updateUserAvatar = async (avatarUrl: string) : Promise<AuthResponse> => {
  try {

    const authResult = await checkAuth();
    if (!authResult.success) {
      return {
        success: false,
        message: "認証に失敗しました"
      };
    }

    await prisma.user.update({
      where: { id: authResult.data!.id },
      data: { avatarUrl }
    });

    return {
      success: true,
      message: "アバター情報を更新しました"
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "アバター情報の更新に失敗しました"
    };
  }
};