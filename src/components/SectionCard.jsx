const STEP_STYLES = {
  Goals: {
    panel: "border-amber-200 bg-amber-100/80",
    title: "text-amber-900",
    chip: "bg-white/80 text-amber-800",
    line: "bg-amber-200",
    button: "bg-amber-300/70",
  },
  Constraints: {
    panel: "border-sky-200 bg-sky-100/80",
    title: "text-sky-900",
    chip: "bg-white/80 text-sky-800",
    line: "bg-sky-200",
    button: "bg-sky-300/70",
  },
  Context: {
    panel: "border-violet-200 bg-violet-100/80",
    title: "text-violet-900",
    chip: "bg-white/80 text-violet-800",
    line: "bg-violet-200",
    button: "bg-violet-300/70",
  },
  Guardrails: {
    panel: "border-rose-200 bg-rose-100/80",
    title: "text-rose-900",
    chip: "bg-white/80 text-rose-800",
    line: "bg-rose-200",
    button: "bg-rose-300/70",
  },
};

export default function SectionCard({ activeStepName = "Goals" }) {
  const stepStyle = STEP_STYLES[activeStepName] ?? STEP_STYLES.Goals;

  return (
    <div className={`rounded-xl border p-4 shadow-sm ${stepStyle.panel}`}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className={`text-sm font-semibold ${stepStyle.title}`}>
          Current Step: {activeStepName}
        </h3>

        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${stepStyle.chip}`}
        >
          Layout Placeholder
        </span>
      </div>

      <div className="space-y-3">
        <div className={`h-3 w-2/5 rounded ${stepStyle.line}`} />
        <div className="h-10 w-full rounded-lg bg-white/80" />
        <div className={`h-3 w-1/3 rounded ${stepStyle.line}`} />
        <div className="h-10 w-full rounded-lg bg-white/80" />
        <div className="h-16 w-full rounded-lg bg-white/80" />
        <div className="flex gap-2 pt-1">
          <div className="h-9 w-24 rounded-lg bg-white/80" />
          <div className={`h-9 w-32 rounded-lg ${stepStyle.button}`} />
        </div>
      </div>
    </div>
  );
}
