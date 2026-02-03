"use client";

import { User } from "@supabase/supabase-js";
import LogOutBtn from "./LogOutBtn";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import { UserCog } from "lucide-react";
import Link from "next/link";
import { Separator } from "./ui/separator";
import { SidebarTrigger } from "./ui/sidebar";
import { usePathname } from "next/navigation";

export default function Navbar({ user }: { user: User | null }) {
  if (!user) {
    return null;
  }

  const pathname = usePathname();
  if (pathname.startsWith("/auth") || pathname.startsWith("/oauth")) {
    return null;
  }

  const is_admin = user.user_metadata?.is_admin;

  return (
    <>
      <div className="w-full flex justify-between items-center p-4">
        <div className="flex items-center">
          <SidebarTrigger className="absolute" />
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {is_admin && (
            <Link href="/admin">
              <Button variant="outline" size="icon">
                <UserCog />
              </Button>
            </Link>
          )}
          <LogOutBtn />
        </div>
      </div>
      <Separator />
    </>
  );
}
