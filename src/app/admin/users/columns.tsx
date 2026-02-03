"use client";

import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/app/utils";
import { User } from "@supabase/supabase-js";
import { ColumnDef } from "@tanstack/react-table";
import { Trash } from "lucide-react";
import Link from "next/link";

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "user_metadata.username",
    header: "Username",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <Link href={`/admin/users/${user.id}`} className="underline">
          {user.user_metadata.username}
        </Link>
      );
    },
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
    cell: () => {
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
