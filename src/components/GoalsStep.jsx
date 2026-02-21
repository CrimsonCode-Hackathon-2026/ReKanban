import { useState } from "react";

function normalizeGoalInput(goal) {
  return {
    title: goal.title.trim(),
    successCriteria: goal.successCriteria.trim(),
    notes: goal.notes.trim(),
    deadline: goal.deadline,
  };
}

export default function GoalsStep({
  goals,
  onAddGoal,
  onUpdateGoal,
  onDeleteGoal,
}) {
  const [newGoal, setNewGoal] = useState({
    title: "",
    successCriteria: "",
    notes: "",
    deadline: "",
  });
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [editingGoal, setEditingGoal] = useState({
    title: "",
    successCriteria: "",
    notes: "",
    deadline: "",
  });
  const [showNewGoalError, setShowNewGoalError] = useState(false);

  const isNewGoalValid =
    newGoal.title.trim().length > 0 &&
    newGoal.successCriteria.trim().length > 0;

  const isEditingGoalValid =
    editingGoal.title.trim().length > 0 &&
    editingGoal.successCriteria.trim().length > 0;

  const handleAddGoal = (event) => {
    event.preventDefault();

    if (!isNewGoalValid) {
      setShowNewGoalError(true);
      return;
    }

    onAddGoal(normalizeGoalInput(newGoal));
    setNewGoal({ title: "", successCriteria: "", notes: "", deadline: "" });
    setShowNewGoalError(false);
  };

  const startEditing = (goal) => {
    setEditingGoalId(goal.id);
    setEditingGoal({
      title: goal.title,
      successCriteria: goal.successCriteria,
      notes: goal.notes ?? "",
      deadline: goal.deadline ?? "",
    });
  };

  const cancelEditing = () => {
    setEditingGoalId(null);
    setEditingGoal({ title: "", successCriteria: "", notes: "", deadline: "" });
  };

  const saveEditing = (goalId) => {
    if (!isEditingGoalValid) {
      return;
    }

    onUpdateGoal(goalId, normalizeGoalInput(editingGoal));
    cancelEditing();
  };

  return (
    <div>
      <h3 className="text-base font-semibold text-slate-900">Goals</h3>
      <p className="mt-1 text-sm text-slate-600">
        Define outcomes. Tasks will be generated from these goals.
      </p>

      <form
        onSubmit={handleAddGoal}
        className="mt-4 rounded-xl border border-slate-200 bg-white/80 p-4"
      >
        <div className="space-y-3">
          <div>
            <label
              htmlFor="goal-title"
              className="mb-1 block text-xs font-medium text-slate-700"
            >
              Goal title
            </label>
            <input
              id="goal-title"
              type="text"
              value={newGoal.title}
              onChange={(event) =>
                setNewGoal((previous) => ({
                  ...previous,
                  title: event.target.value,
                }))
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              placeholder="Launch MVP onboarding flow"
              required
            />
          </div>

          <div>
            <label
              htmlFor="goal-success"
              className="mb-1 block text-xs font-medium text-slate-700"
            >
              Success criteria
            </label>
            <textarea
              id="goal-success"
              value={newGoal.successCriteria}
              onChange={(event) =>
                setNewGoal((previous) => ({
                  ...previous,
                  successCriteria: event.target.value,
                }))
              }
              className="min-h-24 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              placeholder="Users can create a board and add 3 tasks in under 2 minutes."
              required
            />
          </div>

          <div>
            <label
              htmlFor="goal-notes"
              className="mb-1 block text-xs font-medium text-slate-700"
            >
              Notes (optional)
            </label>
            <textarea
              id="goal-notes"
              value={newGoal.notes}
              onChange={(event) =>
                setNewGoal((previous) => ({
                  ...previous,
                  notes: event.target.value,
                }))
              }
              className="min-h-20 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              placeholder="Keep scope tight for demo day."
            />
          </div>

          <div>
            <label
              htmlFor="goal-deadline"
              className="mb-1 block text-xs font-medium text-slate-700"
            >
              Deadline (optional)
            </label>
            <input
              id="goal-deadline"
              type="date"
              value={newGoal.deadline}
              onChange={(event) =>
                setNewGoal((previous) => ({
                  ...previous,
                  deadline: event.target.value,
                }))
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            />
          </div>
        </div>

        {showNewGoalError && !isNewGoalValid ? (
          <p className="mt-3 text-xs font-medium text-rose-600">
            Goal title and success criteria are required.
          </p>
        ) : null}

        <button
          type="submit"
          className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        >
          Add goal
        </button>
      </form>

      <div className="mt-4 space-y-3">
        {goals.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white/70 px-4 py-5 text-sm text-slate-600">
            No goals yet. Add at least one goal to continue.
          </div>
        ) : (
          goals.map((goal) => {
            const isEditing = editingGoalId === goal.id;

            if (isEditing) {
              return (
                <div
                  key={goal.id}
                  className="rounded-xl border border-slate-300 bg-white p-4"
                >
                  <div className="space-y-3">
                    <div>
                      <label
                        htmlFor={`edit-title-${goal.id}`}
                        className="mb-1 block text-xs font-medium text-slate-700"
                      >
                        Goal title
                      </label>
                      <input
                        id={`edit-title-${goal.id}`}
                        type="text"
                        value={editingGoal.title}
                        onChange={(event) =>
                          setEditingGoal((previous) => ({
                            ...previous,
                            title: event.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`edit-success-${goal.id}`}
                        className="mb-1 block text-xs font-medium text-slate-700"
                      >
                        Success criteria
                      </label>
                      <textarea
                        id={`edit-success-${goal.id}`}
                        value={editingGoal.successCriteria}
                        onChange={(event) =>
                          setEditingGoal((previous) => ({
                            ...previous,
                            successCriteria: event.target.value,
                          }))
                        }
                        className="min-h-20 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`edit-notes-${goal.id}`}
                        className="mb-1 block text-xs font-medium text-slate-700"
                      >
                        Notes (optional)
                      </label>
                      <textarea
                        id={`edit-notes-${goal.id}`}
                        value={editingGoal.notes}
                        onChange={(event) =>
                          setEditingGoal((previous) => ({
                            ...previous,
                            notes: event.target.value,
                          }))
                        }
                        className="min-h-16 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`edit-deadline-${goal.id}`}
                        className="mb-1 block text-xs font-medium text-slate-700"
                      >
                        Deadline (optional)
                      </label>
                      <input
                        id={`edit-deadline-${goal.id}`}
                        type="date"
                        value={editingGoal.deadline}
                        onChange={(event) =>
                          setEditingGoal((previous) => ({
                            ...previous,
                            deadline: event.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => saveEditing(goal.id)}
                      disabled={!isEditingGoalValid}
                      className={`rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 ${
                        isEditingGoalValid
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
                key={goal.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {goal.title}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {goal.successCriteria}
                    </p>
                    {goal.notes ? (
                      <p className="mt-2 text-xs text-slate-500">
                        {goal.notes}
                      </p>
                    ) : null}
                  </div>

                  {goal.deadline ? (
                    <span className="rounded-full border border-slate-300 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-700">
                      {goal.deadline}
                    </span>
                  ) : null}
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => startEditing(goal)}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (editingGoalId === goal.id) {
                        cancelEditing();
                      }
                      onDeleteGoal(goal.id);
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
