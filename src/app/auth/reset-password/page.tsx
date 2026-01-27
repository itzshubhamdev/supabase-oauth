"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const supabase = createClient();

export default function LoginForm() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const getUserSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      const { data } = await supabase.auth.getClaims();
      if (data && data.claims && data.claims.amr) {
        if (data.claims.amr[0].method != "recovery") {
          router.push("/auth/login");
        }
      }
    }
  };

  useEffect(() => {
    getUserSession();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.dismiss();

    if (!password) {
      toast.error("Password is required");
      return;
    }

    if (
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(
        password,
      ) === false
    ) {
      toast.error(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
      );
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      toast.error(
        error.message.charAt(0).toUpperCase() + error.message.slice(1),
      );
      setLoading(false);
      return;
    }

    toast.success("Password updated successfully!");
    setLoading(false);

    supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <div className="flex w-full max-w-sm flex-col gap-6 my-auto">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>Enter new password</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                value={password}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            onClick={handleReset}
          >
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
