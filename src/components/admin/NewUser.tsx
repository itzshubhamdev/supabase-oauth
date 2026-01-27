"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "../ui/field";
import { Checkbox } from "../ui/checkbox";

export default function NewUser({
  createNewUser,
}: {
  createNewUser: (
    email: string,
    password: string,
    autoConfirm: boolean,
  ) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [autoConfirm, setAutoConfirm] = useState(false);

  const handleSubmit = () => {
    createNewUser(email, password, autoConfirm);
  };

  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>New User</SheetTitle>
        <SheetDescription>Create a new user.</SheetDescription>
      </SheetHeader>
      <div className="grid flex-1 auto-rows-min gap-6 px-4">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>
          <Field orientation="horizontal">
            <Checkbox
              id="auto-confirm"
              checked={autoConfirm}
              onCheckedChange={(checked) => setAutoConfirm(checked == true)}
            />
            <FieldContent>
              <FieldLabel htmlFor="auto-confirm">Auto Confirm User?</FieldLabel>
              <FieldDescription>
                A confirmation email will not be sent when creating a user via
                this form.
              </FieldDescription>
            </FieldContent>
          </Field>
        </FieldGroup>
      </div>
      <SheetFooter>
        <Button type="submit" onClick={handleSubmit}>
          Create
        </Button>
        <SheetClose asChild>
          <Button variant="outline">Close</Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  );
}
