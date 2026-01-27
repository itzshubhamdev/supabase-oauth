"use client";

import { User } from "@supabase/supabase-js";
import { redirect, usePathname } from "next/navigation";

export default function AuthProvider({
  user,
  children,
}: {
  user?: User;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (
    !pathname.startsWith("/auth") &&
    !user &&
    !pathname.startsWith("/oauth") &&
    !pathname.startsWith("/api")
  ) {
    return redirect("/auth/login");
  }

  return <>{children}</>;
}
