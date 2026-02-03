"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import { Input } from "../ui/input";
import { useState } from "react";
import { addOAuthUri, deleteOAuthUri } from "@/serverFunctions/admin/oAuthApp";
import { toast } from "sonner";
import { capitalize } from "@/app/utils";

export default function RedirectUris({
  id,
  redirect_uris,
}: {
  id: string;
  redirect_uris: string[];
}) {
  const [newUri, setNewUri] = useState("");

  const addUri = async () => {
    if (newUri.trim() === "") return;
    const { error } = await addOAuthUri(id, newUri);

    if (error) {
      toast.error(capitalize(error.message));
    } else {
      toast.success("Redirect URI added");
    }

    setNewUri("");
  };

  const deleteUri = async (uri: string) => {
    const { error } = await deleteOAuthUri(id, uri);

    if (error) {
      toast.error(capitalize(error.message));
    } else {
      toast.success("Redirect URI deleted");
    }
  };

  return (
    <>
      {redirect_uris.map((uri, i) => (
        <ButtonGroup key={i}>
          <Input value={uri} readOnly />
          <Button variant="destructive" onClick={() => deleteUri(uri)}>
            <Trash2 />
          </Button>
        </ButtonGroup>
      ))}
      <ButtonGroup>
        <Input value={newUri} onChange={(e) => setNewUri(e.target.value)} />
        <Button onClick={addUri}>
          <Plus />
        </Button>
      </ButtonGroup>
    </>
  );
}
