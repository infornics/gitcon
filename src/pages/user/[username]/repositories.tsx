import { useEffect, useState } from "react";
import { Link, useParams } from "revine";
import { fetchContributions } from "../../../utils/github";

interface Repository {
  name: string;
  owner: string;
  count: number;
}

export default function UserRepositories() {
  const { username } = useParams<{ username: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [repos, setRepos] = useState<Repository[]>([]);

  useEffect(() => {
    if (username) {
      loadRepositories(username);
    }
  }, [username]);

  async function loadRepositories(uname: string) {
    setLoading(true);
    setError(null);
    try {
      const user = await fetchContributions(uname, 365);
      const extractedRepos = (
        user.contributionsCollection.commitContributionsByRepository || []
      )
        .map((item) => ({
          name: item.repository.name,
          owner: item.repository.owner.login,
          count: item.contributions.totalCount,
        }))
        .sort((a, b) => b.count - a.count);

      setRepos(extractedRepos);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="py-8">
        <div className="flex flex-col gap-6">
          <div className="panel skeleton h-[500px] rounded-xl" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Error</h2>
          <p className="opacity-70">{error}</p>
          <Link href={`/user/${username}`} className="btn btn-primary mt-4">
            Back to profile
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="py-8">
      <div className="flex flex-col gap-6">
        <div className="panel">
          <div className="panel-head flex justify-between items-center flex-wrap gap-4">
            <div>
              <h2>All Repositories</h2>
              <p className="text-sm">
                Complete breakdown of repositories with commit contributions by <strong>@{username}</strong> in the past year.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-xs opacity-60 uppercase tracking-wider">Total Repos</div>
                <div className="font-bold text-primary font-mono">{repos.length}</div>
              </div>
              <Link
                href={`/user/${username}`}
                className="btn btn-secondary !py-1.5 !px-4 !text-xs inline-flex items-center gap-1.5"
              >
                ← Back to Profile
              </Link>
            </div>
          </div>

          <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {repos.map((repo, i) => (
                <a
                  key={i}
                  href={`https://github.com/${repo.owner}/${repo.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-5 rounded-xl bg-surface-2 border border-white/5 flex justify-between items-center hover:border-primary/20 hover:scale-[1.01] transition-all duration-300 group text-inherit no-underline"
                >
                  <div className="flex flex-col min-w-0">
                    <strong className="text-base truncate group-hover:text-primary transition-colors">
                      {repo.name}
                    </strong>
                    <span className="text-xs opacity-60 truncate">
                      {repo.owner}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex flex-col items-end">
                      <strong className="font-mono text-primary text-lg leading-none">
                        {repo.count}
                      </strong>
                      <span className="text-[10px] opacity-40 uppercase tracking-wider mt-1">
                        commits
                      </span>
                    </div>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="opacity-0 group-hover:opacity-60 transition-opacity duration-300"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </div>
                </a>
              ))}
            </div>

            {repos.length === 0 && (
              <div className="text-center py-12 text-muted">
                No repository data found for this user.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
