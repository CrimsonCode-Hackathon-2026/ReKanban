const DEFAULT_STEPS = [
  {
    id: 1,
    name: "Goals",
    status: "active",
    activeClasses: "border-amber-300 bg-amber-100 shadow-sm",
  },
  {
    id: 2,
    name: "Constraints",
    status: "incomplete",
    activeClasses: "border-sky-300 bg-sky-100 shadow-sm",
  },
  {
    id: 3,
    name: "Context",
    status: "incomplete",
    activeClasses: "border-violet-300 bg-violet-100 shadow-sm",
  },
  {
    id: 4,
    name: "Guardrails",
    status: "incomplete",
    activeClasses: "border-rose-300 bg-rose-100 shadow-sm",
  },
];

export default function Stepper({ steps = DEFAULT_STEPS, activeStepId = 1 }) {
  return (
    <ol className="space-y-3" aria-label="Project setup steps">
      {steps.map((step) => {
        const isActive = step.id === activeStepId;
        const isComplete = step.status === "complete";
        const badgeText = isComplete ? "Complete" : isActive ? "Active" : "Incomplete";

        const badgeClasses = isComplete
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : isActive
            ? "border-slate-300 bg-white text-slate-700"
            : "border-slate-300 bg-white text-slate-600";

        const circleClasses = isComplete
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-slate-300 bg-white text-slate-700";

        return (
          <li key={step.id}>
            <button
              type="button"
              className={`w-full rounded-xl border px-3 py-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-1 ${
                isActive ? step.activeClasses : "border-slate-200 bg-white"
              } hover:border-slate-300`}
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
