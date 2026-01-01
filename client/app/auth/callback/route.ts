import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const clientID = process.env.NEXT_PUBLIC_SUPABASE_CLIENT_ID;
const clientSecret = process.env.SUPABASE_CLIENT_SECRET;

async function handle(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  const error = searchParams.get("error");
  const code = searchParams.get("code");
  let next = searchParams.get("next") || "/";

  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  if (!next.startsWith("/")) {
    next = "/";
  }

  if (code) {
    const cookieStore = await cookies();
    const codeVerifier = cookieStore.get("code_verifier")?.value;

    if (!codeVerifier) {
      return NextResponse.json(
        { error: "Code verifier not found" },
        { status: 400 },
      );
    }

    const res = await fetch(`${supabaseURL}/auth/v1/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: clientID!,
        client_secret: clientSecret!,
        redirect_uri: `${origin}/auth/callback`,
        code_verifier: codeVerifier,
      }),
    });

    const tokens = await res.json();

    const response = NextResponse.redirect(`${origin}${next}`);
    response.cookies.delete("code_verifier");
    response.cookies.set("access_token", tokens.access_token, {
      httpOnly: true,
      path: "/",
    });
    response.cookies.set("refresh_token", tokens.refresh_token, {
      httpOnly: true,
      path: "/",
    });

    return response;
  }
}

export { handle as GET, handle as POST };
