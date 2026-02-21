import SectionCard from "./SectionCard";
import Stepper from "./Stepper";
import StickyActionBar from "./StickyActionBar";

export default function ProjectSetupPanel() {
  return (
    <section className="lg:col-span-4">
      <div className="flex min-h-[760px] flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Project Setup</h2>

        <p className="mt-1 text-sm text-slate-500">
          Define intent before generating your board.
        </p>

        <div className="mt-5">
          <Stepper />
        </div>

        <div className="mt-5">
          <SectionCard />
        </div>

        <div className="mt-5">
          <StickyActionBar />
        </div>
      </div>
    </section>
  );
}
