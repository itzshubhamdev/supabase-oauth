"use client";

import { OAuthClient } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

export default function OAuthApp({
  app,
  handleDelete,
}: {
  app: OAuthClient;
  handleDelete: (clientId: string) => void;
}) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{app.client_name}</CardTitle>
        <CardAction>
          <Avatar>
            <AvatarImage src={app.logo_uri} alt={`${app.client_name} logo`} />
            <AvatarFallback>
              {app.client_name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </CardAction>
      </CardHeader>
      <CardContent className="text-sm">
        <ul className="space-y-2">
          <li>
            <span className="font-semibold">ID:</span> {app.client_id}
          </li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={() => handleDelete(app.client_id)}
          variant="destructive"
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
