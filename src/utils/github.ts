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
      repository: { name: string; owner: { login: string } };
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
  let current = 0,
    longest = 0,
    running = 0;
  for (const day of sorted) {
    running = day.count > 0 ? running + 1 : 0;
    longest = Math.max(longest, running);
  }
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (sorted[i].count > 0) current++;
    else if (current) break;
  }
  const best = sorted.reduce(
    (top, day) => (day.count > top.count ? day : top),
    { count: 0, date: null as string | null },
  );
  return { total, activeDays: activeDays.length, max, current, longest, best };
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
          commitContributionsByRepository(maxRepositories: 8) {
            repository { name owner { login } }
            contributions(first: 1) { totalCount }
          }
        }
      }
    }
  `;
  const token = (import.meta as any).env.REVINE_PUBLIC_GITHUB_TOKEN || "";
  console.log(token);
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      query,
      variables: { username, from: start.toISOString(), to: end.toISOString() },
    }),
  });

  if (response.status === 403 || response.status === 401) {
    throw new Error(
      "GitHub API blocked the request. Try adding a REVINE_PUBLIC_GITHUB_TOKEN to your environment if you hit rate limits.",
    );
  }
  const payload = await response.json();
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
