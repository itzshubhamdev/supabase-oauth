import { Card, CardHeader } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { createClient } from "@supabase/supabase-js";
import { toast } from "sonner";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export default async function AdminPage() {
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { data, error } = await supabase.auth.admin.listUsers();

  if (error) {
    toast.error(error.message.charAt(0).toUpperCase() + error.message.slice(1));
  }

  return (
    <div className="w-full flex ">
      <Card className="w-full relative">
        <SidebarTrigger className="absolute" />
        <CardHeader>Users</CardHeader>
      </Card>
    </div>
  );
}
