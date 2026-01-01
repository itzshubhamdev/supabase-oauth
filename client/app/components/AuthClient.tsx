"use client";

export default function AuthClient({ supabaseUrl, clientId }: any) {
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

  const handleGenerate = async () => {
    const codeVerifier = generateCodeVerifier();

    document.cookie = `code_verifier=${codeVerifier}; path=/; max-age=3600; SameSite=Lax; Secure`;
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    const url =
      `${supabaseUrl}/auth/v1/oauth/authorize?` +
      new URLSearchParams({
        response_type: "code",
        client_id: clientId!,
        redirect_uri: "http://localhost:3001/auth/callback",
        scope: "openid email profile",
        code_challenge_method: "S256",
        code_challenge: codeChallenge,
      }).toString();

    window.location.href = url;
  };

  return (
    <button
      onClick={handleGenerate}
      className="w-full border border-gray-300 shadow-sm p-2 rounded-md mt-2"
    >
      Login Using OAuth
    </button>
  );
}
