const STEPS = [
  { id: 1, name: "Goals", status: "Incomplete", color: "bg-amber-100" },
  { id: 2, name: "Constraints", status: "Incomplete", color: "bg-sky-100" },
  { id: 3, name: "Context", status: "Incomplete", color: "bg-violet-100" },
  { id: 4, name: "Guardrails", status: "Incomplete", color: "bg-rose-100" },
];

export default function Stepper() {
  return (
    <div className="space-y-3">
      {STEPS.map((step) => (
        <div
          key={step.id}
          className={`flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-3 ${step.color}`}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-sm font-semibold text-slate-700">
            {step.id}
          </div>

          <p className="flex-1 text-sm font-semibold text-slate-900">
            {step.name}
          </p>

          <span className="rounded-full border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
            {step.status}
          </span>
        </div>
      ))}
    </div>
  );
}
