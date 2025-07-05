"use client";

import { getUser } from "@/actions/user/getUser";
import { userAtom } from "@/atom/user";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect } from "react";
import toast from "react-hot-toast";

const AuthGuard = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useAtom(userAtom);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userResult = await getUser();

        if (!userResult || !userResult.success) {
          toast.error("ユーザー情報の取得に失敗しました。");
          router.replace("/signin");
          return;
        }

        if (userResult && userResult.success && userResult.user) {
          setUser(userResult.user.id);
          toast.success(
            userResult.message || "ユーザー情報の取得に成功しました。"
          );
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, [router, setUser]);

  if (!user) {
    return null; // or a loading spinner
  }

  return <div>{children}</div>;
};

export default AuthGuard;
