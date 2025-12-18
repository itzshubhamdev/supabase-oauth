"use client";

import { useEffect, useState } from "react";

export default function AuthClient({ user, supabaseUrl, clientId }: any) {
  const [authURL, setAuthURL] = useState<string | null>(null);

  function generateCodeVerifier() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return base64URLEncode(array);
  }

  async function generateCodeChallenge(verifier: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const hash = await crypto.subtle.digest("SHA-256", data);
    return base64URLEncode(new Uint8Array(hash));
  }

  function base64URLEncode(buffer: Uint8Array) {
    return btoa(String.fromCharCode(...buffer))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
  }

  useEffect(() => {
    const codeVerifier = generateCodeVerifier();
    try {
      sessionStorage.setItem("code_verifier", codeVerifier);
    } catch {
      // ignore on SSR or if sessionStorage unavailable
    }
  }, []);

  const handleGenerate = async () => {
    const codeVerifier =
      sessionStorage.getItem("code_verifier") || generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    const url =
      `${supabaseUrl}/auth/v1/oauth/authorize?` +
      new URLSearchParams({
        response_type: "code",
        client_id: clientId!,
        redirect_uri: "http://localhost:3000/auth/callback",
        scope: "openid email profile",
        code_challenge_method: "S256",
        code_challenge: codeChallenge,
      }).toString();

    setAuthURL(url);
  };

  return (
    <div>
      {user ? (
        <>
          <p>Logged in as {user.email}</p>
          {authURL && (
            <a href={authURL} target="_blank" rel="noreferrer">
              {authURL}
            </a>
          )}
          <button onClick={handleGenerate}>
            Generate OAuth Authorization URL
          </button>
        </>
      ) : (
        <p>You are not logged in.</p>
      )}
    </div>
  );
}
