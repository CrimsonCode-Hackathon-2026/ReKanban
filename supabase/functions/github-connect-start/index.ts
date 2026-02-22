function generateNonce(byteLength = 16): string {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

Deno.serve((request) => {
  if (request.method !== "GET") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: {
        Allow: "GET",
      },
    });
  }

  const appSlug = Deno.env.get("GH_APP_SLUG");
  if (!appSlug) {
    return new Response("Missing required environment variable: GH_APP_SLUG.", {
      status: 500,
    });
  }

  const nonce = generateNonce();
  const cookieValue = encodeURIComponent(nonce);
  const setCookie = `gh_connect_nonce=${cookieValue}; HttpOnly; Secure; SameSite=Lax; Path=/`;
  const location = `https://github.com/apps/${appSlug}/installations/new`;

  return new Response(null, {
    status: 302,
    headers: {
      Location: location,
      "Set-Cookie": setCookie,
    },
  });
});
