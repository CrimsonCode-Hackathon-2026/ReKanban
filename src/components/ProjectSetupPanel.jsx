import Stepper from "./Stepper";
import StickyActionBar from "./StickyActionBar";

export default function ProjectSetupPanel({
  steps,
  activeStepId,
  onSelectStep,
  onBack,
  onNext,
  onGeneratePlan,
  isBackDisabled,
  isNextDisabled,
  isGenerateDisabled,
}) {
  return (
    <section className="lg:col-span-4">
      <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:h-[calc(100vh-7.5rem)]">
        <h2 className="text-xl font-semibold text-slate-900">Project Setup</h2>

        <p className="mt-1 text-sm text-slate-500">
          Configure your inputs, then review details on the right panel.
        </p>

        <div className="mt-5 flex-1 overflow-y-auto pr-1">
          <Stepper steps={steps} activeStepId={activeStepId} onSelectStep={onSelectStep} />
        </div>

        <div className="mt-5 shrink-0 border-t border-slate-200 pt-4">
          <StickyActionBar
            onBack={onBack}
            onNext={onNext}
            onGeneratePlan={onGeneratePlan}
            isBackDisabled={isBackDisabled}
            isNextDisabled={isNextDisabled}
            isGenerateDisabled={isGenerateDisabled}
          />
        </div>
      </div>
    </section>
  );
}
