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

  const currentTotal = activeTab === "users" ? userResults?.total_count || 0 : repoResults?.total_count || 0;
  const totalPages = Math.min(Math.ceil(currentTotal / 10), 100);

  return (
    <main className="py-8">
      <section className="panel leaderboard-panel">
        {/* Tabs & Controls Header */}
        <div className="panel-head flex justify-between items-center flex-wrap gap-4">
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
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>Users</span>
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
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
              <span>Repositories</span>
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

        {/* Error State */}
        {error && (
          <div className="p-6 text-center text-rose-500">
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="leaderboard-table-wrapper">
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th className="text-center w-16">#</th>
                  <th>{activeTab === "users" ? "Developer" : "Repository"}</th>
                  <th>{activeTab === "users" ? "Type" : "Language"}</th>
                  <th className="!text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i}>
                    <td className="text-center">
                      <div className="skeleton h-5 w-6 mx-auto rounded" />
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="skeleton w-10 h-10 rounded-full shrink-0" />
                        <div className="flex flex-col gap-1.5">
                          <div className="skeleton h-4 w-32 rounded" />
                          <div className="skeleton h-3 w-24 rounded" />
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="skeleton h-4 w-20 rounded" />
                    </td>
                    <td className="!text-right">
                      <div className="skeleton h-4 w-6 ml-auto rounded" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Users Tabular View */}
        {!loading && activeTab === "users" && (
          <>
            {userResults && userResults.items.length > 0 ? (
              <div className="leaderboard-table-wrapper">
                <table className="leaderboard-table">
                  <thead>
                    <tr>
                      <th className="text-center w-16">#</th>
                      <th>Developer</th>
                      <th>Type</th>
                      <th className="!text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userResults.items.map((user, idx) => {
                      const rowNum = (page - 1) * 10 + idx + 1;
                      return (
                        <tr
                          key={user.id}
                          className="cursor-pointer"
                          onClick={() => window.location.href = `/user/${user.login}`}
                        >
                          <td className="rank text-center font-mono">{rowNum}</td>
                          <td>
                            <div className="flex items-center gap-3">
                              <img
                                src={user.avatar_url}
                                alt={user.login}
                                className="w-10 h-10 rounded-full border border-white/5 shrink-0"
                              />
                              <div>
                                <div className="font-bold">{user.name || user.login}</div>
                                <div className="text-xs opacity-60">@{user.login}</div>
                              </div>
                            </div>
                          </td>
                          <td className="font-mono text-xs uppercase tracking-wider opacity-60">
                            {user.type}
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
                      );
                    })}
                  </tbody>
                </table>
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

        {/* Repositories Tabular View */}
        {!loading && activeTab === "repos" && (
          <>
            {repoResults && repoResults.items.length > 0 ? (
              <div className="leaderboard-table-wrapper">
                <table className="leaderboard-table">
                  <thead>
                    <tr>
                      <th className="text-center w-16">#</th>
                      <th>Repository</th>
                      <th>Language</th>
                      <th className="!text-center">Stars</th>
                      <th className="!text-center">Forks</th>
                      <th className="!text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {repoResults.items.map((repo, idx) => {
                      const rowNum = (page - 1) * 10 + idx + 1;
                      return (
                        <tr
                          key={repo.id}
                          className="cursor-pointer"
                          onClick={() => window.location.href = `/repo/${repo.owner.login}/${repo.name}`}
                        >
                          <td className="rank text-center font-mono">{rowNum}</td>
                          <td>
                            <div className="flex flex-col min-w-0 max-w-lg">
                              <strong className="font-bold text-base hover:text-primary transition-colors truncate">
                                {repo.full_name}
                              </strong>
                              {repo.description && (
                                <span className="text-xs opacity-60 truncate mt-0.5">
                                  {repo.description}
                                </span>
                              )}
                            </div>
                          </td>
                          <td>
                            {repo.language ? (
                              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 inline-block">
                                {repo.language}
                              </span>
                            ) : (
                              <span className="text-xs opacity-40">—</span>
                            )}
                          </td>
                          <td className="!text-center font-mono font-bold text-primary">
                            {repo.stargazers_count.toLocaleString()}
                          </td>
                          <td className="!text-center font-mono opacity-80">
                            {repo.forks_count.toLocaleString()}
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
                      );
                    })}
                  </tbody>
                </table>
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
          <div className="pagination">
            <button
              disabled={page === 1}
              onClick={() => {
                setPage((p) => Math.max(1, p - 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="pagination-btn"
            >
              Previous
            </button>

            <span className="page-info">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page >= totalPages}
              onClick={() => {
                setPage((p) => Math.min(totalPages, p + 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
