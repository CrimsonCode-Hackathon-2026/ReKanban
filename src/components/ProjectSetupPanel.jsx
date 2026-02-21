import SectionCard from "./SectionCard";
import Stepper from "./Stepper";
import StickyActionBar from "./StickyActionBar";

const STEPS = [
  {
    id: 1,
    name: "Goals",
    status: "complete",
    activeClasses: "border-amber-300 bg-amber-100 shadow-sm",
  },
  {
    id: 2,
    name: "Constraints",
    status: "active",
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

export default function ProjectSetupPanel() {
  const activeStep = STEPS.find((step) => step.status === "active") ?? STEPS[0];
  const canGenerate = STEPS.every((step) => step.status === "complete");

  return (
    <section className="lg:col-span-4">
      <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:h-[calc(100vh-7.5rem)]">
        <h2 className="text-xl font-semibold text-slate-900">Project Setup</h2>

        <p className="mt-1 text-sm text-slate-500">
          Define intent before generating your board.
        </p>

        <div className="mt-5 flex-1 space-y-5 overflow-y-auto pr-1">
          <Stepper steps={STEPS} activeStepId={activeStep.id} />
          <SectionCard activeStepName={activeStep.name} />
        </div>

        <div className="mt-5 shrink-0 border-t border-slate-200 pt-4">
          <StickyActionBar canGenerate={canGenerate} />
        </div>
      </div>
    </section>
  );
}
