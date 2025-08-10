"use client";

import { signin } from "@/actions/user/signin";
import { signup } from "@/actions/user/signup";
import { uploadImageToSupabase } from "@/actions/user/uploadAvatar";
import { updateUserAvatar } from "@/actions/user/updateUserAvater";
import ErrorMessage from "@/components/error/ErrorMessage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export const signinSchema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z.string().min(6, "パスワードは6文字以上で入力してください"),
});
export const signupSchema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z.string().min(6, "パスワードは6文字以上で入力してください"),
  username: z.string().min(1, "ユーザー名は必須です"),
  avatarUrl: z.string().optional(),
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
    showIn: ["signup"] as ("signup" | "signin")[],
  },
  {
    name: "email",
    label: "メールアドレス",
    type: "email",
    placeholder: "メールアドレスを入力してください",
    showIn: ["signup", "signin"] as ("signup" | "signin")[],
  },
  {
    name: "password",
    label: "パスワード",
    type: "password",
    placeholder: "パスワードを入力してください",
    showIn: ["signup", "signin"] as ("signup" | "signin")[],
  },
  {
    name: "avatarUrl",
    label: "アバター画像",
    type: "file",
    placeholder: "アバター画像の選択してください",
    showIn: ["signup"] as ("signup" | "signin")[],
  },
] as const;

const AuthForm = ({ authType }: AuthFormProps) => {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

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
    console.log("Form data:", data);
    console.log("Selected file:", selectedFile);
    console.log("Preview image:", previewImage);
    try {
      let result;

      if (authType === "signup") {
        result = await signup(data as SignupFormData);

        if (result?.success && selectedFile && result.user) {
          try {
            // クライアントサイドでアップロード
            const avatarUrl = await uploadImageToSupabase(
              selectedFile,
              result.user.id
            );

            // データベースのみサーバーサイドで更新
            const updateResult = await updateUserAvatar(
              result.user.id,
              avatarUrl
            );

            if (updateResult.success) {
              toast.success("アバターのアップロードが成功しました。");
            } else {
              toast.error("アバター情報の更新に失敗しました。");
            }
          } catch (uploadError) {
            console.error("Avatar upload error:", uploadError);
            toast.error("アバターのアップロードに失敗しました。");
          }
        }
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
        setPreviewImage(null); // プレビュー画像のリセット
        setSelectedFile(null); // 選択されたファイルのリセット
      }
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("ファイルサイズは2MB以下にしてください。");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("画像ファイルを選択してください。");
        return;
      }

      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  return (
    <Card className="py-0 px-2 w-full">
      {authType === "signup" && (
        <div className="bg-indigo-500 w-full p-3 rounded-t-lg flex items-center justify-center flex-col gap-2">
          <Avatar className="w-10 h-10 object-fit-cover">
            {previewImage ? (
              <AvatarImage src={previewImage} />
            ) : (
              <AvatarFallback>CN</AvatarFallback>
            )}
          </Avatar>

          <h2 className="font-bold text-lg text-white">アカウント作成</h2>
          <span className="text-white">新しいアカウントを作成してください</span>
        </div>
      )}
      <form
        onSubmit={handleSubmit(handleAuthSubmit)}
        className="flex flex-col gap-6 p-4"
      >
        {AUTH_INPUT.filter((field) => field.showIn.includes(authType)).map(
          (field) => (
            <div key={field.name} className="flex flex-col gap-1">
              <div className="flex gap-2">
                <Label htmlFor={field.label}>{field.label}</Label>
                <ErrorMessage name={field.name} errors={errors} />
              </div>

              {field.type === "file" ? (
                <div className="flex items-center">
                  <Input
                    id={field.name}
                    placeholder={field.placeholder}
                    type={field.type}
                    onChange={handleFileChange} // registerは使わない
                  />
                </div>
              ) : (
                <Input
                  id={field.name}
                  placeholder={field.placeholder}
                  type={field.type}
                  {...register(field.name as keyof AuthFormData)}
                />
              )}
            </div>
          )
        )}

        <Button variant="secondary" className="bg-green-300">
          {authType === "signup" ? "新規登録" : "サインイン"}
        </Button>
      </form>

      <Separator className="" />

      <Button asChild variant={"link"} className="mb-4">
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
