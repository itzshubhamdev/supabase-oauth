import { createClient } from "../lib/supabase/server";
import Profile from "@/components/Profile";

export default async function Page() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const grants = await supabase.auth.oauth.listGrants();

  return (
    <div className="w-full max-w-6xl space-y-4">
      <Profile user={user!} grants={grants} />
    </div>
  );
}
