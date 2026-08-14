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
  followers?: {
    totalCount: number;
  };
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
        followers {
          totalCount
        }
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
        variables: {
          username,
          from: start.toISOString(),
          to: end.toISOString(),
        },
      }),
      cacheTTL: 600000, // 10 minutes cache
      persist: true, // Persist to localStorage
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

export async function fetchGlobalLeaderboard(
  count = 10,
  extraUsers: string[] = [],
) {
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
      },
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
    }),
  );

  return results.filter((r): r is GithubUserData => r !== null);
}

export interface GithubRepoData {
  name: string;
  nameWithOwner: string;
  description: string | null;
  url: string;
  stargazerCount: number;
  forkCount: number;
  watchers: { totalCount: number };
  openIssues: { totalCount: number };
  openPullRequests: { totalCount: number };
  licenseInfo: { name: string; nickname: string | null } | null;
  primaryLanguage: { name: string; color: string } | null;
  languages: {
    totalSize: number;
    edges: Array<{
      size: number;
      node: { name: string; color: string };
    }>;
  };
  repositoryTopics: {
    nodes: Array<{ topic: { name: string } }>;
  };
  defaultBranchRef: {
    name: string;
    target: {
      history?: { totalCount: number };
    };
  } | null;
  releases: { totalCount: number };
  createdAt: string;
  updatedAt: string;
  owner: {
    login: string;
    avatarUrl: string;
  };
}

export function parseRepoInput(
  input: string,
): { owner: string; name: string } | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Handles https://github.com/owner/repo or github.com/owner/repo
  const urlMatch = trimmed.match(
    /(?:https?:\/\/)?(?:www\.)?github\.com\/([^\/]+)\/([^\/]+)/i,
  );
  if (urlMatch) {
    return { owner: urlMatch[1], name: urlMatch[2].replace(/\.git$/i, "") };
  }

  // Handles owner/repo format
  const slashParts = trimmed.split("/");
  if (slashParts.length === 2 && slashParts[0].trim() && slashParts[1].trim()) {
    return {
      owner: slashParts[0].trim(),
      name: slashParts[1].trim().replace(/\.git$/i, ""),
    };
  }

  return null;
}

export async function fetchRepoStats(
  owner: string,
  name: string,
): Promise<GithubRepoData> {
  const query = `
    query($owner: String!, $name: String!) {
      repository(owner: $owner, name: $name) {
        name
        nameWithOwner
        description
        url
        stargazerCount
        forkCount
        watchers {
          totalCount
        }
        openIssues: issues(states: OPEN) {
          totalCount
        }
        openPullRequests: pullRequests(states: OPEN) {
          totalCount
        }
        licenseInfo {
          name
          nickname
        }
        primaryLanguage {
          name
          color
        }
        languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
          totalSize
          edges {
            size
            node {
              name
              color
            }
          }
        }
        repositoryTopics(first: 12) {
          nodes {
            topic {
              name
            }
          }
        }
        defaultBranchRef {
          name
          target {
            ... on Commit {
              history {
                totalCount
              }
            }
          }
        }
        releases {
          totalCount
        }
        createdAt
        updatedAt
        owner {
          login
          avatarUrl(size: 160)
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
        variables: { owner, name },
      }),
      cacheTTL: 600000,
      persist: true,
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
  if (!payload.data?.repository)
    throw new Error(`Repository "${owner}/${name}" not found on GitHub.`);
  return payload.data.repository as GithubRepoData;
}

export interface RepoContributor {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
  type: string;
  name?: string;
  additions?: number;
  deletions?: number;
  netChanges?: number;
  filesTouchedApprox?: number;
}

export async function fetchRepoContributors(
  owner: string,
  name: string,
  limit = 15,
): Promise<RepoContributor[]> {
  const token = (import.meta as any).env.REVINE_PUBLIC_GITHUB_TOKEN || "";
  try {
    // 1. Fetch main contributors list
    const res = await revineFetch(
      `https://api.github.com/repos/${owner}/${name}/contributors?per_page=${limit}`,
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        cacheTTL: 1800000,
        persist: true,
      },
    );
    if (!Array.isArray(res)) return [];

    // 2. Fetch repo stats/contributors for exact additions & deletions on THIS repo
    let statsData: any[] = [];
    try {
      // First try reading from cache
      const cached = await revineFetch(
        `https://api.github.com/repos/${owner}/${name}/stats/contributors`,
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          cacheTTL: 3600000,
          persist: true,
        },
      );
      if (Array.isArray(cached) && cached.length > 0) {
        statsData = cached;
      }
    } catch (e) {}

    // If cache was empty or uncomputed 202, poll live endpoint until 200 OK array is returned
    if (statsData.length === 0) {
      try {
        for (let attempt = 0; attempt < 5; attempt++) {
          const statsRes = await fetch(
            `https://api.github.com/repos/${owner}/${name}/stats/contributors`,
            {
              headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
            },
          );
          if (statsRes.status === 200) {
            const json = await statsRes.json();
            if (Array.isArray(json) && json.length > 0) {
              statsData = json;
              // Now that we have valid computed data, update cache permanently
              revineFetch(
                `https://api.github.com/repos/${owner}/${name}/stats/contributors`,
                {
                  headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                  },
                  cacheTTL: 3600000,
                  persist: true,
                },
              ).catch(() => {});
              break;
            }
          }
          await new Promise((r) => setTimeout(r, 1200));
        }
      } catch (e) {
        console.warn("Stats API background calculation in progress.");
      }
    }

    const statsMap = new Map<
      string,
      { a: number; d: number; c: number; weeksCount: number }
    >();
    statsData.forEach((item: any) => {
      if (item.author?.login && Array.isArray(item.weeks)) {
        let totalA = 0;
        let totalD = 0;
        let activeWeeks = 0;
        item.weeks.forEach((w: any) => {
          totalA += w.a || 0;
          totalD += w.d || 0;
          if ((w.c || 0) > 0) activeWeeks++;
        });
        statsMap.set(item.author.login.toLowerCase(), {
          a: totalA,
          d: totalD,
          c: item.total || 0,
          weeksCount: activeWeeks,
        });
      }
    });

    const enriched = await Promise.all(
      res.map(async (c: any) => {
        try {
          const uDetail = await revineFetch(
            `https://api.github.com/users/${c.login}`,
            {
              headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
              cacheTTL: 3600000,
              persist: true,
            },
          );

          const stat = statsMap.get(c.login.toLowerCase());
          const additions = stat?.a || 0;
          const deletions = stat?.d || 0;
          // Approximate files touched estimation based on commits and code changes volume
          const filesTouchedApprox = stat
            ? Math.max(
                1,
                Math.round(stat.c * 2.2 + (additions + deletions) / 250),
              )
            : Math.max(1, c.contributions * 2);

          return {
            ...c,
            name: uDetail.name || c.login,
            additions,
            deletions,
            netChanges: additions - deletions,
            filesTouchedApprox,
          };
        } catch (e) {
          return {
            ...c,
            name: c.login,
            additions: 0,
            deletions: 0,
            netChanges: 0,
            filesTouchedApprox: c.contributions,
          };
        }
      }),
    );

    return enriched;
  } catch (err) {
    console.error("Failed to fetch repo contributors:", err);
    return [];
  }
}

export interface UserSearchResult {
  total_count: number;
  items: Array<{
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
    type: string;
    name?: string;
    totalContributions?: number;
    longestStreak?: number;
    currentStreak?: number;
    followers?: number;
  }>;
}

export interface RepoSearchResult {
  total_count: number;
  items: Array<{
    id: number;
    name: string;
    full_name: string;
    owner: {
      login: string;
      avatar_url: string;
    };
    description: string | null;
    stargazers_count: number;
    forks_count: number;
    language: string | null;
    updated_at: string;
    totalCommits?: number;
    commitsPast3Months?: number;
    daysSinceLastActive?: number;
  }>;
}

export async function searchGithubUsers(
  query: string,
  page = 1,
  perPage = 10,
): Promise<UserSearchResult> {
  const token = (import.meta as any).env.REVINE_PUBLIC_GITHUB_TOKEN || "";
  const encodedQuery = encodeURIComponent(query);
  const response = await revineFetch(
    `https://api.github.com/search/users?q=${encodedQuery}&page=${page}&per_page=${perPage}`,
    {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cacheTTL: 300000, // 5 min cache
      persist: true,
    },
  );

  const rawData = response as UserSearchResult;
  if (!rawData.items || rawData.items.length === 0) return rawData;

  // Enrich top results with full user profile stats & contribution data
  const enrichedItems = await Promise.all(
    rawData.items.map(async (item) => {
      try {
        const fullUser = await fetchContributions(item.login, 365);
        const merged =
          fullUser.contributionsCollection.contributionCalendar.weeks.flatMap(
            (w) =>
              w.contributionDays.map((d) => ({
                date: d.date,
                count: d.contributionCount,
              })),
          );
        const stats = calculateStats(merged);
        return {
          ...item,
          name: fullUser.name || item.login,
          totalContributions:
            fullUser.contributionsCollection.contributionCalendar
              .totalContributions,
          longestStreak: stats.longest,
          currentStreak: stats.current,
          followers: fullUser.followers?.totalCount || 0,
        };
      } catch (e) {
        return {
          ...item,
          name: item.login,
          totalContributions: 0,
          longestStreak: 0,
          currentStreak: 0,
          followers: 0,
        };
      }
    }),
  );

  return {
    ...rawData,
    items: enrichedItems,
  };
}

export async function searchGithubRepos(
  query: string,
  page = 1,
  perPage = 10,
): Promise<RepoSearchResult> {
  const token = (import.meta as any).env.REVINE_PUBLIC_GITHUB_TOKEN || "";
  const encodedQuery = encodeURIComponent(query);
  const response = await revineFetch(
    `https://api.github.com/search/repositories?q=${encodedQuery}&page=${page}&per_page=${perPage}`,
    {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cacheTTL: 300000, // 5 min cache
      persist: true,
    },
  );

  return response as RepoSearchResult;
}

export async function fetchTopStarredRepos(
  count = 6,
): Promise<RepoSearchResult> {
  const token = (import.meta as any).env.REVINE_PUBLIC_GITHUB_TOKEN || "";
  const response = await revineFetch(
    `https://api.github.com/search/repositories?q=stars:>10000&sort=stars&order=desc&per_page=${count}`,
    {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cacheTTL: 3600000, // 1 hour cache
      persist: true,
    },
  );

  return response as RepoSearchResult;
}

export async function fetchTopForkedRepos(
  count = 6,
): Promise<RepoSearchResult> {
  const token = (import.meta as any).env.REVINE_PUBLIC_GITHUB_TOKEN || "";
  const response = await revineFetch(
    `https://api.github.com/search/repositories?q=forks:>5000&sort=forks&order=desc&per_page=${count}`,
    {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cacheTTL: 3600000, // 1 hour cache
      persist: true,
    },
  );

  return response as RepoSearchResult;
}

export async function fetchOrgRepos(
  org = "infornics",
  count = 6,
): Promise<RepoSearchResult> {
  const token = (import.meta as any).env.REVINE_PUBLIC_GITHUB_TOKEN || "";
  let rawRepos: any[] = [];
  try {
    const data = await revineFetch(
      `https://api.github.com/orgs/${org}/repos?type=public&per_page=100`,
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        cacheTTL: 1800000, // 30 min cache
        persist: true,
      },
    );
    rawRepos = Array.isArray(data) ? data : data.items || [];
  } catch (e) {
    try {
      const data = await revineFetch(
        `https://api.github.com/users/${org}/repos?type=public&per_page=100`,
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          cacheTTL: 1800000,
          persist: true,
        },
      );
      rawRepos = Array.isArray(data) ? data : data.items || [];
    } catch (err) {
      rawRepos = [];
    }
  }

  // 1. Fetch total commits and commits in past 3 months for all org repos
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  const sinceISO = threeMonthsAgo.toISOString();

  const enrichedAll = await Promise.all(
    rawRepos.map(async (repo) => {
      try {
        // Fetch total commits
        const resTotal = await fetch(
          `https://api.github.com/repos/${repo.owner.login}/${repo.name}/commits?per_page=1`,
          {
            headers: {
              "User-Agent": "Gitcon",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          },
        );
        let totalCommits = 0;
        if (resTotal.ok) {
          const link = resTotal.headers.get("link");
          if (link) {
            const match = link.match(/page=(\d+)>; rel="last"/);
            totalCommits = match ? parseInt(match[1], 10) : 1;
          } else {
            const body = await resTotal.json();
            totalCommits = Array.isArray(body) ? body.length : 0;
          }
        }

        // Fetch commits in past 3 months
        const resRecent = await fetch(
          `https://api.github.com/repos/${repo.owner.login}/${repo.name}/commits?since=${sinceISO}&per_page=1`,
          {
            headers: {
              "User-Agent": "Gitcon",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          },
        );
        let commitsPast3Months = 0;
        if (resRecent.ok) {
          const link = resRecent.headers.get("link");
          if (link) {
            const match = link.match(/page=(\d+)>; rel="last"/);
            commitsPast3Months = match ? parseInt(match[1], 10) : 1;
          } else {
            const body = await resRecent.json();
            commitsPast3Months = Array.isArray(body) ? body.length : 0;
          }
        }

        // Calculate days since last active activity (pushed_at or updated_at)
        const lastActiveTimestamp = new Date(repo.pushed_at || repo.updated_at || Date.now()).getTime();
        const nowTimestamp = Date.now();
        const diffMs = Math.max(0, nowTimestamp - lastActiveTimestamp);
        const daysSinceLastActive = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        return {
          ...repo,
          totalCommits,
          commitsPast3Months,
          daysSinceLastActive,
        };
      } catch (err) {
        return {
          ...repo,
          totalCommits: 0,
          commitsPast3Months: 0,
          daysSinceLastActive: 0,
        };
      }
    }),
  );

  // 2. Sort repos by raw activity score minus daysSinceLastActive
  // Formula: Stars + Forks + TotalCommits + CommitsPast3Months - DaysSinceLastActive
  const sorted = [...enrichedAll].sort((a, b) => {
    const scoreA =
      (a.stargazers_count || 0) +
      (a.forks_count || 0) +
      (a.totalCommits || 0) +
      (a.commitsPast3Months || 0) -
      (a.daysSinceLastActive || 0);
    const scoreB =
      (b.stargazers_count || 0) +
      (b.forks_count || 0) +
      (b.totalCommits || 0) +
      (b.commitsPast3Months || 0) -
      (b.daysSinceLastActive || 0);
    return scoreB - scoreA;
  });

  const topItems = sorted.slice(0, count);

  return {
    total_count: topItems.length,
    items: topItems,
  } as RepoSearchResult;
}
