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
import { capitalize } from "@/lib/utils";
import { Copy } from "lucide-react";
import { redirect } from "next/navigation";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { revalidatePath } from "next/cache";
import RedirectUris from "@/components/admin/RedirectUris";

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

  const addUri = async (uri: string) => {
    "use server";

    const { error } = await supabase.auth.admin.oauth.updateClient(id, {
      redirect_uris: [uri],
    });

    if (error) {
      toast.error(capitalize(error.message));
      return;
    }

    revalidatePath("/admin/oauth/" + id);
  };

  const deleteUri = async (uri: string) => {
    "use server";

    const { error } = await supabase.auth.admin.oauth.updateClient(id, {
      redirect_uris: data!.redirect_uris.filter((u) => u !== uri),
    });

    if (error) {
      toast.error(capitalize(error.message));
      return;
    }

    revalidatePath("/admin/oauth/" + id);
  };

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
          <Field>
            <FieldLabel>Redirect URIs</FieldLabel>
            <RedirectUris
              addUri={addUri}
              deleteUri={deleteUri}
              redirect_uris={data.redirect_uris}
            />
          </Field>
        </div>
      </CardContent>
    </Card>
  );
}
