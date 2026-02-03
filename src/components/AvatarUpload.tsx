"use client";

import { Upload } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { useState } from "react";
import { uploadAvatar } from "@/serverFunctions/client";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";

export default function AvatarUpload() {
  const supabase = createClient();
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async () => {
    try {
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        await uploadAvatar(formData);
        const { data: user } = await supabase.auth.getUser();
        if (user.user) {
          await supabase.auth.updateUser({
            data: {
              avatar_url: `${supabaseUrl}/storage/v1/object/public/avatars/${user.user.id}/avatar`,
            },
          });
        }

        toast.success("Avatar uploaded successfully!");
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to upload avatar.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="absolute rounded-full hidden group-hover:inline-flex cursor-pointer w-16 h-16 z-10 hover:backdrop-blur-xs bg-transparent hover:bg-transparent"
        >
          <Upload className="bg-transparent" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Upload Avatar</DialogTitle>
        </DialogHeader>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" onClick={handleSubmit}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
