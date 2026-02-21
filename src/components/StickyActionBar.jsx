export default function StickyActionBar({ canGenerate = false }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className="h-10 rounded-lg border border-slate-300 bg-slate-100 text-sm font-medium text-slate-700 transition hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
        >
          Back
        </button>

        <button
          type="button"
          className="h-10 rounded-lg bg-slate-900 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        >
          Next
        </button>
      </div>

      <button
        type="button"
        disabled={!canGenerate}
        className={`mt-3 h-11 w-full rounded-lg text-sm font-semibold transition focus:outline-none focus-visible:ring-2 ${
          canGenerate
            ? "bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:ring-indigo-300"
            : "cursor-not-allowed bg-slate-300 text-slate-500 focus-visible:ring-slate-200"
        }`}
      >
        Generate Plan
      </button>
    </div>
  );
}
