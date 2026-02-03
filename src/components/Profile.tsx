"use client";

import type { User } from "@supabase/supabase-js";
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
import { Input } from "./ui/input";
import { useState } from "react";
import { Button } from "./ui/button";
import { updateProfile } from "@/serverFunctions/client";
import { toast } from "sonner";

export default function Profile({ user }: { user: User }) {
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
    const formData = new FormData();
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);

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
            <CardDescription>Manage your profile information.</CardDescription>
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
                <Input value={user.email} readOnly />
              </div>
              <div className="grid gap-2">
                <h3 className="font-medium">User ID:</h3>
                <Input value={user.id} readOnly />
              </div>
              <div className="grid gap-2">
                <h3 className="font-medium">Created At:</h3>
                <Input
                  value={new Date(user.created_at).toLocaleString()}
                  readOnly
                />
              </div>
              <div className="grid gap-2">
                <h3 className="font-medium">Username:</h3>
                <Input value={username} readOnly />
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
              <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end">
                <Button className="w-full md:w-fit" onClick={handleSubmit}>
                  Save Changes
                </Button>
              </div>
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
}
