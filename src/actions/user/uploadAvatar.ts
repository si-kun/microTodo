"use server"

import { createClient } from "@/lib/supabase/server";

export const uploadImageToSupabase = async (file: File, userId: string): Promise<string> => {

    const supabase = await createClient();
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}-${Date.now()}.${fileExt}`
  
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      })
  
    if (error) {
      throw new Error(`Upload failed: ${error.message}`)
    }
  
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName)
  
    return publicUrl
  }