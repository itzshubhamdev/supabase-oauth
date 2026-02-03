"use client";

import { revokeGrant } from "@/serverFunctions/client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Card,
  CardAction,
  CardContent,
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
      <CardContent className="text-sm">
        <ul className="space-y-2">
          <li>
            <span className="font-semibold">ID:</span> {grant.client.id}
          </li>
          <li>
            <span className="font-semibold">Authorized At:</span>{" "}
            {new Date(grant.granted_at).toDateString()} at{" "}
            {new Date(grant.granted_at).toLocaleTimeString()}
          </li>
          <li>
            <span className="font-semibold">Scopes:</span>{" "}
            {grant.scopes.join(", ")}
          </li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleSubmit} variant="destructive">
          Revoke
        </Button>
      </CardFooter>
    </Card>
  );
}
