import { IOSS } from "@/components/home";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "revine";
import { ContributionGrid } from "../components/ContributionGrid";
import Leaderboard from "../components/Leaderboard";
import { StatCard } from "../components/StatCard";
import {
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

  const graphWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollToEnd = () => {
      if (graphWrapRef.current) {
        graphWrapRef.current.scrollLeft = graphWrapRef.current.scrollWidth;
      }
    };
    scrollToEnd();
    const rafId = requestAnimationFrame(scrollToEnd);
    const timeoutId = setTimeout(scrollToEnd, 50);
    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
    };
  }, [series, loading]);

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

  const handleLoadData = async (
    targetUsername: string,
    targetRange: number,
  ) => {
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
    <>
      <main>
        <section className="hero">
          <div>
            <div className="eyebrow">GitHub activity dashboard</div>
            <h1 className="tracker-title">
              Deep-dive into your GitHub momentum and coding DNA.
            </h1>
            <p>
              Explore beautiful analytics for any GitHub user. Track streaks,
              analyze repository impact, and discover technology stacks at a
              glance.
            </p>
            <div className="hero-actions">
              <button
                className="btn btn-primary"
                onClick={() =>
                  document.getElementById("global-search-input")?.focus()
                }
              >
                Visualize now
              </button>
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
            <div className="graph-wrap" ref={graphWrapRef}>
              <ContributionGrid
                days={series.slice(-196)}
                maxCount={stats.max}
                skeleton={loading}
                onHover={showTooltip}
                onLeave={() => setTooltip((p) => ({ ...p, show: false }))}
              />
            </div>
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

        <section className="mt-20">
          <Leaderboard />
        </section>

        <section className="workspace-wide mt-20" id="tracker">
          <section className="panel">
            <div className="panel-head">
              <div>
                <h2>Developer Rhythms & Insights</h2>
                <p>Analyze your daily patterns and coding rhythms over time.</p>
              </div>
            </div>
            <div className="flex flex-col gap-6 mt-6">
              <div className="flex items-start gap-4">
                <div className="p-3.5 rounded-xl bg-primary/10 text-primary shrink-0">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Weekly Activity Rhythm</h3>
                  <p className="text-sm opacity-70 mt-1">
                    Identifies your peak coding days and active streaks. Tracks
                    day-of-week averages to help optimize your coding schedule.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3.5 rounded-xl bg-primary/10 text-primary shrink-0">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg">
                    Hourly Focus Distribution
                  </h3>
                  <p className="text-sm opacity-70 mt-1">
                    Plots commit density by the hour of the day. Pinpoint your
                    core focus hours, whether you are a morning coder or a
                    late-night developer.
                  </p>
                </div>
              </div>

              <div className="mt-2 p-4 rounded-xl bg-surface-2/50 border border-white/5">
                <div className="flex justify-between items-center mb-3 text-xs opacity-60">
                  <span>Activity Pattern</span>
                  <span>Peak focus: Afternoon</span>
                </div>
                <div className="flex items-end gap-1.5 h-16 px-2">
                  {[20, 35, 15, 60, 80, 45, 10].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t bg-primary/20 hover:bg-primary transition-colors"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="panel">
            <div className="panel-head">
              <div>
                <h2>Advanced Project Analytics</h2>
                <p>
                  Uncover repository impact and developer network contributions.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-6 mt-6">
              <div className="flex items-start gap-4">
                <div className="p-3.5 rounded-xl bg-primary/10 text-primary shrink-0">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Contributed Accounts</h3>
                  <p className="text-sm opacity-70 mt-1">
                    Discovers which organizations, namespaces, and creator
                    accounts you commit to most, highlighting collaborative
                    contributions.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3.5 rounded-xl bg-primary/10 text-primary shrink-0">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Language Genomics</h3>
                  <p className="text-sm opacity-70 mt-1">
                    Detailed breakdown of languages used across repositories.
                    Track language dominance percentages and stack evolution.
                  </p>
                </div>
              </div>

              <div className="mt-2 p-4 rounded-xl bg-surface-2/50 border border-white/5 flex flex-col gap-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold">TypeScript</span>
                  <span className="opacity-60">72.4%</span>
                </div>
                <div className="h-2 rounded-full bg-surface-offset overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: "72.4%" }}
                  />
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold">CSS / Styling</span>
                  <span className="opacity-60">15.8%</span>
                </div>
                <div className="h-2 rounded-full bg-surface-offset overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#38bdf8]"
                    style={{ width: "15.8%" }}
                  />
                </div>
              </div>
            </div>
          </section>
        </section>

        <IOSS />
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
    </>
  );
}
