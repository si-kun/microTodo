"use server";

import { createClient } from "@/lib/supabase/server";



interface SignupData {
    email: string;
    password: string;
}

export const signup = async(data: SignupData) => {
    try {

        const supabase = await createClient();

        // supabaseのサインアップ機能
        const supabaseAuth = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
        })

        if (supabaseAuth.error) {
            return {
                success: false,
                message: "メールアドレスまたはパスワードが無効です。",
            }
        }

        if(supabaseAuth.data.user) {
            return {
                success: true,
                message: "登録が完了しました",
                user: supabaseAuth.data.user,
            }
        }

    } catch(error) {
        console.error("Signup failed:", error);
        return {
            success: false,
            message: "サインアップに失敗しました。もう一度お試しください。",
        }
    }
}