import { createClient } from "./utils/supabase/server";
import { cookies } from "next/headers";
import AuthClient from "./components/AuthClient";

const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const clientID = process.env.NEXT_PUBLIC_SUPABASE_CLIENT_ID;

export default async function Page() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const user = await (await supabase).auth.getUser();

  return (
    <div>
      <h1>Welcome to SuperAuth</h1>
      <AuthClient
        user={user.data.user}
        supabaseUrl={supabaseURL}
        clientId={clientID}
      />
    </div>
  );
}
