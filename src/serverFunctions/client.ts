"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
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
  const { error } = await supabase.auth.updateUser({
    data: {
      first_name: firstName,
      last_name: lastName,
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
};

export const addAddress = async (
  address: string,
  city: string,
  state: string,
  zip: string,
  country: string,
) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/addresses");
  }

  const addresses = user.user_metadata?.billing_addresses || [];

  const res = await supabase.auth.updateUser({
    data: {
      ...user.user_metadata,
      billing_addresses: [...addresses, { address, city, state, zip, country }],
    },
  });

  revalidatePath("/addresses");
  return res;
};

export const deleteAddress = async (index: number) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/addresses");
  }

  const addresses = (user.user_metadata?.billing_addresses || []) as object[];

  const res = await supabase.auth.updateUser({
    data: {
      ...user.user_metadata,
      billing_addresses: addresses.filter((_, i) => i !== index),
    },
  });

  revalidatePath("/addresses");
  return res;
};
