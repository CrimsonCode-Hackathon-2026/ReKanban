const RECOMMENDED_MIN_LENGTH = 20;

export default function ContextStep({ value, onChange }) {
  const charCount = value.trim().length;
  const isRecommendedLength = charCount >= RECOMMENDED_MIN_LENGTH;

  return (
    <div>
      <h3 className="text-base font-semibold text-slate-900">Context</h3>
      <p className="mt-1 text-sm text-slate-600">
        Add any details that help generate accurate tasks (stack, team size, timeline, audience,
        constraints not listed).
      </p>

      <div className="mt-4 rounded-xl border border-slate-200 bg-white/80 p-4">
        <label htmlFor="context-details" className="mb-1 block text-xs font-medium text-slate-700">
          Additional context
        </label>

        <textarea
          id="context-details"
          rows={8}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          placeholder="We are 2 developers building a hackathon MVP.
Stack: React frontend + Node backend.
Goal: generate 8-12 tasks and populate a board.
Must avoid storing PII."
        />

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-slate-600">
            Recommended: at least {RECOMMENDED_MIN_LENGTH} characters
          </p>

          <p
            className={`text-xs font-medium ${
              isRecommendedLength ? "text-emerald-700" : "text-slate-600"
            }`}
          >
            {charCount}/{RECOMMENDED_MIN_LENGTH}
          </p>
        </div>
      </div>
    </div>
  );
}
