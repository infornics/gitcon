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

export function parseRepoInput(input: string): { owner: string; name: string } | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Handles https://github.com/owner/repo or github.com/owner/repo
  const urlMatch = trimmed.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([^\/]+)\/([^\/]+)/i);
  if (urlMatch) {
    return { owner: urlMatch[1], name: urlMatch[2].replace(/\.git$/i, "") };
  }

  // Handles owner/repo format
  const slashParts = trimmed.split("/");
  if (slashParts.length === 2 && slashParts[0].trim() && slashParts[1].trim()) {
    return { owner: slashParts[0].trim(), name: slashParts[1].trim().replace(/\.git$/i, "") };
  }

  return null;
}

export async function fetchRepoStats(owner: string, name: string): Promise<GithubRepoData> {
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
  if (!payload.data?.repository) throw new Error(`Repository "${owner}/${name}" not found on GitHub.`);
  return payload.data.repository as GithubRepoData;
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
  }>;
}

export async function searchGithubUsers(query: string, page = 1, perPage = 10): Promise<UserSearchResult> {
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
    }
  );

  const rawData = response as UserSearchResult;
  if (!rawData.items || rawData.items.length === 0) return rawData;

  // Enrich top results with full user profile name
  const enrichedItems = await Promise.all(
    rawData.items.map(async (item) => {
      try {
        const uDetail = await revineFetch(`https://api.github.com/users/${item.login}`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          cacheTTL: 3600000,
          persist: true,
        });
        return {
          ...item,
          name: uDetail.name || item.login,
        };
      } catch (e) {
        return {
          ...item,
          name: item.login,
        };
      }
    })
  );

  return {
    ...rawData,
    items: enrichedItems,
  };
}

export async function searchGithubRepos(query: string, page = 1, perPage = 10): Promise<RepoSearchResult> {
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
    }
  );

  return response as RepoSearchResult;
}


