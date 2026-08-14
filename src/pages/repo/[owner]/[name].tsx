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
  const [showConscoreModal, setShowConscoreModal] = useState(false);

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
          <div className="panel skeleton h-70 rounded-2xl" />
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
    <main>
      {/* Repository Header Section (Matching User Profile Hero Layout) */}
      <section className="profile-hero mb-8">
        <div className="profile-hero-inner">
          <div className="profile-info">
            <Link
              href={`/user/${repo.owner.login}`}
              className="block shrink-0"
              title={`View ${repo.owner.login}'s profile`}
            >
              <img
                src={repo.owner.avatarUrl}
                alt={repo.owner.login}
                className="profile-avatar hover:scale-105 hover:shadow-lg transition-all duration-300"
              />
            </Link>
            <div>
              <h1 className="profile-name flex items-center gap-2">
                <Link
                  href={`/user/${repo.owner.login}`}
                  className="hover:text-primary transition-colors text-inherit no-underline"
                >
                  {repo.owner.login}
                </Link>
                <span className="opacity-40">/</span>
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                  title="View repository on GitHub"
                >
                  {repo.name}
                </a>
              </h1>
              <a
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="profile-username hover:text-primary transition-colors inline-flex items-center gap-1.5 mt-1 block"
                title="View repository on GitHub"
              >
                github.com/{repo.owner.login}/{repo.name}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-60"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>

              {/* Conscore Badge Below Repo URL */}
              <div className="mt-3 flex items-center">
                <button
                  onClick={() => setShowConscoreModal(true)}
                  className="px-3.5 py-1.5 rounded-full text-sm font-mono font-extrabold bg-primary/15 text-primary border border-primary/40 inline-flex items-center gap-2 shadow-sm shadow-primary/10 hover:border-primary/60 hover:bg-primary/20 transition-all cursor-pointer group text-left"
                  title="View Conscore calculation breakdown"
                  aria-label="View Conscore calculation breakdown"
                >
                  <span className="tracking-wide font-normal">
                    <span className="text-lg font-bold">
                      {(repo.conScore ?? 0).toLocaleString()}
                    </span>
                    &nbsp;conscore
                  </span>
                  <span className="opacity-80 group-hover:opacity-100 transition-opacity">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Badges, description & topics — now inline with title on the right */}
          <div className="flex-1 lg:max-w-xl">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                {repo.primaryLanguage?.name || "Code"}
              </span>
              {repo.licenseInfo && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-surface-2 text-text-muted border border-white/5 inline-flex items-center gap-1.5">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-70"
                  >
                    <path d="M12 3v18" />
                    <path d="M5 7h14" />
                    <path d="M4 14l3-7 3 7a3 3 0 0 1-6 0z" />
                    <path d="M14 14l3-7 3 7a3 3 0 0 1-6 0z" />
                  </svg>
                  {repo.licenseInfo.nickname || repo.licenseInfo.name}
                </span>
              )}
              {repo.defaultBranchRef && (
                <span className="px-3 py-1 rounded-full text-xs font-mono text-text-muted bg-surface-2 border border-white/5 inline-flex items-center gap-1.5">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-70 text-primary"
                  >
                    <line x1="6" y1="3" x2="6" y2="15" />
                    <circle cx="18" cy="6" r="3" />
                    <circle cx="6" cy="18" r="3" />
                    <path d="M18 9a9 9 0 0 1-9 9" />
                  </svg>
                  {repo.defaultBranchRef.name}
                </span>
              )}
            </div>

            <p className="text-base text-text-muted leading-relaxed max-w-3xl mb-6">
              {repo.description ||
                "No description provided for this repository."}
            </p>

            {/* Topic tags */}
            {repo.repositoryTopics.nodes.length > 0 && (
              <div className="flex flex-wrap gap-2">
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
        </div>
      </section>

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
                  <th className="text-center!">Commits</th>
                  <th className="text-center!">Lines Added / Deleted</th>
                  <th className="text-center!">Files Affected</th>
                  <th>Primary Language</th>
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
                    <td className="text-center!">
                      <div className="skeleton h-5 w-16 mx-auto rounded" />
                    </td>
                    <td className="text-center!">
                      <div className="skeleton h-5 w-24 mx-auto rounded" />
                    </td>
                    <td className="text-center!">
                      <div className="skeleton h-5 w-16 mx-auto rounded" />
                    </td>
                    <td>
                      <div className="skeleton h-5 w-20 rounded" />
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
                  <th className="text-center!">Commits</th>
                  <th className="text-center!">Lines Added / Deleted</th>
                  <th className="text-center!">Files Affected</th>
                  <th>Primary Language</th>
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
                    <td className="text-center! font-mono font-bold text-primary">
                      {c.contributions.toLocaleString()}
                    </td>
                    <td className="text-center! font-mono text-xs">
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
                    <td className="text-center! font-mono opacity-80">
                      {(
                        c.filesTouchedApprox || c.contributions
                      ).toLocaleString()}
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

      {/* Conscore Info Modal */}
      {showConscoreModal && (
        <div
          onClick={() => setShowConscoreModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-surface border border-white/10 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200 cursor-default"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="4" width="5" height="16" rx="2"></rect>
                    <rect x="10" y="9" width="5" height="11" rx="2"></rect>
                    <path d="M17 14a4 4 0 1 1 4 4h-2"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold font-display">Conscore</h3>
                  <p className="text-xs text-text-muted">
                    Repository Momentum Score
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowConscoreModal(false)}
                className="p-1 rounded-lg text-text-muted hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="space-y-4 text-sm text-text-muted">
              <p className="leading-relaxed">
                <strong>Conscore</strong> measures the activity momentum and
                overall health of a GitHub repository by combining popularity,
                lifetime velocity, recent contributions, and activity recency.
              </p>

              <div className="p-4 rounded-xl bg-surface-2 border border-white/5 font-mono text-xs text-primary space-y-1">
                <div>Conscore = Stars + Forks + Total Commits</div>
                <div className="pl-14">+ Commits (Past 3 Months)</div>
                <div className="pl-14">- Days Since Last Active</div>
              </div>

              <div className="space-y-2 pt-2 text-xs">
                <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                  <span className="font-medium text-white flex items-center gap-1.5">
                    <span className="text-primary font-bold">+1</span>{" "}
                    Stargazers
                  </span>
                  <span className="font-mono text-text-muted">
                    +{repo.stargazerCount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                  <span className="font-medium text-white flex items-center gap-1.5">
                    <span className="text-primary font-bold">+1</span> Forks
                  </span>
                  <span className="font-mono text-text-muted">
                    +{repo.forkCount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                  <span className="font-medium text-white flex items-center gap-1.5">
                    <span className="text-primary font-bold">+1</span> Lifetime
                    Commits
                  </span>
                  <span className="font-mono text-text-muted">
                    +{commitCount?.toLocaleString() || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                  <span className="font-medium text-white flex items-center gap-1.5">
                    <span className="text-primary font-bold">+1</span> Commits
                    (Past 90 Days)
                  </span>
                  <span className="font-mono text-text-muted">
                    +{repo.commitsPast3Months?.toLocaleString() || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                  <span className="font-medium text-white flex items-center gap-1.5">
                    <span className="text-rose-400 font-bold">-1</span> Days
                    Inactive
                  </span>
                  <span className="font-mono text-rose-400">
                    -
                    {Math.floor(
                      Math.max(
                        0,
                        Date.now() -
                          new Date(
                            repo.pushedAt || repo.updatedAt || Date.now(),
                          ).getTime(),
                      ) /
                        (1000 * 60 * 60 * 24),
                    ).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 text-sm text-white">
                  <span>Calculated Conscore</span>
                  <span className="font-mono text-primary text-base">
                    {(repo.conScore ?? 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
