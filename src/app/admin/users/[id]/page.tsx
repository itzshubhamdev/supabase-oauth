import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "../../client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { capitalize } from "@/app/utils";
import { Copy } from "lucide-react";
import { redirect } from "next/navigation";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import RedirectUris from "@/components/admin/RedirectUris";
import OAuthClientSecret from "@/components/admin/OAuthClientSecret";
import UserInfo from "@/components/admin/UserInfo";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const {
    data: { user },
    error,
  } = await supabase.auth.admin.getUserById(id);

  if (error) {
    toast.error(capitalize(error.message));
    redirect("/admin/oauth");
  }

  if (!user) {
    toast.error("User not found");
    redirect("/admin/users");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{capitalize(user.user_metadata.username)}</CardTitle>
        <CardDescription>{user.id}</CardDescription>
        <CardAction>
          <Avatar className="w-12 h-12">
            <AvatarImage src={user.user_metadata.avatar_url} />
            <AvatarFallback>
              {user.user_metadata.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </CardAction>
      </CardHeader>
      <CardContent>
        <UserInfo user={user} />
      </CardContent>
    </Card>
  );
}
