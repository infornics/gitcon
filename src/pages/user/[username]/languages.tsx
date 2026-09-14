import { useEffect, useState } from "react";
import { Link, useParams } from "revine";
import {
  fetchContributions,
  fetchUserPrivateRepos,
  getGithubToken,
  getLangColor,
} from "../../../utils/github";

interface Language {
  name: string;
  color: string;
  percent: number;
  size: number;
  topRepo?: {
    owner: string;
    name: string;
    size: number;
  } | null;
}

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export default function UserLanguages() {
  const { username } = useParams<{ username: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [totalSize, setTotalSize] = useState(0);

  useEffect(() => {
    if (username) {
      loadLanguages(username);
    }
  }, [username]);

  async function loadLanguages(uname: string) {
    setLoading(true);
    setError(null);
    try {
      const user = await fetchContributions(uname, 365);
      const token = getGithubToken();
      const langMap = new Map<
        string,
        {
          size: number;
          color: string;
          repoMap: Map<string, { owner: string; name: string; size: number }>;
        }
      >();
      let computedTotalSize = 0;
      const processedRepoKeys = new Set<string>();

      (user.contributionsCollection.commitContributionsByRepository || []).forEach(
        (repo) => {
          const repoOwner = repo.repository.owner.login;
          const repoName = repo.repository.name;
          const key = `${repoOwner.toLowerCase()}/${repoName.toLowerCase()}`;
          processedRepoKeys.add(key);

          repo.repository.languages.edges.forEach((edge) => {
            const { name, color } = edge.node;
            const current = langMap.get(name) || {
              size: 0,
              color,
              repoMap: new Map<string, { owner: string; name: string; size: number }>(),
            };
            const currentRepo = current.repoMap.get(key) || {
              owner: repoOwner,
              name: repoName,
              size: 0,
            };
            currentRepo.size += edge.size;
            current.repoMap.set(key, currentRepo);

            langMap.set(name, {
              size: current.size + edge.size,
              color: current.color || color,
              repoMap: current.repoMap,
            });
            computedTotalSize += edge.size;
          });
        },
      );

      if (token) {
        const privateRepos = await fetchUserPrivateRepos(uname, token);
        privateRepos.forEach((pr) => {
          const key = `${pr.owner.toLowerCase()}/${pr.name.toLowerCase()}`;
          if (!processedRepoKeys.has(key)) {
            processedRepoKeys.add(key);
            if (pr.languages && pr.languages.length > 0) {
              pr.languages.forEach((l) => {
                const current = langMap.get(l.name) || {
                  size: 0,
                  color: l.color,
                  repoMap: new Map<string, { owner: string; name: string; size: number }>(),
                };
                const currentRepo = current.repoMap.get(key) || {
                  owner: pr.owner,
                  name: pr.name,
                  size: 0,
                };
                currentRepo.size += l.size;
                current.repoMap.set(key, currentRepo);

                langMap.set(l.name, {
                  size: current.size + l.size,
                  color: current.color || l.color,
                  repoMap: current.repoMap,
                });
                computedTotalSize += l.size;
              });
            } else if (pr.language) {
              const fallbackSize = (pr.count || 1) * 2048;
              const current = langMap.get(pr.language) || {
                size: 0,
                color: getLangColor(pr.language),
                repoMap: new Map<string, { owner: string; name: string; size: number }>(),
              };
              const currentRepo = current.repoMap.get(key) || {
                owner: pr.owner,
                name: pr.name,
                size: 0,
              };
              currentRepo.size += fallbackSize;
              current.repoMap.set(key, currentRepo);

              langMap.set(pr.language, {
                size: current.size + fallbackSize,
                color: current.color,
                repoMap: current.repoMap,
              });
              computedTotalSize += fallbackSize;
            }
          }
        });
      }

      const extractedLangs = Array.from(langMap.entries())
        .map(([name, { size, color, repoMap }]) => {
          let topRepo: { owner: string; name: string; size: number } | null = null;
          if (repoMap && repoMap.size > 0) {
            const reposArr = Array.from(repoMap.values());
            reposArr.sort((a, b) => b.size - a.size);
            topRepo = reposArr[0];
          }
          return {
            name,
            color,
            size,
            percent: computedTotalSize > 0 ? (size / computedTotalSize) * 100 : 0,
            topRepo,
          };
        })
        .sort((a, b) => b.percent - a.percent);

      setLanguages(extractedLangs);
      setTotalSize(computedTotalSize);
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
              <h2>All Languages</h2>
              <p className="text-sm">
                Complete breakdown of programming languages used by{" "}
                <strong>@{username}</strong> in the past year.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-xs opacity-60 uppercase tracking-wider">
                  Total Code
                </div>
                <div className="font-bold text-primary font-mono">
                  {formatBytes(totalSize)}
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
            {languages.length > 0 && (
              <div className="mb-10">
                <div className="label mb-4 opacity-75">Top 3 Languages</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {languages.slice(0, 3).map((lang, i) => {
                    const badge =
                      i === 0
                        ? {
                            label: "Most Used",
                            color: "#ffd700",
                          }
                        : i === 1
                          ? {
                              label: "#2 Most Used",
                              color: "#c0c0c0",
                            }
                          : {
                              label: "#3 Most Used",
                              color: "#cd7f32",
                            };

                    return (
                      <div
                        key={i}
                        className="p-6 rounded-2xl border flex flex-col gap-4 hover:scale-[1.02] transition-all duration-300"
                        style={{
                          background: `radial-gradient(circle at top right, color-mix(in oklab, ${lang.color || "#ccc"} 10%, var(--color-surface-2)), var(--color-surface-2))`,
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
                              {lang.percent.toFixed(2)}%
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            <span
                              className="w-4.5 h-4.5 rounded-full inline-block shrink-0"
                              style={{ backgroundColor: lang.color || "#ccc" }}
                            />
                            <span className="font-bold text-xl tracking-tight">
                              {lang.name}
                            </span>
                          </div>
                        </div>

                        <div className="lang-bar-bg h-3.5 rounded-full bg-surface-offset overflow-hidden mt-2">
                          <div
                            className="lang-bar h-full rounded-full"
                            style={{
                              width: `${lang.percent}%`,
                              backgroundColor: lang.color || "#ccc",
                            }}
                          />
                        </div>

                        <div className="flex justify-between items-center text-xs font-mono mt-2 pt-3 border-t border-white/10 gap-2">
                          <span className="opacity-60 shrink-0">Size: {formatBytes(lang.size)}</span>
                          {lang.topRepo && (
                            <div className="flex items-center gap-1.5 overflow-hidden justify-end text-right min-w-0">
                              <span className="opacity-50 shrink-0 text-[11px]">Top Repo:</span>
                              <Link
                                href={`/repo/${lang.topRepo.owner}/${lang.topRepo.name}`}
                                className="text-primary hover:underline truncate font-semibold text-xs"
                                title={`${lang.topRepo.owner}/${lang.topRepo.name}`}
                              >
                                {lang.topRepo.owner}/{lang.topRepo.name}
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Other Languages Grid */}
            {languages.length > 3 && (
              <div>
                <div className="label mb-4 opacity-75">Other Languages</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {languages.slice(3).map((lang, i) => (
                    <div
                      key={i}
                      className="p-5 rounded-xl bg-surface-2 border border-white/5 flex flex-col gap-3 hover:border-primary/20 transition-all duration-300"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <span
                            className="w-3.5 h-3.5 rounded-full inline-block"
                            style={{ backgroundColor: lang.color || "#ccc" }}
                          />
                          <span className="font-bold text-lg">{lang.name}</span>
                        </div>
                        <span className="font-mono text-primary font-bold text-lg">
                          {lang.percent.toFixed(2)}%
                        </span>
                      </div>

                      <div className="lang-bar-bg h-2.5 rounded-full bg-surface-offset overflow-hidden">
                        <div
                          className="lang-bar h-full rounded-full"
                          style={{
                            width: `${lang.percent}%`,
                            backgroundColor: lang.color || "#ccc",
                          }}
                        />
                      </div>

                      <div className="flex justify-between items-center text-xs font-mono mt-1 pt-2 border-t border-white/5 gap-2">
                        <div className="flex items-center gap-3 opacity-60 shrink-0">
                          <span>Size: {formatBytes(lang.size)}</span>
                          <span>•</span>
                          <span>Rank: #{i + 4}</span>
                        </div>
                        {lang.topRepo && (
                          <div className="flex items-center gap-1.5 overflow-hidden justify-end text-right min-w-0">
                            <span className="opacity-50 shrink-0 text-[11px]">Top Repo:</span>
                            <Link
                              href={`/repo/${lang.topRepo.owner}/${lang.topRepo.name}`}
                              className="text-primary hover:underline truncate font-semibold text-xs"
                              title={`${lang.topRepo.owner}/${lang.topRepo.name}`}
                            >
                              {lang.topRepo.owner}/{lang.topRepo.name}
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {languages.length === 0 && (
              <div className="text-center py-12 text-muted">
                No language data found for this user.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
