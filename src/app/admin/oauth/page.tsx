import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "../client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import OAuthApp from "@/components/admin/OauthApp";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { capitalize, formatDate } from "@/lib/utils";
import Link from "next/link";

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
        {apps.data.clients.length == 0 ? (
          <p className="p-4 text-center">No OAuth applications found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead />
                <TableHead>Name</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Registration Type</TableHead>
                <TableHead>Client Type</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apps.data.clients.map((app) => (
                <TableRow key={app.client_id}>
                  <TableCell>
                    <Avatar>
                      <AvatarFallback>
                        {app.client_name.charAt(0)}
                      </AvatarFallback>
                      <AvatarImage
                        src={app.logo_uri}
                        alt={`${app.client_name} logo`}
                      />
                    </Avatar>
                  </TableCell>
                  <TableCell className="underline">
                    <Link href={`/admin/oauth/${app.client_id}`}>
                      {capitalize(app.client_name)}
                    </Link>
                  </TableCell>
                  <TableCell>{app.client_id}</TableCell>
                  <TableCell>{capitalize(app.registration_type)}</TableCell>
                  <TableCell>{capitalize(app.client_type)}</TableCell>
                  <TableCell>{formatDate(new Date(app.created_at))}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {apps.data.clients.map((app) => (
          <OAuthApp key={app.client_id} app={app} handleDelete={handleDelete} />
        ))}
      </CardContent>
    </Card>
  );
}
