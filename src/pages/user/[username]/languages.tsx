import React, { useEffect, useState } from "react";
import { useParams, Link } from "revine";
import { fetchContributions } from "../../../utils/github";

interface Language {
  name: string;
  color: string;
  percent: number;
  size: number;
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
      const langMap = new Map<string, { size: number; color: string }>();
      let computedTotalSize = 0;
      
      user.contributionsCollection.commitContributionsByRepository.forEach(
        (repo) => {
          repo.repository.languages.edges.forEach((edge) => {
            const { name, color } = edge.node;
            const current = langMap.get(name) || { size: 0, color };
            langMap.set(name, { size: current.size + edge.size, color });
            computedTotalSize += edge.size;
          });
        },
      );

      const extractedLangs = Array.from(langMap.entries())
        .map(([name, { size, color }]) => ({
          name,
          color,
          size,
          percent: computedTotalSize > 0 ? (size / computedTotalSize) * 100 : 0,
        }))
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
                Complete breakdown of programming languages used by <strong>@{username}</strong> in the past year.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-xs opacity-60 uppercase tracking-wider">Total Code</div>
                <div className="font-bold text-primary font-mono">{formatBytes(totalSize)}</div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {languages.map((lang, i) => (
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

                  <div className="flex justify-between text-xs opacity-60 font-mono mt-1">
                    <span>Size: {formatBytes(lang.size)}</span>
                    <span>Rank: #{i + 1}</span>
                  </div>
                </div>
              ))}
            </div>
            
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
