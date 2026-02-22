const API_CONFIG = {
  baseUrl:
    import.meta.env.VITE_EDGE_FUNCTIONS_BASE_URL ||
    (import.meta.env.VITE_SUPABASE_URL
      ? `${import.meta.env.VITE_SUPABASE_URL.replace(/\/+$/, "")}/functions/v1`
      : ""),
  endpoints: {
    connectStart: "github-connect-start",
    repos: "github-repos",
    selectedRepo: "github-selected-repo",
    bulkCreateIssues: "github-bulk-create-issues",
  },
  defaultHeaders: {
    "Content-Type": "application/json",
  },
};

function buildUrl(endpointKey, query = {}) {
  const endpoint = API_CONFIG.endpoints[endpointKey];
  if (!endpoint) {
    throw new Error(`Unknown API endpoint key: ${endpointKey}`);
  }
  if (!API_CONFIG.baseUrl) {
    throw new Error(
      "Missing API base URL. Set VITE_EDGE_FUNCTIONS_BASE_URL or VITE_SUPABASE_URL.",
    );
  }

  const url = new URL(
    `${API_CONFIG.baseUrl.replace(/\/+$/, "")}/${endpoint}`,
    window.location.origin,
  );

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...API_CONFIG.defaultHeaders,
      ...(options.headers || {}),
    },
  });

  return response.json();
}

export function startGithubConnect() {
  const url = buildUrl("connectStart");
  window.location.assign(url);
}

export function fetchGithubRepos(installationId) {
  const url = buildUrl("repos", { installationId });
  return fetchJson(url);
}

export function setSelectedRepo(repoFullName) {
  const url = buildUrl("selectedRepo");
  return fetchJson(url, {
    method: "POST",
    body: JSON.stringify({ repoFullName }),
  });
}

export function bulkCreateIssues({ installationId, repoFullName, tasks }) {
  const url = buildUrl("bulkCreateIssues");
  return fetchJson(url, {
    method: "POST",
    body: JSON.stringify({ installationId, repoFullName, tasks }),
  });
}
