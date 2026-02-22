const FUNCTIONS_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

function buildFunctionUrl(functionName) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (!supabaseUrl) {
    throw new Error("Missing VITE_SUPABASE_URL.");
  }

  return `${FUNCTIONS_BASE.replace(/\/+$/, "")}/${functionName}`;
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  const text = await response.text();

  let data = {};
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(`Invalid JSON response from ${url} (${response.status}).`);
    }
  }

  if (!response.ok) {
    const message =
      data?.error || data?.message || `Request failed with status ${response.status}.`;
    const error = new Error(message);
    error.status = response.status;
    error.response = data;
    throw error;
  }

  return data;
}

export function startGithubConnect() {
  window.location.href = buildFunctionUrl("github-connect-start");
}

export async function fetchGithubRepos(installationId) {
  const response = await fetchJson(buildFunctionUrl("github-repos"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      installation_id: Number(installationId),
    }),
  });

  const sourceRepos = Array.isArray(response?.repos) ? response.repos : [];
  const repos = sourceRepos
    .map((repo) => ({
      id: repo?.id,
      full_name: repo?.full_name,
    }))
    .filter((repo) => repo.id !== undefined && typeof repo.full_name === "string");

  return { repos };
}

export function generateAndCreateIssues({ installationId, repoFullName, payload }) {
  return fetchJson(buildFunctionUrl("github-generate-and-create-issues"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      installation_id: Number(installationId),
      repoFullName,
      payload,
    }),
  });
}
