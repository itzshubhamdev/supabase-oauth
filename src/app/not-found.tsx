import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function NotFound() {
  return (
    <Card className="w-full max-w-md h-fit my-auto">
      <CardHeader className="text-center">
        <CardTitle className="lg:text-7xl text-4xl">404</CardTitle>
        <CardDescription>
          The page you're looking for doesn't exist.
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-center">
        <Button asChild>
          <Link href="/">Go Back</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
