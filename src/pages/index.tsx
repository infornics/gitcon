import { Analytics, IOSS, Rhythm } from "@/components/home";
import { useEffect, useMemo, useRef, useState } from "react";
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
          <Rhythm />

          <Analytics />
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
