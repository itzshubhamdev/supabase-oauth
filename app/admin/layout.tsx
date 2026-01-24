import { redirect } from "next/navigation";
import { createClient } from "../lib/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login?redirect=/");
  }

  if (!user.user_metadata.is_admin) {
    return redirect("/");
  }

  return (
    <>
      <main className="w-full">{children}</main>
    </>
  );
}
