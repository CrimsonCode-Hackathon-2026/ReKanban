import { useMemo, useState } from "react";
import Header from "./components/Header";
import ProjectSetupPanel from "./components/ProjectSetupPanel";
import SectionCard from "./components/SectionCard";
import GithubConnectModal from "./components/github/GithubConnectModal";

const STEP_SEQUENCE = [
  { id: 1, name: "Goals" },
  { id: 2, name: "Constraints" },
  { id: 3, name: "Context" },
  { id: 4, name: "Guardrails" },
];

const GUARDRAIL_ARRAY_KEYS = ["security", "standards", "ethics", "product"];

function createGoalId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `goal-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
}

function createConstraintId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `constraint-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
}

function isGoalValid(goal) {
  return goal.title.trim().length > 0 && goal.successCriteria.trim().length > 0;
}

function isConstraintValid(constraint) {
  return constraint.text.trim().length > 0;
}

export default function App() {
  const [isGithubModalOpen, setIsGithubModalOpen] = useState(false);
  const [projectTitle] = useState("Hackathon MVP");
  const [activeStepId, setActiveStepId] = useState(1);
  const [goals, setGoals] = useState([]);
  const [constraints, setConstraints] = useState([]);
  const [contextText, setContextText] = useState("");
  const [guardrailsSelections, setGuardrailsSelections] = useState({
    security: [],
    standards: [],
    ethics: [],
    product: [],
    other: "",
  });

  const isGoalsComplete = goals.some((goal) => isGoalValid(goal));
  const isConstraintsComplete = constraints.some((constraint) => isConstraintValid(constraint));
  const isContextComplete = contextText.trim().length >= 20;

  const selectedGuardrailsCount = GUARDRAIL_ARRAY_KEYS.reduce(
    (total, category) => total + guardrailsSelections[category].length,
    0,
  );

  const isGuardrailsComplete =
    selectedGuardrailsCount > 0 || guardrailsSelections.other.trim().length >= 10;

  const isAllStepsComplete =
    isGoalsComplete &&
    isConstraintsComplete &&
    isContextComplete &&
    isGuardrailsComplete;

  const steps = useMemo(() => {
    const completionByStepId = {
      1: isGoalsComplete,
      2: isConstraintsComplete,
      3: isContextComplete,
      4: isGuardrailsComplete,
    };

    return STEP_SEQUENCE.map((step) => {
      const isActive = activeStepId === step.id;
      const isComplete = Boolean(completionByStepId[step.id]);

      return {
        ...step,
        isActive,
        isComplete,
        status: isComplete ? "complete" : isActive ? "active" : "incomplete",
      };
    });
  }, [
    activeStepId,
    isGoalsComplete,
    isConstraintsComplete,
    isContextComplete,
    isGuardrailsComplete,
  ]);

  const currentStep = steps.find((step) => step.id === activeStepId) ?? steps[0];
  const isCurrentStepComplete = currentStep.isComplete;

  const isBackDisabled = activeStepId === 1;
  const isNextDisabled = activeStepId === STEP_SEQUENCE.length || !isCurrentStepComplete;
  const isGenerateDisabled = !isAllStepsComplete;

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

  const handleAddConstraint = ({ text }) => {
    setConstraints((previous) => [
      ...previous,
      {
        id: createConstraintId(),
        text: text.trim(),
      },
    ]);
  };

  const handleUpdateConstraint = (constraintId, updates) => {
    const normalizedUpdates = { ...updates };
    if (typeof normalizedUpdates.text === "string") {
      normalizedUpdates.text = normalizedUpdates.text.trim();
    }

    setConstraints((previous) =>
      previous.map((constraint) =>
        constraint.id === constraintId
          ? { ...constraint, ...normalizedUpdates }
          : constraint,
      ),
    );
  };

  const handleDeleteConstraint = (constraintId) => {
    setConstraints((previous) =>
      previous.filter((constraint) => constraint.id !== constraintId),
    );
  };

  const toggleGuardrail = (category, value) => {
    if (!GUARDRAIL_ARRAY_KEYS.includes(category)) {
      return;
    }

    setGuardrailsSelections((previous) => {
      const isSelected = previous[category].includes(value);

      return {
        ...previous,
        [category]: isSelected
          ? previous[category].filter((item) => item !== value)
          : [...previous[category], value],
      };
    });
  };

  const updateGuardrailsOther = (text) => {
    setGuardrailsSelections((previous) => ({ ...previous, other: text }));
  };

  const handleGeneratePlan = () => {
    if (isGenerateDisabled) {
      return;
    }

    const payload = {
      projectTitle: projectTitle.trim(),
      goals: goals.map((goal) => ({
        title: goal.title.trim(),
        success: goal.successCriteria.trim(),
      })),
      constraints: constraints.map((constraint) => constraint.text.trim()).filter(Boolean),
      context: contextText.trim(),
      guardrails: {
        security: [...guardrailsSelections.security],
        standards: [...guardrailsSelections.standards],
        ethics: [...guardrailsSelections.ethics],
        product_principles: [...guardrailsSelections.product],
        other: guardrailsSelections.other.trim(),
      },
    };

    console.log("RequestPayload:\n", JSON.stringify(payload, null, 2));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <GithubConnectModal
        isOpen={isGithubModalOpen}
        onConnected={() => setIsGithubModalOpen(false)}
        onClose={() => setIsGithubModalOpen(false)}
      />

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            onClick={() => setIsGithubModalOpen(true)}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-900 hover:bg-slate-100"
          >
            Open GitHub Modal
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <ProjectSetupPanel
            steps={steps}
            activeStepId={activeStepId}
            onSelectStep={handleSelectStep}
            onBack={handleBack}
            onNext={handleNext}
            onGeneratePlan={handleGeneratePlan}
            isBackDisabled={isBackDisabled}
            isNextDisabled={isNextDisabled}
            isGenerateDisabled={isGenerateDisabled}
          />

          <section className="lg:col-span-8">
            <div className="lg:h-[calc(100vh-7.5rem)] lg:overflow-y-auto lg:pr-1">
              <SectionCard
                activeStepId={activeStepId}
                goals={goals}
                onAddGoal={handleAddGoal}
                onUpdateGoal={handleUpdateGoal}
                onDeleteGoal={handleDeleteGoal}
                constraints={constraints}
                onAddConstraint={handleAddConstraint}
                onUpdateConstraint={handleUpdateConstraint}
                onDeleteConstraint={handleDeleteConstraint}
                contextText={contextText}
                onContextChange={setContextText}
                guardrailsSelections={guardrailsSelections}
                onToggleGuardrail={toggleGuardrail}
                onUpdateGuardrailsOther={updateGuardrailsOther}
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
