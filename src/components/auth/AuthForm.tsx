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

export const signinSchema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z.string().min(6, "パスワードは6文字以上で入力してください"),
});
export const signupSchema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z.string().min(6, "パスワードは6文字以上で入力してください"),
  username: z.string().min(1, "ユーザー名は必須です"),
});

export type SigninFormData = z.infer<typeof signinSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type AuthFormData = SigninFormData | SignupFormData;

interface AuthFormProps {
  authType: "signin" | "signup";
}

const AUTH_INPUT = [
  {
    name: "username",
    label: "ユーザーネーム",
    type: "text",
    placeholder: "ユーザーネームを入力してください",
  },
  {
    name: "email",
    label: "メールアドレス",
    type: "email",
    placeholder: "メールアドレスを入力してください",
  },
  {
    name: "password",
    label: "パスワード",
    type: "password",
    placeholder: "パスワードを入力してください",
  },
] as const;

const AuthForm = ({ authType }: AuthFormProps) => {
  const router = useRouter();

  const schema = authType === "signup" ? signupSchema : signinSchema;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      ...(authType === "signup" && { username: "" }),
    },
  });

  const handleAuthSubmit = async (data: AuthFormData) => {
    console.log(data);
    try {
      let result;

      if (authType === "signup") {
        result = await signup(data as SignupFormData);
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
        {AUTH_INPUT.filter(
          (field) => field.name !== "username" || authType === "signup"
        ).map((field) => (

        <div key={field.name} className="flex flex-col gap-1">
          <div className="flex gap-2">
            <Label htmlFor={field.label}>{field.label}</Label>
            <ErrorMessage name={field.name} errors={errors} />
          </div>
          <Input
            id="email"
            placeholder={field.placeholder}
            type={field.type}
            {...register(field.name as keyof AuthFormData)}
          />
        </div>
        ))}

        <Button variant="secondary" className="bg-green-300">
          {authType === "signup" ? "新規登録" : "サインイン"}
        </Button>
      </form>

      <Separator className="" />

      <Button asChild variant={"link"}>
        <Link href={authType === "signin" ? "/signup" : "/signin"}>
          {authType === "signin"
            ? "新規登録はこちらから"
            : "ログインはこちらから"}
        </Link>
      </Button>
    </Card>
  );
};

export default AuthForm;
