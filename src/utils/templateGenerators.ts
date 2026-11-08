import {
  ReadmeConfig,
  ReadmeProfileData,
  renderSkillsMarkdown,
  renderSocialsMarkdown,
  SKILLS_CATALOG,
} from "./readme";

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
  // 1. Recruiter / Career
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
    id: "case-file",
    name: "Engineer Case File",
    category: "recruiter",
    badge: "High-Signal",
    badgeColor: "bg-teal-500/15 text-teal-400 border-teal-500/30",
    description: "Typography-first executive dossier: career thesis, production systems, and verified outcomes.",
    accentColor: "#2DD4BF",
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
    id: "student-velocity",
    name: "Student Velocity",
    category: "recruiter",
    badge: "Learning Path",
    badgeColor: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
    description: "Designed for ambitious students & junior developers: learning trajectory, hackathons, and growth metrics.",
    accentColor: "#818CF8",
  },

  // 2. Technical / Systems
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
    id: "neofetch-hacker",
    name: "Neofetch Telemetry",
    category: "technical",
    badge: "SysAdmin",
    badgeColor: "bg-lime-500/15 text-lime-400 border-lime-500/30",
    description: "Authentic Neofetch OS / system report layout: CPU, uptime, memory, kernel, packages, and color blocks.",
    accentColor: "#A3E635",
  },

  // 3. Creative / Visual
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
    id: "arcade-cabinet",
    name: "Arcade Cabinet 8-Bit",
    category: "creative",
    badge: "Pixel Art",
    badgeColor: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    description: "Insert coin to play! 8-bit retro gaming cabinet, high-score leaderboard table, and pixel badges.",
    accentColor: "#FB7185",
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
    id: "character-sheet",
    name: "RPG Character Sheet",
    category: "creative",
    badge: "Level 99",
    badgeColor: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    description: "Tabletop RPG stats sheet: Class, HP, Mana, Quest Log, Inventory gear, and stat ability scores.",
    accentColor: "#FBBF24",
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

  // 4. Open-Source & Community
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
    id: "commit-metro",
    name: "Commit Metro Lines",
    category: "opensource",
    badge: "Transit Map",
    badgeColor: "bg-sky-500/15 text-sky-400 border-sky-500/30",
    description: "Subway route map design where language lines intersect at core repository transfer stations.",
    accentColor: "#38BDF8",
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
];

// =========================================================================
// 1. RECRUITER / CAREER TEMPLATES
// =========================================================================

export function generateRecruiterReadyTemplate(profile: ReadmeProfileData, config: ReadmeConfig): string {
  const { header, aboutMe, skills, githubStats, featuredRepos, socials, statsTheme } = config;
  const username = profile.username;
  const totalStars = featuredRepos.repos.reduce((acc, r) => acc + (r.stars || 0), 0);
  const parts: string[] = [];

  parts.push(`<div align="center">`);
  parts.push(`  <table width="100%">`);
  parts.push(`    <tr>`);
  parts.push(`      <td width="65%" valign="middle">`);
  parts.push(`        <p><sub><b>RECRUITER SIGNAL BRIEF</b> · <code>${username}</code></sub></p>`);
  parts.push(`        <h1>${header.name || profile.name}</h1>`);
  parts.push(`        <h3>${header.title || "Senior Software Engineer"}</h3>`);
  parts.push(`        <p>${profile.bio || aboutMe.bio || "Building robust, scalable production systems with high craft."}</p>`);
  parts.push(`        <p>`);
  parts.push(`          <a href="https://github.com/${username}"><img src="https://img.shields.io/badge/GitHub-Profile-181717?style=for-the-badge&logo=github&logoColor=white" /></a>`);
  if (socials.linkedin) {
    parts.push(`          <a href="https://linkedin.com/in/${socials.linkedin}"><img src="https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" /></a>`);
  }
  if (socials.email) {
    parts.push(`          <a href="mailto:${socials.email}"><img src="https://img.shields.io/badge/Email-Direct_Reach-D14836?style=for-the-badge&logo=gmail&logoColor=white" /></a>`);
  }
  parts.push(`        </p>`);
  parts.push(`      </td>`);
  parts.push(`      <td width="35%" align="center" valign="middle">`);
  if (header.showAvatar && profile.avatarUrl) {
    parts.push(`        <img src="${profile.avatarUrl}" width="125" style="border-radius: 20px; border: 2px solid #34D399;" alt="${header.name}" />`);
  }
  parts.push(`      </td>`);
  parts.push(`    </tr>`);
  parts.push(`  </table>`);
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
  const parts: string[] = [];

  parts.push("```sh");
  parts.push(`┌──(${username}㉿gitcon-terminal)-[~]`);
  parts.push(`└─$ whoami --verbose`);
  parts.push(`Name      : ${header.name || profile.name}`);
  parts.push(`Role      : ${header.title || "Systems Software Engineer"}`);
  parts.push(`Location  : ${profile.location || "Localhost"}`);
  parts.push(`Company   : ${profile.company || "Independent"}`);
  parts.push(`Followers : ${profile.followers}`);
  parts.push(`Repos     : ${profile.publicRepos}`);
  parts.push(`Streak    : ${profile.contributionsStats?.currentStreak || 0} days active`);
  parts.push("```\n");

  parts.push("```sh");
  parts.push(`┌──(${username}㉿gitcon-terminal)-[~/status]`);
  parts.push(`└─$ cat /proc/current_mission.txt`);
  parts.push(`FOCUS    : ${aboutMe.workingOn || "Developing low-latency backend architectures"}`);
  parts.push(`LEARNING : ${aboutMe.learning || "Rust, Linux Kernel internals, eBPF"}`);
  parts.push(`ASK_ME   : ${aboutMe.askMeAbout || "Distributed consensus, memory optimization, database tuning"}`);
  parts.push("```\n");

  if (skills.show && skills.selectedSkills.length > 0) {
    parts.push("```sh");
    parts.push(`┌──(${username}㉿gitcon-terminal)-[~/toolchain]`);
    parts.push(`└─$ ls -l /usr/bin/active_stack`);
    const skillNames = skills.selectedSkills
      .map((id) => SKILLS_CATALOG.find((s) => s.id === id)?.name || id)
      .slice(0, 15);
    parts.push(skillNames.map((s) => `-rwxr-xr-x 1 ${username} dev 4096 Nov 08 2026 ${s.toLowerCase()}`).join("\n"));
    parts.push("```\n");
    parts.push(renderSkillsMarkdown(skills.selectedSkills, "shields", "left") + "\n");
  }

  if (featuredRepos.show && featuredRepos.repos.length > 0) {
    const selected = featuredRepos.repos.filter((r) => r.selected !== false);
    if (selected.length > 0) {
      parts.push("```sh");
      parts.push(`┌──(${username}㉿gitcon-terminal)-[~/repositories]`);
      parts.push(`└─$ gitcon repos --sort=stars --limit=5`);
      selected.forEach((r) => {
        parts.push(`* [⭐ ${String(r.stars).padEnd(4)}] ${r.name.padEnd(20)} (${(r.language || "Plain").padEnd(10)}) - ${r.url}`);
      });
      parts.push("```\n");
    }
  }

  if (githubStats.showStatsCard || githubStats.showStreakCard) {
    parts.push(`### 📡 Telemetry Monitors\n`);
    const cards: string[] = [];
    if (githubStats.showStatsCard) {
      cards.push(`<a href="https://gitcon.infornics.com/user/${username}"><img height="155em" src="https://github-readme-stats-fast.vercel.app/api?username=${username}&show_icons=true&theme=terminal&hide_border=false" /></a>`);
    }
    if (githubStats.showStreakCard) {
      cards.push(`<a href="https://gitcon.infornics.com/user/${username}"><img height="155em" src="https://streak-stats.demolab.com?user=${username}&theme=terminal&hide_border=false" /></a>`);
    }
    parts.push(`<p align="left">\n  ${cards.join("\n  ")}\n</p>\n`);
  }

  parts.push("```sh");
  parts.push(`┌──(${username}㉿gitcon-terminal)-[~/exit]`);
  parts.push(`└─$ echo "System normal. Process completed with returncode 0."`);
  parts.push("```\n");
  return parts.join("\n");
}

export function generateDataLabTemplate(profile: ReadmeProfileData, config: ReadmeConfig): string {
  const { header, aboutMe, skills, githubStats, featuredRepos, socials, statsTheme } = config;
  const username = profile.username;
  const parts: string[] = [];

  parts.push(`<div align="center">\n`);
  parts.push(`  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&pause=1000&color=06B6D4&center=true&vCenter=true&width=550&lines=Data+Lab+%26+Applied+AI+Research;Training+Foundation+Models;High-Throughput+Data+Pipelines" alt="Data Lab Banner" />\n`);
  parts.push(`  <h1>🧬 ${header.name || profile.name}</h1>`);
  parts.push(`  <p><b>Data Scientist · Machine Learning Engineer · Applied Systems Researcher</b></p>\n`);
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
  const parts: string[] = [];

  parts.push("```");
  parts.push(" ____________________________________________________ ");
  parts.push("|  ________________________________________________  |");
  parts.push(`| |  SIDE A: GREATEST HITS // ${username.toUpperCase().padEnd(20)} [HQ] | |`);
  parts.push("| |  ==============================================  | |");
  parts.push("| |   (o)   [==============================]   (o)   | |");
  parts.push("| |            [||||||||||||||||||||||]              | |");
  parts.push("| |                                                  | |");
  parts.push(`| |  TRACK: ${String(header.title || "Full Stack Symphony").slice(0, 39).padEnd(41)}| |`);
  parts.push("| |__________________________________________________| |");
  parts.push("|____________________________________________________|");
  parts.push("       \\__  52-WEEK EQUALIZER : [||||||||||...]  __/");
  parts.push("```\n");

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
  const parts: string[] = [];

  parts.push("```");
  parts.push("  ___________________________________________________  ");
  parts.push(" /                                                   \\ ");
  parts.push(`|   ★ ★ ★   ARCADE 1984: ${username.toUpperCase().padEnd(16)} ★ ★ ★    |`);
  parts.push(" \\___________________________________________________/ ");
  parts.push(" |  _______________________________________________  | ");
  parts.push(" | |                                               | | ");
  parts.push(` | |   PLAYER 1: READY                             | | `);
  parts.push(` | |   SCORE   : ${String(profile.contributionsStats?.totalContributions || 4040).padEnd(8)}   LEVEL: ${(profile.publicRepos || 10)}            | | `);
  parts.push(` | |   STREAK  : ${String(profile.contributionsStats?.currentStreak || 1).padEnd(8)}   LIVES: ★ ★ ★           | | `);
  parts.push(" | |                                               | | ");
  parts.push(" | |_______________________________________________| | ");
  parts.push(" |                                                   | ");
  parts.push(" |      [🕹️ JOYSTICK]         (A) (B) (C) [BUTTONS]  | ");
  parts.push(" \\___________________________________________________/ ");
  parts.push("```\n");

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
  const parts: string[] = [];

  parts.push(`<div align="center">\n`);
  parts.push(`  <img src="https://readme-typing-svg.demolab.com?font=Space+Grotesk&weight=700&size=24&pause=1000&color=E879F9&center=true&vCenter=true&width=500&lines=NIGHT+SHIFT+%2F%2F+02%3A00+AM;Shipping+Code+Under+Neon;Deep+Work.+Quiet+Execution." alt="Night Shift" />\n`);
  parts.push(`  <h1>🌑 ${header.name || profile.name}</h1>`);
  parts.push(`  <p><b>${header.title || "Full-Stack Engineer"} · Night Owl & Deep Work Practitioner</b></p>\n`);
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
 * Route generator for all extended Gitcon templates.
 */
export function generateExtendedTemplate(
  templateId: string,
  profile: ReadmeProfileData,
  config: ReadmeConfig
): string | null {
  switch (templateId) {
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
