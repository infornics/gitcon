import { StatCard } from "@/components/StatCard";
import {
  fetchRepoContributors,
  fetchRepoStats,
  GithubRepoData,
  parseRepoInput,
  RepoContributor,
} from "@/utils/github";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "revine";

export default function RepoDetail() {
  const { owner, name } = useParams<{ owner: string; name: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [repo, setRepo] = useState<GithubRepoData | null>(null);
  const [contributors, setContributors] = useState<RepoContributor[]>([]);
  const [loadingContributors, setLoadingContributors] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (owner && name) {
      loadRepo(owner, name);
      loadContributors(owner, name);
    }
  }, [owner, name]);

  async function loadRepo(rOwner: string, rName: string) {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRepoStats(rOwner, rName);
      setRepo(data);
    } catch (err: any) {
      setError(err.message || "Failed to load repository statistics.");
    } finally {
      setLoading(false);
    }
  }

  async function loadContributors(rOwner: string, rName: string) {
    setLoadingContributors(true);
    try {
      const list = await fetchRepoContributors(rOwner, rName, 12);
      setContributors(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingContributors(false);
    }
  }

  const languageBreakdown = useMemo(() => {
    if (!repo || !repo.languages || !repo.languages.edges.length) return [];
    const total = repo.languages.totalSize || 1;
    return repo.languages.edges.map((edge) => ({
      name: edge.node.name,
      color: edge.node.color || "#888888",
      size: edge.size,
      percent: ((edge.size / total) * 100).toFixed(1),
    }));
  }, [repo]);

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseRepoInput(searchQuery);
    if (parsed) {
      window.location.href = `/repo/${parsed.owner}/${parsed.name}`;
    }
  };

  if (loading) {
    return (
      <main className="py-8">
        <div className="flex flex-col gap-6">
          <div className="panel skeleton h-[280px] rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="panel skeleton h-28" />
            <div className="panel skeleton h-28" />
            <div className="panel skeleton h-28" />
            <div className="panel skeleton h-28" />
          </div>
          <div className="panel skeleton h-64 rounded-2xl" />
        </div>
      </main>
    );
  }

  if (error || !repo) {
    return (
      <main className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <div className="p-4 rounded-full bg-rose-500/10 text-rose-500 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Repository Not Found</h2>
          <p className="opacity-70 text-sm mb-6">{error}</p>
          <Link
            href="/repo"
            className="btn btn-primary inline-flex items-center gap-2"
          >
            ← Back to Repository Search
          </Link>
        </div>
      </main>
    );
  }

  const commitCount = repo.defaultBranchRef?.target?.history?.totalCount;

  return (
    <main className="py-8">
      {/* Header / Search strip */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs opacity-60 mb-1">
            <Link href="/repo" className="hover:underline">
              Repositories
            </Link>
            <span>/</span>
            <span>{repo.owner.login}</span>
          </div>
          <h1 className="text-3xl font-extrabold font-display flex items-center gap-3">
            <img
              src={repo.owner.avatarUrl}
              alt={repo.owner.login}
              className="w-9 h-9 rounded-xl border border-white/10"
            />
            <a
              href={`https://github.com/${repo.owner.login}`}
              target="_blank"
              rel="noreferrer"
              className="hover:underline opacity-80"
            >
              {repo.owner.login}
            </a>
            <span className="opacity-40">/</span>
            <span className="text-primary">{repo.name}</span>
          </h1>
        </div>

        <form
          onSubmit={handleQuickSearch}
          className="flex gap-2 w-full md:w-auto"
        >
          <input
            type="text"
            placeholder="Inspect another repo (owner/repo)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 rounded-full border border-white/10 bg-surface-2 text-xs w-full md:w-64 focus:outline-none focus:border-primary"
          />
          <button
            type="submit"
            className="btn btn-secondary !py-2 !px-4 !text-xs shrink-0"
          >
            Go
          </button>
        </form>
      </div>

      {/* Main Overview Panel */}
      <div className="panel p-8 mb-8 border-primary/20 bg-gradient-to-br from-surface to-surface-2">
        <div className="flex flex-col lg:flex-row justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                {repo.primaryLanguage?.name || "Code"}
              </span>
              {repo.licenseInfo && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-surface-2 text-text-muted border border-white/5">
                  ⚖️ {repo.licenseInfo.nickname || repo.licenseInfo.name}
                </span>
              )}
              {repo.defaultBranchRef && (
                <span className="px-3 py-1 rounded-full text-xs font-mono text-text-muted bg-surface-2">
                  🌿 {repo.defaultBranchRef.name}
                </span>
              )}
            </div>

            <p className="text-base text-text-muted leading-relaxed max-w-3xl mb-6">
              {repo.description ||
                "No description provided for this repository."}
            </p>

            {/* Topic tags */}
            {repo.repositoryTopics.nodes.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {repo.repositoryTopics.nodes.map((node) => (
                  <span
                    key={node.topic.name}
                    className="text-xs px-2.5 py-1 rounded-md bg-surface-offset text-text-muted font-medium hover:text-primary transition-colors cursor-default"
                  >
                    #{node.topic.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 justify-center">
            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary justify-center text-center !py-2.5 !px-5"
            >
              View on GitHub ↗
            </a>
            <a
              href={`${repo.url}/issues`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary justify-center text-center !py-2.5 !px-5"
            >
              Issues & PRs ↗
            </a>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatCard
          label="Stars"
          value={repo.stargazerCount.toLocaleString()}
          subValue="Stargazers"
        />
        <StatCard
          label="Forks"
          value={repo.forkCount.toLocaleString()}
          subValue="Forks count"
        />
        <StatCard
          label="Open Issues"
          value={repo.openIssues.totalCount.toLocaleString()}
          subValue="Active issues"
        />
        <StatCard
          label="Open PRs"
          value={repo.openPullRequests.totalCount.toLocaleString()}
          subValue="Pull requests"
        />
        <StatCard
          label="Watchers"
          value={repo.watchers.totalCount.toLocaleString()}
          subValue="Subscribers"
        />
        <StatCard
          label="Releases"
          value={repo.releases.totalCount.toLocaleString()}
          subValue="Published releases"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Language Genomics */}
        <div className="panel lg:col-span-2">
          <div className="panel-head">
            <div>
              <h2>Language Breakdown</h2>
              <p className="text-sm">Distribution of code by byte count</p>
            </div>
            {repo.languages.totalSize > 0 && (
              <span className="text-xs font-mono opacity-60">
                {(repo.languages.totalSize / 1024 / 1024).toFixed(2)} MB total
              </span>
            )}
          </div>

          {languageBreakdown.length > 0 ? (
            <div className="mt-6 flex flex-col gap-6">
              {/* Stacked bar graph */}
              <div className="h-4 rounded-full overflow-hidden flex w-full bg-surface-offset">
                {languageBreakdown.map((lang) => (
                  <div
                    key={lang.name}
                    style={{
                      width: `${lang.percent}%`,
                      backgroundColor: lang.color,
                    }}
                    title={`${lang.name}: ${lang.percent}%`}
                    className="h-full first:rounded-l-full last:rounded-r-full hover:opacity-80 transition-opacity cursor-pointer"
                  />
                ))}
              </div>

              {/* Language list legend */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {languageBreakdown.map((lang) => (
                  <div
                    key={lang.name}
                    className="flex items-center justify-between p-3 rounded-xl bg-surface-2 border border-white/5"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: lang.color }}
                      />
                      <span className="font-bold text-sm truncate">
                        {lang.name}
                      </span>
                    </div>
                    <span className="font-mono text-xs opacity-70">
                      {lang.percent}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-sm opacity-50">
              No language data available for this repository.
            </div>
          )}
        </div>

        {/* Repository Metadata & Health */}
        <div className="panel flex flex-col justify-between">
          <div>
            <div className="panel-head">
              <h2>Repo Details</h2>
            </div>

            <div className="flex flex-col gap-4 mt-4">
              <div className="flex justify-between items-center py-2.5 border-b border-white/5 text-sm">
                <span className="opacity-60">
                  Total Commits (Default Branch)
                </span>
                <strong className="font-mono text-primary">
                  {commitCount ? commitCount.toLocaleString() : "N/A"}
                </strong>
              </div>

              <div className="flex justify-between items-center py-2.5 border-b border-white/5 text-sm">
                <span className="opacity-60">Created Date</span>
                <span className="font-mono text-xs">
                  {new Date(repo.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>

              <div className="flex justify-between items-center py-2.5 border-b border-white/5 text-sm">
                <span className="opacity-60">Last Updated</span>
                <span className="font-mono text-xs">
                  {new Date(repo.updatedAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>

              <div className="flex justify-between items-center py-2.5 border-b border-white/5 text-sm">
                <span className="opacity-60">Fork Ratio</span>
                <span className="font-mono text-xs">
                  {(
                    (repo.forkCount / Math.max(repo.stargazerCount, 1)) *
                    100
                  ).toFixed(1)}
                  %
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-surface-2/60 border border-white/5">
            <div className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
              Quick Action
            </div>
            <p className="text-xs opacity-70">
              Want to see user contributions to <strong>{repo.name}</strong>?
              Explore the contributor profile by searching their handle.
            </p>
          </div>
        </div>
      </div>

      {/* Contributors Section */}
      <section className="panel leaderboard-panel">
        <div className="panel-head flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold font-display">Contributors</h2>
            <p className="text-xs opacity-60">
              Top developers contributing code to {repo.name}
            </p>
          </div>
          <a
            href={`${repo.url}/graphs/contributors`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-primary hover:underline"
          >
            All Contributors on GitHub ↗
          </a>
        </div>

        {loadingContributors ? (
          <div className="leaderboard-table-wrapper">
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th className="text-center w-16">#</th>
                  <th>Contributor</th>
                  <th className="!text-center">Commits</th>
                  <th className="!text-center">Lines Added / Deleted</th>
                  <th className="!text-center">Files Affected</th>
                  <th>Primary Language</th>
                  <th className="!text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3].map((i) => (
                  <tr key={i}>
                    <td className="text-center">
                      <div className="skeleton h-5 w-6 mx-auto rounded" />
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="skeleton w-10 h-10 rounded-full shrink-0" />
                        <div className="skeleton h-4 w-28 rounded" />
                      </div>
                    </td>
                    <td className="!text-center">
                      <div className="skeleton h-5 w-16 mx-auto rounded" />
                    </td>
                    <td className="!text-center">
                      <div className="skeleton h-5 w-24 mx-auto rounded" />
                    </td>
                    <td className="!text-center">
                      <div className="skeleton h-5 w-16 mx-auto rounded" />
                    </td>
                    <td>
                      <div className="skeleton h-5 w-20 rounded" />
                    </td>
                    <td className="!text-right">
                      <div className="skeleton h-4 w-6 ml-auto rounded" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : contributors.length > 0 ? (
          <div className="leaderboard-table-wrapper">
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th className="text-center w-16">#</th>
                  <th>Contributor</th>
                  <th className="!text-center">Commits</th>
                  <th className="!text-center">Lines Added / Deleted</th>
                  <th className="!text-center">Files Affected</th>
                  <th>Primary Language</th>
                  <th className="!text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {contributors.map((c, idx) => (
                  <tr
                    key={c.id}
                    className="cursor-pointer"
                    onClick={() => (window.location.href = `/user/${c.login}`)}
                  >
                    <td className="text-center font-mono opacity-60 font-bold text-sm">
                      {idx + 1}
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <img
                          src={c.avatar_url}
                          alt={c.login}
                          className="w-10 h-10 rounded-full border border-white/10 shrink-0"
                        />
                        <div>
                          <div className="font-bold">{c.name || c.login}</div>
                          <div className="text-xs opacity-60">@{c.login}</div>
                        </div>
                      </div>
                    </td>
                    <td className="!text-center font-mono font-bold text-primary">
                      {c.contributions.toLocaleString()}
                    </td>
                    <td className="!text-center font-mono text-xs">
                      {c.additions || c.deletions ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="text-emerald-500 font-bold">
                            +{c.additions?.toLocaleString()}
                          </span>
                          <span className="opacity-30">/</span>
                          <span className="text-rose-500 font-bold">
                            -{c.deletions?.toLocaleString()}
                          </span>
                        </span>
                      ) : (
                        <span className="opacity-40">—</span>
                      )}
                    </td>
                    <td className="!text-center font-mono opacity-80">
                      {(c.filesTouchedApprox || c.contributions).toLocaleString()}
                    </td>
                    <td>
                      {repo.primaryLanguage?.name ? (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 inline-block">
                          {repo.primaryLanguage.name}
                        </span>
                      ) : (
                        <span className="text-xs opacity-40">—</span>
                      )}
                    </td>
                    <td className="!text-right">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="opacity-40 hover:opacity-100 transition-all inline-block ml-auto"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-sm opacity-50">
            No contributor data available.
          </div>
        )}
      </section>
    </main>
  );
}
