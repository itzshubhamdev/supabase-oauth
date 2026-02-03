"use client";

import { User } from "@supabase/supabase-js";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CheckCheck, Gavel, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  banUser,
  deleteUser,
  unbanUser,
  updateUser,
} from "@/serverFunctions/admin/user";
import { toast } from "sonner";
import { capitalize } from "@/app/utils";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export default function UserInfo({ user }: { user: User }) {
  const [u, setU] = useState<User>(user);
  const [duration, setDuration] = useState<string>("");

  const save = async () => {
    const res = await updateUser(
      u.id,
      u.user_metadata.username,
      u.email as string,
      u.user_metadata.first_name,
      u.user_metadata.last_name,
    );

    if (res.error) {
      return toast.error(capitalize(res.error.message));
    }

    toast.success("User updated successfully!");
  };

  const ban = async () => {
    if (!duration) {
      return toast.error("Please specify a duration for the ban.");
    }

    const res = await banUser(u.id, duration);

    if (res.error) {
      return toast.error(capitalize(res.error.message));
    }

    toast.success("User banned successfully!");
  };

  const unban = async () => {
    const res = await unbanUser(u.id);

    if (res.error) {
      return toast.error(capitalize(res.error.message));
    }

    toast.success("User unbanned successfully!");
  };

  const deleteU = async () => {
    const res = await deleteUser(u.id);

    if (res.error) {
      return toast.error(capitalize(res.error.message));
    }

    toast.success("User deleted successfully!");
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Field>
        <FieldLabel>User ID</FieldLabel>
        <Input value={u.id} readOnly />
      </Field>
      <Field>
        <FieldLabel>Username</FieldLabel>
        <Input value={u.user_metadata.username} readOnly />
      </Field>
      <Field>
        <FieldLabel>Email</FieldLabel>
        <Input
          value={u.email}
          onChange={(e) =>
            setU({
              ...u,
              email: e.target.value,
            })
          }
        />
      </Field>
      <Field>
        <FieldLabel>First Name</FieldLabel>
        <Input
          value={u.user_metadata.first_name}
          onChange={(e) =>
            setU({
              ...u,
              user_metadata: { ...u.user_metadata, first_name: e.target.value },
            })
          }
        />
      </Field>
      <Field>
        <FieldLabel>Last Name</FieldLabel>
        <Input
          value={u.user_metadata.last_name}
          onChange={(e) =>
            setU({
              ...u,
              user_metadata: { ...u.user_metadata, last_name: e.target.value },
            })
          }
        />
      </Field>
      <Field>
        <FieldLabel>Banned</FieldLabel>
        <Input
          value={user.banned_until ? `Until: ${user.banned_until}` : "No"}
          readOnly
        />
      </Field>
      <FieldGroup className="mt-4 cursor-pointer">
        <Button variant="outline" size="sm" onClick={save}>
          <CheckCheck /> Save Changes
        </Button>
      </FieldGroup>
      {user.banned_until ? (
        <Button
          variant="destructive"
          size="sm"
          className="mt-4 cursor-pointer bg-green-500 hover:bg-green-500 dark:bg-green-800"
          onClick={unban}
        >
          <Gavel /> Unban User
        </Button>
      ) : (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="destructive"
              size="sm"
              className="mt-4 cursor-pointer"
            >
              <Gavel /> Ban User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ban User</DialogTitle>
              <DialogDescription className="mt-4">
                <Input
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="Duration (e.g., 30m, 2h, 30s)"
                />
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button">Close</Button>
              </DialogClose>
              <Button variant="destructive" type="button" onClick={ban}>
                Ban User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="destructive"
            size="sm"
            className="mt-4 cursor-pointer"
          >
            <Trash2 /> Delete User
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription className="mt-4">
              Are you sure you want to delete this user? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button">Close</Button>
            </DialogClose>
            <Button variant="destructive" type="button" onClick={deleteU}>
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
