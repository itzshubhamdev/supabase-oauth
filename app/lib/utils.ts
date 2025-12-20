"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { revalidatePath } from "next/cache";

export const revokeGrant = async (clientId: string) => {
  const supabase = await createClient();
  const { error } = await supabase.auth.oauth.revokeGrant({ clientId });
  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
};

export const uploadAvatar = async (formData: FormData) => {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  const file = formData.get("file") as File;

  if (!user.data.user) {
    redirect("/auth/login?redirect=/");
  }

  const upload = await supabase.storage
    .from("avatars")
    .upload(`${user.data.user.id}/avatar`, file, {
      upsert: true,
    });

  if (upload.error) {
    return { success: false, error: upload.error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
};

export const updateProfile = async (formData: FormData) => {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  if (!user.data.user) {
    redirect("/auth/login?redirect=/");
  }

  const firstName = formData.get("first_name") as string;
  const lastName = formData.get("last_name") as string;
  const username = formData.get("username") as string;

  const { error } = await supabase.auth.updateUser({
    data: {
      first_name: firstName,
      last_name: lastName,
      username: username,
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
};
