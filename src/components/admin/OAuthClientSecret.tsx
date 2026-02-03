"use client";

import { Copy } from "lucide-react";
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { useState } from "react";
import { regenerateClientSecret } from "@/serverFunctions/admin/oAuthApp";
import { toast } from "sonner";

export default function OAuthClientSecret({
  id,
  clientSecret,
}: {
  id: string;
  clientSecret?: string;
}) {
  const [secret, setSecret] = useState(clientSecret);

  const regenerate = async () => {
    const res = await regenerateClientSecret(id);

    if (res.data && res.data.client_secret) {
      setSecret(res.data.client_secret);
    }
  };

  return (
    <Field>
      <FieldLabel>Client Secret</FieldLabel>
      <ButtonGroup>
        <Input value={secret ? secret : "•".repeat(64)} readOnly />
        <Button
          variant="outline"
          onClick={() => {
            if (secret) {
              navigator.clipboard.writeText(secret);
              toast.success("Copied Client Secret to clipboard");
            }
          }}
        >
          <Copy />
        </Button>
      </ButtonGroup>
      <Button
        variant="link"
        className="cursor-pointer w-fit!"
        onClick={regenerate}
      >
        Regenerate Secret
      </Button>
    </Field>
  );
}
