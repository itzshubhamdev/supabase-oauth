import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { toast } from "sonner";
import { userColumns } from "./columns";
import { supabase } from "../client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
} from "@/components/ui/alert-dialog";
import {
  AlertDialogDescription,
  AlertDialogTitle,
} from "@radix-ui/react-alert-dialog";
import { Trash2 } from "lucide-react";

export default async function AdminPage() {
  const { data, error } = await supabase.auth.admin.listUsers();

  if (error) {
    toast.error(error.message.charAt(0).toUpperCase() + error.message.slice(1));
  }

  return (
    <div className="w-full flex ">
      <Card className="w-full relative">
        <CardHeader>Users</CardHeader>
        <CardContent>
          <AlertDialog>
            <DataTable columns={userColumns} data={data.users} />
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
