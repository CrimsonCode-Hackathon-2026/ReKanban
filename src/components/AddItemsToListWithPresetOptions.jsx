import { useId, useState } from "react";

function normalize(text) {
  return text.trim();
}

export default function AddItemsToListWithPresetOptions({
  title,
  presetOptions,
  inputLabel,
  inputPlaceholder,
  addButtonLabel,
  existingItems = [],
  onAddItem,
  onRemoveItem,
}) {
  const fieldId = useId();
  const [inputValue, setInputValue] = useState("");
  const [showError, setShowError] = useState(false);

  const addItem = (rawValue) => {
    const normalizedValue = normalize(rawValue);

    if (normalizedValue.length === 0) {
      setShowError(true);
      return;
    }

    const exists = existingItems.some(
      (item) => item.trim().toLowerCase() === normalizedValue.toLowerCase(),
    );

    if (exists) {
      setShowError(false);
      setInputValue("");
      return;
    }

    onAddItem(normalizedValue);
    setInputValue("");
    setShowError(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    addItem(inputValue);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white/80 p-4">
      <h4 className="text-sm font-semibold text-slate-900">{title}</h4>

      <div className="mt-3 flex flex-wrap gap-2">
        {presetOptions.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => addItem(preset)}
            className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
          >
            {preset}
          </button>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]"
      >
        <div>
          <label
            htmlFor={fieldId}
            className="mb-1 block text-xs font-medium text-slate-700"
          >
            {inputLabel}
          </label>
          <input
            id={fieldId}
            type="text"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            placeholder={inputPlaceholder}
          />
        </div>

        <div className="sm:self-end">
          <button
            type="submit"
            className="h-10 w-full rounded-lg bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 sm:w-auto"
          >
            {addButtonLabel}
          </button>
        </div>
      </form>

      {showError ? (
        <p className="mt-3 text-xs font-medium text-rose-600">
          {inputLabel} is required.
        </p>
      ) : null}

      {onRemoveItem && existingItems.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {existingItems.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onRemoveItem(item)}
              className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
            >
              {item} x
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
