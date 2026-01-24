import { User } from "@supabase/supabase-js";
import LogOutBtn from "./LogOutBtn";
import { ThemeToggle } from "./ThemeToggle";
import { Card, CardAction, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { UserCog } from "lucide-react";

export default function Navbar({ user }: { user: User }) {
  return (
    <Card className="w-full max-w-6xl mb-8">
      <CardHeader className="flex justify-between items-center w-full">
        <CardTitle>SuperAuth</CardTitle>
        <CardAction className="flex gap-2">
          <LogOutBtn />
          <ThemeToggle />
          <Button variant="outline" size="icon">
            <UserCog />
          </Button>
        </CardAction>
      </CardHeader>
    </Card>
  );
}
