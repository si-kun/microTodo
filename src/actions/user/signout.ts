"use server"

import { createClient } from "@/lib/supabase/server";
import { AuthResponse } from "@/types/api";



export const signout = async(): Promise<AuthResponse> => {
    try {

        const supabase = await createClient();

        const result = await supabase.auth.signOut();

        if(result.error) {
            return {
                success: false,
                message: "サインアウトに失敗しました"
            }
        }

        return {
            success: true,
            message: "サインアウトしました",
        }

    } catch(error) {
        console.error("Signout failed:", error);
        return {
            success: false,
            message: "Signout failed. Please try again later.",
        }
    }
}