"use client";

import { OAuthClient } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";

export default function OAuthApp({
  app,
  handleDelete,
}: {
  app: OAuthClient;
  handleDelete: (clientId: string) => void;
}) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{app.client_name}</CardTitle>
        <CardAction>
          <Avatar>
            <AvatarImage src={app.logo_uri} alt={`${app.client_name} logo`} />
            <AvatarFallback>
              {app.client_name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </CardAction>
      </CardHeader>
      <CardContent className="text-sm">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell className="text-wrap">{app.client_id}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>{app.client_name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Redirect URIs</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  {app.redirect_uris.map((uri) => (
                    <span key={uri}>{uri}</span>
                  ))}
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={() => handleDelete(app.client_id)}
          variant="destructive"
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
