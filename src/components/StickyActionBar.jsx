export default function StickyActionBar() {
  return (
    <div className="mt-auto rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-2 gap-3">
        <div className="h-10 rounded-lg border border-slate-300 bg-slate-100 text-center text-sm font-medium leading-10 text-slate-600">
          Back
        </div>

        <div className="h-10 rounded-lg bg-slate-900 text-center text-sm font-medium leading-10 text-white">
          Next
        </div>
      </div>

      <div className="mt-3 h-11 rounded-lg bg-indigo-600 text-center text-sm font-semibold leading-[44px] text-white">
        Generate Plan
      </div>
    </div>
  );
}
