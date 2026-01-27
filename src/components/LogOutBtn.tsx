"use client";

import { LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/client";
import { redirect } from "next/navigation";

export default function LogOutBtn() {
  const supabase = createClient();

  const handleLogOut = async () => {
    await supabase.auth.signOut();
    redirect("/auth/login");
  };

  return (
    <Button variant="outline" size="icon" onClick={handleLogOut}>
      <LogOut />
    </Button>
  );
}
