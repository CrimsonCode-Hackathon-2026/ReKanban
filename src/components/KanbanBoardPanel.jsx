import BoardPlaceholder from "./BoardPlaceholder";

export default function KanbanBoardPanel() {
  return (
    <section className="lg:col-span-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Kanban Board
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Board will populate after generation
            </p>
          </div>
        </div>

        <BoardPlaceholder />
      </div>
    </section>
  );
}
