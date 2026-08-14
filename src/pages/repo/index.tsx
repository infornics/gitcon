import { fetchOrgRepos, fetchTopForkedRepos, fetchTopStarredRepos, parseRepoInput, RepoSearchResult } from "@/utils/github";
import { useEffect, useState } from "react";
import { Link } from "revine";

export default function RepoLanding() {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [infornicsRepos, setInfornicsRepos] = useState<RepoSearchResult["items"]>([]);
  const [topStarredRepos, setTopStarredRepos] = useState<RepoSearchResult["items"]>([]);
  const [topForkedRepos, setTopForkedRepos] = useState<RepoSearchResult["items"]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRepos() {
      try {
        const [infornicsRes, starredRes, forkedRes] = await Promise.all([
          fetchOrgRepos("infornics", 6),
          fetchTopStarredRepos(6),
          fetchTopForkedRepos(6),
        ]);
        setInfornicsRepos(infornicsRes.items || []);
        setTopStarredRepos(starredRes.items || []);
        setTopForkedRepos(forkedRes.items || []);
      } catch (err) {
        console.error("Failed to load repositories:", err);
      } finally {
        setLoading(false);
      }
    }
    loadRepos();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsed = parseRepoInput(input);
    if (!parsed) {
      setError(
        "Please enter a valid format, like 'owner/repo' or a GitHub URL (e.g. facebook/react).",
      );
      return;
    }
    window.location.href = `/repo/${parsed.owner}/${parsed.name}`;
  };

  return (
    <main className="py-10">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto py-16 px-4">
        <div className="eyebrow">Deep-dive repository analytics</div>
        <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-7xl tracking-tight max-w-3xl mt-4 mb-4 leading-tight">
          Stats for any GitHub repository
        </h1>
        <p className="text-base sm:text-lg text-text-muted max-w-2xl mx-auto mb-8">
          Analyze stars, forks, open issues, language breakdown, pull requests,
          and activity health metrics in seconds.
        </p>

        {error && (
          <div className="text-rose-500 text-sm mt-4 font-medium">{error}</div>
        )}
      </section>

      {/* Repositories you should check out for: infornics */}
      <section className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold font-display">
              Repositories you should check out for: <span className="text-primary font-mono">Infornics</span>
            </h2>
            <p className="text-sm opacity-60">
              Public repositories with highest contribution activity built and maintained by Infornics
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="panel p-6 skeleton h-48 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {infornicsRepos.map((repo) => (
              <Link
                key={repo.id}
                href={`/repo/${repo.owner.login}/${repo.name}`}
                className="panel p-6 hover:scale-[1.02] hover:border-primary/30 transition-all duration-300 group flex flex-col justify-between text-inherit no-underline"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    {repo.language ? (
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                        {repo.language}
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-surface-offset text-text-muted">
                        Repo
                      </span>
                    )}
                    <span className="text-xs font-mono font-bold text-primary flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      {repo.stargazers_count.toLocaleString()}
                    </span>
                  </div>
                  <strong className="text-xl font-bold font-display group-hover:text-primary transition-colors block mb-1 truncate">
                    {repo.owner.login} / {repo.name}
                  </strong>
                  <p className="text-xs opacity-70 line-clamp-2 leading-relaxed">
                    {repo.description || "No description provided."}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono opacity-60">
                  <span className="truncate">
                    github.com/{repo.owner.login}/{repo.name}
                  </span>
                  <span className="group-hover:text-primary transition-colors shrink-0">
                    View Stats →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Most Starred Repositories */}
      <section className="mt-16">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold font-display">
              Popular Repositories
            </h2>
            <p className="text-sm opacity-60">
              Top 6 most starred open-source projects on GitHub
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="panel p-6 skeleton h-48 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topStarredRepos.map((repo) => (
              <Link
                key={repo.id}
                href={`/repo/${repo.owner.login}/${repo.name}`}
                className="panel p-6 hover:scale-[1.02] hover:border-primary/30 transition-all duration-300 group flex flex-col justify-between text-inherit no-underline"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    {repo.language ? (
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                        {repo.language}
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-surface-offset text-text-muted">
                        Repo
                      </span>
                    )}
                    <span className="text-xs font-mono font-bold text-primary flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      {repo.stargazers_count.toLocaleString()}
                    </span>
                  </div>
                  <strong className="text-xl font-bold font-display group-hover:text-primary transition-colors block mb-1 truncate">
                    {repo.owner.login} / {repo.name}
                  </strong>
                  <p className="text-xs opacity-70 line-clamp-2 leading-relaxed">
                    {repo.description || "No description provided."}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono opacity-60">
                  <span className="truncate">
                    github.com/{repo.owner.login}/{repo.name}
                  </span>
                  <span className="group-hover:text-primary transition-colors shrink-0">
                    View Stats →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Most Forked Repositories */}
      <section className="mt-20">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold font-display">
              Most Forked Repositories
            </h2>
            <p className="text-sm opacity-60">
              Top 6 most collaborated and forked repositories on GitHub
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="panel p-6 skeleton h-48 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topForkedRepos.map((repo) => (
              <Link
                key={repo.id}
                href={`/repo/${repo.owner.login}/${repo.name}`}
                className="panel p-6 hover:scale-[1.02] hover:border-primary/30 transition-all duration-300 group flex flex-col justify-between text-inherit no-underline"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    {repo.language ? (
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                        {repo.language}
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-surface-offset text-text-muted">
                        Repo
                      </span>
                    )}
                    <span className="text-xs font-mono font-bold text-primary flex items-center gap-1.5">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="6" y1="3" x2="6" y2="15" />
                        <circle cx="18" cy="6" r="3" />
                        <circle cx="6" cy="18" r="3" />
                        <path d="M18 9a9 9 0 0 1-9 9" />
                      </svg>
                      {repo.forks_count.toLocaleString()} forks
                    </span>
                  </div>
                  <strong className="text-xl font-bold font-display group-hover:text-primary transition-colors block mb-1 truncate">
                    {repo.owner.login} / {repo.name}
                  </strong>
                  <p className="text-xs opacity-70 line-clamp-2 leading-relaxed">
                    {repo.description || "No description provided."}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono opacity-60">
                  <span className="truncate">
                    github.com/{repo.owner.login}/{repo.name}
                  </span>
                  <span className="group-hover:text-primary transition-colors shrink-0">
                    View Stats →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
