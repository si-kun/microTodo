"use client";

import { signup } from "@/actions/user/signup";
import ErrorMessage from "@/components/error/ErrorMessage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { Separator } from "../ui/separator";
import { signin } from "@/actions/user/signin";

export const authSchema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z.string().min(6, "パスワードは6文字以上で入力してください"),
});

export type AuthFormData = z.infer<typeof authSchema>;

interface AuthFormProps {
  authType: "signin" | "signup";
}

const AuthForm = ({ authType }: AuthFormProps) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleAuthSubmit = async (data: AuthFormData) => {
    console.log(data);
    try {
      let result;

      if (authType === "signup") {
         result = await signup(data);
      } else if (authType === "signin") {
         result = await signin(data);
      } else {
        return toast.error("不正な認証タイプです。");
      }

      if (result && !result.success) {
        toast.error(result.message || "サインアップに失敗しました。");
      }

      if (result && result.success) {
        toast.success(result.message || "サインアップが完了しました。");
        router.replace("/");
        reset(); // フォームのリセット
      }
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <Card className="p-5 w-full">
      <form
        onSubmit={handleSubmit(handleAuthSubmit)}
        className="flex flex-col gap-6"
      >
        <div className="flex flex-col gap-1">
          <div className="flex gap-2">
            <Label htmlFor="email">Email</Label>
            <ErrorMessage name="email" errors={errors} />
          </div>
          <Input
            id="email"
            placeholder="メールアドレスを入力してください"
            {...register("email")}
          />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex gap-2">
            <Label htmlFor="password">Password</Label>
            <ErrorMessage name="password" errors={errors} />
          </div>
          <Input
            type="password"
            id="password"
            placeholder="メールアドレスを入力してください"
            {...register("password")}
          />
        </div>
        <Button variant="secondary" className="bg-green-300">
          {authType === "signup" ? "新規登録" : "サインイン"}
        </Button>
      </form>

      <Separator className="" />

      <Button asChild variant={"link"}>
        <Link href={authType === "signin" ? "/signup" : "/signin"}>
          {authType === "signin"
            ? "ログインはこちらから"
            : "新規登録はこちらから"}
        </Link>
      </Button>
    </Card>
  );
};

export default AuthForm;
