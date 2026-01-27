"use client";

import { Home, Lock, Mail, Settings, UserIcon, Users } from "lucide-react";
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { Separator } from "./ui/separator";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "@supabase/supabase-js";

const userItems = [
  {
    title: "Profile",
    url: "/",
    icon: UserIcon,
  },
  {
    title: "Security",
    url: "/security",
    icon: Lock,
  },
  {
    title: "Addresses",
    url: "/addresses",
    icon: Mail,
  },
];

const adminItems = [
  {
    title: "Home",
    url: "/admin",
    icon: Home,
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: Users,
  },
  {
    title: "OAuth Applications",
    url: "/admin/oauth",
    icon: Settings,
  },
];

export default function Sidebar({ user }: { user: User }) {
  const pathname = usePathname();

  return (
    <SidebarComponent>
      <SidebarHeader className="text-center font-semibold text-xl">
        Super Auth
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {userItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname == item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {user.user_metadata.is_admin && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname == item.url}>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </SidebarComponent>
  );
}
