"use server";

import { prisma } from "@/lib/prisma";

export const updateUserAvatar = async (userId: string, avatarUrl: string) => {
  try {
    await prisma.user.update({
      where: { id: userId },
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