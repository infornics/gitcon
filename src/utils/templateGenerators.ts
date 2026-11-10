import {
  ReadmeConfig,
  ReadmeProfileData,
  renderSkillsMarkdown,
  renderSocialsMarkdown,
  SKILLS_CATALOG,
} from "./readme";
import {
  createArcadeCabinetSvg,
  createHeroBannerSvg,
  createMixtapeCassetteSvg,
  createTerminalWindowSvg,
  createVelvetEditorialHeroSvg,
  createVelvetProjectCardSvg,
  createVelvetSectionDividerSvg,
} from "./svgBanners";
import {
  createAnimeHeroSvg,
  createAnimeNinjaWaySvg,
  createAnimeJutsuStackSvg,
  createAnimeNinjaIdSvg,
  createAnimeConnectSvg,
} from "./animeSvgs";

export interface GitconTemplateDef {
  id: string;
  name: string;
  category: "recruiter" | "technical" | "creative" | "opensource";
  badge: string;
  badgeColor: string;
  description: string;
  accentColor: string;
}

export const GITCON_TEMPLATES_CATALOG: GitconTemplateDef[] = [
  {
    id: "anime-shinobi",
    name: "Anime Shinobi Arc",
    category: "creative",
    badge: "Trending",
    badgeColor: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    description: "Viral Naruto shinobi theme: Konoha animated video hero, swinging ninja ID registration lanyard, and torchlight jutsu arsenal.",
    accentColor: "#FF7A1A",
  },
  {
    id: "arcade-cabinet",
    name: "Arcade Cabinet 8-Bit",
    category: "creative",
    badge: "Pixel Art",
    badgeColor: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    description: "Insert coin to play! 8-bit retro gaming cabinet, high-score leaderboard table, and pixel badges.",
    accentColor: "#FB7185",
  },
  {
    id: "commit-metro",
    name: "Commit Metro Lines",
    category: "opensource",
    badge: "Transit Map",
    badgeColor: "bg-sky-500/15 text-sky-400 border-sky-500/30",
    description: "Subway route map design where language lines intersect at core repository transfer stations.",
    accentColor: "#38BDF8",
  },
  {
    id: "data-lab",
    name: "Data Lab & AI Systems",
    category: "technical",
    badge: "Data & ML",
    badgeColor: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
    description: "Tailored for AI/ML and backend data engineers: model architectures, data pipelines, and research benchmarks.",
    accentColor: "#06B6D4",
  },
  {
    id: "devops-cloud",
    name: "DevOps & Cloud Architect",
    category: "technical",
    badge: "Infra & SRE",
    badgeColor: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    description: "Infrastructure as code, cluster telemetry, uptime metrics, CI/CD badges, and cloud certifications.",
    accentColor: "#FB923C",
  },
  {
    id: "case-file",
    name: "Engineer Case File",
    category: "recruiter",
    badge: "High-Signal",
    badgeColor: "bg-teal-500/15 text-teal-400 border-teal-500/30",
    description: "Typography-first executive dossier: career thesis, production systems, and verified outcomes.",
    accentColor: "#2DD4BF",
  },
  {
    id: "founder-log",
    name: "Founder & Indie Log",
    category: "opensource",
    badge: "Build in Public",
    badgeColor: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    description: "Build in public founder cockpit: active MRR / stars velocity, shipped micro-SaaS, and roadmap ship log.",
    accentColor: "#F59E0B",
  },
  {
    id: "hire-me-fast",
    name: "Hire Me Fast Scan",
    category: "recruiter",
    badge: "ATS Friendly",
    badgeColor: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    description: "Fast-scanning resume card layout with direct contact CTA buttons and active project deliverables.",
    accentColor: "#60A5FA",
  },
  {
    id: "magazine-editorial",
    name: "Magazine Editorial",
    category: "creative",
    badge: "Press Cover",
    badgeColor: "bg-violet-500/15 text-violet-400 border-violet-500/30",
    description: "High-fashion tech magazine cover: edition volume, featured stories, cover headline, and case studies.",
    accentColor: "#A78BFA",
  },
  {
    id: "maintainer-desk",
    name: "Maintainer's Desk",
    category: "opensource",
    badge: "Core Maintainer",
    badgeColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    description: "Built for active OSS maintainers: roadmap milestones, sponsorship CTA, PR review SLAs, and governance.",
    accentColor: "#10B981",
  },
  {
    id: "neofetch-hacker",
    name: "Neofetch Telemetry",
    category: "technical",
    badge: "SysAdmin",
    badgeColor: "bg-lime-500/15 text-lime-400 border-lime-500/30",
    description: "Authentic Neofetch OS / system report layout: CPU, uptime, memory, kernel, packages, and color blocks.",
    accentColor: "#A3E635",
  },
  {
    id: "night-shift",
    name: "Night Shift Darkroom",
    category: "creative",
    badge: "OLED Noir",
    badgeColor: "bg-fuchsia-500/15 text-fuchsia-400 border-fuchsia-500/30",
    description: "Sleek OLED monochrome dark aesthetic: glowing gradients, ambient telemetry, and luminous accents.",
    accentColor: "#E879F9",
  },
  {
    id: "plain-terminal",
    name: "Plain Terminal CLI",
    category: "technical",
    badge: "Raw Shell",
    badgeColor: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    description: "Clean terminal shell interface with verified command prompts, curl telemetry, and system runtime info.",
    accentColor: "#F59E0B",
  },
  {
    id: "recruiter-ready",
    name: "Recruiter-Ready Brief",
    category: "recruiter",
    badge: "Executive",
    badgeColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    description: "Hiring-optimized telemetry brief: core impact numbers, primary stack, and recruiter signal table.",
    accentColor: "#34D399",
  },
  {
    id: "mixtape-cassette",
    name: "Retro Cassette Mixtape",
    category: "creative",
    badge: "Audiophile",
    badgeColor: "bg-pink-500/15 text-pink-400 border-pink-500/30",
    description: "Cassette tape visual with side A / side B tracklists representing top repositories and monthly equalizer bars.",
    accentColor: "#F472B6",
  },
  {
    id: "character-sheet",
    name: "RPG Character Sheet",
    category: "creative",
    badge: "Level 99",
    badgeColor: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    description: "Tabletop RPG stats sheet: Class, HP, Mana, Quest Log, Inventory gear, and stat ability scores.",
    accentColor: "#FBBF24",
  },
  {
    id: "student-velocity",
    name: "Student Velocity",
    category: "recruiter",
    badge: "Learning Path",
    badgeColor: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
    description: "Designed for ambitious students & junior developers: learning trajectory, hackathons, and growth metrics.",
    accentColor: "#818CF8",
  },
  {
    id: "velvet-editorial",
    name: "Velvet Crimson Editorial",
    category: "creative",
    badge: "Trending",
    badgeColor: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    description: "Viral Instagram aesthetic: deep wine crimson aura, architectural arch portrait, astrolabe orbit rings, and magazine headings.",
    accentColor: "#E5B5C7",
  },
];

// =========================================================================
// 1. RECRUITER / CAREER TEMPLATES
// =========================================================================

export function generateRecruiterReadyTemplate(profile: ReadmeProfileData, config: ReadmeConfig): string {
  const { header, aboutMe, skills, githubStats, featuredRepos, socials, statsTheme } = config;
  const username = profile.username;
  const totalStars = featuredRepos.repos.reduce((acc, r) => acc + (r.stars || 0), 0);
  const topLangs = profile.topLanguages?.map((l) => l.name) || ["TypeScript", "React", "Python"];
  const parts: string[] = [];

  // Glowing Hero Banner
  const heroSvgUri = createHeroBannerSvg({
    username,
    name: header.name || profile.name || username,
    title: header.title || "Full-Stack Software Engineer",
    avatarUrl: profile.avatarUrl,
    avatarBase64: profile.avatarBase64,
    stars: totalStars,
    followers: profile.followers,
    contributions: profile.contributionsStats?.totalContributions || 0,
    languages: topLangs,
    theme: "emerald",
  });

  parts.push(`<div align="center">\n  <img src="${heroSvgUri}" width="100%" alt="${username} Profile Snapshot" />\n</div>\n`);

  parts.push(`<div align="center">`);
  parts.push(`  <p>`);
  parts.push(`    <a href="https://github.com/${username}"><img src="https://img.shields.io/badge/GitHub-Profile-181717?style=for-the-badge&logo=github&logoColor=white" /></a>`);
  if (socials.linkedin) {
    parts.push(`    <a href="https://linkedin.com/in/${socials.linkedin}"><img src="https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" /></a>`);
  }
  if (socials.email) {
    parts.push(`    <a href="mailto:${socials.email}"><img src="https://img.shields.io/badge/Email-Direct_Reach-D14836?style=for-the-badge&logo=gmail&logoColor=white" /></a>`);
  }
  parts.push(`  </p>`);
  parts.push(`</div>\n`);

  parts.push(`## 📌 Executive Summary\n`);
  parts.push(`| Metric | Metric Value | Verified Source |`);
  parts.push(`| :--- | :--- | :--- |`);
  parts.push(`| 🎯 **Core Role** | ${header.title || "Full-Stack Engineer"} | Active GitHub Commits |`);
  parts.push(`| 📍 **Location** | ${profile.location || "Remote / Worldwide"} | Verified Profile |`);
  parts.push(`| 🏢 **Current Team** | ${profile.company || "Independent Builder"} | Work History |`);
  parts.push(`| ⭐ **Ecosystem Stars** | **${totalStars.toLocaleString()}**+ GitHub Stars | Public Repositories |`);
  parts.push(`| 👥 **Network Reach** | **${(profile.followers || 0).toLocaleString()}** Developers | GitHub Community |`);
  parts.push(`| 🔥 **Contributions** | **${(profile.contributionsStats?.totalContributions || 0).toLocaleString()}** Past Year | Gitcon Telemetry |`);
  parts.push(`\n`);

  if (aboutMe.show) {
    parts.push(`## 💼 Impact & Proven Track Record\n`);
    if (aboutMe.workingOn) parts.push(`- 🚀 **Currently Scaling:** ${aboutMe.workingOn}`);
    if (aboutMe.learning) parts.push(`- 🧠 **Active Research & Deep Dive:** ${aboutMe.learning}`);
    if (aboutMe.collaborateOn) parts.push(`- 🤝 **Open for High-Impact Projects:** ${aboutMe.collaborateOn}`);
    if (aboutMe.askMeAbout) parts.push(`- 💬 **Subject Matter Expertise:** ${aboutMe.askMeAbout}`);
    parts.push(`\n`);
  }

  if (skills.show && skills.selectedSkills.length > 0) {
    parts.push(`## ⚡ Core Technical Competencies\n`);
    parts.push(renderSkillsMarkdown(skills.selectedSkills, "shields", "left") + "\n");
  }

  if (featuredRepos.show && featuredRepos.repos.length > 0) {
    const selected = featuredRepos.repos.filter((r) => r.selected !== false);
    if (selected.length > 0) {
      parts.push(`## 🏆 Flagship Production Work\n`);
      parts.push(`<table>`);
      for (let i = 0; i < selected.length; i += 2) {
        parts.push(`  <tr>`);
        for (let j = 0; j < 2; j++) {
          const repo = selected[i + j];
          if (repo) {
            parts.push(`    <td width="50%" valign="top">`);
            parts.push(`      <h3><a href="${repo.url}">${repo.name}</a></h3>`);
            parts.push(`      <p>${repo.description || "Production system built and maintained by " + username}</p>`);
            parts.push(`      <p><b>Stack:</b> <code>${repo.language || "TypeScript"}</code> · ⭐ <b>${repo.stars}</b> stars · 🍴 <b>${repo.forks}</b> forks</p>`);
            parts.push(`    </td>`);
          } else {
            parts.push(`    <td width="50%"></td>`);
          }
        }
        parts.push(`  </tr>`);
      }
      parts.push(`</table>\n`);
    }
  }

  if (githubStats.showStatsCard || githubStats.showStreakCard) {
    parts.push(`## 📈 Engineering Velocity\n`);
    const cards: string[] = [];
    if (githubStats.showStatsCard) {
      cards.push(`<a href="https://gitcon.infornics.com/user/${username}"><img height="165em" src="https://github-readme-stats-fast.vercel.app/api?username=${username}&show_icons=true&theme=${statsTheme}&hide_border=false" alt="Git Stats" /></a>`);
    }
    if (githubStats.showStreakCard) {
      cards.push(`<a href="https://gitcon.infornics.com/user/${username}"><img height="165em" src="https://streak-stats.demolab.com?user=${username}&theme=${statsTheme}&hide_border=false" alt="Streak" /></a>`);
    }
    parts.push(`<p align="center">\n  ${cards.join("\n  ")}\n</p>\n`);
  }

  parts.push(`---\n\n<p align="center"><sub>Candidate dossier verified via <a href="https://gitcon.infornics.com/user/${username}"><b>Gitcon Verified Profile</b></a></sub></p>`);
  return parts.join("\n");
}

export function generateCaseFileTemplate(profile: ReadmeProfileData, config: ReadmeConfig): string {
  const { header, aboutMe, skills, featuredRepos, socials } = config;
  const username = profile.username;
  const parts: string[] = [];

  parts.push(`\`\`\`\n=================================================================\nCONFIDENTIAL // DOSSIER FILE: ${username.toUpperCase()}\nPRIMARY SPECIALIZATION: ${(header.title || "ENGINEERING LEAD").toUpperCase()}\nSTATUS: VERIFIED CANDIDATE // CLEARANCE: OPEN TO HIRE\n=================================================================\n\`\`\`\n`);

  parts.push(`# 📂 CASE DOSSIER: ${header.name || profile.name}\n`);
  parts.push(`> *"The mark of an engineer is not the code they write, but the systems that continue running reliably in their absence."*\n`);

  parts.push(`### 1.0 Candidate Background\n`);
  parts.push(`- **Subject Identity:** ${header.name || profile.name} (\`@${username}\`)`);
  parts.push(`- **Jurisdiction / Base:** ${profile.location || "Earth (Remote)"}`);
  parts.push(`- **Organizational Affiliation:** ${profile.company || "Independent Engineering Practice"}`);
  parts.push(`- **Public Code Artifacts:** ${profile.publicRepos} Repositories across GitHub`);
  parts.push(`- **Community Trust Score:** ${profile.followers} Following Engineers\n`);

  if (aboutMe.show) {
    parts.push(`### 2.0 Operational Focus\n`);
    if (aboutMe.workingOn) parts.push(`- **Primary Initiative:** ${aboutMe.workingOn}`);
    if (aboutMe.learning) parts.push(`- **Technological Expansion:** ${aboutMe.learning}`);
    if (aboutMe.collaborateOn) parts.push(`- **Target Collaborative Endeavors:** ${aboutMe.collaborateOn}`);
    parts.push(`\n`);
  }

  if (skills.show && skills.selectedSkills.length > 0) {
    parts.push(`### 3.0 Verified Tooling & Frameworks\n`);
    parts.push(renderSkillsMarkdown(skills.selectedSkills, "skillicons", "left") + "\n");
  }

  if (featuredRepos.show && featuredRepos.repos.length > 0) {
    const selected = featuredRepos.repos.filter((r) => r.selected !== false);
    if (selected.length > 0) {
      parts.push(`### 4.0 Key Deployed Systems (Evidence of Competence)\n`);
      selected.forEach((r, idx) => {
        parts.push(`#### [Artifact 4.${idx + 1}] [${r.name}](${r.url})`);
        parts.push(`- **System Function:** ${r.description || "High-performance software component."}`);
        parts.push(`- **Key Language:** \`${r.language || "TypeScript"}\` · **Star Validation:** ⭐ \`${r.stars}\``);
        parts.push(`- **Code Inspection:** [Browse repository tree](${r.url})\n`);
      });
    }
  }

  if (socials.show) {
    parts.push(`### 5.0 Communication Protocols\n`);
    parts.push(renderSocialsMarkdown(socials, "left") + "\n");
  }

  parts.push(`\`\`\`\n[END OF DOSSIER] - Signed and indexed by Gitcon Registry.\n\`\`\``);
  return parts.join("\n");
}

export function generateHireMeFastTemplate(profile: ReadmeProfileData, config: ReadmeConfig): string {
  const { header, aboutMe, skills, githubStats, featuredRepos, socials, statsTheme } = config;
  const username = profile.username;
  const parts: string[] = [];

  parts.push(`<div align="center">\n`);
  if (header.showAvatar && profile.avatarUrl) {
    parts.push(`  <img src="${profile.avatarUrl}" width="115" style="border-radius: 50%; box-shadow: 0 10px 30px rgba(0,0,0,0.5);" alt="${header.name}" />\n`);
  }
  parts.push(`  <h1>⚡ ${header.name || profile.name}</h1>`);
  parts.push(`  <h3>${header.title || "Full-Stack Software Engineer"} · Available for Opportunities</h3>\n`);

  parts.push(`  <p>`);
  if (socials.email) {
    parts.push(`    <a href="mailto:${socials.email}"><img src="https://img.shields.io/badge/Email_Me-Hire_Candidate-success?style=for-the-badge&logo=maildotru" /></a>`);
  }
  if (socials.linkedin) {
    parts.push(`    <a href="https://linkedin.com/in/${socials.linkedin}"><img src="https://img.shields.io/badge/LinkedIn-Schedule_Interview-blue?style=for-the-badge&logo=linkedin" /></a>`);
  }
  if (socials.portfolio) {
    parts.push(`    <a href="${socials.portfolio}"><img src="https://img.shields.io/badge/Portfolio-View_Live_Work-8B5CF6?style=for-the-badge&logo=safari" /></a>`);
  }
  parts.push(`  </p>\n</div>\n---\n`);

  parts.push(`### 🎯 30-Second Fast Scan\n`);
  parts.push(`- 📍 **Based in:** ${profile.location || "Remote Worldwide"}`);
  parts.push(`- 💼 **Current focus:** ${aboutMe.workingOn || "Developing scalable software & web infrastructure"}`);
  parts.push(`- 🛠️ **Top technical strengths:** Fast execution, end-to-end ownership, robust tests`);
  parts.push(`- 📬 **Preferred reachout:** ${socials.email ? `[${socials.email}](mailto:${socials.email})` : "GitHub Issues or LinkedIn"}\n`);

  if (skills.show && skills.selectedSkills.length > 0) {
    parts.push(`### 💻 Daily Driver Stack\n`);
    parts.push(renderSkillsMarkdown(skills.selectedSkills, "shields", "left") + "\n");
  }

  if (featuredRepos.show && featuredRepos.repos.length > 0) {
    const selected = featuredRepos.repos.filter((r) => r.selected !== false);
    if (selected.length > 0) {
      parts.push(`### 🚀 Shipped Work & Proof of Velocity\n`);
      selected.forEach((r) => {
        parts.push(`- **[${r.name}](${r.url})**: ${r.description || "Active production repository"} \`${r.language}\` (⭐ ${r.stars})`);
      });
      parts.push(`\n`);
    }
  }

  if (githubStats.showStatsCard || githubStats.showStreakCard) {
    parts.push(`### 📊 Consistent Rhythm & Commits\n`);
    const cards: string[] = [];
    if (githubStats.showStatsCard) {
      cards.push(`<a href="https://gitcon.infornics.com/user/${username}"><img height="150em" src="https://github-readme-stats-fast.vercel.app/api?username=${username}&show_icons=true&theme=${statsTheme}&hide_border=true" alt="Stats" /></a>`);
    }
    if (githubStats.showStreakCard) {
      cards.push(`<a href="https://gitcon.infornics.com/user/${username}"><img height="150em" src="https://streak-stats.demolab.com?user=${username}&theme=${statsTheme}&hide_border=true" alt="Streak" /></a>`);
    }
    parts.push(`<p align="center">\n  ${cards.join("\n  ")}\n</p>\n`);
  }

  return parts.join("\n");
}

export function generateStudentVelocityTemplate(profile: ReadmeProfileData, config: ReadmeConfig): string {
  const { header, aboutMe, skills, githubStats, featuredRepos, socials, statsTheme } = config;
  const username = profile.username;
  const parts: string[] = [];

  parts.push(`<div align="center">\n`);
  parts.push(`  <img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&size=24&pause=1000&color=818CF8&center=true&vCenter=true&width=500&lines=Student+%26+Software+Builder;Learning+in+Public;Open+to+Internships+%26+New+Grad" alt="Typing Banner" />\n`);
  parts.push(`  <h1>🎓 ${header.name || profile.name}</h1>`);
  parts.push(`  <p><b>Learning, building, and shipping software every single day.</b></p>\n`);
  parts.push(`  <p>`);
  parts.push(`    <img src="https://img.shields.io/badge/Curiosity-100%25-6366F1?style=for-the-badge" />`);
  parts.push(`    <img src="https://img.shields.io/badge/Status-Seeking_Internships-10B981?style=for-the-badge" />`);
  parts.push(`    <img src="https://img.shields.io/badge/Contributions-${profile.contributionsStats?.totalContributions || 0}-F59E0B?style=for-the-badge" />`);
  parts.push(`  </p>\n</div>\n\n---\n`);

  parts.push(`### 🎒 My Learning Journey & Goals\n`);
  parts.push(`- 🌱 **Currently Masterclassing:** ${aboutMe.learning || "Distributed systems, React & modern backend"}`);
  parts.push(`- 💻 **Building Today:** ${aboutMe.workingOn || "Portfolio projects and hackathon submissions"}`);
  parts.push(`- 🎯 **2026 Milestone:** Land an impactful engineering internship & ship open-source contributions`);
  parts.push(`- 💬 **Ask me about:** ${aboutMe.askMeAbout || "Data structures, algorithms, frontend development"}\n`);

  if (skills.show && skills.selectedSkills.length > 0) {
    parts.push(`### 🛠️ Languages & Technologies I Work With\n`);
    parts.push(renderSkillsMarkdown(skills.selectedSkills, "skillicons", "center") + "\n");
  }

  if (featuredRepos.show && featuredRepos.repos.length > 0) {
    const selected = featuredRepos.repos.filter((r) => r.selected !== false);
    if (selected.length > 0) {
      parts.push(`### 🌟 What I've Built So Far\n`);
      selected.forEach((r) => {
        parts.push(`- 🚀 **[${r.name}](${r.url})**: ${r.description || "Student project"} (\`${r.language || "Code"}\`) ⭐ ${r.stars}`);
      });
      parts.push(`\n`);
    }
  }

  if (githubStats.showStatsCard || githubStats.showTopLangsCard) {
    parts.push(`### 📈 Activity & Languages\n`);
    const cards: string[] = [];
    if (githubStats.showStatsCard) {
      cards.push(`<a href="https://gitcon.infornics.com/user/${username}"><img height="160em" src="https://github-readme-stats-fast.vercel.app/api?username=${username}&show_icons=true&theme=${statsTheme}&hide_border=false" /></a>`);
    }
    if (githubStats.showTopLangsCard) {
      cards.push(`<a href="https://gitcon.infornics.com/user/${username}"><img height="160em" src="https://github-readme-stats-fast.vercel.app/api/top-langs?username=${username}&layout=compact&theme=${statsTheme}&hide_border=false" /></a>`);
    }
    parts.push(`<p align="center">\n  ${cards.join("\n  ")}\n</p>\n`);
  }

  if (socials.show) {
    parts.push(`### 📬 Let's Connect & Study Together\n`);
    parts.push(renderSocialsMarkdown(socials, "center") + "\n");
  }

  return parts.join("\n");
}

// =========================================================================
// 2. TECHNICAL / SYSTEMS TEMPLATES
// =========================================================================

export function generatePlainTerminalTemplate(profile: ReadmeProfileData, config: ReadmeConfig): string {
  const { header, aboutMe, skills, githubStats, featuredRepos, socials, statsTheme } = config;
  const username = profile.username;
  const totalStars = featuredRepos.repos.reduce((acc, r) => acc + (r.stars || 0), 0);
  const topLangs = profile.topLanguages?.map((l) => l.name) || ["TypeScript", "Rust", "Python", "C++"];
  const parts: string[] = [];

  // 1. High-Craft Terminal Header Window (macOS / Linux styling)
  const termSvg = createTerminalWindowSvg({
    username,
    name: header.name || profile.name || username,
    title: header.title || "Full-Stack Software Engineer",
    avatarUrl: profile.avatarUrl,
    avatarBase64: profile.avatarBase64,
    stars: totalStars,
    followers: profile.followers,
    contributions: profile.contributionsStats?.totalContributions || 0,
    languages: topLangs,
    theme: "emerald",
  });

  parts.push(`<div align="center">\n  <img src="${termSvg}" width="100%" alt="${username} Terminal Session" />\n</div>\n`);

  // Quick navigation prompt
  parts.push(`<div align="center">`);
  parts.push(`  <a href="https://github.com/${username}"><img src="https://img.shields.io/badge/Shell-bash%205.2-10B981?style=for-the-badge&logo=gnubash&logoColor=white" /></a>`);
  parts.push(`  <a href="https://gitcon.infornics.com/user/${username}"><img src="https://img.shields.io/badge/Runtime-x86__64%20Linux-38BDF8?style=for-the-badge&logo=linux&logoColor=white" /></a>`);
  if (socials.linkedin) {
    parts.push(`  <a href="https://linkedin.com/in/${socials.linkedin}"><img src="https://img.shields.io/badge/Connect-LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" /></a>`);
  }
  parts.push(`</div>\n`);

  // 2. Active Session Telemetry
  parts.push(`### 🖥️ \`session --active-tasks\``);
  parts.push("```sh");
  parts.push(`[SYSTEM TELEMETRY REPORT] - ${new Date().toISOString().split("T")[0]} 00:00:00 UTC`);
  parts.push(`USER         : ${username}`);
  parts.push(`HOST         : dev-station-01 (${profile.location || "Earth, Solar System"})`);
  parts.push(`AFFILIATION  : ${profile.company || "Independent Software Engineer"}`);
  parts.push(`NETWORK      : ${profile.followers} followers │ ${profile.publicRepos} public repositories`);
  parts.push(`UPTIME       : ${profile.contributionsStats?.currentStreak || 0} consecutive active days`);
  parts.push("```\n");

  // 3. Process Mission / About
  if (aboutMe.show) {
    parts.push(`### 📂 \`cat /proc/mission.json\``);
    parts.push("```json");
    parts.push(`{`);
    parts.push(`  "focus": "${aboutMe.workingOn || "Building reliable distributed systems & high-performance applications"}",`);
    parts.push(`  "active_learning": "${aboutMe.learning || "Systems internals, compiler design, and AI tooling"}",`);
    parts.push(`  "collaboration": "${aboutMe.collaborateOn || "Open-source developer tooling & cloud native infrastructure"}",`);
    parts.push(`  "inquiries": "${aboutMe.askMeAbout || "C++, Rust, TypeScript, Architecture Design"}"`);
    parts.push(`}`);
    parts.push("```\n");
  }

  // 4. Installed Binaries & Toolchain
  if (skills.show && skills.selectedSkills.length > 0) {
    parts.push(`### ⚙️ \`ls -la /usr/local/bin\``);
    parts.push("```sh");
    const skillNames = skills.selectedSkills
      .map((id) => SKILLS_CATALOG.find((s) => s.id === id)?.name || id)
      .slice(0, 14);
    parts.push(skillNames.map((s, i) => `drwxr-xr-x  1 ${username.padEnd(10)} staff   4096  Nov  8  ${s.toLowerCase()}`).join("\n"));
    parts.push("```\n");
    parts.push(renderSkillsMarkdown(skills.selectedSkills, "shields", "left") + "\n");
  }

  // 5. Active Production Repos
  if (featuredRepos.show && featuredRepos.repos.length > 0) {
    const selected = featuredRepos.repos.filter((r) => r.selected !== false);
    if (selected.length > 0) {
      parts.push(`### 📦 \`gitcon repos --top\``);
      parts.push("```sh");
      selected.forEach((r) => {
        parts.push(`★ [${String(r.stars).padStart(3)} stars]  ${r.name.padEnd(24)} [${(r.language || "code").padEnd(10)}]  ${r.url}`);
      });
      parts.push("```\n");
    }
  }

  // 6. Live Telemetry Monitors
  if (githubStats.showStatsCard || githubStats.showStreakCard) {
    parts.push(`### 📊 \`htop --telemetry\`\n`);
    const cards: string[] = [];
    if (githubStats.showStatsCard) {
      cards.push(`<a href="https://gitcon.infornics.com/user/${username}"><img height="155em" src="https://github-readme-stats-fast.vercel.app/api?username=${username}&show_icons=true&theme=terminal&hide_border=false" /></a>`);
    }
    if (githubStats.showStreakCard) {
      cards.push(`<a href="https://gitcon.infornics.com/user/${username}"><img height="155em" src="https://streak-stats.demolab.com?user=${username}&theme=terminal&hide_border=false" /></a>`);
    }
    parts.push(`<p align="left">\n  ${cards.join("\n  ")}\n</p>\n`);
  }

  return parts.join("\n");
}

export function generateDataLabTemplate(profile: ReadmeProfileData, config: ReadmeConfig): string {
  const { header, aboutMe, skills, githubStats, featuredRepos, socials, statsTheme } = config;
  const username = profile.username;
  const totalStars = featuredRepos.repos.reduce((acc, r) => acc + (r.stars || 0), 0);
  const topLangs = profile.topLanguages?.map((l) => l.name) || ["Python", "PyTorch", "C++", "CUDA"];
  const parts: string[] = [];

  const heroSvgUri = createHeroBannerSvg({
    username,
    name: header.name || profile.name || username,
    title: header.title || "Data Scientist & AI Systems Researcher",
    avatarUrl: profile.avatarUrl,
    avatarBase64: profile.avatarBase64,
    stars: totalStars,
    followers: profile.followers,
    contributions: profile.contributionsStats?.totalContributions || 0,
    languages: topLangs,
    theme: "cyan",
  });

  parts.push(`<div align="center">\n  <img src="${heroSvgUri}" width="100%" alt="${username} Data Lab" />\n</div>\n`);

  parts.push(`<div align="center">\n`);
  parts.push(`  <p>`);
  parts.push(`    <img src="https://img.shields.io/badge/PyTorch-2.0+-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white" />`);
  parts.push(`    <img src="https://img.shields.io/badge/Compute-CUDA_Ready-76B900?style=for-the-badge&logo=nvidia&logoColor=white" />`);
  parts.push(`    <img src="https://img.shields.io/badge/Datasets-Processed_10TB+-0284C7?style=for-the-badge" />`);
  parts.push(`  </p>\n</div>\n\n---\n`);

  parts.push(`### 🧪 Active Lab Experiments\n`);
  parts.push(`| Track | Project / Model | Status | Framework |`);
  parts.push(`| :--- | :--- | :--- | :--- |`);
  parts.push(`| 🤖 **Model Serving** | ${aboutMe.workingOn || "Distributed LLM Inference Engine"} | \`In Production\` | PyTorch / vLLM |`);
  parts.push(`| 📊 **Feature Pipeline** | Real-time vector store & embedding index | \`Benchmarking\` | LanceDB / DuckDB |`);
  parts.push(`| 🧠 **Active Research** | ${aboutMe.learning || "Reasoning agents & multi-modal evaluation"} | \`Active Trial\` | Python / Triton |`);
  parts.push(`| 💬 **Open Inquiries** | ${aboutMe.askMeAbout || "CUDA optimization, LoRA fine-tuning, RAG"} | \`Available\` | GitHub Discussions |`);
  parts.push(`\n`);

  if (skills.show && skills.selectedSkills.length > 0) {
    parts.push(`### 🔬 Computational Arsenal & ML Stack\n`);
    parts.push(renderSkillsMarkdown(skills.selectedSkills, "shields", "left") + "\n");
  }

  if (featuredRepos.show && featuredRepos.repos.length > 0) {
    const selected = featuredRepos.repos.filter((r) => r.selected !== false);
    if (selected.length > 0) {
      parts.push(`### 📦 Model Weights & Research Repositories\n`);
      selected.forEach((r) => {
        parts.push(`- 🗃️ **[${r.name}](${r.url})**: ${r.description || "Research artifact and codebase"} \`${r.language}\` (⭐ ${r.stars} citations)`);
      });
      parts.push(`\n`);
    }
  }

  if (githubStats.showStatsCard || githubStats.showTopLangsCard) {
    parts.push(`### 📈 Activity & Languages\n`);
    const cards: string[] = [];
    if (githubStats.showStatsCard) {
      cards.push(`<a href="https://gitcon.infornics.com/user/${username}"><img height="160em" src="https://github-readme-stats-fast.vercel.app/api?username=${username}&show_icons=true&theme=tokyonight&hide_border=false" /></a>`);
    }
    if (githubStats.showTopLangsCard) {
      cards.push(`<a href="https://gitcon.infornics.com/user/${username}"><img height="160em" src="https://github-readme-stats-fast.vercel.app/api/top-langs?username=${username}&layout=compact&theme=tokyonight&hide_border=false" /></a>`);
    }
    parts.push(`<p align="center">\n  ${cards.join("\n  ")}\n</p>\n`);
  }

  return parts.join("\n");
}

export function generateDevOpsCloudTemplate(profile: ReadmeProfileData, config: ReadmeConfig): string {
  const { header, aboutMe, skills, githubStats, featuredRepos, socials, statsTheme } = config;
  const username = profile.username;
  const parts: string[] = [];

  parts.push(`<div align="center">\n`);
  parts.push(`  <h1>☁️ ${header.name || profile.name}</h1>`);
  parts.push(`  <p><b>DevOps · Site Reliability Engineer · Cloud Architect</b></p>\n`);
  parts.push(`  <p>`);
  parts.push(`    <img src="https://img.shields.io/badge/Uptime-99.999%25-success?style=for-the-badge&logo=prometheus" />`);
  parts.push(`    <img src="https://img.shields.io/badge/Infrastructure-Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white" />`);
  parts.push(`    <img src="https://img.shields.io/badge/IaC-Terraform-844FBA?style=for-the-badge&logo=terraform&logoColor=white" />`);
  parts.push(`    <img src="https://img.shields.io/badge/CI%2FCD-Automated-2088FF?style=for-the-badge&logo=githubactions&logoColor=white" />`);
  parts.push(`  </p>\n</div>\n\n---\n`);

  parts.push(`### 🏗️ Infrastructure Cluster Telemetry\n`);
  parts.push(`- ☸️ **Cluster Status:** Healthy (\`nodes: active\`, \`pods: 100% running\`)`);
  parts.push(`- 🌍 **Deployment Target:** ${profile.location || "Multi-region Cloud"} | Auto-scaling enabled`);
  parts.push(`- 🚀 **Currently Provisioning:** ${aboutMe.workingOn || "Multi-tenant Kubernetes clusters on AWS / GCP"}`);
  parts.push(`- 🛡️ **Zero Trust & Security:** ${aboutMe.learning || "eBPF network security, Cilium, Vault hardening"}`);
  parts.push(`- 💬 **SRE Consultation:** ${aboutMe.askMeAbout || "Docker optimization, Helm charts, Terraform modules"}\n`);

  if (skills.show && skills.selectedSkills.length > 0) {
    parts.push(`### 🧰 Cloud & SRE Tooling\n`);
    parts.push(renderSkillsMarkdown(skills.selectedSkills, "shields", "left") + "\n");
  }

  if (featuredRepos.show && featuredRepos.repos.length > 0) {
    const selected = featuredRepos.repos.filter((r) => r.selected !== false);
    if (selected.length > 0) {
      parts.push(`### 📦 Infrastructure as Code & Modules\n`);
      selected.forEach((r) => {
        parts.push(`- ⚙️ **[${r.name}](${r.url})**: ${r.description || "Cloud orchestration package"} \`${r.language}\` (⭐ ${r.stars})`);
      });
      parts.push(`\n`);
    }
  }

  if (githubStats.showStatsCard || githubStats.showActivityGraph) {
    parts.push(`### 📊 Deployment Activity Log\n`);
    if (githubStats.showActivityGraph) {
      parts.push(`<p align="center">\n  <img src="https://github-readme-activity-graph.vercel.app/graph?username=${username}&theme=dracula" alt="Activity Graph" />\n</p>\n`);
    }
  }

  return parts.join("\n");
}

export function generateNeofetchTemplate(profile: ReadmeProfileData, config: ReadmeConfig): string {
  const { header, aboutMe, skills, githubStats, featuredRepos, socials } = config;
  const username = profile.username;
  const parts: string[] = [];

  const languagesList = profile.topLanguages.map((l) => l.name).join(", ") || "TypeScript, Go, Python, Rust";

  parts.push("```sh");
  parts.push(`        #####           ${username}@gitcon`);
  parts.push(`       #######          --------------`);
  parts.push(`       ##O#O##          OS: Gitcon Linux x86_64`);
  parts.push(`       #VVVVV#          Host: Developer Station 2026`);
  parts.push(`     ##  VVV  ##        Kernel: 6.8.0-gitcon-generic`);
  parts.push(`    #          #        Uptime: ${profile.contributionsStats?.currentStreak || 42} days active streak`);
  parts.push(`   #            #       Packages: ${profile.publicRepos} (public repositories)`);
  parts.push(`   #            #       Shell: zsh 5.9 (x86_64-debian-linux)`);
  parts.push(`   #   #    #   #       CPU: Core Engineer @ 4.80GHz`);
  parts.push(`    #  #    #  #        Memory: ${profile.followers} MiB / ${(profile.followers * 2) + 1024} MiB (network)`);
  parts.push(`     # #    # #         Languages: ${languagesList}`);
  parts.push(`       #    #           Primary: ${header.title || "Full-Stack Software Engineer"}`);
  parts.push(`                        Location: ${profile.location || "Worldwide (Remote)"}`);
  parts.push(``);
  parts.push(`   ███ ███ ███ ███ ███ ███ ███ ███`);
  parts.push("```\n");

  if (aboutMe.show) {
    parts.push(`### 📋 System Operations\n`);
    if (aboutMe.workingOn) parts.push(`- **active_job.sh:** ${aboutMe.workingOn}`);
    if (aboutMe.learning) parts.push(`- **fetch_knowledge.sh:** ${aboutMe.learning}`);
    if (aboutMe.askMeAbout) parts.push(`- **query_subject.sh:** ${aboutMe.askMeAbout}`);
    parts.push(`\n`);
  }

  if (skills.show && skills.selectedSkills.length > 0) {
    parts.push(`### 📦 Loaded Binaries & Dependencies\n`);
    parts.push(renderSkillsMarkdown(skills.selectedSkills, "shields", "left") + "\n");
  }

  if (featuredRepos.show && featuredRepos.repos.length > 0) {
    const selected = featuredRepos.repos.filter((r) => r.selected !== false);
    if (selected.length > 0) {
      parts.push(`### 📁 Directory: /var/repos\n`);
      selected.forEach((r) => {
        parts.push(`- 📦 [\`${r.name}\`](${r.url}) — ${r.description || "Binary artifact"} (⭐ ${r.stars})`);
      });
      parts.push(`\n`);
    }
  }

  return parts.join("\n");
}

// =========================================================================
// 3. CREATIVE / VISUAL TEMPLATES
// =========================================================================

export function generateMixtapeTemplate(profile: ReadmeProfileData, config: ReadmeConfig): string {
  const { header, aboutMe, skills, githubStats, featuredRepos, socials, statsTheme } = config;
  const username = profile.username;
  const totalStars = featuredRepos.repos.reduce((acc, r) => acc + (r.stars || 0), 0);
  const topLangs = profile.topLanguages?.map((l) => l.name) || ["TypeScript", "Audio", "React"];
  const parts: string[] = [];

  const cassetteSvgUri = createMixtapeCassetteSvg({
    username,
    name: header.name || profile.name || username,
    title: header.title || "Full-Stack Symphony",
    avatarUrl: profile.avatarUrl,
    stars: totalStars,
    followers: profile.followers,
    contributions: profile.contributionsStats?.totalContributions || 0,
    languages: topLangs,
    theme: "rose",
  });

  parts.push(`<div align="center">\n  <img src="${cassetteSvgUri}" width="100%" alt="${username} Mixtape Cassette" />\n</div>\n`);

  parts.push(`## 📼 ${header.name || profile.name} // Developer Mixtape\n`);
  parts.push(`> *"Coding with rhythm. Volume turned up to 11."*\n`);

  if (featuredRepos.show && featuredRepos.repos.length > 0) {
    const selected = featuredRepos.repos.filter((r) => r.selected !== false);
    const sideA = selected.slice(0, 3);
    const sideB = selected.slice(3, 6);

    parts.push(`### 🎵 Tracklist: Side A (Most Played Repos)\n`);
    sideA.forEach((r, idx) => {
      parts.push(`- 0${idx + 1}. **[${r.name}](${r.url})** · \`${r.language}\` · ⭐ ${r.stars} plays — *${r.description || "Hit release"}*`);
    });
    parts.push(`\n`);

    if (sideB.length > 0) {
      parts.push(`### 🎵 Tracklist: Side B (Deep Cuts & Experiments)\n`);
      sideB.forEach((r, idx) => {
        parts.push(`- 0${idx + 4}. **[${r.name}](${r.url})** · \`${r.language}\` · ⭐ ${r.stars} plays — *${r.description || "Experimental groove"}*`);
      });
      parts.push(`\n`);
    }
  }

  if (skills.show && skills.selectedSkills.length > 0) {
    parts.push(`### 🎛️ Audio Rack & Synthesizers (Tech Stack)\n`);
    parts.push(renderSkillsMarkdown(skills.selectedSkills, "skillicons", "left") + "\n");
  }

  if (githubStats.showStatsCard || githubStats.showStreakCard) {
    parts.push(`### 🔊 Studio Levels & Output\n`);
    const cards: string[] = [];
    if (githubStats.showStatsCard) {
      cards.push(`<a href="https://gitcon.infornics.com/user/${username}"><img height="160em" src="https://github-readme-stats-fast.vercel.app/api?username=${username}&show_icons=true&theme=radical&hide_border=false" /></a>`);
    }
    if (githubStats.showStreakCard) {
      cards.push(`<a href="https://gitcon.infornics.com/user/${username}"><img height="160em" src="https://streak-stats.demolab.com?user=${username}&theme=radical&hide_border=false" /></a>`);
    }
    parts.push(`<p align="center">\n  ${cards.join("\n  ")}\n</p>\n`);
  }

  return parts.join("\n");
}

export function generateArcadeCabinetTemplate(profile: ReadmeProfileData, config: ReadmeConfig): string {
  const { header, aboutMe, skills, githubStats, featuredRepos, socials, statsTheme } = config;
  const username = profile.username;
  const totalStars = featuredRepos.repos.reduce((acc, r) => acc + (r.stars || 0), 0);
  const parts: string[] = [];

  const arcadeSvgUri = createArcadeCabinetSvg({
    username,
    name: header.name || profile.name || username,
    title: header.title || "Arcade Player 1",
    avatarUrl: profile.avatarUrl,
    stars: totalStars,
    followers: profile.followers,
    contributions: profile.contributionsStats?.totalContributions || 4040,
    languages: profile.topLanguages?.map((l) => l.name) || ["Assembly", "C", "Rust"],
    theme: "rose",
  });

  parts.push(`<div align="center">\n  <img src="${arcadeSvgUri}" width="100%" alt="${username} Arcade Cabinet" />\n</div>\n`);

  parts.push(`## 🕹️ ${header.name || profile.name} // 8-Bit Developer Arena\n`);
  parts.push(`> *"Insert coin to ship code."*\n`);

  if (featuredRepos.show && featuredRepos.repos.length > 0) {
    const selected = featuredRepos.repos.filter((r) => r.selected !== false);
    if (selected.length > 0) {
      parts.push(`### 🏆 High Score Leaderboard (Top Repositories)\n`);
      parts.push(`| RANK | PLAYER REPOSITORY | STARS (PTS) | FORKS | CODE CLASS |`);
      parts.push(`| :--- | :--- | :--- | :--- | :--- |`);
      selected.forEach((r, idx) => {
        parts.push(`| **#${idx + 1}** | [**${r.name}**](${r.url}) | **${r.stars}** PTS | ${r.forks} | \`${r.language || "ASM"}\` |`);
      });
      parts.push(`\n`);
    }
  }

  if (skills.show && skills.selectedSkills.length > 0) {
    parts.push(`### ⚔️ Special Powers & Inventory\n`);
    parts.push(renderSkillsMarkdown(skills.selectedSkills, "shields", "left") + "\n");
  }

  if (githubStats.showStatsCard || githubStats.showStreakCard) {
    parts.push(`### 📊 Combo Meter & Power Ups\n`);
    const cards: string[] = [];
    if (githubStats.showStatsCard) {
      cards.push(`<a href="https://gitcon.infornics.com/user/${username}"><img height="155em" src="https://github-readme-stats-fast.vercel.app/api?username=${username}&show_icons=true&theme=blood&hide_border=false" /></a>`);
    }
    if (githubStats.showStreakCard) {
      cards.push(`<a href="https://gitcon.infornics.com/user/${username}"><img height="155em" src="https://streak-stats.demolab.com?user=${username}&theme=blood&hide_border=false" /></a>`);
    }
    parts.push(`<p align="center">\n  ${cards.join("\n  ")}\n</p>\n`);
  }

  return parts.join("\n");
}

export function generateMagazineTemplate(profile: ReadmeProfileData, config: ReadmeConfig): string {
  const { header, aboutMe, skills, githubStats, featuredRepos, socials, statsTheme } = config;
  const username = profile.username;
  const parts: string[] = [];

  parts.push(`<div align="center">\n`);
  parts.push(`  <table width="100%"><tr><td align="center" style="border: 2px solid #8B5CF6; border-radius: 12px; padding: 20px;">`);
  parts.push(`    <p><sub><b>ISSUE NO. 2026 // THE DEVELOPER QUARTERLY</b></sub></p>`);
  parts.push(`    <h1 style="font-size: 38px; letter-spacing: 2px;">DEV·MAGAZINE</h1>`);
  parts.push(`    <h2>COVER FEATURE: ${header.name || profile.name}</h2>`);
  parts.push(`    <p><i>"${header.title || "The Architecture of Modern Systems"}: How engineering craft and velocity redefine the web."</i></p>`);
  parts.push(`    <p><b>${profile.followers}</b> SUBSCRIBERS · <b>${profile.publicRepos}</b> EDITIONS · <b>${profile.contributionsStats?.totalContributions || 0}</b> CONTRIBUTIONS</p>`);
  parts.push(`  </td></tr></table>\n</div>\n\n---\n`);

  parts.push(`### 📰 Inside This Edition\n`);
  parts.push(`- 🖋️ **The Cover Story:** ${aboutMe.workingOn || "Architecting high-scale applications and tools"}`);
  parts.push(`- 🔬 **Tech Spec Column:** ${aboutMe.learning || "Deep dive into reactive systems and distributed caches"}`);
  parts.push(`- 💬 **Editorial Interview:** ${aboutMe.askMeAbout || "Ask me about modern developer ergonomics"}`);
  parts.push(`- 📮 **Letters to the Editor:** ${socials.email ? `[Send dispatch to ${socials.email}](mailto:${socials.email})` : "Reach via GitHub"}\n`);

  if (skills.show && skills.selectedSkills.length > 0) {
    parts.push(`### 🎨 The Designer & Engineer's Palette\n`);
    parts.push(renderSkillsMarkdown(skills.selectedSkills, "skillicons", "center") + "\n");
  }

  if (featuredRepos.show && featuredRepos.repos.length > 0) {
    const selected = featuredRepos.repos.filter((r) => r.selected !== false);
    if (selected.length > 0) {
      parts.push(`### 📚 Portfolio Case Studies\n`);
      selected.forEach((r, idx) => {
        parts.push(`#### [Feature ${idx + 1}] [${r.name}](${r.url})`);
        parts.push(`> ${r.description || "A deep study into scalable system architecture."}`);
        parts.push(`*Published in \`${r.language || "Code"}\` with ${r.stars} stars of peer acclaim.*\n`);
      });
    }
  }

  return parts.join("\n");
}

export function generateCharacterSheetTemplate(profile: ReadmeProfileData, config: ReadmeConfig): string {
  const { header, aboutMe, skills, githubStats, featuredRepos, socials, statsTheme } = config;
  const username = profile.username;
  const parts: string[] = [];

  const level = Math.max(1, Math.min(99, Math.floor((profile.publicRepos || 5) * 1.5 + (profile.followers || 0) * 0.1)));

  parts.push("```");
  parts.push("===================================================================");
  parts.push(`CHARACTER SHEET: ${header.name.toUpperCase()} (LEVEL ${level})`);
  parts.push(`CLASS: ${String(header.title || "CODE WIZARD").toUpperCase()} // GUILD: ${profile.company ? profile.company.toUpperCase() : "INDEPENDENT"}`);
  parts.push("===================================================================");
  parts.push(`HP: [${"█".repeat(12)}${"░".repeat(4)}] 3,500/4,000       MANA: [${"█".repeat(14)}${"░".repeat(2)}] 9,200/10,000`);
  parts.push(`STRENGTH  : 88 (Heavy Refactoring)    INTELLECT : 96 (System Architecture)`);
  parts.push(`AGILITY   : 92 (Sprint Velocity)       WISDOM    : 90 (Debug Instinct)`);
  parts.push(`STAMINA   : 99 (Hackathon Survivor)    CHARISMA  : 85 (Docs & Mentoring)`);
  parts.push("===================================================================");
  parts.push("```\n");

  parts.push(`### 📜 Active Quests & Campaign\n`);
  parts.push(`- ⚔️ **Main Quest:** ${aboutMe.workingOn || "Slay technical debt and summon high-scale microservices"}`);
  parts.push(`- 🔮 **Spellbook Study:** ${aboutMe.learning || "Ancient scrolls of distributed algorithms"}`);
  parts.push(`- 🤝 **Party Recruitment:** ${aboutMe.collaborateOn || "Looking for brave companions for ambitious builds"}\n`);

  if (skills.show && skills.selectedSkills.length > 0) {
    parts.push(`### 🎒 Inventory & Equipped Weapons\n`);
    parts.push(renderSkillsMarkdown(skills.selectedSkills, "shields", "left") + "\n");
  }

  if (featuredRepos.show && featuredRepos.repos.length > 0) {
    const selected = featuredRepos.repos.filter((r) => r.selected !== false);
    if (selected.length > 0) {
      parts.push(`### 🗝️ Legendary Artifacts (Forged Repositories)\n`);
      selected.forEach((r) => {
        parts.push(`- 🗡️ **[${r.name}](${r.url})**: ${r.description || "Mythic equipment"} [⭐ +${r.stars} ATK] (\`${r.language}\`)`);
      });
      parts.push(`\n`);
    }
  }

  return parts.join("\n");
}

export function generateNightShiftTemplate(profile: ReadmeProfileData, config: ReadmeConfig): string {
  const { header, aboutMe, skills, githubStats, featuredRepos, socials, statsTheme } = config;
  const username = profile.username;
  const totalStars = featuredRepos.repos.reduce((acc, r) => acc + (r.stars || 0), 0);
  const parts: string[] = [];

  const heroSvgUri = createHeroBannerSvg({
    username,
    name: header.name || profile.name || username,
    title: header.title || "Full-Stack Engineer · Night Shift",
    avatarUrl: profile.avatarUrl,
    avatarBase64: profile.avatarBase64,
    stars: totalStars,
    followers: profile.followers,
    contributions: profile.contributionsStats?.totalContributions || 0,
    languages: profile.topLanguages?.map((l) => l.name) || ["TypeScript", "Next.js", "Tailwind"],
    theme: "purple",
  });

  parts.push(`<div align="center">\n  <img src="${heroSvgUri}" width="100%" alt="${username} Night Shift Profile" />\n</div>\n`);

  parts.push(`<div align="center">\n`);
  parts.push(`  <p>`);
  parts.push(`    <img src="https://img.shields.io/badge/Mode-OLED_Monochrome-000000?style=for-the-badge&logo=probot&logoColor=E879F9" />`);
  parts.push(`    <img src="https://img.shields.io/badge/Focus-Flow_State-701A75?style=for-the-badge" />`);
  parts.push(`  </p>\n</div>\n\n---\n`);

  parts.push(`### 🌃 Late Night Logs\n`);
  parts.push(`- ☕ **Current Midnight Build:** ${aboutMe.workingOn || "Refining performance and crafting delight"}`);
  parts.push(`- 🎧 **Soundtrack & Focus:** Synthwave, ambient electronics, zero distractions`);
  parts.push(`- 🧪 **Obsessed With:** ${aboutMe.learning || "Compiler internals, state machines, micro-interactions"}\n`);

  if (skills.show && skills.selectedSkills.length > 0) {
    parts.push(`### ⚡ Glow Stack\n`);
    parts.push(renderSkillsMarkdown(skills.selectedSkills, "skillicons", "center") + "\n");
  }

  if (featuredRepos.show && featuredRepos.repos.length > 0) {
    const selected = featuredRepos.repos.filter((r) => r.selected !== false);
    if (selected.length > 0) {
      parts.push(`### 🌙 Night Releases\n`);
      selected.forEach((r) => {
        parts.push(`- 🟣 **[${r.name}](${r.url})**: ${r.description || "Night release"} \`${r.language}\` (⭐ ${r.stars})`);
      });
      parts.push(`\n`);
    }
  }

  if (githubStats.showStatsCard || githubStats.showStreakCard) {
    parts.push(`### 📈 Midnight Rhythm\n`);
    const cards: string[] = [];
    if (githubStats.showStatsCard) {
      cards.push(`<a href="https://gitcon.infornics.com/user/${username}"><img height="155em" src="https://github-readme-stats-fast.vercel.app/api?username=${username}&show_icons=true&theme=synthwave&hide_border=false" /></a>`);
    }
    if (githubStats.showStreakCard) {
      cards.push(`<a href="https://gitcon.infornics.com/user/${username}"><img height="155em" src="https://streak-stats.demolab.com?user=${username}&theme=synthwave&hide_border=false" /></a>`);
    }
    parts.push(`<p align="center">\n  ${cards.join("\n  ")}\n</p>\n`);
  }

  return parts.join("\n");
}

// =========================================================================
// 4. OPEN SOURCE & COMMUNITY TEMPLATES
// =========================================================================

export function generateMaintainerDeskTemplate(profile: ReadmeProfileData, config: ReadmeConfig): string {
  const { header, aboutMe, skills, githubStats, featuredRepos, socials, statsTheme } = config;
  const username = profile.username;
  const parts: string[] = [];

  parts.push(`<div align="center">\n`);
  parts.push(`  <h1>🌱 ${header.name || profile.name}</h1>`);
  parts.push(`  <p><b>Open-Source Maintainer & Software Steward</b></p>\n`);
  parts.push(`  <p>`);
  parts.push(`    <a href="https://github.com/sponsors/${username}"><img src="https://img.shields.io/badge/Sponsor-Support_Open_Source-EA4AAA?style=for-the-badge&logo=githubsponsors&logoColor=white" /></a>`);
  parts.push(`    <a href="https://github.com/${username}"><img src="https://img.shields.io/badge/Public_Repos-${profile.publicRepos}-10B981?style=for-the-badge&logo=github&logoColor=white" /></a>`);
  parts.push(`    <a href="https://github.com/${username}?tab=followers"><img src="https://img.shields.io/badge/Followers-${profile.followers}-3B82F6?style=for-the-badge&logo=github" /></a>`);
  parts.push(`  </p>\n</div>\n\n---\n`);

  parts.push(`### 📋 Open-Source Stewardship Policy\n`);
  parts.push(`- 🤝 **Community First:** I review PRs, triage issues, and maintain documentation for developers worldwide.`);
  parts.push(`- 🧭 **Core Roadmap:** ${aboutMe.workingOn || "Refining libraries, stabilizing APIs, and improving developer ergonomics"}`);
  parts.push(`- 💡 **Help Wanted:** Check any repository with the \`good first issue\` tag to contribute.`);
  parts.push(`- 💬 **Governance Questions:** ${aboutMe.askMeAbout || "Open-source licensing, RFC processes, and project roadmaps"}\n`);

  if (featuredRepos.show && featuredRepos.repos.length > 0) {
    const selected = featuredRepos.repos.filter((r) => r.selected !== false);
    if (selected.length > 0) {
      parts.push(`### 📦 Maintained Repositories & Libraries\n`);
      parts.push(`| Package | Description | Stars | Forks | CI / Activity |`);
      parts.push(`| :--- | :--- | :--- | :--- | :--- |`);
      selected.forEach((r) => {
        parts.push(`| [**${r.name}**](${r.url}) | ${r.description || "Active open-source library"} | ⭐ **${r.stars}** | 🍴 ${r.forks} | [![Issues](https://img.shields.io/github/issues-raw/${username}/${r.name}?style=flat-square)](https://github.com/${username}/${r.name}/issues) |`);
      });
      parts.push(`\n`);
    }
  }

  if (skills.show && skills.selectedSkills.length > 0) {
    parts.push(`### 🛠️ Core Tooling & Ecosystem\n`);
    parts.push(renderSkillsMarkdown(skills.selectedSkills, "shields", "left") + "\n");
  }

  if (githubStats.showStatsCard || githubStats.showActivityGraph) {
    parts.push(`### 📈 Contribution Rhythm\n`);
    if (githubStats.showActivityGraph) {
      parts.push(`<p align="center">\n  <img src="https://github-readme-activity-graph.vercel.app/graph?username=${username}&theme=github-compact" alt="Activity Graph" />\n</p>\n`);
    }
  }

  return parts.join("\n");
}

export function generateCommitMetroTemplate(profile: ReadmeProfileData, config: ReadmeConfig): string {
  const { header, aboutMe, skills, githubStats, featuredRepos, socials, statsTheme } = config;
  const username = profile.username;
  const parts: string[] = [];

  parts.push("```");
  parts.push("=========================================================================");
  parts.push(`  METRO TRANSIT MAP // NETWORK DISPATCH: ${username.toUpperCase()}`);
  parts.push("=========================================================================");
  parts.push("  [Line 1: Frontend]  ◉───◉───◉───◉───[STATION: SHIPPED UI]");
  parts.push("                            │");
  parts.push("  [Line 2: Backend]   ◉───◉───●───◉───[STATION: SCALED API]  (Transfer)");
  parts.push("                      │     │");
  parts.push("  [Line 3: Cloud]     ◉───●─┼─────◉───[STATION: PROD K8S]");
  parts.push("=========================================================================");
  parts.push("```\n");

  parts.push(`## 🚇 ${header.name || profile.name} // Commit Transit System\n`);
  parts.push(`> *"Every commit is a train departure. Reliability is the timetable."*\n`);

  if (featuredRepos.show && featuredRepos.repos.length > 0) {
    const selected = featuredRepos.repos.filter((r) => r.selected !== false);
    if (selected.length > 0) {
      parts.push(`### 🚉 Key Transit Stations (Repositories)\n`);
      selected.forEach((r, idx) => {
        parts.push(`- 🚊 **Station 0${idx + 1} · [${r.name}](${r.url})**: ${r.description || "Terminal hub"} · \`${r.language}\` (⭐ ${r.stars} passengers)`);
      });
      parts.push(`\n`);
    }
  }

  if (skills.show && skills.selectedSkills.length > 0) {
    parts.push(`### 🗺️ Transit Lines & Interchanges (Tech Stack)\n`);
    parts.push(renderSkillsMarkdown(skills.selectedSkills, "shields", "left") + "\n");
  }

  if (githubStats.showStatsCard || githubStats.showStreakCard) {
    parts.push(`### ⏱️ Network Schedule & Velocity\n`);
    const cards: string[] = [];
    if (githubStats.showStatsCard) {
      cards.push(`<a href="https://gitcon.infornics.com/user/${username}"><img height="155em" src="https://github-readme-stats-fast.vercel.app/api?username=${username}&show_icons=true&theme=${statsTheme}&hide_border=false" /></a>`);
    }
    if (githubStats.showStreakCard) {
      cards.push(`<a href="https://gitcon.infornics.com/user/${username}"><img height="155em" src="https://streak-stats.demolab.com?user=${username}&theme=${statsTheme}&hide_border=false" /></a>`);
    }
    parts.push(`<p align="center">\n  ${cards.join("\n  ")}\n</p>\n`);
  }

  return parts.join("\n");
}

export function generateFounderLogTemplate(profile: ReadmeProfileData, config: ReadmeConfig): string {
  const { header, aboutMe, skills, githubStats, featuredRepos, socials, statsTheme } = config;
  const username = profile.username;
  const parts: string[] = [];

  parts.push(`<div align="center">\n`);
  parts.push(`  <img src="https://readme-typing-svg.demolab.com?font=Plus+Jakarta+Sans&weight=700&size=24&pause=1000&color=F59E0B&center=true&vCenter=true&width=550&lines=Indie+Hacker+%26+Founder;Building+in+Public;Shipping+Micro-SaaS+Products" alt="Founder Log" />\n`);
  parts.push(`  <h1>🚀 ${header.name || profile.name}</h1>`);
  parts.push(`  <p><b>Founder · Indie Hacker · Shipping Products That Pay The Rent</b></p>\n`);
  parts.push(`  <p>`);
  parts.push(`    <img src="https://img.shields.io/badge/Mindset-Ship_or_Die-D97706?style=for-the-badge" />`);
  parts.push(`    <img src="https://img.shields.io/badge/Products_Live-${featuredRepos.repos.length || 3}-10B981?style=for-the-badge" />`);
  parts.push(`    <img src="https://img.shields.io/badge/Mode-Build_In_Public-3B82F6?style=for-the-badge" />`);
  parts.push(`  </p>\n</div>\n\n---\n`);

  parts.push(`### 🛠️ The Founder's Build Log\n`);
  parts.push(`- 💡 **Primary Venture:** ${aboutMe.workingOn || "Bootstrapping software products with organic distribution"}`);
  parts.push(`- 📈 **Growth Thesis:** High velocity iterations, listening to users, fast feedback loops`);
  parts.push(`- 🔍 **Exploring Now:** ${aboutMe.learning || "Distribution strategies, developer APIs, viral growth"}`);
  parts.push(`- 💬 **Pitch Me / Talk Shop:** ${aboutMe.askMeAbout || "Product launches, MVP architecture, zero-to-one engineering"}\n`);

  if (featuredRepos.show && featuredRepos.repos.length > 0) {
    const selected = featuredRepos.repos.filter((r) => r.selected !== false);
    if (selected.length > 0) {
      parts.push(`### 📦 Shipped Product Fleet\n`);
      selected.forEach((r) => {
        parts.push(`- 🚀 **[${r.name}](${r.url})**: ${r.description || "Active bootstrapped software"} \`${r.language}\` (⭐ ${r.stars} fans)`);
      });
      parts.push(`\n`);
    }
  }

  if (skills.show && skills.selectedSkills.length > 0) {
    parts.push(`### ⚡ Fast-Execution Stack\n`);
    parts.push(renderSkillsMarkdown(skills.selectedSkills, "skillicons", "center") + "\n");
  }

  if (githubStats.showStatsCard || githubStats.showStreakCard) {
    parts.push(`### 📊 Shipping Momentum\n`);
    const cards: string[] = [];
    if (githubStats.showStatsCard) {
      cards.push(`<a href="https://gitcon.infornics.com/user/${username}"><img height="155em" src="https://github-readme-stats-fast.vercel.app/api?username=${username}&show_icons=true&theme=solarized-dark&hide_border=false" /></a>`);
    }
    if (githubStats.showStreakCard) {
      cards.push(`<a href="https://gitcon.infornics.com/user/${username}"><img height="155em" src="https://streak-stats.demolab.com?user=${username}&theme=solarized-dark&hide_border=false" /></a>`);
    }
    parts.push(`<p align="center">\n  ${cards.join("\n  ")}\n</p>\n`);
  }

  return parts.join("\n");
}

/**
 * 17. Velvet Crimson Editorial Template (Viral Instagram / Reel Aesthetic)
 * High-craft editorial typography, wine-red aura, architectural arch portrait,
 * custom section dividers, and matching crimson badge palette (#701A3D, #190B12, #F8F0F3).
 */
export function generateVelvetEditorialTemplate(profile: ReadmeProfileData, config: ReadmeConfig): string {
  const { header, aboutMe, skills, githubStats, featuredRepos, socials } = config;
  const username = profile.username;
  const totalStars = featuredRepos.repos.reduce((acc, r) => acc + (r.stars || 0), 0);
  const topLangs = profile.topLanguages?.map((l) => l.name) || ["Python", "TypeScript", "React", "Rust"];
  const parts: string[] = [];

  // 1. Signature Velvet Editorial Hero Banner
  const heroSvg = createVelvetEditorialHeroSvg({
    username,
    name: header.name || profile.name || username,
    title: header.title || "AI & Full-Stack Engineer · Creative Technologist",
    avatarUrl: profile.avatarUrl,
    avatarBase64: profile.avatarBase64,
    stars: totalStars,
    followers: profile.followers,
    contributions: profile.contributionsStats?.totalContributions || 0,
    languages: topLangs,
    theme: "rose",
  });

  parts.push(`<div align="center">\n  <a href="https://gitcon.infornics.com/user/${username}">\n    <img src="${heroSvg}" width="100%" alt="${username} Editorial Profile" />\n  </a>\n</div>\n`);

  // Quick Action Buttons (Matching the Reel: Portfolio, LinkedIn, LeetCode, Email)
  parts.push(`<p align="center">`);
  if (profile.website) {
    parts.push(`  <a href="${profile.website}"><img src="https://img.shields.io/badge/Portfolio-${encodeURIComponent(username)}.dev-701A3D?style=for-the-badge&labelColor=190B12&logoColor=F8F0F3&logo=githubpages" alt="Portfolio" /></a>`);
  } else {
    parts.push(`  <a href="https://gitcon.infornics.com/user/${username}"><img src="https://img.shields.io/badge/Profile-Gitcon_Studio-701A3D?style=for-the-badge&labelColor=190B12&logoColor=F8F0F3&logo=github" alt="Profile" /></a>`);
  }
  if (socials.linkedin) {
    parts.push(`  <a href="https://linkedin.com/in/${socials.linkedin}"><img src="https://img.shields.io/badge/LinkedIn-Connect-701A3D?style=for-the-badge&labelColor=190B12&logoColor=F8F0F3&logo=linkedin" alt="LinkedIn" /></a>`);
  }
  if (socials.twitter) {
    parts.push(`  <a href="https://twitter.com/${socials.twitter}"><img src="https://img.shields.io/badge/Twitter-@${socials.twitter}-701A3D?style=for-the-badge&labelColor=190B12&logoColor=F8F0F3&logo=twitter" alt="Twitter" /></a>`);
  }
  if (socials.email) {
    parts.push(`  <a href="mailto:${socials.email}"><img src="https://img.shields.io/badge/Email-Get_in_Touch-701A3D?style=for-the-badge&labelColor=190B12&logoColor=F8F0F3&logo=gmail" alt="Email" /></a>`);
  }
  parts.push(`</p>\n`);

  // Section 01: About
  const aboutDivider = createVelvetSectionDividerSvg("01", "About", `Hello, I'm ${header.name?.split(" ")[0] || username}.`);
  parts.push(`<img src="${aboutDivider}" width="100%" alt="01 About" />\n`);

  const bioText = profile.bio || "Engineering intelligence. Designing experiences with modern software.";
  const locationText = profile.location ? `Based in **${profile.location}**` : "Building globally";
  const orgText = profile.company ? `Working at **${profile.company}**` : "Independent software engineer";

  parts.push(`> ### ✦ Creative Dossier & Career Thesis`);
  parts.push(`> ${bioText}`);
  parts.push(`> `);
  parts.push(`> 📍 ${locationText} &nbsp;·&nbsp; 🏛️ ${orgText} &nbsp;·&nbsp; ⚡ **${profile.publicRepos}** Repositories &nbsp;·&nbsp; 👥 **${profile.followers}** Followers\n`);

  if (aboutMe.show) {
    if (aboutMe.workingOn) parts.push(`- 🚀 **Currently Building:** ${aboutMe.workingOn}`);
    if (aboutMe.learning) parts.push(`- 🧠 **Research & Deep-Dive:** ${aboutMe.learning}`);
    if (aboutMe.collaborateOn) parts.push(`- 🤝 **Open for Collaboration:** ${aboutMe.collaborateOn}`);
    if (aboutMe.askMeAbout) parts.push(`- 💬 **Ask Me About:** ${aboutMe.askMeAbout}`);
    parts.push(`\n`);
  }

  // Section 02: Selected Work
  if (featuredRepos.show && featuredRepos.repos.length > 0) {
    const selected = featuredRepos.repos.filter((r) => r.selected !== false);
    if (selected.length > 0) {
      const workDivider = createVelvetSectionDividerSvg("02", "Selected Work", "Products, not assignments.");
      parts.push(`<img src="${workDivider}" width="100%" alt="02 Selected Work" />\n`);

      // Render each project as an animated Velvet Editorial card with moving laser border
      selected.forEach((repo, idx) => {
        const cardSvgUri = createVelvetProjectCardSvg({
          index: idx + 1,
          name: repo.name,
          description: repo.description || "Production system and verified implementation.",
          language: repo.language || "Code",
          stars: repo.stars || 0,
          forks: repo.forks || 0,
          tags: [repo.language || "Software", "Production", "Verified", "Gitcon"],
          repoUrl: repo.url,
        });

        parts.push(`<a href="${repo.url}">\n  <img src="${cardSvgUri}" width="100%" alt="${repo.name}" />\n</a>\n`);
        parts.push(`<p align="center">\n  <a href="${repo.url}"><img src="https://img.shields.io/badge/Repository-${encodeURIComponent(repo.name.replace(/-/g, "--"))}-451126?style=for-the-badge&labelColor=190B12&logoColor=F8F0F3&logo=github" alt="${repo.name} repository" /></a>\n</p>\n`);
      });
    }
  }

  // Section 03: Toolkit
  if (skills.show && skills.selectedSkills.length > 0) {
    const toolkitDivider = createVelvetSectionDividerSvg("03", "Toolkit", "The tools I reach for.");
    parts.push(`<img src="${toolkitDivider}" width="100%" alt="03 Toolkit" />\n`);
    parts.push(renderSkillsMarkdown(skills.selectedSkills, "shields", "center") + "\n");
  }

  // Section 04: Commit Log & Telemetry
  if (githubStats.showStatsCard || githubStats.showStreakCard) {
    const commitDivider = createVelvetSectionDividerSvg("04", "Commit Log", "A year of building, one square at a time.");
    parts.push(`<img src="${commitDivider}" width="100%" alt="04 Commit Log" />\n`);

    const cards: string[] = [];
    if (githubStats.showStatsCard) {
      cards.push(`<a href="https://gitcon.infornics.com/user/${username}"><img height="165em" src="https://github-readme-stats-fast.vercel.app/api?username=${username}&show_icons=true&hide_rank=true&hide_border=true&border_radius=16&bg_color=190B12&title_color=E5B5C7&text_color=B6A3AC&icon_color=C77B9B&custom_title=GitHub%20At%20A%20Glance" /></a>`);
    }
    if (githubStats.showStreakCard) {
      cards.push(`<a href="https://gitcon.infornics.com/user/${username}"><img height="165em" src="https://streak-stats.demolab.com?user=${username}&hide_border=true&border_radius=16&background=190B12&ring=701A3D&fire=E5B5C7&currStreakNum=F8F0F3&sideNums=E5B5C7&currStreakLabel=C77B9B&sideLabels=B6A3AC&dates=701A3D" /></a>`);
    }
    parts.push(`<p align="center">\n  ${cards.join("\n  ")}\n</p>\n`);
  }

  // Section 05: Connect
  const connectDivider = createVelvetSectionDividerSvg("05", "Connect", "Let's build something worth explaining.");
  parts.push(`<img src="${connectDivider}" width="100%" alt="05 Connect" />\n`);

  parts.push(`<p align="center">`);
  parts.push(`  <a href="https://github.com/${username}"><img src="https://img.shields.io/badge/GitHub-@${username}-701A3D?style=for-the-badge&labelColor=190B12&logoColor=F8F0F3&logo=github" alt="GitHub" /></a>`);
  if (socials.linkedin) {
    parts.push(`  <a href="https://linkedin.com/in/${socials.linkedin}"><img src="https://img.shields.io/badge/LinkedIn-Connect-701A3D?style=for-the-badge&labelColor=190B12&logoColor=F8F0F3&logo=linkedin" alt="LinkedIn" /></a>`);
  }
  if (socials.email) {
    parts.push(`  <a href="mailto:${socials.email}"><img src="https://img.shields.io/badge/Email-Direct_Reach-701A3D?style=for-the-badge&labelColor=190B12&logoColor=F8F0F3&logo=gmail" alt="Email" /></a>`);
  }
  parts.push(`</p>\n`);

  return parts.join("\n");
}

// =========================================================================
// 5. ANIME SHINOBI ARC TEMPLATE (Viral Reel Style)
// =========================================================================

export function generateAnimeShinobiTemplate(profile: ReadmeProfileData, config: ReadmeConfig): string {
  const { featuredRepos, githubStats, socials } = config;
  const username = profile.username;
  const parts: string[] = [];

  // Hero Section
  parts.push(`<div align="center">\n`);
  const heroSvg = createAnimeHeroSvg(profile, config);
  parts.push(`<!-- 🎬 HERO video intro -->\n<img src="${heroSvg}" alt="Hi, I'm ${profile.name || username} — Shinobi Developer" width="100%"/>\n`);
  parts.push(`<br/><br/>\n`);

  // Team 7 dance GIF
  parts.push(`<img src="https://raw.githubusercontent.com/Meghamittal0920/Meghamittal0920/main/team7-dance.gif" alt="Team 7 chibi dance" width="260"/>\n`);
  parts.push(`<br/>\n`);

  // Ninja Way
  const ninjaWaySvg = createAnimeNinjaWaySvg(profile, config);
  parts.push(`<!-- 🍥 MY NINJA WAY -->\n<img src="${ninjaWaySvg}" alt="My ninja way — what I build" width="100%"/>\n`);
  parts.push(`<br/><br/>\n`);

  // Jutsu Stack
  const jutsuStackSvg = createAnimeJutsuStackSvg(profile, config);
  parts.push(`<!-- 🔦 JUTSU ARSENAL -->\n<img src="${jutsuStackSvg}" alt="Jutsu arsenal — my tech stack" width="100%"/>\n`);
  parts.push(`<br/><br/>\n`);

  // Ninja ID + Mission Dashboard
  const ninjaIdSvg = createAnimeNinjaIdSvg(profile, config);
  parts.push(`<!-- 🪪 NINJA REGISTRATION + MISSION DASHBOARD -->\n<img src="${ninjaIdSvg}" alt="Ninja registration card and live GitHub dashboard" width="100%"/>\n`);
  parts.push(`<br/><br/>\n</div>\n`);

  // S-Rank Missions Table
  if (featuredRepos.show && featuredRepos.repos.length > 0) {
    const selected = featuredRepos.repos.filter((r) => r.selected !== false);
    if (selected.length > 0) {
      parts.push(`## 🍥 S-Rank Missions\n`);
      parts.push(`<table>`);
      parts.push(`<tr><th>Mission</th><th>What it is</th><th>Jutsu used</th><th align="center">⭐</th></tr>`);
      selected.forEach((repo) => {
        parts.push(
          `<tr><td><a href="${repo.url}"><b>${repo.name}</b></a></td><td>${repo.description || "Production shinobi system"}</td><td><code>${repo.language || "Code"}</code></td><td align="center"><b>${repo.stars || 0}</b></td></tr>`
        );
      });
      parts.push(`</table>\n`);
      parts.push(`<div align="center">\n<a href="https://github.com/${username}?tab=repositories"><b>→ See all repositories</b></a>\n<br/><br/>\n</div>\n`);
    }
  }

  // Contribution Village & Rasengan
  parts.push(`<div align="center">\n`);
  parts.push(`<img src="https://raw.githubusercontent.com/Meghamittal0920/Meghamittal0920/main/rasengan-run.gif" alt="Naruto running with a rasengan" width="150"/>\n`);
  parts.push(`### 🌃 My contribution village\n\n*Every commit raises another building — rebuilt automatically every day.*\n`);

  if (githubStats.showStatsCard || githubStats.showStreakCard) {
    const cards: string[] = [];
    if (githubStats.showStatsCard) {
      cards.push(`<a href="https://gitcon.infornics.com/user/${username}"><img height="165em" src="https://github-readme-stats-fast.vercel.app/api?username=${username}&show_icons=true&hide_rank=true&hide_border=true&border_radius=16&bg_color=171B28&title_color=FF7A1A&text_color=8B93A7&icon_color=4AA8FF&custom_title=Shinobi%20Telemetry" /></a>`);
    }
    if (githubStats.showStreakCard) {
      cards.push(`<a href="https://gitcon.infornics.com/user/${username}"><img height="165em" src="https://streak-stats.demolab.com?user=${username}&hide_border=true&border_radius=16&background=171B28&ring=FF7A1A&fire=FFB52E&currStreakNum=EEF1F7&sideNums=4AA8FF&currStreakLabel=FF7A1A&sideLabels=8B93A7&dates=FF7A1A" /></a>`);
    }
    parts.push(`<p align="center">\n  ${cards.join("\n  ")}\n</p>\n`);
  }

  // Connect Section
  const connectSvg = createAnimeConnectSvg(profile, config);
  parts.push(`<!-- 💌 JOIN THE SQUAD -->\n<img src="${connectSvg}" alt="Let's connect" width="100%"/>\n`);

  parts.push(`<p align="center">`);
  parts.push(`  <a href="https://github.com/${username}"><img src="https://img.shields.io/badge/GitHub-ff7a1a?style=for-the-badge&logo=github&logoColor=0b0d13" alt="GitHub"/></a>`);
  if (socials.email) {
    parts.push(`  <a href="mailto:${socials.email}"><img src="https://img.shields.io/badge/Email-e2383f?style=for-the-badge&logo=gmail&logoColor=0b0d13" alt="Email"/></a>`);
  }
  if (socials.linkedin) {
    parts.push(`  <a href="https://linkedin.com/in/${socials.linkedin}"><img src="https://img.shields.io/badge/LinkedIn-4aa8ff?style=for-the-badge&logo=linkedin&logoColor=0b0d13" alt="LinkedIn"/></a>`);
  }
  if (socials.twitter) {
    parts.push(`  <a href="https://twitter.com/${socials.twitter}"><img src="https://img.shields.io/badge/Twitter-2fd48a?style=for-the-badge&logo=x&logoColor=0b0d13" alt="Twitter"/></a>`);
  }
  parts.push(`</p>\n`);

  parts.push(`<br/>\n<img src="https://raw.githubusercontent.com/Meghamittal0920/Meghamittal0920/main/chibi-walk.gif" alt="Chibi Naruto walking" width="90"/>\n`);
  parts.push(`\n**Dattebayo — keep coding, keep growing.** 🍥\n`);
  parts.push(`</div>\n`);

  return parts.join("\n");
}

/**
 * Route generator for all extended Gitcon templates.
 */
export function generateExtendedTemplate(
  templateId: string,
  profile: ReadmeProfileData,
  config: ReadmeConfig
): string | null {
  switch (templateId) {
    // Creative
    case "anime-shinobi":
      return generateAnimeShinobiTemplate(profile, config);
    // Recruiter
    case "recruiter-ready":
      return generateRecruiterReadyTemplate(profile, config);
    case "case-file":
      return generateCaseFileTemplate(profile, config);
    case "hire-me-fast":
      return generateHireMeFastTemplate(profile, config);
    case "student-velocity":
      return generateStudentVelocityTemplate(profile, config);

    // Technical
    case "plain-terminal":
      return generatePlainTerminalTemplate(profile, config);
    case "data-lab":
      return generateDataLabTemplate(profile, config);
    case "devops-cloud":
      return generateDevOpsCloudTemplate(profile, config);
    case "neofetch-hacker":
      return generateNeofetchTemplate(profile, config);

    // Creative
    case "velvet-editorial":
      return generateVelvetEditorialTemplate(profile, config);
    case "mixtape-cassette":
      return generateMixtapeTemplate(profile, config);
    case "arcade-cabinet":
      return generateArcadeCabinetTemplate(profile, config);
    case "magazine-editorial":
      return generateMagazineTemplate(profile, config);
    case "character-sheet":
      return generateCharacterSheetTemplate(profile, config);
    case "night-shift":
      return generateNightShiftTemplate(profile, config);

    // Open Source
    case "maintainer-desk":
      return generateMaintainerDeskTemplate(profile, config);
    case "commit-metro":
      return generateCommitMetroTemplate(profile, config);
    case "founder-log":
      return generateFounderLogTemplate(profile, config);

    default:
      return null;
  }
}
