import { fetchTopStarredRepos, parseRepoInput, RepoSearchResult } from "@/utils/github";
import { useEffect, useState } from "react";
import { Link } from "revine";

export default function RepoLanding() {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [topRepos, setTopRepos] = useState<RepoSearchResult["items"]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTopRepos() {
      try {
        const res = await fetchTopStarredRepos(6);
        setTopRepos(res.items || []);
      } catch (err) {
        console.error("Failed to load top repos:", err);
      } finally {
        setLoading(false);
      }
    }
    loadTopRepos();
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
            {topRepos.map((repo) => (
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
    </main>
  );
}

