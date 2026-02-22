export default function RepositorySelectionStep({
  ownerRepositoryOptions,
  selectedOwner,
  selectedRepo,
  onSelectOwner,
  onSelectRepo,
}) {
  const options = Array.isArray(ownerRepositoryOptions) ? ownerRepositoryOptions : [];

  const reposForSelectedOwner =
    options.find((entry) => entry.owner === selectedOwner)?.repos ?? [];

  const isComplete = selectedOwner.length > 0 && selectedRepo.length > 0;

  return (
    <div>
      <h3 className="text-base font-semibold text-slate-900">Repository</h3>
      <p className="mt-1 text-sm text-slate-600">
        Choose the GitHub owner and repository where generated issues should be created.
      </p>

      <div className="mt-4 rounded-xl border border-slate-200 bg-white/80 p-4">
        <div>
          <label htmlFor="repo-owner" className="mb-1 block text-xs font-medium text-slate-700">
            Owner
          </label>
          <select
            id="repo-owner"
            value={selectedOwner}
            onChange={(event) => onSelectOwner(event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          >
            <option value="">Select owner</option>
            {options.map((entry) => (
              <option key={entry.owner} value={entry.owner}>
                {entry.owner}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4">
          <label htmlFor="repo-name" className="mb-1 block text-xs font-medium text-slate-700">
            Repository
          </label>
          <select
            id="repo-name"
            value={selectedRepo}
            onChange={(event) => onSelectRepo(event.target.value)}
            disabled={selectedOwner.length === 0 || reposForSelectedOwner.length === 0}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
          >
            <option value="">Select repository</option>
            {reposForSelectedOwner.map((repoName) => (
              <option key={repoName} value={repoName}>
                {repoName}
              </option>
            ))}
          </select>
        </div>

        {!isComplete ? (
          <p className="mt-3 text-xs font-medium text-amber-700">
            Select both owner and repository to continue.
          </p>
        ) : (
          <p className="mt-3 text-xs font-medium text-emerald-700">
            Repository selected: {selectedOwner}/{selectedRepo}
          </p>
        )}
      </div>
    </div>
  );
}
