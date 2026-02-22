import { useEffect } from "react";

export default function GeneratingOverlay({ open }) {
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

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 backdrop-blur-sm">
      <style>{`
        @keyframes rekanban-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div
        role="status"
        aria-live="polite"
        aria-busy="true"
        className="w-full max-w-md rounded-2xl border border-slate-200/60 bg-white/90 p-8 text-center shadow-2xl backdrop-blur"
      >
        <div className="relative mx-auto h-20 w-20">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              animation: "rekanban-spin 1.8s linear infinite",
              background:
                "conic-gradient(from 0deg, rgba(8,145,178,0) 10%, rgba(8,145,178,0.95) 55%, rgba(99,102,241,0.92) 85%, rgba(8,145,178,0) 100%)",
              WebkitMask:
                "radial-gradient(farthest-side, transparent calc(100% - 8px), #000 calc(100% - 7px))",
              mask: "radial-gradient(farthest-side, transparent calc(100% - 8px), #000 calc(100% - 7px))",
              filter: "drop-shadow(0 0 12px rgba(8,145,178,0.25))",
            }}
          />
          <div className="absolute inset-[10px] rounded-full bg-slate-50 shadow-inner shadow-slate-200/70" />
        </div>

        <h2 className="mt-6 text-xl font-semibold text-slate-900">Generating tasks...</h2>
        <p className="mt-2 text-sm text-slate-600">Turning your goals into GitHub issues</p>
      </div>
    </div>
  );
}
