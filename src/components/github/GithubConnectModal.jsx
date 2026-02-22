import { useState } from "react";


export default function GithubConnectModal({ isOpen, onConnected, onClose }) {
  const [selectedRepoFullName, setSelectedRepoFullName] = useState("");

  const handleConnectGithub = () => {
    // Intentionally left bare for teammate implementation.
  };

  const handleContinue = () => {
    if (!selectedRepoFullName) {
      return;
    }

    if (typeof onConnected === "function") {
      onConnected({ installationId: "", repoFullName: selectedRepoFullName });
    }

    if (typeof onClose === "function") {
      onClose();
    }
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

        <div className="mt-4 space-y-4">
          <p className="text-sm text-slate-600">
            Authorize your GitHub account and select your repo you want to generate issues into.
          </p>
          <button
            type="button"
            onClick={handleConnectGithub}
            className="inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            Connect GitHub
          </button>
        </div>
      </div>
    </div>
  );
}
