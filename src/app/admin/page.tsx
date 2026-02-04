import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "./client";

export default async function AdminPage() {
  const {
    data: { users },
  } = await supabase.auth.admin.listUsers();

  return (
    <div className="w-full flex ">
      <Card className="w-full relative">
        <CardContent>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Users</CardTitle>
                <CardDescription className="text-4xl">
                  {users.length}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
