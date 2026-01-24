import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date) {
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    // year: "numeric",
    // month: "short",
    // day: "numeric",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);

  return formattedDate;
}
