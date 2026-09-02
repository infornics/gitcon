import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "revine";
import { ContributionGrid } from "../../components/ContributionGrid";
import { StatCard } from "../../components/StatCard";
import {
  calculateStats,
  fetchContributions,
  fetchUserPrivateRepos,
  getGithubToken,
  getLangColor,
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

const renderAchievementIcon = (type: string, size = 15, className = "") => {
  switch (type) {
    case "crown":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
          <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
      );
    case "flame":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3.5z" />
        </svg>
      );
    case "rocket":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
          <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
          <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
          <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
        </svg>
      );
    case "repo":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      );
    case "code":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );
    case "diamond":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M6 3h12l4 6-10 12L2 9z" />
          <path d="M11 3 8 9l4 12 4-12-3-6" />
          <path d="M2 9h20" />
        </svg>
      );
    default:
      return null;
  }
};

export default function UserProfile() {
  const { username } = useParams<{ username: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<GithubUserData | null>(null);
  const [series, setSeries] = useState<Array<{ date: string; count: number }>>(
    [],
  );
  const [repos, setRepos] = useState<
    Array<{ name: string; owner: string; count: number; isPrivate?: boolean }>
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
  const [selectedAchievement, setSelectedAchievement] = useState<any | null>(
    null,
  );

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
      const token = getGithubToken();
      let extractedRepos = (
        user.contributionsCollection.commitContributionsByRepository || []
      ).map((item) => ({
        name: item.repository.name,
        owner: item.repository.owner.login,
        count: item.contributions.totalCount,
        isPrivate: item.repository.isPrivate,
      }));

      let fetchedPrivateRepos: Awaited<ReturnType<typeof fetchUserPrivateRepos>> = [];
      if (token) {
        fetchedPrivateRepos = await fetchUserPrivateRepos(uname, token);
        const repoMap = new Map<string, (typeof extractedRepos)[0]>();
        extractedRepos.forEach((r) =>
          repoMap.set(`${r.owner.toLowerCase()}/${r.name.toLowerCase()}`, r),
        );

        fetchedPrivateRepos.forEach((pr) => {
          const key = `${pr.owner.toLowerCase()}/${pr.name.toLowerCase()}`;
          const existing = repoMap.get(key);
          if (existing) {
            existing.isPrivate = pr.isPrivate || existing.isPrivate;
            existing.count = Math.max(existing.count, pr.count);
          } else {
            repoMap.set(key, {
              name: pr.name,
              owner: pr.owner,
              count: pr.count,
              isPrivate: pr.isPrivate,
            });
          }
        });

        extractedRepos = Array.from(repoMap.values());
      }

      extractedRepos.sort((a, b) => b.count - a.count);

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

      if (token && fetchedPrivateRepos.length > 0) {
        fetchedPrivateRepos.forEach((pr) => {
          if (pr.languages && pr.languages.length > 0) {
            pr.languages.forEach((l) => {
              const current = langMap.get(l.name) || {
                size: 0,
                color: l.color,
              };
              langMap.set(l.name, {
                size: current.size + l.size,
                color: current.color || l.color,
              });
              totalSize += l.size;
            });
          } else if (pr.language) {
            const fallbackSize = (pr.count || 1) * 2048;
            const current = langMap.get(pr.language) || {
              size: 0,
              color: getLangColor(pr.language),
            };
            langMap.set(pr.language, {
              size: current.size + fallbackSize,
              color: current.color,
            });
            totalSize += fallbackSize;
          }
        });
      }

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

  const dailyAverage = useMemo(() => {
    if (series.length === 0) return 0;
    return stats.total / series.length;
  }, [series, stats.total]);

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

  const topDays = useMemo(() => {
    if (series.length === 0) return [];
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const activeDays = series.filter((d) => d.count > 0);
    const sorted = [...activeDays].sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return b.date.localeCompare(a.date);
    });
    const top = sorted.slice(0, 10);
    const maxCount = top[0]?.count || 1;

    return top.map((d) => {
      const dateObj = new Date(d.date + "T00:00:00Z");
      return {
        date: d.date,
        count: d.count,
        dayName: dayNames[dateObj.getUTCDay()],
        formattedDate: dateObj.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
          timeZone: "UTC",
        }),
        relativePercent: (d.count / maxCount) * 100,
        shareOfTotal:
          stats.total > 0
            ? ((d.count / stats.total) * 100).toFixed(1)
            : "0",
      };
    });
  }, [series, stats.total]);

  const topDaysTotal = useMemo(() => {
    return topDays.reduce((acc, curr) => acc + curr.count, 0);
  }, [topDays]);

  const monthlyBreakdown = useMemo(() => {
    if (series.length === 0) return [];
    const map = new Map<
      string,
      { monthKey: string; label: string; count: number }
    >();

    series.forEach((d) => {
      const dateObj = new Date(d.date + "T00:00:00Z");
      const key = `${dateObj.getUTCFullYear()}-${String(dateObj.getUTCMonth() + 1).padStart(2, "0")}`;
      const label = dateObj.toLocaleDateString(undefined, {
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      });
      const current = map.get(key) || { monthKey: key, label, count: 0 };
      current.count += d.count;
      map.set(key, current);
    });

    const months = Array.from(map.values()).sort((a, b) =>
      b.monthKey.localeCompare(a.monthKey),
    );
    const maxCount = Math.max(...months.map((m) => m.count), 1);

    return months.map((m) => ({
      ...m,
      percent: (m.count / maxCount) * 100,
      shareOfTotal:
        stats.total > 0
          ? ((m.count / stats.total) * 100).toFixed(1)
          : "0",
      isPeak: m.count === maxCount && maxCount > 0,
    }));
  }, [series, stats.total]);

  const consistencyStats = useMemo(() => {
    if (series.length === 0) {
      return {
        activeDays: 0,
        totalDays: 0,
        activeRatio: 0,
        activeAverage: 0,
        restDays: 0,
        weekdayCount: 0,
        weekendCount: 0,
        weekdayPercent: 50,
        weekendPercent: 50,
        archetype: "Coder",
        archetypeIcon: "💻",
        archetypeDesc: "Consistent software development",
      };
    }

    const totalDays = series.length;
    const activeDays = series.filter((d) => d.count > 0).length;
    const restDays = totalDays - activeDays;
    const activeRatio = totalDays > 0 ? (activeDays / totalDays) * 100 : 0;
    const activeAverage = activeDays > 0 ? stats.total / activeDays : 0;

    let weekdayCount = 0;
    let weekendCount = 0;

    series.forEach((d) => {
      const day = new Date(d.date + "T00:00:00Z").getUTCDay();
      if (day === 0 || day === 6) {
        weekendCount += d.count;
      } else {
        weekdayCount += d.count;
      }
    });

    const totalCalculated = weekdayCount + weekendCount;
    const weekdayPercent =
      totalCalculated > 0 ? (weekdayCount / totalCalculated) * 100 : 50;
    const weekendPercent =
      totalCalculated > 0 ? (weekendCount / totalCalculated) * 100 : 50;

    let archetype = "Daily Striker";
    let archetypeIcon = "🔥";
    let archetypeDesc = "High daily consistency and regular commits";

    if (activeRatio >= 80) {
      archetype = "Ironclad Striker";
      archetypeIcon = "⚡";
      archetypeDesc = "Active over 80% of all days in the period";
    } else if (weekendPercent > 35) {
      archetype = "Weekend Warrior";
      archetypeIcon = "🛡️";
      archetypeDesc = "Heavy contribution volume on weekends";
    } else if (languages.length >= 4) {
      archetype = "Polyglot Architect";
      archetypeIcon = "🌐";
      archetypeDesc = "Versatile across multiple programming stacks";
    } else if (stats.best.count >= 80) {
      archetype = "High-Velocity Sprinter";
      archetypeIcon = "🚀";
      archetypeDesc = "Capable of massive single-day contribution bursts";
    } else if (stats.longest >= 30) {
      archetype = "Endurance Runner";
      archetypeIcon = "🏃";
      archetypeDesc = "Exceptional continuous momentum";
    }

    return {
      activeDays,
      totalDays,
      activeRatio,
      activeAverage,
      restDays,
      weekdayCount,
      weekendCount,
      weekdayPercent,
      weekendPercent,
      archetype,
      archetypeIcon,
      archetypeDesc,
    };
  }, [series, stats.total, stats.best.count, stats.longest, languages.length]);

  const achievements = useMemo(() => {
    return [
      {
        id: "century",
        iconType: "crown",
        title: "Century Club",
        shortDesc: "100+ contributions in a single day",
        fullDesc:
          "Record 100 or more contributions within a single 24-hour UTC day.",
        unlocked: stats.best.count >= 100,
        badgeSubtitle:
          stats.best.count >= 100
            ? `${stats.best.count.toLocaleString()} in a day`
            : `${stats.best.count}/100 in a day`,
        progress: `${Math.min(stats.best.count, 100)}/100`,
        progressPercent: Math.min(
          100,
          Math.round((stats.best.count / 100) * 100),
        ),
        currentValue: `${stats.best.count.toLocaleString()} contributions`,
        targetValue: "100 contributions",
        metricLabel: "Peak Single-Day Output",
        rewardCategory: "Daily Intensity",
      },
      {
        id: "streak-30",
        iconType: "flame",
        title: "Iron Streak",
        shortDesc: "Maintained a 30+ day streak",
        fullDesc:
          "Maintain an uninterrupted contribution streak for 30 consecutive calendar days or more.",
        unlocked: stats.longest >= 30,
        badgeSubtitle:
          stats.longest >= 30
            ? `${stats.longest} days streak`
            : `${stats.longest}/30 days`,
        progress: `${Math.min(stats.longest, 30)}/30 days`,
        progressPercent: Math.min(
          100,
          Math.round((stats.longest / 30) * 100),
        ),
        currentValue: `${stats.longest} consecutive days`,
        targetValue: "30 days",
        metricLabel: "Longest Consecutive Streak",
        rewardCategory: "Consistency",
      },
      {
        id: "kilo-club",
        iconType: "rocket",
        title: "1K Milestone",
        shortDesc: "Reached 1,000+ total contributions",
        fullDesc:
          "Accumulate 1,000 or more total contributions over the selected yearly tracking period.",
        unlocked: stats.total >= 1000,
        badgeSubtitle:
          stats.total >= 1000
            ? `${stats.total.toLocaleString()} commits`
            : `${stats.total.toLocaleString()}/1K commits`,
        progress: `${Math.min(stats.total, 1000).toLocaleString()}/1,000`,
        progressPercent: Math.min(
          100,
          Math.round((stats.total / 1000) * 100),
        ),
        currentValue: `${stats.total.toLocaleString()} total contributions`,
        targetValue: "1,000 contributions",
        metricLabel: "Total Contribution Volume",
        rewardCategory: "Volume Milestone",
      },
      {
        id: "five-k",
        iconType: "diamond",
        title: "5K Milestone",
        shortDesc: "Reached 5,000+ total contributions",
        fullDesc:
          "Accumulate 5,000 or more total contributions over the selected yearly tracking period.",
        unlocked: stats.total >= 5000,
        badgeSubtitle:
          stats.total >= 5000
            ? `${stats.total.toLocaleString()} commits`
            : `${stats.total.toLocaleString()}/5K commits`,
        progress: `${Math.min(stats.total, 5000).toLocaleString()}/5,000`,
        progressPercent: Math.min(
          100,
          Math.round((stats.total / 5000) * 100),
        ),
        currentValue: `${stats.total.toLocaleString()} total contributions`,
        targetValue: "5,000 contributions",
        metricLabel: "Total Contribution Volume",
        rewardCategory: "Elite Milestone",
      },
      {
        id: "multi-repo",
        iconType: "repo",
        title: "Code Explorer",
        shortDesc: "Committed to 5+ repositories",
        fullDesc:
          "Contribute commits across at least 5 distinct repositories within the past year.",
        unlocked: repos.length >= 5,
        badgeSubtitle:
          repos.length >= 5
            ? `${repos.length} repositories`
            : `${repos.length}/5 repos`,
        progress: `${Math.min(repos.length, 5)}/5 repos`,
        progressPercent: Math.min(
          100,
          Math.round((repos.length / 5) * 100),
        ),
        currentValue: `${repos.length} repositories`,
        targetValue: "5 repositories",
        metricLabel: "Active Repositories",
        rewardCategory: "Exploration",
      },
      {
        id: "polyglot",
        iconType: "code",
        title: "Polyglot",
        shortDesc: "Used 4+ programming languages",
        fullDesc:
          "Write and push code in 4 or more different programming languages.",
        unlocked: languages.length >= 4,
        badgeSubtitle:
          languages.length >= 4
            ? `${languages.length} languages`
            : `${languages.length}/4 langs`,
        progress: `${Math.min(languages.length, 4)}/4 langs`,
        progressPercent: Math.min(
          100,
          Math.round((languages.length / 4) * 100),
        ),
        currentValue: `${languages.length} languages detected`,
        targetValue: "4 languages",
        metricLabel: "Languages Stack",
        rewardCategory: "Versatility",
      },
    ];
  }, [stats, repos.length, languages.length]);

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
              <div className="profile-hero-inner">
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
                <div className="profile-header-badges-stack">
                  <div className="header-badges-row">
                    <div className="skeleton h-8 w-28 rounded-full" />
                    <div className="skeleton h-8 w-28 rounded-full" />
                    <div className="skeleton h-8 w-28 rounded-full" />
                  </div>
                  <div className="header-badges-row">
                    <div className="skeleton h-8 w-28 rounded-full" />
                    <div className="skeleton h-8 w-28 rounded-full" />
                    <div className="skeleton h-8 w-28 rounded-full" />
                  </div>
                </div>
              </div>
              <div className="profile-stats-grid">
                <div className="panel skeleton h-32" />
                <div className="panel skeleton h-32" />
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
                <div className="panel h-[420px] skeleton" />
              </div>
              <aside className="flex flex-col gap-6">
                <div className="panel h-[280px] skeleton" />
                <div className="panel h-[560px] skeleton" />
                <div className="panel h-[260px] skeleton" />
                <div className="panel h-[260px] skeleton" />
                <div className="panel h-[480px] skeleton" />
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
          <div className="profile-hero-inner">
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
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="profile-name">
                    {userData?.name || userData?.login}
                  </h1>
                </div>
                <Link
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
                </Link>
              </div>
            </div>

            {/* Header Badges: 3 on Top Row, 2 on Second Row */}
            <div className="profile-header-badges-stack">
              <div className="header-badges-row">
                {achievements.slice(0, 3).map((ach) => (
                  <button
                    key={ach.id}
                    type="button"
                    onClick={() => setSelectedAchievement(ach)}
                    className={`header-badge-chip ${ach.unlocked ? "unlocked" : "locked"}`}
                    title={`Click to view details: ${ach.title}`}
                  >
                    <span className="badge-chip-icon">
                      {renderAchievementIcon(ach.iconType, 15)}
                    </span>
                    <div className="badge-chip-info">
                      <span className="badge-chip-title">{ach.title}</span>
                      <span className="badge-chip-sub">{ach.badgeSubtitle}</span>
                    </div>
                  </button>
                ))}
              </div>
              <div className="header-badges-row">
                {achievements.slice(3, 6).map((ach) => (
                  <button
                    key={ach.id}
                    type="button"
                    onClick={() => setSelectedAchievement(ach)}
                    className={`header-badge-chip ${ach.unlocked ? "unlocked" : "locked"}`}
                    title={`Click to view details: ${ach.title}`}
                  >
                    <span className="badge-chip-icon">
                      {renderAchievementIcon(ach.iconType, 15)}
                    </span>
                    <div className="badge-chip-info">
                      <span className="badge-chip-title">{ach.title}</span>
                      <span className="badge-chip-sub">{ach.badgeSubtitle}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="profile-stats-grid">
            <StatCard
              label="Total contributions"
              value={stats.total.toLocaleString()}
              subValue="In past 1 year"
            />
            <StatCard
              label="Daily average"
              value={dailyAverage.toFixed(2)}
              subValue="Contributions / day"
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

            <div className="panel">
              <div className="panel-head flex justify-between items-center flex-wrap gap-2">
                <div>
                  <h2>Top Contribution Days</h2>
                  <p>Highest volume contribution days in the selected period.</p>
                </div>
                {topDays.length > 0 && (
                  <div className="text-right">
                    <div className="text-primary font-bold text-sm">
                      {topDaysTotal.toLocaleString()} Commits
                    </div>
                    <div className="text-xs opacity-60 mt-0.5">
                      {stats.total > 0
                        ? `${((topDaysTotal / stats.total) * 100).toFixed(1)}% of total`
                        : ""}
                    </div>
                  </div>
                )}
              </div>

              {topDays.length > 0 ? (
                <div className="top-days-table-wrapper">
                  <table className="top-days-table">
                    <thead>
                      <tr>
                        <th className="text-center w-12">#</th>
                        <th>Date</th>
                        <th className="hide-mobile">Day of Week</th>
                        <th>Activity Intensity</th>
                        <th className="text-right">Contributions</th>
                        <th className="text-right hide-mobile">% of Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topDays.map((item, idx) => {
                        const rank = idx + 1;
                        const rankClass =
                          rank === 1
                            ? "gold"
                            : rank === 2
                              ? "silver"
                              : rank === 3
                                ? "bronze"
                                : "regular";

                        return (
                          <tr key={item.date}>
                            <td className="rank-cell text-center">
                              <span className={`rank-badge ${rankClass}`}>
                                {rank}
                              </span>
                            </td>
                            <td>
                              <div className="flex flex-col">
                                <span className="font-bold text-sm">
                                  {item.formattedDate}
                                </span>
                                <span className="font-mono text-xs opacity-50">
                                  {item.date}
                                </span>
                              </div>
                            </td>
                            <td className="hide-mobile">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-surface-offset text-text-muted">
                                {item.dayName}
                              </span>
                            </td>
                            <td>
                              <div className="flex items-center gap-3 min-w-[120px] max-w-[220px]">
                                <div className="flex-1 h-2 rounded-full bg-surface-offset overflow-hidden">
                                  <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{
                                      width: `${item.relativePercent}%`,
                                      background:
                                        rank === 1
                                          ? "linear-gradient(90deg, var(--color-primary), #ffd700)"
                                          : rank === 2
                                            ? "linear-gradient(90deg, var(--color-primary), #c0c0c0)"
                                            : rank === 3
                                              ? "linear-gradient(90deg, var(--color-primary), #cd7f32)"
                                              : "var(--color-primary)",
                                    }}
                                  />
                                </div>
                                <span className="text-xs opacity-60 font-mono w-9 text-right shrink-0">
                                  {Math.round(item.relativePercent)}%
                                </span>
                              </div>
                            </td>
                            <td className="text-right">
                              <span className="font-mono font-bold text-primary text-sm">
                                {item.count.toLocaleString()}
                              </span>
                              <span className="text-xs opacity-50 ml-1 hidden sm:inline">
                                {item.count === 1 ? "commit" : "commits"}
                              </span>
                            </td>
                            <td className="text-right font-mono text-xs opacity-60 hide-mobile">
                              {item.shareOfTotal}%
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="muted p-6 text-center text-sm">
                  No contribution activity recorded in this period.
                </div>
              )}
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
                  repos.slice(0, 7).map((repo, i) => (
                    <Link
                      key={i}
                      href={`/repo/${repo.owner}/${repo.name}`}
                      className="repo-item hover:border-primary/20 hover:scale-[1.01] transition-all duration-300 cursor-pointer text-inherit no-underline min-w-0"
                    >
                      <div className="flex flex-col min-w-0 flex-1 pr-1">
                        <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                          <strong className="truncate text-sm font-bold max-w-full">
                            {repo.name}
                          </strong>
                          {repo.isPrivate && (
                            <span
                              className="inline-flex items-center justify-center p-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0 opacity-80 hover:opacity-100 transition-opacity"
                              title="Private repository"
                            >
                              <svg
                                width="11"
                                height="11"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <rect
                                  x="3"
                                  y="11"
                                  width="18"
                                  height="11"
                                  rx="2"
                                  ry="2"
                                />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                              </svg>
                            </span>
                          )}
                        </div>
                        <span className="text-xs opacity-60 truncate mt-0.5">
                          {repo.owner}
                        </span>
                      </div>
                      <strong className="shrink-0 font-mono text-sm">
                        {repo.count}
                      </strong>
                    </Link>
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

            {/* Developer Habits & Consistency */}
            <div className="panel">
              <div className="panel-head">
                <h2>Habits & Consistency</h2>
              </div>

              <div className="habit-stat-grid mt-4">
                <div className="habit-stat-box">
                  <span className="text-xs opacity-60">Active Ratio</span>
                  <strong className="text-base font-mono text-primary font-bold">
                    {consistencyStats.activeRatio.toFixed(1)}%
                  </strong>
                  <span className="text-[11px] opacity-50">
                    {consistencyStats.activeDays} of {consistencyStats.totalDays} days
                  </span>
                </div>

                <div className="habit-stat-box">
                  <span className="text-xs opacity-60">Rest Days</span>
                  <strong className="text-base font-mono font-bold">
                    {consistencyStats.restDays}
                  </strong>
                  <span className="text-[11px] opacity-50">Zero-commit days</span>
                </div>

                <div className="habit-stat-box full-width">
                  <span className="text-xs opacity-60">Active Day Avg</span>
                  <strong className="text-base font-mono font-bold">
                    {consistencyStats.activeAverage.toFixed(1)}
                  </strong>
                  <span className="text-[11px] opacity-50">Commits / active day</span>
                </div>
              </div>

              <div className="weekday-split-wrap">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="font-bold">Weekday vs. Weekend Split</span>
                  <span className="font-mono opacity-60">
                    {consistencyStats.weekdayPercent.toFixed(0)}% / {consistencyStats.weekendPercent.toFixed(0)}%
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-surface-offset flex overflow-hidden gap-0.5">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${consistencyStats.weekdayPercent}%` }}
                    title={`Weekdays: ${consistencyStats.weekdayCount.toLocaleString()} commits (${consistencyStats.weekdayPercent.toFixed(1)}%)`}
                  />
                  <div
                    className="h-full bg-blue transition-all duration-500"
                    style={{ width: `${consistencyStats.weekendPercent}%` }}
                    title={`Weekends: ${consistencyStats.weekendCount.toLocaleString()} commits (${consistencyStats.weekendPercent.toFixed(1)}%)`}
                  />
                </div>
                <div className="flex justify-between text-[11px] opacity-60 mt-1.5">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-primary inline-block" />
                    Mon–Fri ({consistencyStats.weekdayCount.toLocaleString()})
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue inline-block" />
                    Sat–Sun ({consistencyStats.weekendCount.toLocaleString()})
                  </span>
                </div>
              </div>
            </div>

            {/* Monthly Activity Breakdown */}
            <div className="panel">
              <div className="panel-head flex justify-between items-center">
                <div>
                  <h2>Monthly Breakdown</h2>
                  <p className="text-xs opacity-60">Output trend across months</p>
                </div>
              </div>

              <div className="month-breakdown-list mt-3">
                {monthlyBreakdown.map((m) => (
                  <div key={m.monthKey} className="month-item">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold flex items-center gap-1.5">
                        {m.label}
                        {m.isPeak && (
                          <span
                            className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold"
                            title="Peak contribution month"
                          >
                            PEAK
                          </span>
                        )}
                      </span>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="font-bold text-primary">
                          {m.count.toLocaleString()}
                        </span>
                        <span className="opacity-50 text-[11px]">
                          ({m.shareOfTotal}%)
                        </span>
                      </div>
                    </div>
                    <div className="h-2 rounded-full bg-surface-offset overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          m.isPeak ? "bg-amber-400" : "bg-primary"
                        }`}
                        style={{ width: `${m.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
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

      {/* Achievement Detail Modal */}
      {selectedAchievement && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: "rgba(0, 0, 0, 0.72)",
            backdropFilter: "blur(8px)",
          }}
          onClick={() => setSelectedAchievement(null)}
        >
          <div
            className="achievement-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="achievement-modal-header">
              <div className="flex items-center gap-3">
                <div
                  className={`achievement-modal-icon-badge ${
                    selectedAchievement.unlocked ? "unlocked" : "locked"
                  }`}
                >
                  {renderAchievementIcon(selectedAchievement.iconType, 22)}
                </div>
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-primary">
                    {selectedAchievement.rewardCategory}
                  </span>
                  <h3 className="text-xl font-bold leading-snug">
                    {selectedAchievement.title}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAchievement(null)}
                className="modal-close-btn"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="achievement-modal-body">
              <p className="text-sm opacity-80 mb-6 leading-relaxed">
                {selectedAchievement.fullDesc}
              </p>

              <div className="achievement-status-banner mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold">
                    {selectedAchievement.unlocked
                      ? "Milestone Completed"
                      : "Current Progress"}
                  </span>
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                      selectedAchievement.unlocked
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                    }`}
                  >
                    {selectedAchievement.unlocked
                      ? "✓ UNLOCKED"
                      : `${selectedAchievement.progressPercent}%`}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-surface-offset overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      selectedAchievement.unlocked
                        ? "bg-emerald-500"
                        : "bg-primary"
                    }`}
                    style={{
                      width: `${selectedAchievement.progressPercent}%`,
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-surface-offset/50 border border-white/5">
                  <span className="text-xs opacity-60 block mb-1">
                    {selectedAchievement.metricLabel}
                  </span>
                  <strong className="text-sm font-mono font-bold text-primary">
                    {selectedAchievement.currentValue}
                  </strong>
                </div>

                <div className="p-3.5 rounded-xl bg-surface-offset/50 border border-white/5">
                  <span className="text-xs opacity-60 block mb-1">
                    Required Goal
                  </span>
                  <strong className="text-sm font-mono font-bold">
                    {selectedAchievement.targetValue}
                  </strong>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="achievement-modal-footer">
              <button
                type="button"
                onClick={() => setSelectedAchievement(null)}
                className="btn btn-secondary w-full justify-center text-xs font-bold !py-2.5"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
