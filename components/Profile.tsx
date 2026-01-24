"use client";

import type { AuthOAuthGrantsResponse, User } from "@supabase/supabase-js";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import AvatarUpload from "./AvatarUpload";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import AuthorizedGrant from "./AuthorizedGrant";
import { Input } from "./ui/input";
import { useState } from "react";
import { Button } from "./ui/button";
import { updateProfile } from "@/app/lib/utils";
import { toast } from "sonner";

export default function Profile({
  user,
  grants,
}: {
  user: User;
  grants: AuthOAuthGrantsResponse;
}) {
  const [firstName, setFirstName] = useState(
    user?.user_metadata.first_name || "N/A",
  );
  const [lastName, setLastName] = useState(
    user?.user_metadata.last_name || "N/A",
  );
  const [username, setUsername] = useState(
    user?.user_metadata.username || "N/A",
  );

  const handleSubmit = async () => {
    if (username.length < 3) {
      toast.error("Username must be at least 3 characters long");
      return;
    }

    if (/[^a-zA-Z0-9]/.test(username)) {
      toast.error("Username can only contain alphanumeric characters");
      return;
    }

    const formData = new FormData();
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("username", username);

    const response = await updateProfile(formData);

    if (!response.success) {
      console.error("Failed to update profile:", response.error);
      toast.error("Failed to update profile.");
    }

    toast.success("Profile updated successfully!");
  };

  return (
    <Card className="w-full">
      {user && (
        <>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Manage your authorized grants and profile information.
            </CardDescription>
            <CardAction className="flex space-x-2">
              <div className="flex items-center group relative overflow-hidden">
                <AvatarUpload />
                <Avatar className="w-16 h-16">
                  <AvatarImage
                    src={user.user_metadata.avatar_url}
                    alt={`${user.user_metadata.first_name} profile picture`}
                  />
                  <AvatarFallback>
                    {user.email && user.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-6">
              <div className="grid gap-2">
                <h3 className="font-medium">Email:</h3>
                <p>{user.email}</p>
              </div>
              <div className="grid gap-2">
                <h3 className="font-medium">User ID:</h3>
                <p>{user.id}</p>
              </div>
              <div className="grid gap-2">
                <h3 className="font-medium">Created At:</h3>
                <p>{new Date(user.created_at).toLocaleString()}</p>
              </div>
              <div className="grid gap-2">
                <h3 className="font-medium">First Name:</h3>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <h3 className="font-medium">Last Name:</h3>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <h3 className="font-medium">Username:</h3>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end">
                <Button className="w-full md:w-fit" onClick={handleSubmit}>
                  Save Changes
                </Button>
              </div>
            </div>
            <Separator className="my-6" />
            {!grants.error && grants.data && grants.data.length > 0 && (
              <div className="w-full space-y-6">
                <h1 className="col-span-3 text-xl font-semibold">
                  Authorized Grants:
                </h1>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                  {grants.data.map((grant) => (
                    <AuthorizedGrant key={grant.client.id} grant={grant} />
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </>
      )}
    </Card>
  );
}
