import { createClient } from "@/lib/supabase/server";
import Profile from "@/components/Profile";

export default async function Page() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <Profile user={user!} />;
}
