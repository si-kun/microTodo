"use server"

import { AuthFormData } from "@/components/auth/AuthForm";
import { createClient } from "@/lib/supabase/server";

export const signin = async (data: AuthFormData) => {
    try {

        const supabase = await createClient();

        const result = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
        })

        if(result.error) {
            return {
                success: false,
                message: "サインインに失敗しました: " + result.error.message,
            }
        }

        if(result.data.session) {
            return {
                success: true,
                message: "サインインが完了しました。",
            }
        } else {
            return {
                success: false,
                message: "サインインに失敗しました。",
            }
        }

    } catch(error) {
        console.error("Signin failed:", error);
        return {
            success: false,
            message: "サインインに失敗しました。",
        };
    }
}