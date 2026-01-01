import AuthClient from "./components/AuthClient";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const clientID = process.env.NEXT_PUBLIC_SUPABASE_CLIENT_ID;

type DecodedToken = {
  aud: string;
  exp: number;
  iat: number;
  iss: string;
  sub: string;
  email: string;
  phone: string;
  app_metadata: {
    provider: string;
    providers: string[];
  };
  user_metadata: {};
  role: string;
  aal: string;
  amr: {
    method: string;
    timestamp: number;
  }[];
  session_id: string;
  client_id: string;
};

export default async function Page() {
  const cookiesStore = await cookies();
  const accessToken = cookiesStore.get("access_token")?.value;
  const decoded = jwt.decode(accessToken || "") as DecodedToken | null;

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-sm border border-gray-300 rounded-lg p-4 shadow-sm">
        <h1 className="w-full text-center text-2xl pb-2">
          Welcome to SuperAuth
        </h1>
        {decoded ? (
          <>
            <p className="font-semibold">
              Logged in as:
              <span className="font-normal ml-2">{decoded.email}</span>
            </p>
            <p className="font-semibold">
              Provider:
              <span className="font-normal ml-2">
                {decoded.app_metadata.provider}
              </span>
            </p>
            <p className="font-semibold">
              Access Token Issued At:
              <span className="font-normal ml-2">
                {new Date(decoded.iat * 1000).toLocaleString()}
              </span>
            </p>
            <p className="font-semibold">
              Access Token Expires At:
              <span className="font-normal ml-2">
                {new Date(decoded.exp * 1000).toLocaleString()}
              </span>
            </p>
            <AuthClient supabaseUrl={supabaseURL} clientId={clientID} />
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
