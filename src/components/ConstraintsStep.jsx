import { useState } from "react";

const PRESET_CONSTRAINTS = [
  "MVP only",
  "Must be demoable",
  "React frontend",
  "Backend separate service",
  "No PII",
  "No secrets in frontend",
  "Free services only",
];

function normalizeConstraintInput(constraint) {
  return {
    text: constraint.text.trim(),
  };
}

function isConstraintValid(constraint) {
  return constraint.text.trim().length > 0;
}

export default function ConstraintsStep({
  constraints,
  onAddConstraint,
  onUpdateConstraint,
  onDeleteConstraint,
}) {
  const [newConstraint, setNewConstraint] = useState({ text: "" });
  const [editingConstraintId, setEditingConstraintId] = useState(null);
  const [editingConstraint, setEditingConstraint] = useState({ text: "" });
  const [showNewConstraintError, setShowNewConstraintError] = useState(false);

  const isNewConstraintValid = isConstraintValid(newConstraint);
  const isEditingConstraintValid = isConstraintValid(editingConstraint);

  const handleAddConstraint = (event) => {
    event.preventDefault();

    if (!isNewConstraintValid) {
      setShowNewConstraintError(true);
      return;
    }

    onAddConstraint(normalizeConstraintInput(newConstraint));
    setNewConstraint({ text: "" });
    setShowNewConstraintError(false);
  };

  const addPresetConstraint = (text) => {
    const normalizedText = text.trim().toLowerCase();
    const duplicateExists = constraints.some(
      (constraint) => constraint.text.trim().toLowerCase() === normalizedText,
    );

    if (duplicateExists) {
      return;
    }

    onAddConstraint({ text: text.trim() });
  };

  const startEditing = (constraint) => {
    setEditingConstraintId(constraint.id);
    setEditingConstraint({ text: constraint.text });
  };

  const cancelEditing = () => {
    setEditingConstraintId(null);
    setEditingConstraint({ text: "" });
  };

  const saveEditing = (constraintId) => {
    if (!isEditingConstraintValid) {
      return;
    }

    onUpdateConstraint(constraintId, normalizeConstraintInput(editingConstraint));
    cancelEditing();
  };

  return (
    <div>
      <h3 className="text-base font-semibold text-slate-900">Constraints</h3>
      <p className="mt-1 text-sm text-slate-600">
        Define limits and requirements. The plan must respect these.
      </p>

      <div className="mt-4 rounded-xl border border-slate-200 bg-white/80 p-4">
        <h4 className="text-sm font-semibold text-slate-900">Rules and Requirements</h4>

        <div className="mt-3 flex flex-wrap gap-2">
          {PRESET_CONSTRAINTS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => addPresetConstraint(preset)}
              className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
            >
              {preset}
            </button>
          ))}
        </div>

        <form onSubmit={handleAddConstraint} className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
          <div>
            <label
              htmlFor="constraint-text"
              className="mb-1 block text-xs font-medium text-slate-700"
            >
              Constraint
            </label>
            <input
              id="constraint-text"
              type="text"
              value={newConstraint.text}
              onChange={(event) =>
                setNewConstraint((previous) => ({
                  ...previous,
                  text: event.target.value,
                }))
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              placeholder="Keep scope to core workflow"
              required
            />
          </div>

          <div className="sm:self-end">
            <button
              type="submit"
              className="h-10 w-full rounded-lg bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 sm:w-auto"
            >
              Add constraint
            </button>
          </div>
        </form>

        {showNewConstraintError && !isNewConstraintValid ? (
          <p className="mt-3 text-xs font-medium text-rose-600">
            Constraint text is required.
          </p>
        ) : null}
      </div>

      <div className="mt-4 space-y-3">
        {constraints.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white/70 px-4 py-5 text-sm text-slate-600">
            No constraints yet. Add at least one constraint to continue.
          </div>
        ) : (
          constraints.map((constraint) => {
            const isEditing = editingConstraintId === constraint.id;

            if (isEditing) {
              return (
                <div
                  key={constraint.id}
                  className="rounded-xl border border-slate-300 bg-white p-4"
                >
                  <div>
                    <label
                      htmlFor={`edit-constraint-text-${constraint.id}`}
                      className="mb-1 block text-xs font-medium text-slate-700"
                    >
                      Constraint
                    </label>
                    <input
                      id={`edit-constraint-text-${constraint.id}`}
                      type="text"
                      value={editingConstraint.text}
                      onChange={(event) =>
                        setEditingConstraint((previous) => ({
                          ...previous,
                          text: event.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                      required
                    />
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => saveEditing(constraint.id)}
                      disabled={!isEditingConstraintValid}
                      className={`rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 ${
                        isEditingConstraintValid
                          ? "bg-slate-900 text-white hover:bg-slate-800 focus-visible:ring-slate-400"
                          : "cursor-not-allowed bg-slate-300 text-slate-500 focus-visible:ring-slate-200"
                      }`}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={cancelEditing}
                      className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={constraint.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <p className="text-sm text-slate-700">{constraint.text}</p>

                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => startEditing(constraint)}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (editingConstraintId === constraint.id) {
                        cancelEditing();
                      }
                      onDeleteConstraint(constraint.id);
                    }}
                    className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
