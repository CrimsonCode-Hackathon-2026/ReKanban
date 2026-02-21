import Header from "./components/Header";
import KanbanBoardPanel from "./components/KanbanBoardPanel";
import ProjectSetupPanel from "./components/ProjectSetupPanel";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-12">
          <ProjectSetupPanel />
          <KanbanBoardPanel />
        </div>
      </main>
    </div>
  );
}
