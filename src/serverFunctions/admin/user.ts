"use server";

import { supabase } from "@/app/admin/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const updateUser = async (
  userId: string,
  username: string,
  email: string,
  first_name: string,
  last_name: string,
) => {
  const res = await supabase.auth.admin.updateUserById(userId, {
    email,
    user_metadata: {
      first_name,
      last_name,
      username,
    },
  });

  revalidatePath("/admin/users/" + userId);
  return res;
};

export const deleteUser = async (userId: string) => {
  const res = await supabase.auth.admin.deleteUser(userId);

  revalidatePath("/admin/users");
  redirect("/admin/users");
  return res;
};

export const banUser = async (userId: string, duration: string) => {
  const res = await supabase.auth.admin.updateUserById(userId, {
    ban_duration: duration,
  });

  revalidatePath("/admin/users/" + userId);
  return res;
};

export const unbanUser = async (userId: string) => {
  const res = await supabase.auth.admin.updateUserById(userId, {
    ban_duration: "none",
  });

  revalidatePath("/admin/users/" + userId);
  return res;
};
