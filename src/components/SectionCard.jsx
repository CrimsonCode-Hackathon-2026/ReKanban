import ConstraintsStep from "./ConstraintsStep";
import ContextStep from "./ContextStep";
import GoalsStep from "./GoalsStep";

const STEP_META = {
  1: {
    name: "Goals",
    subtitle: "Define outcomes. Tasks will be generated from these goals.",
    panelClasses: "border-amber-200 bg-amber-100/80",
    labelClasses: "text-amber-900",
    chipClasses: "bg-white/80 text-amber-800",
  },
  2: {
    name: "Constraints",
    subtitle: "Capture limits and boundaries for the generated plan.",
    panelClasses: "border-sky-200 bg-sky-100/80",
    labelClasses: "text-sky-900",
    chipClasses: "bg-white/80 text-sky-800",
  },
  3: {
    name: "Context",
    subtitle: "Add background details so output matches your project reality.",
    panelClasses: "border-violet-200 bg-violet-100/80",
    labelClasses: "text-violet-900",
    chipClasses: "bg-white/80 text-violet-800",
  },
  4: {
    name: "Guardrails",
    subtitle: "Define what to avoid and quality expectations.",
    panelClasses: "border-rose-200 bg-rose-100/80",
    labelClasses: "text-rose-900",
    chipClasses: "bg-white/80 text-rose-800",
  },
};

function PlaceholderStepContent({ title }) {
  return (
    <div className="rounded-xl border border-white/70 bg-white/60 p-4">
      <p className="text-sm font-medium text-slate-700">{title} form coming soon</p>
      <div className="mt-3 space-y-3">
        <div className="h-3 w-2/5 rounded bg-white/90" />
        <div className="h-10 w-full rounded-lg bg-white/90" />
        <div className="h-3 w-1/3 rounded bg-white/90" />
        <div className="h-10 w-full rounded-lg bg-white/90" />
        <div className="h-16 w-full rounded-lg bg-white/90" />
      </div>
    </div>
  );
}

export default function SectionCard({
  activeStepId,
  goals,
  onAddGoal,
  onUpdateGoal,
  onDeleteGoal,
  constraints,
  onAddConstraint,
  onUpdateConstraint,
  onDeleteConstraint,
  contextText,
  onContextChange,
}) {
  const currentStep = STEP_META[activeStepId] ?? STEP_META[1];

  return (
    <div className={`rounded-xl border p-4 shadow-sm ${currentStep.panelClasses}`}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className={`text-sm font-semibold ${currentStep.labelClasses}`}>
          Current Step: {currentStep.name}
        </h3>

        <span className={`rounded-full px-2 py-1 text-xs font-medium ${currentStep.chipClasses}`}>
          Wizard Content
        </span>
      </div>

      {activeStepId === 1 ? (
        <GoalsStep
          goals={goals}
          onAddGoal={onAddGoal}
          onUpdateGoal={onUpdateGoal}
          onDeleteGoal={onDeleteGoal}
        />
      ) : activeStepId === 2 ? (
        <ConstraintsStep
          constraints={constraints}
          onAddConstraint={onAddConstraint}
          onUpdateConstraint={onUpdateConstraint}
          onDeleteConstraint={onDeleteConstraint}
        />
      ) : activeStepId === 3 ? (
        <ContextStep value={contextText} onChange={onContextChange} />
      ) : (
        <PlaceholderStepContent title={currentStep.name} />
      )}
    </div>
  );
}
