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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

const supabase = createClient();

export default function LoginForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const redirectUrl = searchParams.get("redirect") || "/";
  const router = useRouter();

  const checkUserSession = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      router.push(redirectUrl);
    }
  };

  useEffect(() => {
    checkUserSession();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.dismiss();

    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(
        error.message.charAt(0).toUpperCase() + error.message.slice(1),
      );
      setLoading(false);
      return;
    }

    toast.success("Logged in successfully!");
    router.push(redirectUrl);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.dismiss();

    if (
      !firstName ||
      !lastName ||
      !username ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      toast.error("All fields are required");
      return;
    }

    if (username.length < 3) {
      toast.error("Username must be at least 3 characters long");
      return;
    }

    if (/[^a-zA-Z0-9]/.test(username)) {
      toast.error("Username can only contain alphanumeric characters");
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

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          username: username,
        },
      },
    });

    if (error) {
      toast.error(
        error.message.charAt(0).toUpperCase() + error.message.slice(1),
      );
      setLoading(false);
      return;
    }

    toast.success("Account created successfully! Please check your email.");
    router.push("/auth/login?redirect=" + encodeURIComponent(redirectUrl));
  };

  return (
    <div className="flex w-full max-w-sm flex-col gap-6 my-auto">
      <Tabs defaultValue="login">
        <TabsList>
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Signup</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Welcome Back</CardTitle>
              <CardDescription>
                Sign in to your account to continue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    id="email"
                    value={email}
                    autoComplete="username"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    type="password"
                    id="password"
                    value={password}
                    autoComplete="current-password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  <a href="/auth/forgot-password" className="underline">
                    Forgot your password?
                  </a>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
                onClick={handleLogin}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
              <CardDescription>
                Create a new account to continue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2 grid-cols-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    type="text"
                    id="first_name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name"
                    autoComplete="name"
                    required
                  />
                  <Input
                    type="text"
                    id="last_name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last Name"
                    autoComplete="additional-name"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    autoComplete="username"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    autoComplete="new-password"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    type="password"
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Password"
                    autoComplete="new-password"
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
                onClick={handleSignup}
              >
                {loading ? "Signing up..." : "Signup"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
