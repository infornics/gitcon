import { revineFetch } from "revine";

export function formatBytes(bytes: number): string {
  if (!bytes || bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const absBytes = Math.abs(bytes);
  const i = Math.floor(Math.log(absBytes) / Math.log(k));
  const val = parseFloat((absBytes / Math.pow(k, i)).toFixed(2));
  const prefix = bytes < 0 ? "-" : "";
  return `${prefix}${val} ${sizes[i]}`;
}

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
  repositories?: {
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
        isPrivate?: boolean;
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

export function clearRevineCache() {
  if (typeof window !== "undefined") {
    try {
      Object.keys(localStorage)
        .filter((key) => key.startsWith("revine_cache_") || key.startsWith("fetch_"))
        .forEach((key) => localStorage.removeItem(key));
    } catch (e) {}
  }
}

export function getGithubToken(): string {
  if (typeof window !== "undefined") {
    // One-time cache purge for PAT users to remove legacy cached public data
    if (!localStorage.getItem("gitcon_cache_purged_v5")) {
      clearRevineCache();
      localStorage.setItem("gitcon_cache_purged_v5", "true");
    }
    const userToken = localStorage.getItem("gitcon_pat")?.trim();
    if (userToken) return userToken;
  }
  return (import.meta as any).env.REVINE_PUBLIC_GITHUB_TOKEN || "";
}

export function setGithubToken(token: string) {
  if (typeof window !== "undefined") {
    if (token.trim()) {
      localStorage.setItem("gitcon_pat", token.trim());
    } else {
      localStorage.removeItem("gitcon_pat");
    }
    clearRevineCache();
  }
}

export function hasCustomGithubToken(): boolean {
  if (typeof window !== "undefined") {
    return !!localStorage.getItem("gitcon_pat")?.trim();
  }
  return false;
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

  const today = isoDate(new Date());
  const yesterday = isoDate(new Date(Date.now() - 86400000));

  let current = 0;
  const daysMap = new Map(sorted.map((d) => [d.date, d.count]));

  let checkDate = daysMap.has(today) && daysMap.get(today)! > 0 ? today : yesterday;

  while (daysMap.has(checkDate) && daysMap.get(checkDate)! > 0) {
    current++;
    const prev = new Date(checkDate);
    prev.setUTCDate(prev.getUTCDate() - 1);
    checkDate = isoDate(prev);
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
  const token = getGithubToken();
  const includeViewer = !!token;

  const query = `
    query($username: String!, $from: DateTime!, $to: DateTime!, $includeViewer: Boolean!) {
      viewer @include(if: $includeViewer) {
        name
        login
        avatarUrl(size: 160)
        followers {
          totalCount
        }
        repositories {
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
              isPrivate
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
      user(login: $username) {
        name
        login
        avatarUrl(size: 160)
        followers {
          totalCount
        }
        repositories {
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
              isPrivate
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
          includeViewer,
        },
      }),
      cacheTTL: hasCustomGithubToken() ? 300000 : 600000, // 5 min for PAT, 10 min for public
      persist: !hasCustomGithubToken(), // Do not persist PAT response permanently in localStorage
      revalidate: hasCustomGithubToken(), // Force revalidation when PAT is active
    });
  } catch (err: any) {
    if (err.status === 403 || err.status === 401) {
      throw new Error(
        "GitHub API access error. Please check your Personal Access Token (PAT) via Access Token button in header.",
      );
    }
    throw err;
  }

  const payload = response;
  if (payload.errors?.length) throw new Error(payload.errors[0].message);

  const viewer = payload.data?.viewer;
  const user = payload.data?.user;

  if (
    viewer &&
    (viewer.login.toLowerCase() === username.toLowerCase() ||
      (!user && includeViewer))
  ) {
    return viewer as GithubUserData;
  }

  if (!user) throw new Error("GitHub user not found.");
  return user as GithubUserData;
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
  const token = getGithubToken();

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
  pushedAt?: string;
  commitsPast3Months?: number;
  conScore?: number;
  releases: { totalCount: number };
  createdAt: string;
  updatedAt: string;
  owner: {
    login: string;
    avatarUrl: string;
  };
}

export function calculateConScore(repo: {
  stargazerCount: number;
  forkCount: number;
  defaultBranchRef?: { target?: { history?: { totalCount: number } } } | null;
  commitsPast3Months?: number;
  pushedAt?: string;
  updatedAt?: string;
}) {
  const stars = repo.stargazerCount || 0;
  const forks = repo.forkCount || 0;
  const totalCommits = repo.defaultBranchRef?.target?.history?.totalCount || 0;
  const recentCommits = repo.commitsPast3Months || 0;
  const lastActiveTs = new Date(
    repo.pushedAt || repo.updatedAt || Date.now(),
  ).getTime();
  const diffMs = Math.max(0, Date.now() - lastActiveTs);
  const daysSinceLastActive = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return stars + forks + totalCommits + recentCommits - daysSinceLastActive;
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
        pushedAt
        createdAt
        updatedAt
        owner {
          login
          avatarUrl(size: 160)
        }
      }
    }
  `;

  const token = getGithubToken();
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
        "GitHub API access error. If this is a private repository, please click 'Access Token' in the header to add your GitHub Personal Access Token.",
      );
    }
    throw err;
  }

  const payload = response;
  if (payload.errors?.length) {
    const msg = payload.errors[0].message;
    if (msg.includes("Could not resolve to a Repository")) {
      throw new Error(
        `Repository "${owner}/${name}" was not found or is private. If you have access, add your Personal Access Token (PAT) using the Access Token button in the header.`,
      );
    }
    throw new Error(msg);
  }
  if (!payload.data?.repository)
    throw new Error(`Repository "${owner}/${name}" not found on GitHub.`);

  const repoObj = payload.data.repository;

  // Fetch past 3 months commits for Conscore
  let commitsPast3Months = 0;
  try {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    const sinceISO = threeMonthsAgo.toISOString();
    const resRecent = await fetch(
      `https://api.github.com/repos/${owner}/${name}/commits?since=${sinceISO}&per_page=1`,
      {
        headers: {
          "User-Agent": "Gitcon",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      },
    );
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
  } catch (e) {
    commitsPast3Months = 0;
  }

  repoObj.commitsPast3Months = commitsPast3Months;
  repoObj.conScore = calculateConScore(repoObj);

  return repoObj as GithubRepoData;
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
  score?: number;
}

export async function fetchRepoContributors(
  owner: string,
  name: string,
  limit = 15,
): Promise<RepoContributor[]> {
  const token = getGithubToken();
  try {
    // 1. Fetch main contributors list
    const res = await revineFetch(
      `https://api.github.com/repos/${owner}/${name}/contributors?per_page=${limit}`,
      {
        headers: {
          "User-Agent": "Gitcon",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        cacheTTL: 1800000,
        persist: true,
      },
    );
    if (!Array.isArray(res)) return [];

    // 2. Fetch repo stats/contributors for exact additions & deletions on THIS repo
    let statsData: any[] = [];

    for (let attempt = 0; attempt < 6; attempt++) {
      try {
        const statsRes = await fetch(
          `https://api.github.com/repos/${owner}/${name}/stats/contributors`,
          {
            headers: {
              "User-Agent": "Gitcon",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          },
        );
        if (statsRes.status === 200) {
          const json = await statsRes.json();
          if (Array.isArray(json) && json.length > 0) {
            statsData = json;
            break;
          }
        }
      } catch (e) {}
      if (attempt < 5) {
        await new Promise((r) => setTimeout(r, 1000));
      }
    }

    const statsMap = new Map<
      string,
      { a: number; d: number; c: number; weeksCount: number }
    >();
    if (Array.isArray(statsData)) {
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
    }

    // 3. Fetch repo git tree to determine total unique files in repository
    let totalRepoFiles = 0;
    try {
      const treeData = await revineFetch(
        `https://api.github.com/repos/${owner}/${name}/git/trees/HEAD?recursive=1`,
        {
          headers: {
            "User-Agent": "Gitcon",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          cacheTTL: 3600000,
          persist: true,
        },
      );
      if (Array.isArray(treeData?.tree)) {
        totalRepoFiles = treeData.tree.filter(
          (item: any) => item.type === "blob",
        ).length;
      }
    } catch (e) {}

    const enriched = await Promise.all(
      res.map(async (c: any) => {
        let name = c.login;
        try {
          const uDetail = await revineFetch(
            `https://api.github.com/users/${c.login}`,
            {
              headers: {
                "User-Agent": "Gitcon",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
              cacheTTL: 3600000,
              persist: true,
            },
          );
          if (uDetail?.name) name = uDetail.name;
        } catch (e) {}

        const stat = statsMap.get(c.login.toLowerCase());
        const totalCommits = c.contributions || 0;

        const additions = stat ? stat.a : totalCommits * 110;
        const deletions = stat ? stat.d : Math.round(totalCommits * 45);
        const totalBytes = (additions + deletions) * 45;

        // Fetch unique files touched from user's commits
        let uniqueFilesTouched = 0;
        try {
          const userCommits = await revineFetch(
            `https://api.github.com/repos/${owner}/${name}/commits?author=${c.login}&per_page=25`,
            {
              headers: {
                "User-Agent": "Gitcon",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
              cacheTTL: 1800000,
              persist: true,
            },
          );

          if (Array.isArray(userCommits) && userCommits.length > 0) {
            const uniqueFilesSet = new Set<string>();
            const commitsToInspect = userCommits.slice(0, 15);
            const commitDetails = await Promise.all(
              commitsToInspect.map(async (commitItem: any) => {
                try {
                  return await revineFetch(
                    `https://api.github.com/repos/${owner}/${name}/commits/${commitItem.sha}`,
                    {
                      headers: {
                        "User-Agent": "Gitcon",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                      },
                      cacheTTL: 3600000,
                      persist: true,
                    },
                  );
                } catch (e) {
                  return null;
                }
              }),
            );

            commitDetails.forEach((detail: any) => {
              if (Array.isArray(detail?.files)) {
                detail.files.forEach((f: any) => {
                  if (f.filename) uniqueFilesSet.add(f.filename);
                });
              }
            });

            if (uniqueFilesSet.size > 0) {
              uniqueFilesTouched = uniqueFilesSet.size;
            }
          }
        } catch (e) {}

        let filesTouchedApprox = uniqueFilesTouched;
        if (!filesTouchedApprox) {
          filesTouchedApprox = stat
            ? Math.max(1, Math.round(stat.c * 1.5 + (additions + deletions) / 300))
            : Math.max(1, totalCommits);
        }

        // Enforce hard upper bound: can never exceed total unique files in repository
        if (totalRepoFiles > 0) {
          filesTouchedApprox = Math.min(filesTouchedApprox, totalRepoFiles);
        }

        // Code impact score incorporating contribution size (bytes/KB) + commits + additions + deletions + files touched
        const score =
          totalCommits * 10 +
          Math.round(totalBytes / 1024) +
          additions +
          deletions +
          filesTouchedApprox;

        return {
          ...c,
          name,
          additions,
          deletions,
          netChanges: additions - deletions,
          filesTouchedApprox,
          score,
        };
      }),
    );

    return enriched.sort((a, b) => (b.score || 0) - (a.score || 0));
  } catch (err) {
    console.error("Failed to fetch repo contributors:", err);
    return [];
  }
}

export interface UserSearchResult {
  total_count: number;
  items: Array<{
    id: number;
    login: string;
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
  const token = getGithubToken();
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

  const detailedItems = await Promise.all(
    rawData.items.map(async (user) => {
      try {
        const uDetail = await revineFetch(
          `https://api.github.com/users/${user.login}`,
          {
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            cacheTTL: 3600000, // 1 hr cache
            persist: true,
          },
        );
        return {
          ...user,
          name: uDetail.name || user.login,
          followers: uDetail.followers || 0,
          public_repos: uDetail.public_repos || 0,
          bio: uDetail.bio || null,
        };
      } catch (err) {
        return user;
      }
    }),
  );

  return {
    ...rawData,
    items: detailedItems,
  };
}

export async function searchGithubRepos(
  query: string,
  page = 1,
  perPage = 10,
): Promise<RepoSearchResult> {
  const token = getGithubToken();
  const encodedQuery = encodeURIComponent(query);
  try {
    const response = (await revineFetch(
      `https://api.github.com/search/repositories?q=${encodedQuery}&page=${page}&per_page=${perPage}`,
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        cacheTTL: 300000, // 5 min cache
        persist: true,
      },
    )) as RepoSearchResult;

    let items = response?.items || [];

    // GitHub Search API does not index private repos.
    // If authenticated with a PAT, query user's accessible repos and filter by query match
    if (token) {
      try {
        const userReposData = await revineFetch(
          `https://api.github.com/user/repos?per_page=100&sort=updated`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cacheTTL: 600000,
            persist: true,
          },
        );
        if (Array.isArray(userReposData)) {
          const qLower = query.toLowerCase().trim();
          const matchingPrivate = userReposData.filter(
            (r: any) =>
              r.full_name.toLowerCase().includes(qLower) ||
              r.name.toLowerCase().includes(qLower) ||
              (r.description && r.description.toLowerCase().includes(qLower)),
          );

          // Merge matching user repos at top if not already present
          const existingIds = new Set(items.map((i) => i.id));
          const newItems = matchingPrivate.filter(
            (r: any) => !existingIds.has(r.id),
          );
          items = [...newItems, ...items];
        }
      } catch (e) {}
    }

    return {
      total_count: items.length,
      items: items.slice((page - 1) * perPage, page * perPage),
    };
  } catch (err) {
    return {
      total_count: 0,
      items: [],
    };
  }
}

export async function fetchTopStarredRepos(
  count = 6,
): Promise<RepoSearchResult> {
  const token = getGithubToken();
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
  const token = getGithubToken();
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
  org: string,
  count = 6,
): Promise<RepoSearchResult> {
  const token = getGithubToken();
  let rawRepos: any[] = [];
  try {
    const data = await revineFetch(
      `https://api.github.com/users/${org}/repos?type=all&per_page=100`,
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        cacheTTL: 1800000, // 30 min cache
        persist: true,
      },
    );
    rawRepos = Array.isArray(data) ? data : data.items || [];
  } catch (err) {
    try {
      const data = await revineFetch(
        `https://api.github.com/orgs/${org}/repos?type=all&per_page=100`,
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          cacheTTL: 1800000, // 30 min cache
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
        const lastActiveTimestamp = new Date(
          repo.pushed_at || repo.updated_at || Date.now(),
        ).getTime();
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

export const GITHUB_LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Go: "#00ADD8",
  Rust: "#dea584",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  PHP: "#4F5D95",
  Ruby: "#701516",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Shell: "#89e051",
  Dart: "#00B4AB",
  Kotlin: "#A97BFF",
  Swift: "#F05138",
  Scala: "#c22d40",
  Elixir: "#6e4a7e",
  Haskell: "#5e5086",
  Lua: "#000080",
  R: "#198CE7",
  Zig: "#ec915c",
};

export function getLangColor(lang: string, fallback = "#38bdf8"): string {
  return GITHUB_LANG_COLORS[lang] || fallback;
}

export interface UserPrivateRepo {
  name: string;
  owner: string;
  count: number;
  isPrivate: boolean;
  language: string | null;
  languages?: Array<{ name: string; size: number; color: string }>;
}

export async function fetchUserPrivateRepos(
  username: string,
  token: string,
  sinceDate?: string,
): Promise<UserPrivateRepo[]> {
  if (!token) return [];
  try {
    const allRepos: any[] = [];
    let page = 1;
    while (page <= 5) {
      const res = await revineFetch(
        `https://api.github.com/user/repos?per_page=100&sort=updated&type=all&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cacheTTL: 300000,
          persist: true,
        },
      );

      if (!Array.isArray(res) || res.length === 0) break;
      allRepos.push(...res);
      if (res.length < 100) break;
      page++;
    }

    if (allRepos.length === 0) return [];

    const sinceParam = sinceDate ? `&since=${encodeURIComponent(sinceDate)}` : "";

    const enriched = await Promise.all(
      allRepos.map(async (repo: any) => {
        let count = 0;
        try {
          const resCommits = await fetch(
            `https://api.github.com/repos/${repo.owner.login}/${repo.name}/commits?author=${username}${sinceParam}&per_page=1`,
            {
              headers: {
                "User-Agent": "Gitcon",
                Authorization: `Bearer ${token}`,
              },
            },
          );
          if (resCommits.ok) {
            const link = resCommits.headers.get("link");
            if (link) {
              const match = link.match(/page=(\d+)>; rel="last"/);
              count = match ? parseInt(match[1], 10) : 1;
            } else {
              const body = await resCommits.json();
              count = Array.isArray(body) ? body.length : 0;
            }
          }
        } catch (e) {}

        let languagesArr: Array<{ name: string; size: number; color: string }> =
          [];
        try {
          const resLangs = await revineFetch(
            `https://api.github.com/repos/${repo.owner.login}/${repo.name}/languages`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              cacheTTL: 3600000,
              persist: true,
            },
          );
          if (
            resLangs &&
            typeof resLangs === "object" &&
            !Array.isArray(resLangs)
          ) {
            languagesArr = Object.entries(resLangs).map(([langName, size]) => ({
              name: langName,
              size: Number(size) || 0,
              color: getLangColor(langName),
            }));
          }
        } catch (e) {}

        return {
          name: repo.name,
          owner: repo.owner.login,
          count,
          isPrivate: repo.private || false,
          language: repo.language || null,
          languages: languagesArr,
        };
      }),
    );

    return enriched.filter((r) => r.count > 0);
  } catch (err) {
    console.error("Failed to fetch user accessible repos:", err);
    return [];
  }
}

