import React, { useEffect, useMemo, useState } from "react";
import { Link } from "revine";
import { Header } from "../components/common";
import { ContributionGrid } from "../components/ContributionGrid";
import { StatCard } from "../components/StatCard";
import {
  buildDateSeries,
  calculateStats,
  fetchContributions,
  GithubUserData,
  mergeSeries,
} from "../utils/github";

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function Home() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  });
  const [username, setUsername] = useState("rachit-bharadwaj");
  const [range, setRange] = useState(365);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("Enter a username and load the graph.");
  const [userData, setUserData] = useState<GithubUserData | null>(null);
  const [series, setSeries] = useState<Array<{ date: string; count: number }>>(
    [],
  );
  const [repos, setRepos] = useState<
    Array<{ name: string; owner: string; count: number }>
  >([]);
  const [tooltip, setTooltip] = useState<{
    text: string;
    x: number;
    y: number;
    show: boolean;
  }>({
    text: "",
    x: 0,
    y: 0,
    show: false,
  });

  // Theme Sync
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Fetch initial data on mount
  useEffect(() => {
    handleLoadData("rachit-bharadwaj", 365);
  }, []);

  const stats = useMemo(() => calculateStats(series), [series]);
  const months = useMemo(() => {
    const weeks: string[][] = [];
    for (let i = 0; i < series.length; i += 7)
      weeks.push(series.slice(i, i + 7).map((d) => d.date));
    return weeks.map((week) => {
      const d = new Date(week[0] + "T00:00:00Z");
      return d.getUTCDate() <= 7 ? MONTH_NAMES[d.getUTCMonth()] : "";
    });
  }, [series]);

  const handleLoadData = async (targetUsername: string, targetRange: number) => {
    if (!targetUsername) return;
    setLoading(true);
    setStatus("Loading contribution data…");

    try {
      const user = await fetchContributions(targetUsername, targetRange);
      const merged = mergeSeries(
        targetRange,
        user.contributionsCollection.contributionCalendar.weeks,
      );
      const extractedRepos = (
        user.contributionsCollection.commitContributionsByRepository || []
      )
        .map((item) => ({
          name: item.repository.name,
          owner: item.repository.owner.login,
          count: item.contributions.totalCount,
        }))
        .sort((a, b) => b.count - a.count);

      setUserData(user);
      setSeries(merged);
      setRepos(extractedRepos);
      setStatus(
        `Loaded ${user.contributionsCollection.contributionCalendar.totalContributions.toLocaleString()} contributions for ${user.login}.`,
      );
    } catch (err: any) {
      setStatus(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handleLoadData(username, range);
  };

  const showTooltip = (
    day: { date: string; count: number },
    x: number,
    y: number,
  ) => {
    const dateFormatted = new Date(day.date + "T00:00:00Z").toLocaleDateString(
      undefined,
      {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      },
    );
    setTooltip({
      text: `${day.count} contributions • ${dateFormatted}`,
      x,
      y,
      show: true,
    });
  };

  return (
    <div className="page-shell-wrapper">
      <div className="page-shell">
        <Header />
        <main>
          <section className="hero">
            <div>
              <div className="eyebrow">GitHub activity dashboard</div>
              <h1 className="tracker-title">
                See your coding streak as a living contribution graph.
              </h1>
              <p>
                Paste a GitHub username, choose a time window, and get a clean
                heatmap with streaks, totals, and busiest repositories.
              </p>
              <div className="hero-actions">
                <a className="btn btn-primary" href="#tracker">
                  Open tracker
                </a>
                <a
                  className="btn btn-secondary"
                  href="https://docs.github.com/en/account-and-profile/concepts/contributions-on-your-profile"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  How counts work
                </a>
              </div>
            </div>
            <aside className="hero-card">
              <div className="hero-card-header">
                <div className="flex items-center gap-3">
                  {userData?.avatarUrl && (
                    <img
                      src={userData.avatarUrl}
                      alt={userData.login}
                      className="w-10 h-10 rounded-full border border-white/10"
                    />
                  )}
                  <div>
                    <div className="label">Preview snapshot</div>
                    <div className="value">
                      {userData?.name || userData?.login || "rachit-bharadwaj"}
                    </div>
                    {userData && (
                      <Link
                        href={`/user/${userData.login}`}
                        className="text-xs text-primary underline mt-1 block"
                      >
                        View full profile →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
              <ContributionGrid
                days={series.slice(-196)}
                maxCount={stats.max}
                skeleton={loading}
                onHover={showTooltip}
                onLeave={() => setTooltip((p) => ({ ...p, show: false }))}
              />
              <div className="mini-kpis">
                <StatCard
                  label="Total (past 1 year)"
                  value={stats.total.toLocaleString()}
                  isMini
                />
                <StatCard label="Longest streak" value={stats.longest} isMini />
              </div>
            </aside>
          </section>

          <section className="workspace-wide" id="tracker">
            <section className="panel">
              <div className="panel-head">
                <div>
                  <h2>Momentum</h2>
                  <p>Consistency and intensity signals.</p>
                </div>
              </div>
              <div className="kpi-stack">
                <StatCard
                  label="Total contributions"
                  value={stats.total.toLocaleString()}
                  subValue={`${stats.activeDays ? (stats.total / stats.activeDays).toFixed(1) : "0.0"} per active day`}
                />
                <StatCard
                  label="Current streak"
                  value={`${stats.current} days`}
                  subValue="Measured from the latest day."
                />
                  <div className="kpi">
                    <div className="label">Longest streak</div>
                    <strong>{stats.longest} days</strong>
                    <div className="text-xs opacity-60">
                      {stats.longestStart && stats.longestEnd
                        ? `${new Date(stats.longestStart + "T00:00:00Z").toLocaleDateString(undefined, { month: "short", day: "numeric" })} — ${new Date(stats.longestEnd + "T00:00:00Z").toLocaleDateString(undefined, { month: "short", day: "numeric" })}`
                        : "Peak consistency"}
                    </div>
                  </div>
                <StatCard
                  label="Best day"
                  value={
                    stats.best.date
                      ? new Date(stats.best.date + "T00:00:00Z").toLocaleDateString(
                          undefined,
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )
                      : "—"
                  }
                  subValue={
                    stats.best.date
                      ? `${stats.best.count} contributions in a day`
                      : "No data yet."
                  }
                />
              </div>
            </section>

            <section className="panel">
              <div className="panel-head">
                <div>
                  <h2>Top repositories</h2>
                  <p>Ranked by commit contributions in selected range.</p>
                </div>
              </div>
              <div className="repo-list">
                {repos.length > 0 ? (
                  repos.slice(0, 10).map((repo, i) => (
                    <div key={i} className="repo-item">
                      <div>
                        <strong>{repo.name}</strong>
                        <span>{repo.owner}</span>
                      </div>
                      <strong>{repo.count}</strong>
                    </div>
                  ))
                ) : (
                  <div className="repo-item">
                    <div>
                      <strong>No data yet</strong>
                      <span>Load a profile to see repos.</span>
                    </div>
                    <strong>—</strong>
                  </div>
                )}
              </div>
            </section>
          </section>
        </main>

        {tooltip.show && (
          <div
            className="tooltip show"
            style={{
              left: tooltip.x,
              top: tooltip.y,
              transform: "translate(12px, 12px)",
            }}
          >
            {tooltip.text}
          </div>
        )}
      </div>
    </div>
  );
}
