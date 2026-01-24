"use client";

import { revokeGrant } from "@/app/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import type { OAuthGrant } from "@supabase/supabase-js";
import { toast } from "sonner";

export default function AuthorizedGrant({ grant }: { grant: OAuthGrant }) {
  const handleSubmit = async () => {
    const response = await revokeGrant(grant.client.id);
    if (!response.success) {
      toast.error(response.error || "Failed to revoke grant");
    }

    toast.success("Grant revoked successfully");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{grant.client.name}</CardTitle>
        <CardDescription>
          <h4>
            <span className="font-semibold">ID:</span> {grant.client.id}
          </h4>
        </CardDescription>
        <CardAction>
          <Avatar>
            <AvatarImage
              src={grant.client.logo_uri}
              alt={`${grant.client.name} logo`}
            />
            <AvatarFallback>
              {grant.client.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </CardAction>
      </CardHeader>
      <CardFooter>
        <Button className="w-full" onClick={handleSubmit} variant="destructive">
          Revoke
        </Button>
      </CardFooter>
    </Card>
  );
}
