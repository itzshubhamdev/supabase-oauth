import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "../../client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { capitalize } from "@/app/utils";
import { Copy } from "lucide-react";
import { redirect } from "next/navigation";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import RedirectUris from "@/components/admin/RedirectUris";
import OAuthClientSecret from "@/components/admin/OAuthClientSecret";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data, error } = await supabase.auth.admin.oauth.getClient(id);

  if (error) {
    toast.error(capitalize(error.message));
    redirect("/admin/oauth");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{capitalize(data.client_name)}</CardTitle>
        <CardDescription>{data.client_id}</CardDescription>
        <CardAction>
          <Avatar className="w-12 h-12">
            <AvatarImage src={data.logo_uri} alt={`${data.client_name} logo`} />
            <AvatarFallback>
              {data.client_name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <Field>
            <FieldLabel>Client ID</FieldLabel>
            <ButtonGroup>
              <Input value={data.client_id} readOnly />
              <Button variant="outline">
                <Copy />
              </Button>
            </ButtonGroup>
          </Field>
          <OAuthClientSecret id={id} clientSecret={data.client_secret} />
          <Field>
            <FieldLabel>Redirect URIs</FieldLabel>
            <RedirectUris id={id} redirect_uris={data.redirect_uris} />
          </Field>
        </div>
      </CardContent>
    </Card>
  );
}
