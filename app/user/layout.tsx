import Navbar from "@/components/Navbar";
import { createClient } from "../lib/supabase/server";
import { redirect } from "next/navigation";

export default async function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supbase = await createClient();
  const {
    data: { user },
  } = await supbase.auth.getUser();

  if (!user) {
    return redirect("/auth/login?redirect=/user");
  }

  return (
    <>
      <Navbar user={user} />
      {children}
    </>
  );
}
