"use client";

import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/app/utils";
import { User } from "@supabase/supabase-js";
import { ColumnDef } from "@tanstack/react-table";
import { Trash } from "lucide-react";

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "user_metadata.username",
    header: "Username",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ getValue }) => {
      const date = new Date(getValue() as string);
      return formatDate(date);
    },
  },
  {
    id: "delete",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm">
            <Trash />
          </Button>
        </AlertDialogTrigger>
      );
    },
  },
];
