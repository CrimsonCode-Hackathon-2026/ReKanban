export default function SectionCard() {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-100/80 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-amber-900">
          Current Step: Goals
        </h3>

        <span className="rounded-full bg-white/80 px-2 py-1 text-xs font-medium text-amber-800">
          Layout Placeholder
        </span>
      </div>

      <div className="space-y-3">
        <div className="h-3 w-2/5 rounded bg-amber-200" />
        <div className="h-10 w-full rounded-lg bg-white/80" />
        <div className="h-3 w-1/3 rounded bg-amber-200" />
        <div className="h-10 w-full rounded-lg bg-white/80" />
        <div className="h-16 w-full rounded-lg bg-white/80" />
        <div className="flex gap-2 pt-1">
          <div className="h-9 w-24 rounded-lg bg-white/80" />
          <div className="h-9 w-32 rounded-lg bg-amber-300/70" />
        </div>
      </div>
    </div>
  );
}
