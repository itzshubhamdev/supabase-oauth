"use client";

import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import { Input } from "../ui/input";

export default function RedirectUris({
  addUri,
  deleteUri,
  redirect_uris,
}: {
  addUri: (uri: string) => void;
  deleteUri: (uri: string) => void;
  redirect_uris: string[];
}) {
  return (
    <>
      {redirect_uris.map((uri) => (
        <ButtonGroup key={uri}>
          <Input value={uri} readOnly />
          <Button variant="destructive" onClick={() => deleteUri(uri)}>
            <Trash2 />
          </Button>
        </ButtonGroup>
      ))}
    </>
  );
}
