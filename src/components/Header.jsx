export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <p className="text-lg font-bold tracking-tight">ReKanban</p>

        <div className="flex items-center gap-4">
          <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
            Project: Enter your project name
          </span>

          <a
            href="https://wsu-acm.github.io/crimsoncode"
            target="_blank"
            className="text-sm font-medium text-slate-500"
          >
            Hackathon
          </a>
        </div>
      </div>
    </header>
  );
}
