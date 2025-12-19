"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="scale-100 rotate-0 translate-x-full transition-all dark:scale-0 dark:-rotate-90"
        onClick={() => setTheme("dark")}
      >
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
        onClick={() => setTheme("light")}
      >
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    </>
  );
}
