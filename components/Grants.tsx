"use client";

import type { AuthOAuthGrantsResponse, User } from "@supabase/supabase-js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import AuthorizedGrant from "./AuthorizedGrant";

export default function Grants({
  grants,
}: {
  grants: AuthOAuthGrantsResponse;
}) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Applications</CardTitle>
        <CardDescription>Manage your authorized applications.</CardDescription>
      </CardHeader>
      <CardContent>
        {!grants.error && grants.data && grants.data.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {grants.data.map((grant) => (
              <AuthorizedGrant key={grant.client.id} grant={grant} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
