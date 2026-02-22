import AddItemsToListWithPresetOptions from "./AddItemsToListWithPresetOptions";

const GUARDRAIL_GROUPS = [
  {
    key: "security",
    label: "Security",
    options: [
      "No secrets in frontend",
      "No PII in prompts or storage",
      "Validate inputs",
      "Avoid logging sensitive content",
    ],
    placeholder: "Never expose keys or sensitive logs",
  },
  {
    key: "standards",
    label: "Standards",
    options: [
      "Include loading + error states",
      "Accessible forms (labels, focus states)",
      "Consistent data schema",
      "Demo-ready definition of done",
    ],
    placeholder: "Every flow should include clear error handling",
  },
  {
    key: "ethics",
    label: "Ethics",
    options: [
      "User stays in control (AI suggests, user approves)",
      "Disclose AI-generated output",
      "Avoid biased or harmful content",
    ],
    placeholder: "Make AI suggestions transparent to users",
  },
  {
    key: "product",
    label: "Product Principles",
    options: [
      "Keep UX simple and minimal steps",
      "Prioritize clarity over complexity",
      "Prefer safe defaults",
      "Make assumptions explicit",
    ],
    placeholder: "Optimize for clarity before adding complexity",
  },
];

const RECOMMENDED_GUARDRAILS = [
  { category: "security", value: "No secrets in frontend" },
  { category: "security", value: "No PII in prompts or storage" },
  { category: "standards", value: "Include loading + error states" },
  { category: "ethics", value: "Disclose AI-generated output" },
  {
    category: "ethics",
    value: "User stays in control (AI suggests, user approves)",
  },
];

const OTHER_MIN_LENGTH = 10;

const EMPTY_GUARDRAILS = {
  security: [],
  standards: [],
  ethics: [],
  product: [],
  other: "",
};

function hasGuardrail(items, value) {
  return items.some((item) => item.trim().toLowerCase() === value.trim().toLowerCase());
}

export default function GuardrailsStep({ value, onToggle, onOtherChange }) {
  const selections = value ?? EMPTY_GUARDRAILS;

  const selectedCount = ["security", "standards", "ethics", "product"].reduce(
    (total, key) => total + selections[key].length,
    0,
  );

  const otherCount = selections.other.trim().length;
  const isComplete = selectedCount > 0 || otherCount >= OTHER_MIN_LENGTH;

  const handleSelectRecommended = () => {
    RECOMMENDED_GUARDRAILS.forEach((item) => {
      if (!hasGuardrail(selections[item.category], item.value)) {
        onToggle(item.category, item.value);
      }
    });
  };

  return (
    <div>
      <h3 className="text-base font-semibold text-slate-900">Guardrails</h3>
      <p className="mt-1 text-sm text-slate-600">
        Set standards the generated plan must follow (security, quality, ethics, product
        alignment).
      </p>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-medium text-slate-600">Selected guardrails: {selectedCount}</p>
        <button
          type="button"
          onClick={handleSelectRecommended}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
        >
          Select recommended
        </button>
      </div>

      {!isComplete ? (
        <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
          Pick at least one guardrail to continue.
        </div>
      ) : null}

      <div className="mt-4 space-y-3">
        {GUARDRAIL_GROUPS.map((group) => (
          <AddItemsToListWithPresetOptions
            key={group.key}
            title={group.label}
            presetOptions={group.options}
            inputLabel="Guardrail"
            inputPlaceholder={group.placeholder}
            addButtonLabel="Add guardrail"
            existingItems={selections[group.key]}
            onAddItem={(item) => {
              if (!hasGuardrail(selections[group.key], item)) {
                onToggle(group.key, item);
              }
            }}
            onRemoveItem={(item) => onToggle(group.key, item)}
          />
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 bg-white/80 p-4">
        <label
          htmlFor="guardrails-other"
          className="mb-1 block text-xs font-medium text-slate-700"
        >
          Other guardrails
        </label>

        <textarea
          id="guardrails-other"
          rows={4}
          value={selections.other}
          onChange={(event) => onOtherChange(event.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          placeholder="Must not store any user data; keep everything local; prioritize speed over polish"
        />

        <div className="mt-2 flex items-center justify-between gap-2">
          <p className="text-xs text-slate-600">Recommended: 10+ characters</p>
          <p
            className={`text-xs font-medium ${
              otherCount >= 10 ? "text-emerald-700" : "text-slate-600"
            }`}
          >
            {otherCount}/10
          </p>
        </div>
      </div>
    </div>
  );
}
