import { useMemo, useState } from "react";
import SectionCard from "./SectionCard";
import Stepper from "./Stepper";
import StickyActionBar from "./StickyActionBar";

const STEP_SEQUENCE = [
  { id: 1, name: "Goals" },
  { id: 2, name: "Constraints" },
  { id: 3, name: "Context" },
  { id: 4, name: "Guardrails" },
];

function createGoalId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `goal-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
}

function isGoalValid(goal) {
  return goal.title.trim().length > 0 && goal.successCriteria.trim().length > 0;
}

export default function ProjectSetupPanel() {
  const [activeStepId, setActiveStepId] = useState(1);
  const [goals, setGoals] = useState([]);

  const isGoalsComplete = goals.some((goal) => isGoalValid(goal));

  const steps = useMemo(
    () =>
      STEP_SEQUENCE.map((step) => {
        if (step.id === 1) {
          const status = isGoalsComplete
            ? "complete"
            : activeStepId === 1
              ? "active"
              : "incomplete";

          return { ...step, status };
        }

        return {
          ...step,
          status: activeStepId === step.id ? "active" : "incomplete",
        };
      }),
    [activeStepId, isGoalsComplete],
  );

  const currentStep = steps.find((step) => step.id === activeStepId) ?? steps[0];
  const isCurrentStepComplete = currentStep.status === "complete";

  const isBackDisabled = activeStepId === 1;
  const isNextDisabled = activeStepId >= STEP_SEQUENCE.length || !isCurrentStepComplete;
  const isGenerateDisabled = steps.some((step) => step.status !== "complete");

  const handleBack = () => {
    setActiveStepId((previous) => Math.max(1, previous - 1));
  };

  const handleNext = () => {
    if (isNextDisabled) {
      return;
    }

    setActiveStepId((previous) => Math.min(STEP_SEQUENCE.length, previous + 1));
  };

  const handleSelectStep = (stepId) => {
    setActiveStepId(stepId);
  };

  const handleAddGoal = (goal) => {
    setGoals((previous) => [...previous, { id: createGoalId(), ...goal }]);
  };

  const handleUpdateGoal = (goalId, updates) => {
    setGoals((previous) =>
      previous.map((goal) => (goal.id === goalId ? { ...goal, ...updates } : goal)),
    );
  };

  const handleDeleteGoal = (goalId) => {
    setGoals((previous) => previous.filter((goal) => goal.id !== goalId));
  };

  return (
    <section className="lg:col-span-4">
      <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:h-[calc(100vh-7.5rem)]">
        <h2 className="text-xl font-semibold text-slate-900">Project Setup</h2>

        <p className="mt-1 text-sm text-slate-500">
          Define intent before generating your board.
        </p>

        <div className="mt-5 flex-1 space-y-5 overflow-y-auto pr-1">
          <Stepper steps={steps} activeStepId={activeStepId} onSelectStep={handleSelectStep} />

          <SectionCard
            activeStepId={activeStepId}
            goals={goals}
            onAddGoal={handleAddGoal}
            onUpdateGoal={handleUpdateGoal}
            onDeleteGoal={handleDeleteGoal}
          />
        </div>

        <div className="mt-5 shrink-0 border-t border-slate-200 pt-4">
          <StickyActionBar
            onBack={handleBack}
            onNext={handleNext}
            onGeneratePlan={() => {}}
            isBackDisabled={isBackDisabled}
            isNextDisabled={isNextDisabled}
            isGenerateDisabled={isGenerateDisabled}
          />
        </div>
      </div>
    </section>
  );
}
