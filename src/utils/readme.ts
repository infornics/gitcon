import { getGithubToken, hasCustomGithubToken } from "./github";
import { generateExtendedTemplate } from "./templateGenerators";

export type ReadmeTemplate = string;

export interface SkillItem {
  id: string;
  name: string;
  category: "languages" | "frontend" | "backend" | "databases" | "devops" | "tools";
  badge: {
    label: string;
    color: string;
    logo: string;
    logoColor?: string;
  };
  skillIcon?: string;
}

export interface ReadmeRepo {
  name: string;
  owner: string;
  description: string;
  url: string;
  stars: number;
  forks: number;
  language: string;
  selected?: boolean;
}

export interface ReadmeProfileData {
  username: string;
  name: string;
  avatarUrl: string;
  avatarBase64?: string;
  bio: string;
  company: string;
  location: string;
  website: string;
  twitter: string;
  followers: number;
  following: number;
  publicRepos: number;
  topLanguages: Array<{ name: string; color: string; percent: number }>;
  topRepositories: ReadmeRepo[];
  contributionsStats: {
    totalContributions: number;
    currentStreak: number;
    longestStreak: number;
    dailyAverage: number;
  };
}

export interface ReadmeConfig {
  template: ReadmeTemplate;
  animeVariant?: "boy" | "girl";
  potterHouse?: "gryffindor" | "slytherin" | "ravenclaw" | "hufflepuff";
  statsTheme: string;
  header: {
    greeting: string;
    name: string;
    title: string;
    align: "left" | "center";
    showAvatar: boolean;
    typingEffect: boolean;
    typingLines: string[];
  };
  aboutMe: {
    show: boolean;
    bio: string;
    workingOn: string;
    workingOnUrl: string;
    learning: string;
    collaborateOn: string;
    askMeAbout: string;
    reachMe: string;
    funFact: string;
  };
  skills: {
    show: boolean;
    badgeStyle: "shields" | "skillicons";
    selectedSkills: string[];
  };
  githubStats: {
    showStatsCard: boolean;
    showStreakCard: boolean;
    showTopLangsCard: boolean;
    showGitconBadge: boolean;
    showTrophies: boolean;
    showActivityGraph: boolean;
  };
  featuredRepos: {
    show: boolean;
    repos: ReadmeRepo[];
  };
  socials: {
    show: boolean;
    github: string;
    linkedin: string;
    twitter: string;
    portfolio: string;
    email: string;
    devto: string;
    youtube: string;
    discord: string;
  };
  extras: {
    showVisitorBadge: boolean;
    showRandomQuote: boolean;
  };
}

export interface StatsThemeItem {
  id: string;
  name: string;
  bg: string;
  accent: string;
  text: string;
  border?: boolean;
}

export const STATS_THEMES: StatsThemeItem[] = [
  { id: "dark", name: "Dark", bg: "#0d1117", accent: "#58aab0", text: "#c9d1d9" },
  { id: "tokyonight", name: "Tokyo Night", bg: "#1a1b26", accent: "#7aa2f7", text: "#a9b1d6" },
  { id: "dracula", name: "Dracula", bg: "#282a36", accent: "#ff79c6", text: "#f8f8f2" },
  { id: "radical", name: "Radical", bg: "#141321", accent: "#fe428e", text: "#a9fef7" },
  { id: "onedark", name: "One Dark", bg: "#282c34", accent: "#61afef", text: "#abb2bf" },
  { id: "synthwave", name: "Synthwave", bg: "#2b213a", accent: "#ff7edb", text: "#fede5d" },
  { id: "github_dark", name: "GitHub Dark", bg: "#0d1117", accent: "#58a6ff", text: "#f0f6fc" },
  { id: "nightowl", name: "Night Owl", bg: "#011627", accent: "#c792ea", text: "#d6deeb" },
  { id: "merko", name: "Merko", bg: "#0a0f0d", accent: "#abd200", text: "#68b587" },
  { id: "gruvbox", name: "Gruvbox", bg: "#282828", accent: "#fe8019", text: "#ebdbb2" },
  { id: "catppuccin_mocha", name: "Catppuccin", bg: "#1e1e2e", accent: "#cba6f7", text: "#cdd6f4" },
  { id: "transparent", name: "Transparent", bg: "rgba(255,255,255,0.05)", accent: "#58aab0", text: "#e3e0d9", border: true },
];

export const SKILLS_CATALOG: SkillItem[] = [
  // Languages
  { id: "typescript", name: "TypeScript", category: "languages", badge: { label: "TypeScript", color: "3178C6", logo: "typescript", logoColor: "white" }, skillIcon: "ts" },
  { id: "javascript", name: "JavaScript", category: "languages", badge: { label: "JavaScript", color: "F7DF1E", logo: "javascript", logoColor: "black" }, skillIcon: "js" },
  { id: "python", name: "Python", category: "languages", badge: { label: "Python", color: "3776AB", logo: "python", logoColor: "white" }, skillIcon: "py" },
  { id: "rust", name: "Rust", category: "languages", badge: { label: "Rust", color: "000000", logo: "rust", logoColor: "white" }, skillIcon: "rust" },
  { id: "go", name: "Go", category: "languages", badge: { label: "Go", color: "00ADD8", logo: "go", logoColor: "white" }, skillIcon: "go" },
  { id: "java", name: "Java", category: "languages", badge: { label: "Java", color: "ED8B00", logo: "openjdk", logoColor: "white" }, skillIcon: "java" },
  { id: "cpp", name: "C++", category: "languages", badge: { label: "C++", color: "00599C", logo: "cplusplus", logoColor: "white" }, skillIcon: "cpp" },
  { id: "csharp", name: "C#", category: "languages", badge: { label: "C#", color: "239120", logo: "csharp", logoColor: "white" }, skillIcon: "cs" },
  { id: "php", name: "PHP", category: "languages", badge: { label: "PHP", color: "777BB4", logo: "php", logoColor: "white" }, skillIcon: "php" },
  { id: "ruby", name: "Ruby", category: "languages", badge: { label: "Ruby", color: "CC342D", logo: "ruby", logoColor: "white" }, skillIcon: "ruby" },
  { id: "swift", name: "Swift", category: "languages", badge: { label: "Swift", color: "F05138", logo: "swift", logoColor: "white" }, skillIcon: "swift" },
  { id: "kotlin", name: "Kotlin", category: "languages", badge: { label: "Kotlin", color: "7F52FF", logo: "kotlin", logoColor: "white" }, skillIcon: "kotlin" },
  { id: "dart", name: "Dart", category: "languages", badge: { label: "Dart", color: "0175C2", logo: "dart", logoColor: "white" }, skillIcon: "dart" },
  { id: "html5", name: "HTML5", category: "languages", badge: { label: "HTML5", color: "E34F26", logo: "html5", logoColor: "white" }, skillIcon: "html" },
  { id: "css3", name: "CSS3", category: "languages", badge: { label: "CSS3", color: "1572B6", logo: "css3", logoColor: "white" }, skillIcon: "css" },
  { id: "bash", name: "Bash", category: "languages", badge: { label: "Bash", color: "4EAA25", logo: "gnubash", logoColor: "white" }, skillIcon: "bash" },

  // Frontend
  { id: "react", name: "React", category: "frontend", badge: { label: "React", color: "20232A", logo: "react", logoColor: "61DAFB" }, skillIcon: "react" },
  { id: "nextjs", name: "Next.js", category: "frontend", badge: { label: "Next.js", color: "000000", logo: "nextdotjs", logoColor: "white" }, skillIcon: "nextjs" },
  { id: "vuejs", name: "Vue.js", category: "frontend", badge: { label: "Vue.js", color: "4FC08D", logo: "vuedotjs", logoColor: "white" }, skillIcon: "vue" },
  { id: "svelte", name: "Svelte", category: "frontend", badge: { label: "Svelte", color: "FF3E00", logo: "svelte", logoColor: "white" }, skillIcon: "svelte" },
  { id: "angular", name: "Angular", category: "frontend", badge: { label: "Angular", color: "DD0031", logo: "angular", logoColor: "white" }, skillIcon: "angular" },
  { id: "tailwindcss", name: "Tailwind CSS", category: "frontend", badge: { label: "Tailwind_CSS", color: "38B2AC", logo: "tailwind-css", logoColor: "white" }, skillIcon: "tailwind" },
  { id: "redux", name: "Redux", category: "frontend", badge: { label: "Redux", color: "764ABC", logo: "redux", logoColor: "white" }, skillIcon: "redux" },
  { id: "vite", name: "Vite", category: "frontend", badge: { label: "Vite", color: "646CFF", logo: "vite", logoColor: "white" }, skillIcon: "vite" },
  { id: "sass", name: "Sass", category: "frontend", badge: { label: "Sass", color: "CC6699", logo: "sass", logoColor: "white" }, skillIcon: "sass" },
  { id: "bootstrap", name: "Bootstrap", category: "frontend", badge: { label: "Bootstrap", color: "7952B3", logo: "bootstrap", logoColor: "white" }, skillIcon: "bootstrap" },

  // Backend
  { id: "nodejs", name: "Node.js", category: "backend", badge: { label: "Node.js", color: "339933", logo: "nodedotjs", logoColor: "white" }, skillIcon: "nodejs" },
  { id: "express", name: "Express.js", category: "backend", badge: { label: "Express", color: "000000", logo: "express", logoColor: "white" }, skillIcon: "express" },
  { id: "nestjs", name: "NestJS", category: "backend", badge: { label: "NestJS", color: "E0234E", logo: "nestjs", logoColor: "white" }, skillIcon: "nestjs" },
  { id: "fastapi", name: "FastAPI", category: "backend", badge: { label: "FastAPI", color: "009688", logo: "fastapi", logoColor: "white" }, skillIcon: "fastapi" },
  { id: "django", name: "Django", category: "backend", badge: { label: "Django", color: "092E20", logo: "django", logoColor: "white" }, skillIcon: "django" },
  { id: "flask", name: "Flask", category: "backend", badge: { label: "Flask", color: "000000", logo: "flask", logoColor: "white" }, skillIcon: "flask" },
  { id: "graphql", name: "GraphQL", category: "backend", badge: { label: "GraphQL", color: "E10098", logo: "graphql", logoColor: "white" }, skillIcon: "graphql" },
  { id: "spring", name: "Spring Boot", category: "backend", badge: { label: "Spring_Boot", color: "6DB33F", logo: "spring", logoColor: "white" }, skillIcon: "spring" },

  // Databases
  { id: "postgresql", name: "PostgreSQL", category: "databases", badge: { label: "PostgreSQL", color: "4169E1", logo: "postgresql", logoColor: "white" }, skillIcon: "postgres" },
  { id: "mongodb", name: "MongoDB", category: "databases", badge: { label: "MongoDB", color: "47A248", logo: "mongodb", logoColor: "white" }, skillIcon: "mongodb" },
  { id: "mysql", name: "MySQL", category: "databases", badge: { label: "MySQL", color: "4479A1", logo: "mysql", logoColor: "white" }, skillIcon: "mysql" },
  { id: "redis", name: "Redis", category: "databases", badge: { label: "Redis", color: "DC382D", logo: "redis", logoColor: "white" }, skillIcon: "redis" },
  { id: "sqlite", name: "SQLite", category: "databases", badge: { label: "SQLite", color: "003B57", logo: "sqlite", logoColor: "white" }, skillIcon: "sqlite" },
  { id: "supabase", name: "Supabase", category: "databases", badge: { label: "Supabase", color: "3FCF8E", logo: "supabase", logoColor: "white" }, skillIcon: "supabase" },
  { id: "firebase", name: "Firebase", category: "databases", badge: { label: "Firebase", color: "FFCA28", logo: "firebase", logoColor: "black" }, skillIcon: "firebase" },
  { id: "prisma", name: "Prisma", category: "databases", badge: { label: "Prisma", color: "2D3748", logo: "prisma", logoColor: "white" }, skillIcon: "prisma" },

  // DevOps & Cloud
  { id: "docker", name: "Docker", category: "devops", badge: { label: "Docker", color: "2496ED", logo: "docker", logoColor: "white" }, skillIcon: "docker" },
  { id: "kubernetes", name: "Kubernetes", category: "devops", badge: { label: "Kubernetes", color: "326CE5", logo: "kubernetes", logoColor: "white" }, skillIcon: "kubernetes" },
  { id: "aws", name: "AWS", category: "devops", badge: { label: "AWS", color: "232F3E", logo: "amazonwebservices", logoColor: "white" }, skillIcon: "aws" },
  { id: "gcp", name: "Google Cloud", category: "devops", badge: { label: "Google_Cloud", color: "4285F4", logo: "googlecloud", logoColor: "white" }, skillIcon: "gcp" },
  { id: "azure", name: "Azure", category: "devops", badge: { label: "Microsoft_Azure", color: "0078D4", logo: "microsoftazure", logoColor: "white" }, skillIcon: "azure" },
  { id: "linux", name: "Linux", category: "devops", badge: { label: "Linux", color: "FCC624", logo: "linux", logoColor: "black" }, skillIcon: "linux" },
  { id: "githubactions", name: "GitHub Actions", category: "devops", badge: { label: "GitHub_Actions", color: "2088FF", logo: "githubactions", logoColor: "white" }, skillIcon: "githubactions" },
  { id: "vercel", name: "Vercel", category: "devops", badge: { label: "Vercel", color: "000000", logo: "vercel", logoColor: "white" }, skillIcon: "vercel" },
  { id: "terraform", name: "Terraform", category: "devops", badge: { label: "Terraform", color: "7B42BC", logo: "terraform", logoColor: "white" }, skillIcon: "terraform" },
  { id: "nginx", name: "Nginx", category: "devops", badge: { label: "Nginx", color: "009639", logo: "nginx", logoColor: "white" }, skillIcon: "nginx" },

  // Tools
  { id: "git", name: "Git", category: "tools", badge: { label: "Git", color: "F05032", logo: "git", logoColor: "white" }, skillIcon: "git" },
  { id: "github", name: "GitHub", category: "tools", badge: { label: "GitHub", color: "181717", logo: "github", logoColor: "white" }, skillIcon: "github" },
  { id: "vscode", name: "VS Code", category: "tools", badge: { label: "VS_Code", color: "007ACC", logo: "visualstudiocode", logoColor: "white" }, skillIcon: "vscode" },
  { id: "postman", name: "Postman", category: "tools", badge: { label: "Postman", color: "FF6C37", logo: "postman", logoColor: "white" }, skillIcon: "postman" },
  { id: "figma", name: "Figma", category: "tools", badge: { label: "Figma", color: "F24E1E", logo: "figma", logoColor: "white" }, skillIcon: "figma" },
  { id: "jest", name: "Jest", category: "tools", badge: { label: "Jest", color: "C21325", logo: "jest", logoColor: "white" }, skillIcon: "jest" },
];

/**
 * Fetch profile data for the README generator.
 * Uses GraphQL if available/authenticated, with graceful fallback to GitHub REST API.
 */
export async function fetchReadmeData(username: string): Promise<ReadmeProfileData> {
  const token = getGithubToken();

  // Helper to safely fetch and convert GitHub avatar to base64 data URI
  // This allows SVGs to embed the user's real GitHub DP without browser CORS blocks
  async function fetchAvatarBase64(url: string): Promise<string | undefined> {
    if (!url) return undefined;
    try {
      const res = await fetch(url);
      if (!res.ok) return undefined;
      const blob = await res.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => resolve(undefined);
        reader.readAsDataURL(blob);
      });
    } catch {
      return undefined;
    }
  }

  // Try GraphQL first
  if (token) {
    try {
      const query = `
        query($login: String!) {
          user(login: $login) {
            name
            login
            bio
            company
            location
            websiteUrl
            twitterUsername
            avatarUrl(size: 200)
            createdAt
            followers { totalCount }
            following { totalCount }
            repositories(first: 10, orderBy: {field: STARGAZERS, direction: DESC}, isFork: false, privacy: PUBLIC) {
              totalCount
              nodes {
                name
                description
                url
                stargazerCount
                forkCount
                primaryLanguage { name color }
                languages(first: 5, orderBy: {field: SIZE, direction: DESC}) {
                  edges {
                    size
                    node { name color }
                  }
                }
              }
            }
            contributionsCollection {
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    contributionCount
                    date
                  }
                }
              }
            }
          }
        }
      `;

      const res = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query, variables: { login: username } }),
      });

      const json = await res.json();
      if (!json.errors && json.data?.user) {
        const u = json.data.user;
        const reposNodes = u.repositories?.nodes || [];

        // Aggregate languages
        const langMap = new Map<string, { size: number; color: string }>();
        let totalLangSize = 0;
        reposNodes.forEach((repo: any) => {
          if (repo.languages?.edges) {
            repo.languages.edges.forEach((edge: any) => {
              const name = edge.node.name;
              const size = edge.size;
              const color = edge.node.color || "#58aab0";
              totalLangSize += size;
              const existing = langMap.get(name);
              if (existing) {
                existing.size += size;
              } else {
                langMap.set(name, { size, color });
              }
            });
          }
        });

        const topLanguages = Array.from(langMap.entries())
          .sort((a, b) => b[1].size - a[1].size)
          .map(([name, val]) => ({
            name,
            color: val.color,
            percent: totalLangSize > 0 ? Math.round((val.size / totalLangSize) * 100) : 0,
          }));

        // Compute streak & contributions
        const calendar = u.contributionsCollection?.contributionCalendar;
        const totalContributions = calendar?.totalContributions || 0;
        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;

        const allDays: Array<{ date: string; count: number }> = [];
        calendar?.weeks?.forEach((w: any) => {
          w.contributionDays?.forEach((d: any) => {
            allDays.push({ date: d.date, count: d.contributionCount });
          });
        });

        allDays.forEach((d) => {
          if (d.count > 0) {
            tempStreak++;
            if (tempStreak > longestStreak) longestStreak = tempStreak;
          } else {
            tempStreak = 0;
          }
        });

        for (let i = allDays.length - 1; i >= 0; i--) {
          if (allDays[i].count > 0) {
            currentStreak++;
          } else if (i === allDays.length - 1) {
            // maybe today hasn't happened yet, check yesterday
            continue;
          } else {
            break;
          }
        }

        const dailyAverage = allDays.length > 0 ? totalContributions / allDays.length : 0;

        const topRepositories: ReadmeRepo[] = reposNodes.map((r: any) => ({
          name: r.name,
          owner: u.login,
          description: r.description || "",
          url: r.url,
          stars: r.stargazerCount || 0,
          forks: r.forkCount || 0,
          language: r.primaryLanguage?.name || "",
          selected: true,
        }));

        const avatarBase64 = await fetchAvatarBase64(u.avatarUrl || `https://avatars.githubusercontent.com/${username}?s=140`);

        return {
          username: u.login,
          name: u.name || u.login,
          avatarUrl: u.avatarUrl || "",
          avatarBase64,
          bio: u.bio || "",
          company: u.company || "",
          location: u.location || "",
          website: u.websiteUrl || "",
          twitter: u.twitterUsername || "",
          followers: u.followers?.totalCount || 0,
          following: u.following?.totalCount || 0,
          publicRepos: u.repositories?.totalCount || 0,
          topLanguages,
          topRepositories,
          contributionsStats: {
            totalContributions,
            currentStreak,
            longestStreak,
            dailyAverage,
          },
        };
      }
    } catch (e) {
      console.warn("GraphQL profile query failed, trying REST fallback:", e);
    }
  }

  // REST API fallback
  const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!userRes.ok) {
    if (userRes.status === 404) throw new Error(`GitHub user "${username}" was not found.`);
    throw new Error(`Failed to fetch GitHub profile for "${username}" (HTTP ${userRes.status}).`);
  }

  const u = await userRes.json();

  let reposData: any[] = [];
  try {
    const reposRes = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=stars&per_page=8`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );
    if (reposRes.ok) {
      reposData = await reposRes.json();
    }
  } catch (e) {}

  const topRepositories: ReadmeRepo[] = (Array.isArray(reposData) ? reposData : [])
    .filter((r) => !r.fork)
    .slice(0, 6)
    .map((r) => ({
      name: r.name,
      owner: r.owner?.login || u.login,
      description: r.description || "",
      url: r.html_url,
      stars: r.stargazers_count || 0,
      forks: r.forks_count || 0,
      language: r.language || "",
      selected: true,
    }));

  const langCountMap: Record<string, number> = {};
  topRepositories.forEach((r) => {
    if (r.language) {
      langCountMap[r.language] = (langCountMap[r.language] || 0) + 1;
    }
  });

  const topLanguages = Object.entries(langCountMap)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({
      name,
      color: "#58aab0",
      percent: Math.round((count / Math.max(topRepositories.length, 1)) * 100),
    }));

  const avatarBase64 = await fetchAvatarBase64(u.avatar_url || `https://avatars.githubusercontent.com/${username}?s=140`);

  return {
    username: u.login,
    name: u.name || u.login,
    avatarUrl: u.avatar_url || "",
    avatarBase64,
    bio: u.bio || "",
    company: u.company || "",
    location: u.location || "",
    website: u.blog || "",
    twitter: u.twitter_username || "",
    followers: u.followers || 0,
    following: u.following || 0,
    publicRepos: u.public_repos || 0,
    topLanguages,
    topRepositories,
    contributionsStats: {
      totalContributions: 0,
      currentStreak: 0,
      longestStreak: 0,
      dailyAverage: 0,
    },
  };
}

/**
 * Build initial default configuration based on fetched profile data.
 */
export function buildDefaultConfig(profile: ReadmeProfileData): ReadmeConfig {
  // Auto-detect skills matching user's top languages and repos
  const detectedSkillIds: string[] = [];
  const lowerLangs = profile.topLanguages.map((l) => l.name.toLowerCase());

  SKILLS_CATALOG.forEach((skill) => {
    const sName = skill.name.toLowerCase();
    const sId = skill.id.toLowerCase();
    if (
      lowerLangs.some(
        (l) => l === sName || l === sId || sName.includes(l) || l.includes(sName)
      )
    ) {
      detectedSkillIds.push(skill.id);
    }
  });

  // If none detected, add sensible defaults
  if (detectedSkillIds.length === 0) {
    detectedSkillIds.push("typescript", "javascript", "react", "nodejs", "python", "git");
  }

  const role = profile.bio ? profile.bio.split("\n")[0].slice(0, 60) : "Software Developer & Open Source Contributor";

  return {
    template: "modern",
    animeVariant: "boy",
    potterHouse: "gryffindor",
    statsTheme: "dark",
    header: {
      greeting: "Hi there 👋, I'm",
      name: profile.name || profile.username,
      title: role,
      align: "center",
      showAvatar: false,
      typingEffect: true,
      typingLines: [
        "Passionate Full Stack Developer 🚀",
        "Open Source Contributor & Builder 💻",
        "Exploring Modern Systems & AI ⚡",
      ],
    },
    aboutMe: {
      show: true,
      bio: profile.bio || "Crafting performant web experiences, open-source software, and developer tools.",
      workingOn: profile.topRepositories[0]?.name
        ? `${profile.topRepositories[0].name}`
        : "Innovative software projects",
      workingOnUrl: profile.topRepositories[0]?.url || "",
      learning: "Distributed systems, performance engineering, and AI pipelines",
      collaborateOn: "Exciting open-source initiatives and developer tooling",
      askMeAbout: profile.topLanguages.slice(0, 3).map((l) => l.name).join(", ") || "TypeScript, React, Node.js",
      reachMe: profile.website || `twitter.com/${profile.twitter || profile.username}`,
      funFact: "I turn coffee and tea into clean code ☕",
    },
    skills: {
      show: true,
      badgeStyle: "shields",
      selectedSkills: Array.from(new Set(detectedSkillIds)),
    },
    githubStats: {
      showStatsCard: true,
      showStreakCard: true,
      showTopLangsCard: true,
      showGitconBadge: true,
      showTrophies: false,
      showActivityGraph: false,
    },
    featuredRepos: {
      show: profile.topRepositories.length > 0,
      repos: profile.topRepositories,
    },
    socials: {
      show: true,
      github: profile.username,
      linkedin: profile.username,
      twitter: profile.twitter || "",
      portfolio: profile.website || "",
      email: "",
      devto: "",
      youtube: "",
      discord: "",
    },
    extras: {
      showVisitorBadge: true,
      showRandomQuote: false,
    },
  };
}

/**
 * Generate Shields.io or SkillIcons markdown for selected skills.
 */
export function renderSkillsMarkdown(
  selectedIds: string[],
  badgeStyle: "shields" | "skillicons",
  align: "left" | "center" = "center"
): string {
  if (selectedIds.length === 0) return "";

  if (badgeStyle === "skillicons") {
    const iconKeys = selectedIds
      .map((id) => {
        const item = SKILLS_CATALOG.find((s) => s.id === id);
        return item?.skillIcon || id;
      })
      .filter(Boolean);
    const alignTag = align === "center" ? ' align="center"' : "";
    return `<p${alignTag}>\n  <a href="https://skillicons.dev">\n    <img src="https://skillicons.dev/icons?i=${iconKeys.join(",")}" alt="My Skills" />\n  </a>\n</p>`;
  }

  // Shields.io style grouped or in paragraphs
  const badges = selectedIds
    .map((id) => {
      const item = SKILLS_CATALOG.find((s) => s.id === id);
      if (!item) return "";
      const logoColor = item.badge.logoColor || "white";
      return `<img src="https://img.shields.io/badge/${encodeURIComponent(item.badge.label)}-${item.badge.color}?style=for-the-badge&logo=${item.badge.logo}&logoColor=${logoColor}" alt="${item.name}" />`;
    })
    .filter(Boolean);

  const alignTag = align === "center" ? ' align="center"' : "";
  return `<p${alignTag}>\n  ${badges.join("\n  ")}\n</p>`;
}

/**
 * Generate social badges markdown.
 */
export function renderSocialsMarkdown(
  socials: ReadmeConfig["socials"],
  align: "left" | "center" = "center"
): string {
  if (!socials.show) return "";

  const badges: string[] = [];

  if (socials.github) {
    badges.push(
      `<a href="https://github.com/${socials.github}" target="_blank">\n    <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />\n  </a>`
    );
  }
  if (socials.linkedin) {
    const url = socials.linkedin.startsWith("http")
      ? socials.linkedin
      : `https://linkedin.com/in/${socials.linkedin}`;
    badges.push(
      `<a href="${url}" target="_blank">\n    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />\n  </a>`
    );
  }
  if (socials.twitter) {
    const handle = socials.twitter.replace(/^@/, "");
    badges.push(
      `<a href="https://twitter.com/${handle}" target="_blank">\n    <img src="https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white" alt="Twitter" />\n  </a>`
    );
  }
  if (socials.portfolio) {
    const url = socials.portfolio.startsWith("http") ? socials.portfolio : `https://${socials.portfolio}`;
    badges.push(
      `<a href="${url}" target="_blank">\n    <img src="https://img.shields.io/badge/Portfolio-58aab0?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Portfolio" />\n  </a>`
    );
  }
  if (socials.email) {
    badges.push(
      `<a href="mailto:${socials.email}" target="_blank">\n    <img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email" />\n  </a>`
    );
  }
  if (socials.devto) {
    badges.push(
      `<a href="https://dev.to/${socials.devto}" target="_blank">\n    <img src="https://img.shields.io/badge/dev.to-0A0A0A?style=for-the-badge&logo=devdotto&logoColor=white" alt="Dev.to" />\n  </a>`
    );
  }
  if (socials.youtube) {
    const url = socials.youtube.startsWith("http") ? socials.youtube : `https://youtube.com/@${socials.youtube}`;
    badges.push(
      `<a href="${url}" target="_blank">\n    <img src="https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white" alt="YouTube" />\n  </a>`
    );
  }
  if (socials.discord) {
    badges.push(
      `<img src="https://img.shields.io/badge/Discord-${encodeURIComponent(socials.discord)}-7289DA?style=for-the-badge&logo=discord&logoColor=white" alt="Discord" />`
    );
  }

  if (badges.length === 0) return "";

  const alignTag = align === "center" ? ' align="center"' : "";
  return `<p${alignTag}>\n  ${badges.join("\n  ")}\n</p>`;
}

/**
 * Generate the complete Markdown document according to the chosen template.
 */
export function generateReadmeMarkdown(profile: ReadmeProfileData, config: ReadmeConfig): string {
  const { template } = config;

  // Check extended built-in templates first
  const extendedResult = generateExtendedTemplate(template, profile, config);
  if (extendedResult) {
    return extendedResult;
  }

  switch (template) {
    case "minimal":
      return generateMinimalTemplate(profile, config);
    case "showcase":
      return generateShowcaseTemplate(profile, config);
    case "cyberpunk":
      return generateCyberpunkTemplate(profile, config);
    case "modern":
    default:
      return generateModernTemplate(profile, config);
  }
}

/**
 * Template 1: Modern Developer
 */
function generateModernTemplate(profile: ReadmeProfileData, config: ReadmeConfig): string {
  const { header, aboutMe, skills, githubStats, featuredRepos, socials, extras, statsTheme } = config;
  const username = profile.username;
  const parts: string[] = [];

  // Header & Greeting
  const align = header.align;
  const alignTag = align === "center" ? ' align="center"' : "";

  if (header.showAvatar && profile.avatarUrl) {
    parts.push(`<p${alignTag}>\n  <img src="${profile.avatarUrl}" width="110" style="border-radius: 50%;" alt="${profile.name}" />\n</p>\n`);
  }

  parts.push(`<h1${alignTag}>${header.greeting} ${header.name}</h1>\n`);

  if (header.typingEffect && header.typingLines.length > 0) {
    const linesParam = header.typingLines.map((l) => encodeURIComponent(l)).join(";");
    parts.push(
      `<p${alignTag}>\n  <a href="https://gitcon.infornics.com/user/${username}">\n    <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&pause=1000&color=58AAB0&center=${align === "center"}&vCenter=true&width=435&lines=${linesParam}" alt="Typing SVG" />\n  </a>\n</p>\n`
    );
  } else if (header.title) {
    parts.push(`<h3${alignTag}>${header.title}</h3>\n`);
  }

  // Quick Badges
  const quickBadges: string[] = [];
  if (githubStats.showGitconBadge) {
    quickBadges.push(
      `<a href="https://gitcon.infornics.com/user/${username}">\n    <img src="https://img.shields.io/badge/Gitcon-Profile_&_Stats-58aab0?style=for-the-badge&logo=github&logoColor=white" alt="Gitcon Profile" />\n  </a>`
    );
  }
  if (extras.showVisitorBadge) {
    quickBadges.push(
      `<img src="https://komarev.com/ghpvc/?username=${username}&label=Profile%20Views&color=58aab0&style=for-the-badge" alt="Profile Views" />`
    );
  }
  if (profile.location) {
    quickBadges.push(
      `<img src="https://img.shields.io/badge/Location-${encodeURIComponent(profile.location)}-blue?style=for-the-badge" alt="Location" />`
    );
  }

  if (quickBadges.length > 0) {
    parts.push(`<p${alignTag}>\n  ${quickBadges.join("\n  ")}\n</p>\n`);
  }

  // About Me
  if (aboutMe.show) {
    parts.push(`### 💫 About Me\n`);
    if (aboutMe.bio) {
      parts.push(`${aboutMe.bio}\n`);
    }

    const bullets: string[] = [];
    if (aboutMe.workingOn) {
      const link = aboutMe.workingOnUrl ? `[**${aboutMe.workingOn}**](${aboutMe.workingOnUrl})` : `**${aboutMe.workingOn}**`;
      bullets.push(`- 🔭 I’m currently working on ${link}`);
    }
    if (aboutMe.learning) bullets.push(`- 🌱 I’m currently learning **${aboutMe.learning}**`);
    if (aboutMe.collaborateOn) bullets.push(`- 👯 I’m looking to collaborate on **${aboutMe.collaborateOn}**`);
    if (aboutMe.askMeAbout) bullets.push(`- 💬 Ask me about **${aboutMe.askMeAbout}**`);
    if (aboutMe.reachMe) bullets.push(`- 📫 How to reach me: **${aboutMe.reachMe}**`);
    if (aboutMe.funFact) bullets.push(`- ⚡ Fun fact: ${aboutMe.funFact}`);

    if (bullets.length > 0) {
      parts.push(bullets.join("\n") + "\n");
    }
  }

  // Skills
  if (skills.show && skills.selectedSkills.length > 0) {
    parts.push(`### 🛠️ Languages & Tools\n`);
    parts.push(renderSkillsMarkdown(skills.selectedSkills, skills.badgeStyle, "left") + "\n");
  }

  // GitHub Stats
  if (
    githubStats.showStatsCard ||
    githubStats.showStreakCard ||
    githubStats.showTopLangsCard ||
    githubStats.showActivityGraph
  ) {
    parts.push(`### 📊 GitHub Analytics & Rhythm\n`);

    if (githubStats.showStatsCard || githubStats.showStreakCard) {
      const cards: string[] = [];
      if (githubStats.showStatsCard) {
        cards.push(
          `<a href="https://gitcon.infornics.com/user/${username}">\n    <img height="180em" src="https://github-readme-stats-fast.vercel.app/api?username=${username}&show_icons=true&theme=${statsTheme}&hide_border=false" alt="${username}'s GitHub Stats" />\n  </a>`
        );
      }
      if (githubStats.showStreakCard) {
        cards.push(
          `<a href="https://gitcon.infornics.com/user/${username}">\n    <img height="180em" src="https://streak-stats.demolab.com?user=${username}&theme=${statsTheme}&hide_border=false" alt="${username}'s GitHub Streak" />\n  </a>`
        );
      }
      parts.push(`<p align="center">\n  ${cards.join("\n  ")}\n</p>\n`);
    }

    if (githubStats.showTopLangsCard) {
      parts.push(
        `<p align="center">\n  <a href="https://gitcon.infornics.com/user/${username}">\n    <img height="180em" src="https://github-readme-stats-fast.vercel.app/api/top-langs?username=${username}&layout=compact&theme=${statsTheme}&hide_border=false" alt="Top Languages" />\n  </a>\n</p>\n`
      );
    }

    if (githubStats.showActivityGraph) {
      parts.push(
        `<p align="center">\n  <img src="https://github-readme-activity-graph.vercel.app/graph?username=${username}&theme=react-dark" alt="Activity Graph" />\n</p>\n`
      );
    }
  }

  // Featured Repositories
  if (featuredRepos.show && featuredRepos.repos.length > 0) {
    const selectedRepos = featuredRepos.repos.filter((r) => r.selected !== false);
    if (selectedRepos.length > 0) {
      parts.push(`### 🚀 Featured Projects\n`);
      selectedRepos.forEach((repo) => {
        const langBadge = repo.language ? `\`${repo.language}\`` : "";
        const starBadge = repo.stars > 0 ? `⭐ **${repo.stars}**` : "";
        parts.push(
          `- [**${repo.name}**](${repo.url}) ${langBadge} ${starBadge}\n  ${repo.description || "Open source project"}`
        );
      });
      parts.push("\n");
    }
  }

  // Social Links
  if (socials.show) {
    parts.push(`### 🌐 Connect With Me\n`);
    parts.push(renderSocialsMarkdown(socials, "left") + "\n");
  }

  // Footer
  parts.push(
    `---\n\n<p align="center">\n  <sub>⚡ Powered by <a href="https://gitcon.infornics.com"><b>Gitcon</b></a> — High-Performance GitHub Rhythm & Activity Dashboard</sub>\n</p>`
  );

  return parts.join("\n");
}

/**
 * Template 2: Minimalist Clean
 */
function generateMinimalTemplate(profile: ReadmeProfileData, config: ReadmeConfig): string {
  const { header, aboutMe, skills, githubStats, featuredRepos, socials, statsTheme } = config;
  const username = profile.username;
  const parts: string[] = [];

  parts.push(`# ${header.name}\n`);
  if (header.title) {
    parts.push(`> ${header.title}\n`);
  }

  if (aboutMe.show && aboutMe.bio) {
    parts.push(`${aboutMe.bio}\n`);
  }

  // Minimal Badges
  const badges: string[] = [];
  if (githubStats.showGitconBadge) {
    badges.push(`[![Gitcon](https://img.shields.io/badge/Gitcon-Active-58aab0?style=flat-square)](https://gitcon.infornics.com/user/${username})`);
  }
  if (socials.twitter) {
    badges.push(`[![Twitter](https://img.shields.io/badge/Twitter-@${socials.twitter.replace(/^@/, "")}-1DA1F2?style=flat-square)](https://twitter.com/${socials.twitter.replace(/^@/, "")})`);
  }
  if (socials.portfolio) {
    badges.push(`[![Website](https://img.shields.io/badge/Website-Live-00ADD8?style=flat-square)](${socials.portfolio})`);
  }
  if (badges.length > 0) {
    parts.push(badges.join(" ") + "\n");
  }

  // What I'm up to
  const bullets: string[] = [];
  if (aboutMe.workingOn) bullets.push(`- **Focus:** ${aboutMe.workingOn}`);
  if (aboutMe.learning) bullets.push(`- **Learning:** ${aboutMe.learning}`);
  if (aboutMe.askMeAbout) bullets.push(`- **Ask me about:** ${aboutMe.askMeAbout}`);
  if (aboutMe.reachMe) bullets.push(`- **Contact:** ${aboutMe.reachMe}`);

  if (bullets.length > 0) {
    parts.push(`## Highlights\n\n` + bullets.join("\n") + "\n");
  }

  // Skills
  if (skills.show && skills.selectedSkills.length > 0) {
    parts.push(`## Tech Stack\n`);
    parts.push(renderSkillsMarkdown(skills.selectedSkills, "skillicons", "left") + "\n");
  }

  // GitHub Stats
  if (githubStats.showStatsCard || githubStats.showStreakCard) {
    parts.push(`## Activity\n`);
    const cards: string[] = [];
    if (githubStats.showStatsCard) {
      cards.push(
        `<img height="150em" src="https://github-readme-stats-fast.vercel.app/api?username=${username}&show_icons=true&theme=${statsTheme}&hide_border=true" alt="Stats" />`
      );
    }
    if (githubStats.showStreakCard) {
      cards.push(
        `<img height="150em" src="https://streak-stats.demolab.com?user=${username}&theme=${statsTheme}&hide_border=true" alt="Streak" />`
      );
    }
    parts.push(`<p align="left">\n  ${cards.join("\n  ")}\n</p>\n`);
  }

  // Featured Repos
  if (featuredRepos.show && featuredRepos.repos.length > 0) {
    const selectedRepos = featuredRepos.repos.filter((r) => r.selected !== false);
    if (selectedRepos.length > 0) {
      parts.push(`## Selected Works\n`);
      selectedRepos.forEach((r) => {
        parts.push(`- [**${r.name}**](${r.url}) — ${r.description || "Project"} ${r.stars > 0 ? `(⭐ ${r.stars})` : ""}`);
      });
      parts.push("\n");
    }
  }

  return parts.join("\n");
}

/**
 * Template 3: Showcase Portfolio
 */
function generateShowcaseTemplate(profile: ReadmeProfileData, config: ReadmeConfig): string {
  const { header, aboutMe, skills, githubStats, featuredRepos, socials, extras, statsTheme } = config;
  const username = profile.username;
  const parts: string[] = [];

  // Hero section
  parts.push(`<div align="center">\n`);
  if (header.showAvatar && profile.avatarUrl) {
    parts.push(`  <img src="${profile.avatarUrl}" width="120" style="border-radius: 50%; box-shadow: 0 4px 20px rgba(88,170,176,0.3);" alt="${profile.name}" />\n`);
  }

  parts.push(`  <h1>👋 Welcome to my GitHub Profile!</h1>`);
  parts.push(`  <h2>I'm ${header.name} — ${header.title}</h2>\n`);

  if (header.typingLines.length > 0) {
    const linesParam = header.typingLines.map((l) => encodeURIComponent(l)).join(";");
    parts.push(
      `  <p><img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=18&pause=1000&color=58AAB0&center=true&vCenter=true&width=500&lines=${linesParam}" alt="Typing SVG" /></p>\n`
    );
  }

  // Header quick stats
  const quickBadges: string[] = [];
  if (githubStats.showGitconBadge) {
    quickBadges.push(
      `<a href="https://gitcon.infornics.com/user/${username}"><img src="https://img.shields.io/badge/Gitcon-Dashboard-58aab0?style=for-the-badge&logo=github&logoColor=white" /></a>`
    );
  }
  if (extras.showVisitorBadge) {
    quickBadges.push(
      `<img src="https://komarev.com/ghpvc/?username=${username}&label=Total%20Views&color=58aab0&style=for-the-badge" />`
    );
  }
  if (quickBadges.length > 0) {
    parts.push(`  <p>\n    ${quickBadges.join("\n    ")}\n  </p>\n`);
  }
  parts.push(`</div>\n\n---\n`);

  // About Me
  if (aboutMe.show) {
    parts.push(`## 👨‍💻 About Me\n`);
    if (aboutMe.bio) parts.push(`> ${aboutMe.bio}\n`);

    parts.push(`| Info | Detail |`);
    parts.push(`| :--- | :--- |`);
    if (aboutMe.workingOn) parts.push(`| 🔭 **Working On** | ${aboutMe.workingOn} |`);
    if (aboutMe.learning) parts.push(`| 🌱 **Learning** | ${aboutMe.learning} |`);
    if (aboutMe.collaborateOn) parts.push(`| 👯 **Collaborating On** | ${aboutMe.collaborateOn} |`);
    if (aboutMe.askMeAbout) parts.push(`| 💬 **Ask Me About** | ${aboutMe.askMeAbout} |`);
    if (aboutMe.reachMe) parts.push(`| 📫 **Get in Touch** | ${aboutMe.reachMe} |`);
    if (aboutMe.funFact) parts.push(`| ⚡ **Fun Fact** | ${aboutMe.funFact} |`);
    parts.push("\n");
  }

  // Skills
  if (skills.show && skills.selectedSkills.length > 0) {
    parts.push(`## 🛠️ Tech Stack & Arsenal\n`);
    parts.push(renderSkillsMarkdown(skills.selectedSkills, skills.badgeStyle, "center") + "\n");
  }

  // Trophies
  if (githubStats.showTrophies) {
    parts.push(`## 🏆 GitHub Achievements & Trophies\n`);
    parts.push(
      `<p align="center">\n  <img src="https://github-trophies.vercel.app/?username=${username}&theme=radical&no-frame=false&no-bg=true&margin-w=4" alt="Trophies" />\n</p>\n`
    );
  }

  // Stats
  if (githubStats.showStatsCard || githubStats.showStreakCard || githubStats.showTopLangsCard) {
    parts.push(`## 📈 Activity & Momentum\n`);
    const cards: string[] = [];
    if (githubStats.showStatsCard) {
      cards.push(
        `<a href="https://gitcon.infornics.com/user/${username}">\n    <img height="185em" src="https://github-readme-stats-fast.vercel.app/api?username=${username}&show_icons=true&theme=${statsTheme}&hide_border=false" alt="Stats" />\n  </a>`
      );
    }
    if (githubStats.showStreakCard) {
      cards.push(
        `<a href="https://gitcon.infornics.com/user/${username}">\n    <img height="185em" src="https://streak-stats.demolab.com?user=${username}&theme=${statsTheme}&hide_border=false" alt="Streak" />\n  </a>`
      );
    }
    parts.push(`<p align="center">\n  ${cards.join("\n  ")}\n</p>\n`);

    if (githubStats.showTopLangsCard) {
      parts.push(
        `<p align="center">\n  <img height="185em" src="https://github-readme-stats-fast.vercel.app/api/top-langs?username=${username}&layout=compact&theme=${statsTheme}&hide_border=false" alt="Top Languages" />\n</p>\n`
      );
    }
  }

  // Featured Repositories
  if (featuredRepos.show && featuredRepos.repos.length > 0) {
    const selectedRepos = featuredRepos.repos.filter((r) => r.selected !== false);
    if (selectedRepos.length > 0) {
      parts.push(`## 🌟 Featured Projects\n`);
      parts.push(`| Project | Description | Stars | Language |`);
      parts.push(`| :--- | :--- | :--- | :--- |`);
      selectedRepos.forEach((r) => {
        parts.push(
          `| [**${r.name}**](${r.url}) | ${r.description || "—"} | ⭐ ${r.stars} | \`${r.language || "Plain"}\` |`
        );
      });
      parts.push("\n");
    }
  }

  // Socials
  if (socials.show) {
    parts.push(`## 📬 Let's Connect!\n`);
    parts.push(renderSocialsMarkdown(socials, "center") + "\n");
  }

  parts.push(
    `---\n\n<p align="center"><sub>Created with ❤️ using <a href="https://gitcon.infornics.com">Gitcon</a></sub></p>`
  );

  return parts.join("\n");
}

/**
 * Template 4: Cyberpunk / Terminal
 */
function generateCyberpunkTemplate(profile: ReadmeProfileData, config: ReadmeConfig): string {
  const { header, aboutMe, skills, githubStats, featuredRepos, socials, statsTheme } = config;
  const username = profile.username;
  const parts: string[] = [];

  // Terminal greeting
  parts.push("```bash");
  parts.push(`$ whoami`);
  parts.push(`> ${username} [${header.name}]`);
  parts.push(`$ gitcon telemetry --user=${username}`);
  parts.push(
    `> Status: ACTIVE | Rhythm: CONSTANT | Public Repos: ${profile.publicRepos} | Followers: ${profile.followers}`
  );
  parts.push("```\n");

  // Code block object
  const skillNames = skills.selectedSkills
    .map((id) => SKILLS_CATALOG.find((s) => s.id === id)?.name || id)
    .slice(0, 8);

  parts.push("```typescript");
  parts.push(`interface DeveloperProfile {`);
  parts.push(`  name: string;`);
  parts.push(`  role: string;`);
  parts.push(`  location: string;`);
  parts.push(`  skills: string[];`);
  parts.push(`  currentObjective: string;`);
  parts.push(`}`);
  parts.push(``);
  parts.push(`const ${username.replace(/[^a-zA-Z0-9_]/g, "_")}: DeveloperProfile = {`);
  parts.push(`  name: "${header.name}",`);
  parts.push(`  role: "${header.title || "Full Stack Developer"}",`);
  parts.push(`  location: "${profile.location || "Earth, Solar System"}",`);
  parts.push(`  skills: [${skillNames.map((s) => `"${s}"`).join(", ")}],`);
  parts.push(`  currentObjective: "${aboutMe.workingOn || "Building next-gen systems"}"`);
  parts.push(`};`);
  parts.push("```\n");

  // Skills as badges
  if (skills.show && skills.selectedSkills.length > 0) {
    parts.push(`### [SYS:STACK]\n`);
    parts.push(renderSkillsMarkdown(skills.selectedSkills, "shields", "left") + "\n");
  }

  // GitHub stats with synthwave or dark theme
  const cyberTheme = statsTheme === "dark" ? "synthwave" : statsTheme;
  if (githubStats.showStatsCard || githubStats.showStreakCard) {
    parts.push(`### [SYS:METRICS]\n`);
    const cards: string[] = [];
    if (githubStats.showStatsCard) {
      cards.push(
        `<a href="https://gitcon.infornics.com/user/${username}">\n    <img height="175em" src="https://github-readme-stats-fast.vercel.app/api?username=${username}&show_icons=true&theme=${cyberTheme}&hide_border=false" alt="Cyber Stats" />\n  </a>`
      );
    }
    if (githubStats.showStreakCard) {
      cards.push(
        `<a href="https://gitcon.infornics.com/user/${username}">\n    <img height="175em" src="https://streak-stats.demolab.com?user=${username}&theme=${cyberTheme}&hide_border=false" alt="Cyber Streak" />\n  </a>`
      );
    }
    parts.push(`<p align="center">\n  ${cards.join("\n  ")}\n</p>\n`);
  }

  // Featured Repos
  if (featuredRepos.show && featuredRepos.repos.length > 0) {
    const selectedRepos = featuredRepos.repos.filter((r) => r.selected !== false);
    if (selectedRepos.length > 0) {
      parts.push(`### [SYS:MODULES]\n`);
      selectedRepos.forEach((r) => {
        parts.push(`- \`git clone ${r.url}\`\n  # ${r.description || r.name} [⭐ ${r.stars}]`);
      });
      parts.push("\n");
    }
  }

  // Socials
  if (socials.show) {
    parts.push(`### [SYS:COMM_CHANNELS]\n`);
    parts.push(renderSocialsMarkdown(socials, "left") + "\n");
  }

  parts.push(
    `---\n\n\`gitcon --status ok\` 🚀 Telemetry synced with [Gitcon](https://gitcon.infornics.com/user/${username})`
  );

  return parts.join("\n");
}

/**
 * Download a string content as a markdown file.
 */
export function downloadMarkdownFile(filename: string, content: string) {
  if (typeof window === "undefined") return;
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".md") ? filename : `${filename}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

