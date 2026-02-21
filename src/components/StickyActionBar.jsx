export default function StickyActionBar({
  onBack,
  onNext,
  onGeneratePlan,
  isBackDisabled,
  isNextDisabled,
  isGenerateDisabled,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={isBackDisabled}
          className={`h-10 rounded-lg border text-sm font-medium transition focus:outline-none focus-visible:ring-2 ${
            isBackDisabled
              ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 focus-visible:ring-slate-200"
              : "border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200 focus-visible:ring-slate-300"
          }`}
        >
          Back
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={isNextDisabled}
          className={`h-10 rounded-lg text-sm font-medium transition focus:outline-none focus-visible:ring-2 ${
            isNextDisabled
              ? "cursor-not-allowed bg-slate-300 text-slate-500 focus-visible:ring-slate-200"
              : "bg-slate-900 text-white hover:bg-slate-800 focus-visible:ring-slate-400"
          }`}
        >
          Next
        </button>
      </div>

      <button
        type="button"
        onClick={onGeneratePlan}
        disabled={isGenerateDisabled}
        className={`mt-3 h-11 w-full rounded-lg text-sm font-semibold transition focus:outline-none focus-visible:ring-2 ${
          isGenerateDisabled
            ? "cursor-not-allowed bg-slate-300 text-slate-500 focus-visible:ring-slate-200"
            : "bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:ring-indigo-300"
        }`}
      >
        Generate Plan
      </button>
    </div>
  );
}
