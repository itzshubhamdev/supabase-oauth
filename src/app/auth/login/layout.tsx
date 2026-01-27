import { connection } from "next/server";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await connection();
  return <>{children}</>;
}
