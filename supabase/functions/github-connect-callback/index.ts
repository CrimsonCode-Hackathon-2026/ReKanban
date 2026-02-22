function getCookieValue(cookieHeader: string | null, key: string): string {
  if (!cookieHeader) {
    return "";
  }

  const parts = cookieHeader.split(";");
  for (const part of parts) {
    const [rawName, ...rawValueParts] = part.trim().split("=");
    if (rawName !== key) {
      continue;
    }

    const rawValue = rawValueParts.join("=");
    if (!rawValue) {
      return "";
    }

    try {
      return decodeURIComponent(rawValue);
    } catch {
      return rawValue;
    }
  }

  return "";
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

  const nonce = getCookieValue(request.headers.get("Cookie"), "gh_connect_nonce");
  if (!nonce) {
    return new Response("Missing gh_connect_nonce cookie.", { status: 400 });
  }

  const url = new URL(request.url);
  const installationId = url.searchParams.get("installation_id");
  if (!installationId) {
    return new Response("Missing installation_id query parameter.", { status: 400 });
  }

  const frontendUrl = Deno.env.get("FRONTEND_URL");
  if (!frontendUrl) {
    return new Response("Missing required environment variable: FRONTEND_URL.", {
      status: 500,
    });
  }

  const location = `${frontendUrl.replace(/\/+$/, "")}/?installation_id=${encodeURIComponent(
    installationId,
  )}`;
  const clearCookie =
    "gh_connect_nonce=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0";

  return new Response(null, {
    status: 302,
    headers: {
      Location: location,
      "Set-Cookie": clearCookie,
    },
  });
});
