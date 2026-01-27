import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "../client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import OAuthApp from "@/components/admin/OauthApp";

export default async function Page() {
  const apps = await supabase.auth.admin.oauth.listClients();

  const handleDelete = async (clientId: string) => {
    "use server";
    const { error } = await supabase.auth.admin.oauth.deleteClient(clientId);

    if (error) {
      toast.error(
        error.message.charAt(0).toUpperCase() + error.message.slice(1),
      );
    }

    toast.success("OAuth application deleted successfully");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>OAuth Applications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3">
          {apps.data.clients.map((app) => (
            <OAuthApp
              key={app.client_id}
              app={app}
              handleDelete={handleDelete}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
