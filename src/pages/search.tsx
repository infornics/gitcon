import { useEffect, useState } from "react";
import { Link, useLocation } from "revine";
import {
  searchGithubUsers,
  searchGithubRepos,
  UserSearchResult,
  RepoSearchResult,
} from "@/utils/github";

export default function SearchPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<"users" | "repos">("users");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [userResults, setUserResults] = useState<UserSearchResult | null>(null);
  const [repoResults, setRepoResults] = useState<RepoSearchResult | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q") || "";
    setQuery(q);
    setPage(1);
  }, [location.search]);

  useEffect(() => {
    if (!query.trim()) return;
    performSearch();
  }, [query, activeTab, page]);

  async function performSearch() {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === "users") {
        const res = await searchGithubUsers(query, page, 10);
        setUserResults(res);
      } else {
        const res = await searchGithubRepos(query, page, 10);
        setRepoResults(res);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch search results from GitHub.");
    } finally {
      setLoading(false);
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    window.history.pushState({}, "", `/search?q=${encodeURIComponent(query.trim())}`);
    setPage(1);
    performSearch();
  };

  const currentTotal = activeTab === "users" ? userResults?.total_count || 0 : repoResults?.total_count || 0;
  const totalPages = Math.min(Math.ceil(currentTotal / 10), 100); // GitHub API caps search at 1000 items (100 pages * 10)

  return (
    <main className="py-8">
      {/* Search Header Strip */}
      <div className="panel mb-8 p-6">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search GitHub users or repositories..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-12 px-4 py-3 rounded-full border border-white/10 bg-surface-2 text-text text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <button type="submit" className="btn btn-primary h-12 px-6 rounded-full shrink-0 justify-center">
            Search
          </button>
        </form>
      </div>

      {/* Tabs Header */}
      <div className="flex justify-between items-center flex-wrap gap-4 mb-6 border-b border-white/5 pb-4">
        <div className="flex gap-3">
          <button
            onClick={() => {
              setActiveTab("users");
              setPage(1);
            }}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "users"
                ? "bg-primary text-text-inverse shadow-md"
                : "bg-surface-2 text-text-muted hover:text-text border border-white/5"
            }`}
          >
            👤 Users
            {userResults && (
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-mono">
                {userResults.total_count.toLocaleString()}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab("repos");
              setPage(1);
            }}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "repos"
                ? "bg-primary text-text-inverse shadow-md"
                : "bg-surface-2 text-text-muted hover:text-text border border-white/5"
            }`}
          >
            📦 Repositories
            {repoResults && (
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-mono">
                {repoResults.total_count.toLocaleString()}
              </span>
            )}
          </button>
        </div>

        {currentTotal > 0 && (
          <div className="text-xs opacity-60 font-mono">
            Showing {((page - 1) * 10) + 1}–{Math.min(page * 10, currentTotal)} of {currentTotal.toLocaleString()} results
          </div>
        )}
      </div>

      {/* Error state */}
      {error && (
        <div className="panel p-6 mb-6 text-center text-rose-500">
          <p className="font-semibold">{error}</p>
        </div>
      )}

      {/* Loading Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="panel skeleton h-28 rounded-xl" />
          ))}
        </div>
      )}

      {/* Users Tab Content */}
      {!loading && activeTab === "users" && (
        <>
          {userResults && userResults.items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userResults.items.map((user) => (
                <div
                  key={user.id}
                  className="panel p-5 flex items-center justify-between gap-4 hover:border-primary/30 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={user.avatar_url}
                      alt={user.login}
                      className="w-12 h-12 rounded-full border border-white/10 shrink-0"
                    />
                    <div className="min-w-0">
                      <strong className="text-base font-bold truncate block group-hover:text-primary transition-colors">
                        @{user.login}
                      </strong>
                      <span className="text-xs opacity-50 uppercase tracking-wider block mt-0.5">
                        {user.type}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/user/${user.login}`}
                    className="btn btn-secondary !py-1.5 !px-3.5 !text-xs shrink-0 inline-flex items-center gap-1"
                  >
                    Visualize →
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            !loading && query && (
              <div className="text-center py-16 opacity-60">
                No users found for "{query}". Try another search term.
              </div>
            )
          )}
        </>
      )}

      {/* Repositories Tab Content */}
      {!loading && activeTab === "repos" && (
        <>
          {repoResults && repoResults.items.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {repoResults.items.map((repo) => (
                <div
                  key={repo.id}
                  className="panel p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-primary/30 transition-all duration-300 group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <strong className="text-lg font-bold font-display group-hover:text-primary transition-colors">
                        {repo.full_name}
                      </strong>
                      {repo.language && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                          {repo.language}
                        </span>
                      )}
                    </div>

                    {repo.description && (
                      <p className="text-xs opacity-70 line-clamp-2 leading-relaxed mb-3">
                        {repo.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-xs font-mono opacity-60">
                      <span>⭐ {repo.stargazers_count.toLocaleString()} stars</span>
                      <span>🍴 {repo.forks_count.toLocaleString()} forks</span>
                      <span>Updated {new Date(repo.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <Link
                    href={`/repo/${repo.owner.login}/${repo.name}`}
                    className="btn btn-secondary !py-2 !px-4 !text-xs shrink-0 self-end md:self-center"
                  >
                    Inspect Stats →
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            !loading && query && (
              <div className="text-center py-16 opacity-60">
                No repositories found for "{query}". Try another search term.
              </div>
            )
          )}
        </>
      )}

      {/* Pagination Controls */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-10">
          <button
            disabled={page === 1}
            onClick={() => {
              setPage((p) => Math.max(1, p - 1));
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="btn btn-secondary !py-2 !px-5 !text-xs disabled:opacity-30"
          >
            ← Previous
          </button>

          <span className="text-xs font-mono opacity-70">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page >= totalPages}
            onClick={() => {
              setPage((p) => Math.min(totalPages, p + 1));
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="btn btn-secondary !py-2 !px-5 !text-xs disabled:opacity-30"
          >
            Next →
          </button>
        </div>
      )}
    </main>
  );
}
