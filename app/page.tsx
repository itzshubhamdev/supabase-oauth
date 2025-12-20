import { createClient } from "./lib/supabase/server";
import { Card, CardAction, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import LogOutBtn from "@/components/LogOutBtn";
import Profile from "@/components/Profile";

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
          <CardAction>
            <LogOutBtn />
          </CardAction>
        </CardHeader>
      </Card>
      <Profile user={user} grants={grants} />
    </div>
  );
}
