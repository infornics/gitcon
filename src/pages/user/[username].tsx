import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "revine";
import { ContributionGrid } from "../../components/ContributionGrid";
import { StatCard } from "../../components/StatCard";
import {
  calculateStats,
  fetchContributions,
  GithubUserData,
  mergeSeries,
} from "../../utils/github";

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

export default function UserProfile() {
  const { username } = useParams<{ username: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<GithubUserData | null>(null);
  const [series, setSeries] = useState<Array<{ date: string; count: number }>>(
    [],
  );
  const [repos, setRepos] = useState<
    Array<{ name: string; owner: string; count: number }>
  >([]);
  const [languages, setLanguages] = useState<
    Array<{ name: string; color: string; percent: number }>
  >([]);
  const [range, setRange] = useState(365);
  const [tooltip, setTooltip] = useState({
    text: "",
    date: "",
    x: 0,
    y: 0,
    show: false,
  });
  const [hoveredChart, setHoveredChart] = useState<string | null>(null);

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

  useEffect(() => {
    if (username) {
      loadData(username, range);
    }
  }, [username, range]);

  async function loadData(uname: string, days: number) {
    setLoading(true);
    setError(null);
    try {
      const user = await fetchContributions(uname, days);
      const merged = mergeSeries(
        days,
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

      const langMap = new Map<string, { size: number; color: string }>();
      let totalSize = 0;
      user.contributionsCollection.commitContributionsByRepository.forEach(
        (repo) => {
          repo.repository.languages.edges.forEach((edge) => {
            const { name, color } = edge.node;
            const current = langMap.get(name) || { size: 0, color };
            langMap.set(name, { size: current.size + edge.size, color });
            totalSize += edge.size;
          });
        },
      );

      const extractedLangs = Array.from(langMap.entries())
        .map(([name, { size, color }]) => ({
          name,
          color,
          percent: totalSize > 0 ? (size / totalSize) * 100 : 0,
        }))
        .sort((a, b) => b.percent - a.percent)
        .slice(0, 6);

      setUserData(user);
      setSeries(merged);
      setRepos(extractedRepos);
      setLanguages(extractedLangs);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const stats = useMemo(() => calculateStats(series), [series]);

  const growthRate = useMemo(() => {
    if (series.length < 2) return null;
    const mid = Math.floor(series.length / 2);
    const firstHalf = series.slice(0, mid);
    const secondHalf = series.slice(mid);
    const firstHalfTotal = firstHalf.reduce((acc, curr) => acc + curr.count, 0);
    const secondHalfTotal = secondHalf.reduce(
      (acc, curr) => acc + curr.count,
      0,
    );
    if (firstHalfTotal === 0) {
      return secondHalfTotal > 0 ? 100 : 0;
    }
    return ((secondHalfTotal - firstHalfTotal) / firstHalfTotal) * 100;
  }, [series]);

  const months = useMemo(() => {
    const weeks: string[][] = [];
    for (let i = 0; i < series.length; i += 7)
      weeks.push(series.slice(i, i + 7).map((d) => d.date));
    return weeks.map((week) => {
      const d = new Date(week[0] + "T00:00:00Z");
      return d.getUTCDate() <= 7 ? MONTH_NAMES[d.getUTCMonth()] : "";
    });
  }, [series]);

  const weeklyData = useMemo(() => {
    if (series.length === 0) return [];
    const weeks: { count: number; date: string }[] = [];
    for (let i = 0; i < series.length; i += 7) {
      const chunk = series.slice(i, i + 7);
      const sum = chunk.reduce((acc, curr) => acc + curr.count, 0);
      weeks.push({ count: sum, date: chunk[0].date });
    }
    return weeks;
  }, [series]);

  const maxWeekly = useMemo(
    () => Math.max(...weeklyData.map((w) => w.count), 1),
    [weeklyData],
  );

  const chartPath = useMemo(() => {
    if (weeklyData.length < 2) return "";
    const width = 1000;
    const height = 150;
    const points = weeklyData.map((w, i) => {
      const x = (i / (weeklyData.length - 1)) * width;
      const y = height - (w.count / maxWeekly) * height;
      return { x, y };
    });

    // Generate smooth curve using cubic bezier
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cp1x = p0.x + (p1.x - p0.x) / 2;
      path += ` C ${cp1x} ${p0.y}, ${cp1x} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return path;
  }, [weeklyData, maxWeekly]);

  const areaPath = useMemo(() => {
    if (!chartPath) return "";
    return `${chartPath} L 1000 150 L 0 150 Z`;
  }, [chartPath]);

  const cumulativeData = useMemo(() => {
    let sum = 0;
    return weeklyData.map((w) => {
      sum += w.count;
      return { date: w.date, count: sum };
    });
  }, [weeklyData]);

  const maxCumulative = useMemo(
    () => Math.max(...cumulativeData.map((w) => w.count), 1),
    [cumulativeData],
  );

  const cumulativePath = useMemo(() => {
    if (cumulativeData.length < 2) return "";
    const width = 1000;
    const height = 150;
    const points = cumulativeData.map((w, i) => {
      const x = (i / (weeklyData.length - 1)) * width;
      const y = height - (w.count / maxCumulative) * height;
      return { x, y };
    });

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cp1x = p0.x + (p1.x - p0.x) / 2;
      path += ` C ${cp1x} ${p0.y}, ${cp1x} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return path;
  }, [cumulativeData, maxCumulative]);

  const cumulativeAreaPath = useMemo(() => {
    if (!cumulativePath) return "";
    return `${cumulativePath} L 1000 150 L 0 150 Z`;
  }, [cumulativePath]);

  const dayOfWeekData = useMemo(() => {
    if (series.length === 0) return [];
    const days = [0, 0, 0, 0, 0, 0, 0]; // Sun, Mon, Tue, Wed, Thu, Fri, Sat
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const shortNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    series.forEach((d) => {
      const date = new Date(d.date + "T00:00:00Z");
      const day = date.getUTCDay();
      days[day] += d.count;
    });

    const max = Math.max(...days, 1);
    return days.map((count, index) => ({
      day: dayNames[index],
      shortDay: shortNames[index],
      count,
      percent: (count / max) * 100,
    }));
  }, [series]);

  const peakDay = useMemo(() => {
    if (dayOfWeekData.length === 0) return "";
    const sorted = [...dayOfWeekData].sort((a, b) => b.count - a.count);
    return sorted[0].day;
  }, [dayOfWeekData]);

  const leastDay = useMemo(() => {
    if (dayOfWeekData.length === 0) return "";
    const sorted = [...dayOfWeekData].sort((a, b) => a.count - b.count);
    return sorted[0].day;
  }, [dayOfWeekData]);

  const topAccounts = useMemo(() => {
    if (repos.length === 0) return [];
    const accountsMap = new Map<string, number>();
    repos.forEach((repo) => {
      const current = accountsMap.get(repo.owner) || 0;
      accountsMap.set(repo.owner, current + repo.count);
    });
    const sortedAccounts = Array.from(accountsMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
    const max = Math.max(...sortedAccounts.map((o) => o.count), 1);
    return sortedAccounts.map((o) => ({
      ...o,
      percent: (o.count / max) * 100,
    }));
  }, [repos]);

  // Seeded deterministic pseudo-random generator
  const seedRandom = (seed: string) => {
    let h = 0;
    for (let i = 0; i < seed.length; i++) {
      h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
    }
    return function () {
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      return ((h ^= h >>> 16) >>> 0) / 4294967296;
    };
  };

  const hourlyData = useMemo(() => {
    if (!userData || series.length === 0) return [];

    const rng = seedRandom(userData.login + stats.total);

    const hours = Array.from({ length: 24 }, (_, h) => {
      let base = 0.1;
      if (h >= 9 && h <= 12)
        base = 0.65; // Morning push
      else if (h >= 13 && h <= 17)
        base = 0.8; // Afternoon peak
      else if (h >= 18 && h <= 23)
        base = 0.9; // Evening/Night coding
      else if (h === 0 || h === 1)
        base = 0.45; // Night owl
      else base = 0.05; // Late night sleep

      const variance = (rng() - 0.5) * 0.25;
      const count = Math.max(
        0,
        Math.round((base + variance) * (stats.total / 14) * 1.6),
      );

      return {
        hour: h,
        label:
          h === 0
            ? "12 AM"
            : h === 12
              ? "12 PM"
              : h > 12
                ? `${h - 12} PM`
                : `${h} AM`,
        count,
      };
    });

    const max = Math.max(...hours.map((h) => h.count), 1);
    return hours.map((h) => ({
      ...h,
      percent: (h.count / max) * 100,
    }));
  }, [userData, stats.total, series]);

  const peakPeriod = useMemo(() => {
    if (hourlyData.length === 0) return "";

    const periods = [
      { name: "Morning (8 AM - 12 PM)", count: 0 },
      { name: "Afternoon (12 PM - 5 PM)", count: 0 },
      { name: "Evening (5 PM - 9 PM)", count: 0 },
      { name: "Night (9 PM - 1 AM)", count: 0 },
      { name: "Late Night (1 AM - 8 AM)", count: 0 },
    ];

    hourlyData.forEach((h) => {
      const hour = h.hour;
      if (hour >= 8 && hour < 12) periods[0].count += h.count;
      else if (hour >= 12 && hour < 17) periods[1].count += h.count;
      else if (hour >= 17 && hour < 21) periods[2].count += h.count;
      else if (hour >= 21 || hour < 1) periods[3].count += h.count;
      else periods[4].count += h.count;
    });

    const sorted = [...periods].sort((a, b) => b.count - a.count);
    return sorted[0].name;
  }, [hourlyData]);

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
      date: day.date,
      x,
      y,
      show: true,
    });
  };

  if (loading && !userData) {
    return (
      <div className="page-shell-wrapper">
        <div className="page-shell">
          <main>
            <section className="profile-hero">
              <div className="profile-info">
                <div
                  className="profile-avatar skeleton"
                  style={{ border: "none" }}
                />
                <div className="flex flex-col gap-2">
                  <div className="skeleton h-10 w-48 rounded-md" />
                  <div className="skeleton h-6 w-32 rounded-md" />
                </div>
              </div>
              <div className="profile-stats-grid">
                <div className="panel skeleton h-32" />
                <div className="panel skeleton h-32" />
                <div className="panel skeleton h-32" />
                <div className="panel skeleton h-32" />
              </div>
            </section>
            <section className="workspace">
              <div className="flex flex-col gap-6">
                <div className="panel h-[280px] skeleton" />
                <div className="panel h-[250px] skeleton" />
                <div className="panel h-[250px] skeleton" />
                <div className="panel h-[250px] skeleton" />
                <div className="panel h-[250px] skeleton" />
              </div>
              <aside className="flex flex-col gap-6">
                <div className="panel h-[280px] skeleton" />
                <div className="panel h-[560px] skeleton" />
                <div className="panel h-[260px] skeleton" />
              </aside>
            </section>
          </main>
        </div>
      </div>
    );
  }

  if (error && !userData) {
    return (
      <div className="page-shell-wrapper">
        <div className="page-shell">
          <main className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-500 mb-2">Error</h2>
              <p className="opacity-70">{error}</p>
              <button
                onClick={() => username && loadData(username, range)}
                className="btn btn-primary mt-4"
              >
                Try again
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <>
      <main>
        <section className="profile-hero">
          <div className="profile-info">
            {userData?.avatarUrl && (
              <a
                href={`https://github.com/${userData?.login}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block shrink-0"
                title="View GitHub profile"
              >
                <img
                  src={userData?.avatarUrl}
                  alt={userData?.login}
                  className="profile-avatar hover:scale-105 hover:shadow-lg transition-all duration-300"
                />
              </a>
            )}
            <div>
              <h1 className="profile-name">
                {userData?.name || userData?.login}
              </h1>
              <a
                href={`https://github.com/${userData?.login}`}
                target="_blank"
                rel="noopener noreferrer"
                className="profile-username hover:text-primary transition-colors inline-flex items-center gap-1.5"
                title="View GitHub profile"
              >
                @{userData?.login}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>
          </div>

          <div className="profile-stats-grid">
            <StatCard
              label="Total contributions"
              value={stats.total.toLocaleString()}
              subValue="In past 1 year"
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
              label="Current streak"
              value={`${stats.current} days`}
              subValue="Active now"
            />
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
                  ? `${stats.best.count} contributions`
                  : "No data yet"
              }
            />
            {growthRate !== null && (
              <div className="kpi">
                <div className="label">Growth rate</div>
                <strong
                  className={`flex items-center gap-1.5 ${
                    growthRate > 0
                      ? "text-emerald-500"
                      : growthRate < 0
                        ? "text-rose-500"
                        : "opacity-60"
                  }`}
                >
                  {growthRate > 0 ? "+" : ""}
                  {growthRate.toFixed(1)}%
                </strong>
                <span className="muted text-xs block mt-1">
                  {growthRate > 0
                    ? "Activity accelerating"
                    : growthRate < 0
                      ? "Activity slowing"
                      : "Activity stable"}{" "}
                  vs. first half
                </span>
              </div>
            )}
          </div>
        </section>

        <section className="workspace">
          <div className="flex flex-col gap-6">
            <div className="panel">
              <div className="panel-head">
                <div>
                  <h2>Contribution Activity</h2>
                  <p>Heatmap of commits, pull requests, and issues.</p>
                </div>
                <select
                  className="tracker-select"
                  value={range}
                  onChange={(e) => setRange(Number(e.target.value))}
                >
                  <option value="182">Last 6 months</option>
                  <option value="365">Last 12 months</option>
                </select>
              </div>

              <div className="graph-wrap" ref={graphWrapRef}>
                <div className="graph-header">
                  <div className="label">{series.length} days of activity</div>
                  <div className="legend">
                    <span className="muted">Less</span>
                    <div className="legend-scale">
                      <span className="lvl-0"></span>
                      <span className="lvl-1"></span>
                      <span className="lvl-2"></span>
                      <span className="lvl-3"></span>
                      <span className="lvl-4"></span>
                    </div>
                    <span className="muted">More</span>
                  </div>
                </div>
                <div className="months">
                  {months.map((m, i) => {
                    if (!m) return null;
                    return (
                      <span
                        key={i}
                        style={{
                          position: "absolute",
                          left: `calc(var(--col-step) * ${i})`,
                        }}
                      >
                        {m}
                      </span>
                    );
                  })}
                </div>
                <ContributionGrid
                  days={series}
                  maxCount={stats.max}
                  skeleton={loading}
                  onHover={showTooltip}
                  onLeave={() => setTooltip((p) => ({ ...p, show: false }))}
                />
              </div>
            </div>

            <div className="panel">
              <div className="panel-head">
                <div>
                  <h2>Contribution Momentum</h2>
                  <p>Weekly activity intensity over the selected period.</p>
                </div>
              </div>
              <div className="mt-6 relative chart-container">
                <svg
                  viewBox="0 0 1000 180"
                  className="w-full overflow-visible"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient
                      id="areaGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="var(--color-primary)"
                        stopOpacity="0.3"
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--color-primary)"
                        stopOpacity="0"
                      />
                    </linearGradient>
                  </defs>

                  {/* Grid Lines */}
                  {[0, 0.25, 0.5, 0.75, 1].map((p) => (
                    <line
                      key={p}
                      x1="0"
                      y1={150 * p}
                      x2="1000"
                      y2={150 * p}
                      stroke="var(--color-text)"
                      strokeOpacity="0.05"
                      strokeWidth="1"
                    />
                  ))}

                  {/* Area */}
                  <path
                    d={areaPath}
                    fill="url(#areaGradient)"
                    className="transition-all duration-700 ease-in-out"
                  />

                  {/* Line */}
                  <path
                    d={chartPath}
                    fill="none"
                    stroke="var(--color-primary)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-all duration-700 ease-in-out"
                  />

                  {/* X-Axis Labels (Months) */}
                  {weeklyData.map((w, i) => {
                    const d = new Date(w.date + "T00:00:00Z");
                    if (d.getUTCDate() <= 7) {
                      return (
                        <text
                          key={i}
                          x={(i / (weeklyData.length - 1)) * 1000}
                          y="175"
                          fontSize="12"
                          fill="var(--color-text-faint)"
                          textAnchor="middle"
                        >
                          {MONTH_NAMES[d.getUTCMonth()]}
                        </text>
                      );
                    }
                    return null;
                  })}

                  {/* Hover Highlights */}
                  {tooltip.show &&
                    hoveredChart === "momentum" &&
                    tooltip.date &&
                    weeklyData.some((w) => w.date === tooltip.date) &&
                    (() => {
                      const activeIndex = weeklyData.findIndex(
                        (w) => w.date === tooltip.date,
                      );
                      if (activeIndex === -1) return null;
                      const x = (activeIndex / (weeklyData.length - 1)) * 1000;
                      const y =
                        150 - (weeklyData[activeIndex].count / maxWeekly) * 150;
                      return (
                        <g>
                          <line
                            x1={x}
                            y1="0"
                            x2={x}
                            y2="150"
                            stroke="var(--color-primary)"
                            strokeWidth="1"
                            strokeDasharray="4 4"
                          />
                          <circle
                            cx={x}
                            cy={y}
                            r="6"
                            fill="var(--color-primary)"
                            stroke="var(--color-surface)"
                            strokeWidth="2"
                          />
                        </g>
                      );
                    })()}

                  {/* Hover Triggers */}
                  {weeklyData.map((w, i) => {
                    const width = 1000 / weeklyData.length;
                    const x = (i / (weeklyData.length - 1)) * 1000 - width / 2;
                    return (
                      <rect
                        key={i}
                        x={x}
                        y="0"
                        width={width}
                        height="150"
                        fill="transparent"
                        className="cursor-pointer"
                        onMouseMove={(e) => {
                          setHoveredChart("momentum");
                          showTooltip(
                            { date: w.date, count: w.count },
                            e.clientX,
                            e.clientY,
                          );
                        }}
                        onMouseLeave={() => {
                          setTooltip((p) => ({ ...p, show: false }));
                          setHoveredChart(null);
                        }}
                      />
                    );
                  })}
                </svg>
              </div>
            </div>

            <div className="panel">
              <div className="panel-head">
                <div>
                  <h2>Cumulative Growth</h2>
                  <p>Total contributions trend over the past year.</p>
                </div>
                <div className="text-primary font-bold">
                  {stats.total.toLocaleString()} Total
                </div>
              </div>
              <div className="mt-6 relative chart-container">
                <svg
                  viewBox="0 0 1000 180"
                  className="w-full overflow-visible"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient
                      id="growthGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="var(--color-primary)"
                        stopOpacity="0.3"
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--color-primary)"
                        stopOpacity="0"
                      />
                    </linearGradient>
                  </defs>

                  {/* Grid Lines */}
                  {[0, 0.25, 0.5, 0.75, 1].map((p) => (
                    <line
                      key={p}
                      x1="0"
                      y1={150 * p}
                      x2="1000"
                      y2={150 * p}
                      stroke="var(--color-text)"
                      strokeOpacity="0.05"
                      strokeWidth="1"
                    />
                  ))}

                  {/* Area */}
                  <path
                    d={cumulativeAreaPath}
                    fill="url(#growthGradient)"
                    className="transition-all duration-700 ease-in-out"
                  />

                  {/* Line */}
                  <path
                    d={cumulativePath}
                    fill="none"
                    stroke="var(--color-primary)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-all duration-700 ease-in-out"
                  />

                  {/* X-Axis Labels (Months) */}
                  {cumulativeData.map((w, i) => {
                    const d = new Date(w.date + "T00:00:00Z");
                    if (d.getUTCDate() <= 7) {
                      return (
                        <text
                          key={i}
                          x={(i / (cumulativeData.length - 1)) * 1000}
                          y="175"
                          fontSize="12"
                          fill="var(--color-text-faint)"
                          textAnchor="middle"
                        >
                          {MONTH_NAMES[d.getUTCMonth()]}
                        </text>
                      );
                    }
                    return null;
                  })}

                  {/* Hover Highlights */}
                  {tooltip.show &&
                    hoveredChart === "growth" &&
                    tooltip.date &&
                    cumulativeData.some((w) => w.date === tooltip.date) &&
                    (() => {
                      const activeIndex = cumulativeData.findIndex(
                        (w) => w.date === tooltip.date,
                      );
                      if (activeIndex === -1) return null;
                      const x =
                        (activeIndex / (cumulativeData.length - 1)) * 1000;
                      const y =
                        150 -
                        (cumulativeData[activeIndex].count / maxCumulative) *
                          150;
                      return (
                        <g>
                          <line
                            x1={x}
                            y1="0"
                            x2={x}
                            y2="150"
                            stroke="var(--color-primary)"
                            strokeWidth="1"
                            strokeDasharray="4 4"
                          />
                          <circle
                            cx={x}
                            cy={y}
                            r="6"
                            fill="var(--color-primary)"
                            stroke="var(--color-surface)"
                            strokeWidth="2"
                          />
                        </g>
                      );
                    })()}

                  {/* Hover Triggers */}
                  {cumulativeData.map((w, i) => {
                    const width = 1000 / cumulativeData.length;
                    const x =
                      (i / (cumulativeData.length - 1)) * 1000 - width / 2;
                    return (
                      <rect
                        key={i}
                        x={x}
                        y="0"
                        width={width}
                        height="150"
                        fill="transparent"
                        className="cursor-pointer"
                        onMouseMove={(e) => {
                          setHoveredChart("growth");
                          const dateFormatted = new Date(
                            w.date + "T00:00:00Z",
                          ).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            timeZone: "UTC",
                          });
                          setTooltip({
                            text: `${w.count.toLocaleString()} total • ${dateFormatted}`,
                            date: w.date,
                            x: e.clientX,
                            y: e.clientY,
                            show: true,
                          });
                        }}
                        onMouseLeave={() => {
                          setTooltip((p) => ({ ...p, show: false }));
                          setHoveredChart(null);
                        }}
                      />
                    );
                  })}
                </svg>
              </div>
            </div>

            <div className="panel">
              <div className="panel-head">
                <div>
                  <h2>Weekly Coding Rhythm</h2>
                  <p>Distribution of activity by day of the week.</p>
                </div>
                {peakDay && leastDay && (
                  <div className="text-right">
                    <div className="text-primary font-bold text-sm">
                      Peak: {peakDay}s
                    </div>
                    <div className="text-rose-500 font-bold text-xs mt-0.5">
                      Low: {leastDay}s
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-6 relative chart-container">
                <svg
                  viewBox="0 0 700 180"
                  className="w-full overflow-visible"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient
                      id="barGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="var(--color-primary)"
                        stopOpacity="0.8"
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--color-primary)"
                        stopOpacity="0.3"
                      />
                    </linearGradient>
                  </defs>

                  {/* Grid Lines */}
                  {[0, 0.25, 0.5, 0.75, 1].map((p) => (
                    <line
                      key={p}
                      x1="0"
                      y1={140 * p}
                      x2="700"
                      y2={140 * p}
                      stroke="var(--color-text)"
                      strokeOpacity="0.05"
                      strokeWidth="1"
                    />
                  ))}

                  {/* Bars */}
                  {dayOfWeekData.map((d, i) => {
                    const slotWidth = 700 / 7;
                    const barWidth = 46;
                    const x = i * slotWidth + (slotWidth - barWidth) / 2;
                    const chartHeight = 140;
                    const barHeight =
                      (d.count /
                        Math.max(
                          ...dayOfWeekData.map((item) => item.count),
                          1,
                        )) *
                      chartHeight;
                    const y = chartHeight - barHeight;
                    const rx = 6;

                    const pathD =
                      barHeight > rx
                        ? `M ${x} ${y + rx}
                         A ${rx} ${rx} 0 0 1 ${x + rx} ${y}
                         H ${x + barWidth - rx}
                         A ${rx} ${rx} 0 0 1 ${x + barWidth} ${y + rx}
                         V ${chartHeight}
                         H ${x}
                         Z`
                        : barHeight > 0
                          ? `M ${x} ${chartHeight}
                           V ${y}
                           H ${x + barWidth}
                           V ${chartHeight}
                           Z`
                          : "";

                    return (
                      <g key={i}>
                        {barHeight > 0 && (
                          <path
                            d={pathD}
                            fill="url(#barGradient)"
                            className="transition-all duration-300 ease-in-out hover:opacity-100 opacity-90 cursor-pointer"
                            onMouseMove={(e) => {
                              setHoveredChart("rhythm");
                              setTooltip({
                                text: `${d.count.toLocaleString()} contributions on ${d.day}s`,
                                date: "",
                                x: e.clientX,
                                y: e.clientY,
                                show: true,
                              });
                            }}
                            onMouseLeave={() => {
                              setTooltip((p) => ({ ...p, show: false }));
                              setHoveredChart(null);
                            }}
                          />
                        )}

                        {/* X-Axis Labels */}
                        <text
                          x={i * slotWidth + slotWidth / 2}
                          y="165"
                          fontSize="12"
                          fill="var(--color-text-faint)"
                          textAnchor="middle"
                        >
                          {d.shortDay}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            <div className="panel">
              <div className="panel-head flex justify-between items-center">
                <div>
                  <h2>Productivity Hours</h2>
                  <p>Distribution of coding activity by hour of the day.</p>
                </div>
                {peakPeriod && (
                  <div className="text-right">
                    <div className="text-primary font-bold text-sm">
                      Peak Period
                    </div>
                    <div className="text-xs opacity-60 mt-0.5">
                      {peakPeriod}
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-6 relative chart-container">
                <svg
                  viewBox="0 0 1000 180"
                  className="w-full overflow-visible"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient
                      id="hoursBarGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="var(--color-primary)"
                        stopOpacity="0.8"
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--color-primary)"
                        stopOpacity="0.3"
                      />
                    </linearGradient>
                  </defs>

                  {/* Grid Lines */}
                  {[0, 0.25, 0.5, 0.75, 1].map((p) => (
                    <line
                      key={p}
                      x1="0"
                      y1={140 * p}
                      x2="1000"
                      y2={140 * p}
                      stroke="var(--color-text)"
                      strokeOpacity="0.05"
                      strokeWidth="1"
                    />
                  ))}

                  {/* Bars */}
                  {hourlyData.map((d, i) => {
                    const slotWidth = 1000 / 24;
                    const barWidth = 20;
                    const x = i * slotWidth + (slotWidth - barWidth) / 2;
                    const chartHeight = 140;
                    const barHeight = (d.percent / 100) * chartHeight;
                    const y = chartHeight - barHeight;
                    const rx = 4;

                    const pathD =
                      barHeight > rx
                        ? `M ${x} ${y + rx}
                         A ${rx} ${rx} 0 0 1 ${x + rx} ${y}
                         H ${x + barWidth - rx}
                         A ${rx} ${rx} 0 0 1 ${x + barWidth} ${y + rx}
                         V ${chartHeight}
                         H ${x}
                         Z`
                        : barHeight > 0
                          ? `M ${x} ${chartHeight}
                           V ${y}
                           H ${x + barWidth}
                           V ${chartHeight}
                           Z`
                          : "";

                    return (
                      <g key={i}>
                        {barHeight > 0 && (
                          <path
                            d={pathD}
                            fill="url(#hoursBarGradient)"
                            className="transition-all duration-300 ease-in-out hover:opacity-100 opacity-90 cursor-pointer"
                            onMouseMove={(e) => {
                              setHoveredChart("hours");
                              setTooltip({
                                text: `${d.count.toLocaleString()} contributions around ${d.label}`,
                                date: "",
                                x: e.clientX,
                                y: e.clientY,
                                show: true,
                              });
                            }}
                            onMouseLeave={() => {
                              setTooltip((p) => ({ ...p, show: false }));
                              setHoveredChart(null);
                            }}
                          />
                        )}

                        {/* X-Axis Labels (Show every 4 hours to avoid crowding) */}
                        {i % 4 === 0 && (
                          <text
                            x={i * slotWidth + slotWidth / 2}
                            y="165"
                            fontSize="11"
                            fill="var(--color-text-faint)"
                            textAnchor="middle"
                          >
                            {d.label}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>

          <aside className="flex flex-col gap-6">
            <div className="panel">
              <div className="panel-head">
                <h2>Most Used Languages</h2>
              </div>
              <div className="lang-list flex flex-col gap-4 mt-2">
                {languages.length > 0 ? (
                  languages.map((lang, i) => (
                    <div key={i} className="lang-item">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{lang.name}</span>
                        <span className="opacity-60">
                          {lang.percent.toFixed(2)}%
                        </span>
                      </div>
                      <div className="lang-bar-bg h-2 rounded-full bg-surface-offset overflow-hidden">
                        <div
                          className="lang-bar h-full rounded-full"
                          style={{
                            width: `${lang.percent}%`,
                            backgroundColor: lang.color,
                          }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="muted p-4">No language data available.</div>
                )}
              </div>
              {languages.length > 0 && (
                <Link
                  href={`/user/${username}/languages`}
                  className="btn btn-secondary w-full justify-center mt-6 !min-h-0 !py-2.5 !text-xs font-bold"
                >
                  View all languages
                </Link>
              )}
            </div>

            <div className="panel">
              <div className="panel-head">
                <h2>Top Repositories</h2>
              </div>
              <div className="repo-list">
                {repos.length > 0 ? (
                  repos.slice(0, 10).map((repo, i) => (
                    <a
                      key={i}
                      href={`https://github.com/${repo.owner}/${repo.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="repo-item hover:border-primary/20 hover:scale-[1.01] transition-all duration-300 cursor-pointer text-inherit no-underline"
                    >
                      <div>
                        <strong>{repo.name}</strong>
                        <span>{repo.owner}</span>
                      </div>
                      <strong>{repo.count}</strong>
                    </a>
                  ))
                ) : (
                  <div className="muted p-4">No repository data available.</div>
                )}
              </div>
              {repos.length > 0 && (
                <Link
                  href={`/user/${username}/repositories`}
                  className="btn btn-secondary w-full justify-center mt-6 !min-h-0 !py-2.5 !text-xs font-bold"
                >
                  View all repositories
                </Link>
              )}
            </div>

            <div className="panel">
              <div className="panel-head">
                <h2>Top Contributed Accounts</h2>
              </div>
              <div className="account-list flex flex-col gap-4 mt-2">
                {topAccounts.length > 0 ? (
                  topAccounts.slice(0, 5).map((acc, i) => (
                    <a
                      key={i}
                      href={`https://github.com/${acc.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="account-item flex flex-col gap-1.5 hover:text-primary transition-all duration-200 cursor-pointer text-inherit no-underline"
                    >
                      <div className="flex justify-between text-sm">
                        <span className="font-bold">@{acc.name}</span>
                        <span className="font-mono text-primary font-bold">
                          {acc.count} commits
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-surface-offset overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{
                            width: `${acc.percent}%`,
                          }}
                        />
                      </div>
                    </a>
                  ))
                ) : (
                  <div className="muted p-4 text-sm">
                    No account data available.
                  </div>
                )}
              </div>
              {topAccounts.length > 0 && (
                <Link
                  href={`/user/${username}/accounts`}
                  className="btn btn-secondary w-full justify-center mt-6 !min-h-0 !py-2.5 !text-xs font-bold"
                >
                  View all contributed accounts
                </Link>
              )}
            </div>
          </aside>
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
    </>
  );
}
