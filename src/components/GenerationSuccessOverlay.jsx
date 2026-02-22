import { useEffect, useRef } from "react";


export default function GenerationSuccessOverlay({
  open = true,
  onClose,
  owner,
  repo,
  issueCount,
}) {
  const primaryButtonRef = useRef(null);
  const closeButtonRef = useRef(null);
  const titleIdRef = useRef(`generation-success-overlay-title-${Math.random().toString(36).slice(2, 10)}`);
  const issuesUrl = owner && repo ? `https://github.com/${owner}/${repo}/issues` : null;

  useEffect(() => {
    if (!open || typeof document === "undefined") {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open || typeof window === "undefined") {
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && typeof onClose === "function") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const focusTarget = primaryButtonRef.current || closeButtonRef.current;
    if (!focusTarget) {
      return;
    }

    const rafId = window.requestAnimationFrame(() => {
      focusTarget.focus();
    });

    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, [open, issuesUrl]);

  if (!open) {
    return null;
  }

  const showDetailLine = Boolean(issueCount && owner && repo);
  const canClose = typeof onClose === "function";

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      onClick={canClose ? onClose : undefined}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleIdRef.current}
        className="w-full max-w-md rounded-2xl border border-slate-200/60 bg-white/95 p-8 text-center shadow-2xl backdrop-blur"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400/70 via-cyan-400/50 to-blue-500/65 blur-md" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-lg shadow-emerald-500/30 ring-4 ring-white/70">
            <svg
              viewBox="0 0 24 24"
              className="h-8 w-8 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
        </div>

        <h2 id={titleIdRef.current} className="mt-6 text-xl font-semibold text-slate-900">
          Tasks generated
        </h2>
        <p className="mt-2 text-sm text-slate-600">Your GitHub issues are ready.</p>

        {showDetailLine ? (
          <p className="mt-3 text-sm text-slate-500">
            Created {issueCount} issues in {owner}/{repo}
          </p>
        ) : null}

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {issuesUrl ? (
            <a
              ref={primaryButtonRef}
              href={issuesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
            >
              View issues on GitHub
            </a>
          ) : null}

          <button
            ref={closeButtonRef}
            type="button"
            onClick={canClose ? onClose : undefined}
            disabled={!canClose}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
