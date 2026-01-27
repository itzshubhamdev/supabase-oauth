import Grants from "@/components/Grants";
import { createClient } from "@/lib/supabase/server";

export default async function Page() {
  const supabase = await createClient();
  const grants = await supabase.auth.oauth.listGrants();

  console.log("Grants:", grants);

  return <Grants grants={grants} />;
}
