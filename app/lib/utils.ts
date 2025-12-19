"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";

export const revokeGrant = async (clientId: string) => {
  const supabase = await createClient();
  const { error } = await supabase.auth.oauth.revokeGrant({ clientId });
  if (error) {
    console.error("Failed to revoke grant:", error);
  } else {
    redirect("/");
  }
};