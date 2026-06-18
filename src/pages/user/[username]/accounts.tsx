import { useEffect, useState } from "react";
import { Link, useParams } from "revine";
import { fetchContributions } from "../../../utils/github";

interface Account {
  name: string;
  count: number;
  percent: number;
}

export default function UserAccounts() {
  const { username } = useParams<{ username: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    if (username) {
      loadAccounts(username);
    }
  }, [username]);

  async function loadAccounts(uname: string) {
    setLoading(true);
    setError(null);
    try {
      const user = await fetchContributions(uname, 365);
      const accountsMap = new Map<string, number>();

      const repoContributions =
        user.contributionsCollection.commitContributionsByRepository || [];

      repoContributions.forEach((item) => {
        const owner = item.repository.owner.login;
        const current = accountsMap.get(owner) || 0;
        accountsMap.set(owner, current + item.contributions.totalCount);
      });

      const sortedAccounts = Array.from(accountsMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

      const max = Math.max(...sortedAccounts.map((o) => o.count), 1);
      const extractedAccounts = sortedAccounts.map((o) => ({
        ...o,
        percent: (o.count / max) * 100,
      }));

      setAccounts(extractedAccounts);
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
              <h2>All Contributed Accounts</h2>
              <p className="text-sm">
                Complete breakdown of other user and organization accounts with
                commit contributions by <strong>@{username}</strong> in the past
                year.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-xs opacity-60 uppercase tracking-wider">
                  Total Accounts
                </div>
                <div className="font-bold text-primary font-mono text-lg">
                  {accounts.length}
                </div>
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
            {/* Top 3 Highlighted Grid */}
            {accounts.length > 0 && (
              <div className="mb-10">
                <div className="label mb-4 opacity-75">
                  Top 3 Contributed Accounts
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {accounts.slice(0, 3).map((acc, i) => {
                    const badge =
                      i === 0
                        ? {
                            label: "Most Contributed",
                            color: "#ffd700",
                          }
                        : i === 1
                          ? {
                              label: "#2 Most Contributed",
                              color: "#c0c0c0",
                            }
                          : {
                              label: "#3 Most Contributed",
                              color: "#cd7f32",
                            };

                    return (
                     < a
                        key={i}
                        href={`https://github.com/${acc.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-6 rounded-2xl border flex flex-col gap-4 hover:scale-[1.02] hover:text-primary transition-all duration-300 cursor-pointer text-inherit no-underline"
                        style={{
                          background: `radial-gradient(circle at top right, color-mix(in oklab, var(--color-primary) 8%, var(--color-surface-2)), var(--color-surface-2))`,
                          borderColor: badge.color + "35",
                          boxShadow: `0 10px 30px ${badge.color}0a`,
                        }}
                      >
                        <div className="flex flex-col gap-3">
                          <div className="flex justify-between items-center">
                            <span
                              className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5"
                              style={{ color: badge.color }}
                            >
                              {badge.label}
                            </span>
                            <span className="font-mono text-primary font-extrabold text-2xl">
                              {acc.count}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="font-bold text-xl tracking-tight">
                              @{acc.name}
                            </span>
                          </div>
                        </div>

                        <div className="h-3.5 rounded-full bg-surface-offset overflow-hidden mt-2">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{
                              width: `${acc.percent}%`,
                            }}
                          />
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Other Accounts Grid */}
            {accounts.length > 3 && (
              <div>
                <div className="label mb-4 opacity-75">
                  Other Contributed Accounts
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {accounts.slice(3).map((acc, i) => (
                    <a
                      key={i}
                      href={`https://github.com/${acc.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-5 rounded-xl bg-surface-2 border border-white/5 flex flex-col gap-3 hover:border-primary/20 hover:scale-[1.01] hover:text-primary transition-all duration-300 cursor-pointer text-inherit no-underline"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-lg">@{acc.name}</span>
                        <span className="font-mono text-primary font-bold text-lg">
                          {acc.count} commits
                        </span>
                      </div>

                      <div className="h-2.5 rounded-full bg-surface-offset overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{
                            width: `${acc.percent}%`,
                          }}
                        />
                      </div>

                      <div className="flex justify-between text-xs opacity-60 font-mono mt-1">
                        <span>Rank: #{i + 4}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {accounts.length === 0 && (
              <div className="text-center py-12 text-muted">
                No account data found for this user.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
