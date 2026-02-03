"use server";

import { supabase } from "@/app/admin/client";
import { revalidatePath } from "next/cache";

export const addOAuthUri = async (id: string, uri: string) => {
  "use server";

  const { data, error } = await supabase.auth.admin.oauth.getClient(id);

  if (!data) {
    return { error };
  }

  const existingUri = data.redirect_uris.find((u) => u === uri);

  if (existingUri) {
    return { error: new Error("Redirect URI already exists") };
  }

  const res = await supabase.auth.admin.oauth.updateClient(id, {
    redirect_uris: [...data.redirect_uris, uri],
  });

  revalidatePath("/admin/oauth/" + id);
  return res;
};

export const deleteOAuthUri = async (id: string, uri: string) => {
  "use server";

  const { data, error } = await supabase.auth.admin.oauth.getClient(id);

  if (!data) {
    return { error };
  }

  const res = await supabase.auth.admin.oauth.updateClient(id, {
    redirect_uris: data.redirect_uris.filter((u) => u !== uri),
  });

  revalidatePath("/admin/oauth/" + id);
  return res;
};

export const regenerateClientSecret = async (id: string) => {
  "use server";

  const { data, error } =
    await supabase.auth.admin.oauth.regenerateClientSecret(id);

  revalidatePath("/admin/oauth/" + id);
  return { data, error };
};
