import { getOctokitForInstallation } from "../_shared/githubApp.ts";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type",
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "application/json",
    },
  });
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: CORS_HEADERS,
    });
  }

  if (request.method !== "POST") {
    return jsonResponse({ error: "Method Not Allowed" }, 405);
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON body." }, 400);
  }

  const installationId = (payload as { installation_id?: unknown })?.installation_id;
  if (typeof installationId !== "number" || !Number.isFinite(installationId)) {
    return jsonResponse(
      { error: "Invalid installation_id. Expected JSON { installation_id: number }." },
      400,
    );
  }

  try {
    const octokit = getOctokitForInstallation(installationId);
    const { data } = await octokit.request("GET /installation/repositories");

    const repos = Array.isArray(data?.repositories)
      ? data.repositories.map((repo) => ({
          id: repo.id,
          full_name: repo.full_name,
        }))
      : [];

    return jsonResponse({ repos });
  } catch (error) {
    const statusFromError =
      typeof (error as { status?: unknown })?.status === "number"
        ? Number((error as { status: number }).status)
        : 500;

    const status = statusFromError >= 400 && statusFromError < 500 ? 400 : 500;
    const message =
      (error as { message?: string })?.message || "Failed to fetch repositories from GitHub.";
    const details = (error as { response?: { data?: unknown } })?.response?.data;

    return jsonResponse(
      details ? { error: message, details } : { error: message },
      status,
    );
  }
});
