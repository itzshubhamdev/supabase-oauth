import AuthClient from "@/components/AuthClient";
import { createClient } from "./lib/supabase/server";
import AuthorizedGrant from "@/components/AuthorizedGrant";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardAction, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const clientId = process.env.NEXT_PUBLIC_SUPABASE_CLIENT_ID || "";

export default async function Page() {
  const supabase = await createClient();

  const user = await supabase.auth.getUser();
  if (!user.data.user) {
    redirect("/auth/login?redirect=/");
  }

  const grants = await supabase.auth.oauth.listGrants();

  return (
    <div className="w-full max-w-6xl space-y-4">
      <Card className="w-full">
        <CardHeader className="flex justify-between items-center w-full">
          <CardTitle>SuperAuth</CardTitle>
          <CardAction className="flex space-x-2">
            <h4 className="text-lg">
              {user.data.user.user_metadata.first_name || user.data.user.email}
            </h4>
            <Avatar>
              <AvatarImage
                src={user.data.user.user_metadata.profile_picture}
                alt={`${user.data.user.user_metadata.first_name} profile picture`}
              />
              <AvatarFallback>
                {user.data.user.email &&
                  user.data.user.email.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </CardAction>
        </CardHeader>
      </Card>
      <AuthClient
        user={user.data.user}
        supabaseUrl={supabaseUrl}
        clientId={clientId}
      />
      <div className="grid grid-cols-3 gap-4 w-full">
        {!grants.error && grants.data && grants.data.length > 0 && (
          <>
            <h1 className="col-span-3 text-xl font-semibold">Authorized Grants:</h1>
            {grants.data.map((grant) => (
              <AuthorizedGrant key={grant.client.id} grant={grant} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
