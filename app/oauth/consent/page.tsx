import { createClient } from "@/app/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/ui/button-group";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const scopesDescriptions: { [key: string]: string } = {
  openid: "Authenticate using OpenID Connect",
  email: "Access your email address",
  profile: "Access your profile information (name, picture, etc.)",
  phone: "Access your phone number",
};

export default async function ConsentPage({
  searchParams,
}: {
  searchParams: Promise<{ authorization_id?: string }>;
}) {
  const authorizationId = (await searchParams).authorization_id;
  if (!authorizationId) {
    return <div>Error: Missing authorization_id</div>;
  }
  const supabase = await createClient();
  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    // Redirect to login, preserving authorization_id
    redirect(
      `/auth/login?redirect=/oauth/consent?authorization_id=${authorizationId}`,
    );
  }
  // Get authorization details using the authorization_id
  const { data: authDetails, error } =
    await supabase.auth.oauth.getAuthorizationDetails(authorizationId);
  console.log("Auth Details:", authDetails, "Error:", error);
  if (error || !authDetails) {
    return (
      <div>Error: {error?.message || "Invalid authorization request"}</div>
    );
  }

  if (!error && authDetails.redirect_uri && !authDetails.client) {
    return redirect(authDetails.redirect_uri);
  }

  return (
    <>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Authorize {authDetails.client.name}</CardTitle>
          <CardDescription>
            Logged in as *<span className="font-semibold">{user.email}</span>*
          </CardDescription>
          <CardAction>
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={authDetails.client.logo_uri}
                alt={`${authDetails.client.name} logo`}
              />
              <AvatarFallback>
                {authDetails.client.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <h4 className="font-semibold mt-4">
              It is requesting the following permissions:
            </h4>
            {authDetails.scope &&
              authDetails.scope.split(" ").length > 0 &&
              authDetails.scope.split(" ").map((scope) => (
                <AccordionItem key={scope} value={scope}>
                  <AccordionTrigger>
                    {scope.charAt(0).toUpperCase() + scope.slice(1)}
                  </AccordionTrigger>
                  {scopesDescriptions[scope] && (
                    <AccordionContent>
                      {scopesDescriptions[scope]}
                    </AccordionContent>
                  )}
                </AccordionItem>
              ))}
          </Accordion>
        </CardContent>
        <CardFooter className="flex-col">
          <form
            action="/api/oauth/decision"
            method="POST"
            className="w-full my-8 flex space-x-4 justify-center"
          >
            <input
              type="hidden"
              name="authorization_id"
              value={authorizationId}
            />
            <ButtonGroup>
              <Button
                type="submit"
                name="decision"
                value="approve"
                className="w-32"
              >
                Approve
              </Button>
              <ButtonGroupSeparator />
              <Button
                type="submit"
                name="decision"
                value="deny"
                className="w-32"
              >
                Deny
              </Button>
            </ButtonGroup>
          </form>
        </CardFooter>

        {error && <p className="text-red-500 mb-4">{error}</p>}
      </Card>
    </>
  );
}
