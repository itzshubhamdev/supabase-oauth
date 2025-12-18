import { createClient } from "@/app/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ArrowLeftRight } from "lucide-react";

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
  const supabase = await createClient(cookies());
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
    <div className="w-full h-screen bg-gray-900 flex items-center justify-center">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg flex flex-col items-center">
        <div className="flex items-center mt-8">
          {user.user_metadata.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt={`${user.user_metadata.full_name}`}
              className="h-20 w-20 mx-auto rounded-full"
            />
          ) : (
            <div className="h-20 w-20 rounded-full bg-gray-600 flex items-center justify-center text-white text-2xl">
              {user.email?.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="mx-4 flex items-center">
            <ArrowLeftRight className="text-white" size={32} />
          </div>
          <div className="flex flex-col justify-center">
            {authDetails.client?.logo_uri ? (
              <img
                src={authDetails.client.logo_uri}
                alt={`${authDetails.client.name} logo`}
                className="h-20 w-20 mx-auto rounded-full"
              />
            ) : (
              <div className="h-20 w-20 mx-auto rounded-full bg-gray-600 flex items-center justify-center text-white text-2xl">
                {authDetails.client?.name
                  ? authDetails.client.name.charAt(0).toUpperCase()
                  : "?"}
              </div>
            )}
          </div>
        </div>
        <div className="my-8 text-center text-lg">
          <h1 className="text-2xl">Authorize {authDetails.client.name}</h1>
          Logged in as *<span className="font-semibold">{user.email}</span>*
        </div>
        {authDetails.scope && authDetails.scope.split(" ").length > 0 && (
          <div>
            <h1 className="mb-2 text-lg">It will be given permission to:</h1>
            <ul className="list-disc list-inside text-left">
              {authDetails.scope.split(" ").map((scope) => (
                <li key={scope}>{scopesDescriptions[scope] || scope}</li>
              ))}
            </ul>
          </div>
        )}
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
          <button
            type="submit"
            name="decision"
            value="approve"
            className="w-32 bg-gray-900 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Approve
          </button>
          <button
            type="submit"
            name="decision"
            value="deny"
            className="w-32 bg-gray-900 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Deny
          </button>
        </form>
      </div>
    </div>
  );
}
