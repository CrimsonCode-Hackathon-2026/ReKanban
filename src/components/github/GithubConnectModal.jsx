import { useCallback, useEffect, useState } from "react";
import { fetchGithubRepos, startGithubConnect } from "../../api/githubApi";

const INSTALLATION_STORAGE_KEY = "gh_installation_id";
const REPO_STORAGE_KEY = "gh_repo_full_name";

function readLocalStorageValue(key) {
  if (typeof window === "undefined") {
    return "";
  }

  try {
    return window.localStorage.getItem(key) || "";
  } catch {
    return "";
  }
}

function writeLocalStorageValue(key, value) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(key, value);
  } catch {
    // no-op when storage is unavailable
  }
}

function normalizeInstallationId(value) {
  if (value === undefined || value === null || value === "") {
    return "";
  }

  return String(value);
}

function normalizeRepos(payload) {
  const sourceRepos = Array.isArray(payload?.repos) ? payload.repos : [];

  return sourceRepos
    .map((repo) => ({
      id: repo?.id,
      full_name: repo?.full_name,
    }))
    .filter((repo) => repo.id !== undefined && typeof repo.full_name === "string");
}

export default function GithubConnectModal({
  isOpen,
  onConnected,
  onClose,
  installationId: installationIdProp,
}) {
  const [installationId, setInstallationId] = useState("");
  const [repos, setRepos] = useState([]);
  const [selectedRepoFullName, setSelectedRepoFullName] = useState("");
  const [isLoadingRepos, setIsLoadingRepos] = useState(false);
  const [repoError, setRepoError] = useState("");
  const [isContinuing, setIsContinuing] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const nextInstallationId = normalizeInstallationId(
      installationIdProp || readLocalStorageValue(INSTALLATION_STORAGE_KEY),
    );
    setInstallationId(nextInstallationId);
    setSelectedRepoFullName(readLocalStorageValue(REPO_STORAGE_KEY));
    setRepoError("");
  }, [installationIdProp, isOpen]);

  const loadRepos = useCallback(async () => {
    if (!isOpen || !installationId) {
      setRepos([]);
      setIsLoadingRepos(false);
      return;
    }

    setIsLoadingRepos(true);
    setRepoError("");

    try {
      const payload = await fetchGithubRepos(installationId);
      const nextRepos = normalizeRepos(payload);
      const storedRepo = readLocalStorageValue(REPO_STORAGE_KEY);

      setRepos(nextRepos);
      setSelectedRepoFullName((currentValue) => {
        if (currentValue && nextRepos.some((repo) => repo.full_name === currentValue)) {
          return currentValue;
        }
        if (storedRepo && nextRepos.some((repo) => repo.full_name === storedRepo)) {
          return storedRepo;
        }
        if (nextRepos.length === 1) {
          return nextRepos[0].full_name;
        }
        return "";
      });
    } catch (error) {
      setRepos([]);
      setRepoError(error?.message || "Failed to load repositories.");
    } finally {
      setIsLoadingRepos(false);
    }
  }, [installationId, isOpen]);

  useEffect(() => {
    loadRepos();
  }, [loadRepos]);

  const handleContinue = () => {
    if (!installationId || !selectedRepoFullName || isContinuing) {
      return;
    }

    setIsContinuing(true);

    writeLocalStorageValue(INSTALLATION_STORAGE_KEY, String(installationId));
    writeLocalStorageValue(REPO_STORAGE_KEY, selectedRepoFullName);

    if (typeof onConnected === "function") {
      onConnected({
        installationId: String(installationId),
        repoFullName: selectedRepoFullName,
      });
    }

    if (typeof onClose === "function") {
      onClose();
    }

    setIsContinuing(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-lg"
      >
        <h2 className="text-lg font-semibold text-slate-900">Connect GitHub</h2>

        {!installationId && (
          <div className="mt-4 space-y-4">
            <p className="text-sm text-slate-600">
              Connect your GitHub account before continuing the wizard.
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

        {installationId && isLoadingRepos && (
          <div className="mt-4">
            <p className="text-sm text-slate-600">Loading repositories...</p>
          </div>
        )}

        {installationId && !isLoadingRepos && repoError && (
          <div className="mt-4 space-y-3">
            <p className="text-sm text-red-600">{repoError}</p>
            <button
              type="button"
              onClick={loadRepos}
              className="inline-flex w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-100"
            >
              Retry
            </button>
          </div>
        )}

        {installationId && !isLoadingRepos && !repoError && (
          <div className="mt-4 space-y-4">
            <p className="text-sm text-slate-600">Select a repository to continue.</p>

            <label className="block text-sm font-medium text-slate-700" htmlFor="repo-select">
              Repository
            </label>

            <select
              id="repo-select"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
              value={selectedRepoFullName}
              onChange={(event) => setSelectedRepoFullName(event.target.value)}
              disabled={repos.length === 0}
            >
              <option value="">
                {repos.length === 0 ? "No repositories found" : "Select a repository"}
              </option>
              {repos.map((repo) => (
                <option key={repo.id} value={repo.full_name}>
                  {repo.full_name}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleContinue}
              disabled={!selectedRepoFullName || repos.length === 0 || isContinuing}
              className="inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {isContinuing ? "Continuing..." : "Continue"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
