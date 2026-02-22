import { useEffect, useMemo, useState } from "react";
import {
  fetchGithubRepos,
  setSelectedRepo,
  startGithubConnect,
} from "../../api/githubApi";

function readInstallationIdFromUrl() {
  if (typeof window === "undefined") {
    return "";
  }

  const params = new URLSearchParams(window.location.search);
  return params.get("installationId") || params.get("installation_id") || "";
}

function normalizeRepos(payload) {
  const repoList = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.repos)
      ? payload.repos
      : Array.isArray(payload?.data)
        ? payload.data
        : [];

  return repoList
    .map((repo) => {
      if (typeof repo === "string") {
        return {
          id: repo,
          fullName: repo,
          name: repo.split("/").pop() || repo,
        };
      }

      const fullName = repo.full_name || repo.fullName || "";
      return {
        id: repo.id || fullName || repo.name,
        fullName,
        name: repo.name || fullName.split("/").pop() || fullName,
      };
    })
    .filter((repo) => repo.fullName);
}

export default function GithubConnectModal({ isOpen, onConnected }) {
  const [installationId, setInstallationId] = useState(() =>
    readInstallationIdFromUrl(),
  );
  const [repos, setRepos] = useState([]);
  const [selectedRepoFullName, setSelectedRepoFullName] = useState("");
  const [isLoadingRepos, setIsLoadingRepos] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setInstallationId(readInstallationIdFromUrl());
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !installationId) {
      setRepos([]);
      setSelectedRepoFullName("");
      setIsLoadingRepos(false);
      return;
    }

    let isActive = true;
    setError("");
    setIsLoadingRepos(true);

    fetchGithubRepos(installationId)
      .then((payload) => {
        if (!isActive) {
          return;
        }

        const normalizedRepos = normalizeRepos(payload);
        setRepos(normalizedRepos);

        if (normalizedRepos.length === 1) {
          setSelectedRepoFullName(normalizedRepos[0].fullName);
        }
      })
      .catch((fetchError) => {
        if (!isActive) {
          return;
        }

        setError(fetchError?.message || "Failed to load repositories.");
      })
      .finally(() => {
        if (isActive) {
          setIsLoadingRepos(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [installationId, isOpen]);

  const viewState = useMemo(() => {
    if (!installationId) {
      return "not-connected";
    }

    if (isLoadingRepos) {
      return "loading-repos";
    }

    return "repo-selection";
  }, [installationId, isLoadingRepos]);

  const handleSaveSelection = async () => {
    if (!selectedRepoFullName || !installationId || isSaving) {
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      await setSelectedRepo(selectedRepoFullName);
      if (typeof onConnected === "function") {
        onConnected({ installationId, repoFullName: selectedRepoFullName });
      }
    } catch (saveError) {
      setError(saveError?.message || "Failed to save repository selection.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-slate-900">Connect GitHub</h2>

        {viewState === "not-connected" && (
          <div className="mt-4 space-y-4">
            <p className="text-sm text-slate-600">
              Connect your GitHub account to load repositories for issue
              creation.
            </p>
            <button
              type="button"
              onClick={startGithubConnect}
              className="inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
            >
              Connect GitHub
            </button>
          </div>
        )}

        {viewState === "loading-repos" && (
          <div className="mt-4">
            <p className="text-sm text-slate-600">Loading repositories...</p>
          </div>
        )}

        {viewState === "repo-selection" && (
          <div className="mt-4 space-y-4">
            <p className="text-sm text-slate-600">
              Select the repository for this project.
            </p>

            <label
              className="block text-sm font-medium text-slate-700"
              htmlFor="repo-select"
            >
              Repository
            </label>
            <select
              id="repo-select"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
              value={selectedRepoFullName}
              onChange={(event) => setSelectedRepoFullName(event.target.value)}
            >
              <option value="">Select a repository</option>
              {repos.map((repo) => (
                <option key={repo.id} value={repo.fullName}>
                  {repo.fullName}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleSaveSelection}
              disabled={!selectedRepoFullName || isSaving}
              className="inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {isSaving ? "Saving..." : "Save Repository"}
            </button>
          </div>
        )}

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}
