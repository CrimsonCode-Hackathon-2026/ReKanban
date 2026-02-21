const columns = ["Backlog", "Doing", "Done"];

export default function BoardPlaceholder() {
  return (
    <div className="relative mt-4 grid gap-4 md:grid-cols-3">
      {columns.map((column) => (
        <div
          key={column}
          className="rounded-xl border border-slate-200 bg-slate-50 p-3 shadow-sm"
        >
          <h3 className="mb-3 text-sm font-semibold text-slate-800">
            {column}
          </h3>

          <div className="space-y-3">
            <div className="h-20 rounded-lg border border-slate-200 bg-white p-3">
              <div className="h-3 w-3/4 rounded bg-slate-200" />
              <div className="mt-2 h-3 w-1/2 rounded bg-slate-200" />
              <div className="mt-3 h-2 w-2/5 rounded bg-slate-100" />
            </div>

            <div className="h-20 rounded-lg border border-slate-200 bg-white p-3">
              <div className="h-3 w-4/5 rounded bg-slate-200" />
              <div className="mt-2 h-3 w-1/2 rounded bg-slate-200" />
              <div className="mt-3 h-2 w-1/3 rounded bg-slate-100" />
            </div>

            <div className="h-20 rounded-lg border border-slate-200 bg-white p-3">
              <div className="h-3 w-2/3 rounded bg-slate-200" />
              <div className="mt-2 h-3 w-3/5 rounded bg-slate-200" />
              <div className="mt-3 h-2 w-1/2 rounded bg-slate-100" />
            </div>
          </div>
        </div>
      ))}

      {/*
      <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-slate-900/30 backdrop-blur-sm">
        <div className="flex items-center gap-3 rounded-lg bg-white px-4 py-3 shadow-md">
          <div className="h-5 w-5 animate-pulse rounded-full bg-indigo-500" />
          <p className="text-sm font-medium text-slate-700">Generating board...</p>
        </div>
      </div>
      */}
    </div>
  );
}
