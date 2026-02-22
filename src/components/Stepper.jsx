export default function Stepper({ steps, activeStepId, onSelectStep }) {
  const activeStepClasses = {
    1: "border-amber-300 bg-amber-100 shadow-sm",
    2: "border-sky-300 bg-sky-100 shadow-sm",
    3: "border-violet-300 bg-violet-100 shadow-sm",
    4: "border-rose-300 bg-rose-100 shadow-sm",
    5: "border-emerald-300 bg-emerald-100 shadow-sm",
  };

  return (
    <ol className="space-y-3" aria-label="Project setup steps">
      {steps.map((step) => {
        const isActive =
          typeof step.isActive === "boolean"
            ? step.isActive
            : step.status === "active" || step.id === activeStepId;

        const isComplete =
          typeof step.isComplete === "boolean"
            ? step.isComplete
            : step.status === "complete";

        const stepClasses = isActive
          ? activeStepClasses[step.id] ?? "border-slate-300 bg-slate-100 shadow-sm"
          : "border-slate-200 bg-white";

        const badgeClasses = isComplete
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : isActive
            ? "border-slate-300 bg-white text-slate-700"
            : "border-slate-300 bg-white text-slate-600";

        const circleClasses = isComplete
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-slate-300 bg-white text-slate-700";

        const badgeText = isComplete ? "Complete" : isActive ? "Active" : "Incomplete";

        return (
          <li key={step.id}>
            <button
              type="button"
              onClick={() => onSelectStep(step.id)}
              aria-current={step.id === activeStepId ? "step" : undefined}
              className={`w-full rounded-xl border px-3 py-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-1 hover:border-slate-300 ${stepClasses}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold ${circleClasses}`}
                >
                  {step.id}
                </div>

                <p className="flex-1 text-sm font-semibold text-slate-900">{step.name}</p>

                <span
                  className={`rounded-full border px-2.5 py-1 text-xs font-medium ${badgeClasses}`}
                >
                  {badgeText}
                </span>
              </div>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
