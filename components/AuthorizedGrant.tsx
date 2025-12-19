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
import type { createClient } from "@/app/lib/supabase/server";

type Grant = {
  client: {
    id: string;
    name: string;
    logo_uri: string;
  };
  scopes: string[];
  granted_at: string;
};

export default function AuthorizedGrant({
  grant,
}: {
  grant: Grant;
}) {
  return (
    <Card className="w-full max-w-sm">
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
        <Button className="w-full" onClick={() => revokeGrant(grant.client.id)}>
          Revoke
        </Button>
      </CardFooter>
    </Card>
  );
}
