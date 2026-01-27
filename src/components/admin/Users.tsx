"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { userColumns } from "@/app/admin/users/columns";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Trash2 } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { useState } from "react";

export default function Users({ users }: { users: User[] }) {
  const [userId, setUserId] = useState<string | null>(null);
  return (
    <div className="w-full flex ">
      <Card className="w-full relative">
        <CardHeader>Users</CardHeader>
        <CardContent>
          <AlertDialog>
            <DataTable columns={userColumns} data={users} />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                  <Trash2 />
                </AlertDialogMedia>
                <AlertDialogTitle>Delete user?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the user from the database. This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
                <AlertDialogAction variant="destructive">
                  Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
