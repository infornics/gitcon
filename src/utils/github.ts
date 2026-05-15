import { revineFetch } from "revine";
export interface ContributionDay {
  date: string;
  contributionCount: number;
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface GithubUserData {
  name: string;
  login: string;
  avatarUrl: string;
  contributionsCollection: {
    contributionCalendar: {
      totalContributions: number;
      weeks: ContributionWeek[];
    };
    commitContributionsByRepository: Array<{
      repository: {
        name: string;
        owner: { login: string };
        languages: {
          edges: Array<{
            size: number;
            node: { name: string; color: string };
          }>;
        };
      };
      contributions: { totalCount: number };
    }>;
  };
}

export function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function sundayAlignedStart(date: Date) {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() - d.getUTCDay());
  return d;
}

export function buildDateSeries(daysBack: number) {
  const end = new Date();
  end.setUTCHours(0, 0, 0, 0);
  const start = new Date(end);
  start.setUTCDate(end.getUTCDate() - daysBack + 1);
  const alignedStart = sundayAlignedStart(start);
  const dates: string[] = [];
  const cursor = new Date(alignedStart);
  while (cursor <= end) {
    dates.push(isoDate(cursor));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return { start, end, alignedStart, dates };
}

export function calculateStats(days: Array<{ date: string; count: number }>) {
  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));
  const total = sorted.reduce((sum, day) => sum + day.count, 0);
  const activeDays = sorted.filter((day) => day.count > 0);
  const max = Math.max(...sorted.map((d) => d.count), 0);
  
  let longest = 0,
    running = 0,
    runningStart = null as string | null,
    longestStart = null as string | null,
    longestEnd = null as string | null;

  for (const day of sorted) {
    if (day.count > 0) {
      if (running === 0) runningStart = day.date;
      running++;
      if (running > longest) {
        longest = running;
        longestStart = runningStart;
        longestEnd = day.date;
      }
    } else {
      running = 0;
      runningStart = null;
    }
  }

  let current = 0;
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (sorted[i].count > 0) {
      current++;
    } else if (i === sorted.length - 1) {
      // Today is empty, that's fine, streak can still be active from yesterday
      continue;
    } else {
      // Yesterday or older is empty, streak is broken
      break;
    }
  }

  const best = sorted.reduce(
    (top, day) => (day.count > top.count ? day : top),
    { count: 0, date: null as string | null },
  );

  return {
    total,
    activeDays: activeDays.length,
    max,
    current,
    longest,
    longestStart,
    longestEnd,
    best,
  };
}

export async function fetchContributions(username: string, daysBack: number) {
  const { start, end } = buildDateSeries(daysBack);
  const query = `
    query($username: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $username) {
        name
        login
        avatarUrl(size: 160)
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
          commitContributionsByRepository(maxRepositories: 100) {
            repository { 
              name 
              owner { login } 
              languages(first: 5, orderBy: {field: SIZE, direction: DESC}) {
                edges {
                  size
                  node { name color }
                }
              }
            }
            contributions(first: 1) { totalCount }
          }
        }
      }
    }
  `;
  const token = (import.meta as any).env.REVINE_PUBLIC_GITHUB_TOKEN || "";
  let response;
  try {
    response = await revineFetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        query,
        variables: { username, from: start.toISOString(), to: end.toISOString() },
      }),
      cacheTTL: 600000, // 10 minutes cache
      persist: true,    // Persist to localStorage
    });
  } catch (err: any) {
    if (err.status === 403 || err.status === 401) {
      throw new Error(
        "GitHub API blocked the request. Try adding a REVINE_PUBLIC_GITHUB_TOKEN to your environment if you hit rate limits.",
      );
    }
    throw err;
  }

  const payload = response;
  if (payload.errors?.length) throw new Error(payload.errors[0].message);
  if (!payload.data?.user) throw new Error("GitHub user not found.");
  return payload.data.user as GithubUserData;
}
export function mergeSeries(daysBack: number, apiWeeks: ContributionWeek[]) {
  const { dates } = buildDateSeries(daysBack);
  const map = new Map<string, number>();
  apiWeeks
    .flatMap((week) => week.contributionDays)
    .forEach((day) => map.set(day.date, day.contributionCount));
  return dates.map((date) => ({ date, count: map.get(date) || 0 }));
}

export async function fetchGlobalLeaderboard(count = 10, extraUsers: string[] = []) {
  const token = (import.meta as any).env.REVINE_PUBLIC_GITHUB_TOKEN || "";
  
  // 1. Discover top users by followers (proxy for "global top developers")
  let searchData;
  try {
    searchData = await revineFetch(
      `https://api.github.com/search/users?q=type:user&sort=followers&order=desc&per_page=${count}`,
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        cacheTTL: 3600000, // 1 hour cache
        persist: true,
      }
    );
  } catch (err) {
    throw new Error("Failed to discover global users.");
  }
  
  const discoveredLogins = searchData.items.map((u: any) => u.login);

  // Combine with extra users and ensure uniqueness
  const logins = [...new Set([...extraUsers, ...discoveredLogins])];

  // 2. Fetch full stats for each discovered user
  const results = await Promise.all(
    logins.map(async (login: string) => {
      try {
        return await fetchContributions(login, 365);
      } catch (e) {
        return null;
      }
    })
  );

  return results.filter((r): r is GithubUserData => r !== null);
}
