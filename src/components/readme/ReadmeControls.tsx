import { useState } from "react";
import {
  HiAdjustmentsHorizontal,
  HiBriefcase,
  HiChartBar,
  HiCheck,
  HiCodeBracket,
  HiFolder,
  HiMagnifyingGlass,
  HiShare,
  HiSparkles,
  HiUser,
} from "react-icons/hi2";
import {
  ReadmeConfig,
  ReadmeProfileData,
  ReadmeTemplate,
  SKILLS_CATALOG,
  STATS_THEMES,
} from "../../utils/readme";

interface ReadmeControlsProps {
  config: ReadmeConfig;
  profile: ReadmeProfileData;
  onChange: (newConfig: ReadmeConfig) => void;
}

type TabType = "template" | "header" | "about" | "skills" | "stats" | "repos" | "socials";

export function ReadmeControls({ config, profile, onChange }: ReadmeControlsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("template");
  const [skillCategory, setSkillCategory] = useState<string>("all");
  const [skillSearch, setSkillSearch] = useState<string>("");

  const update = <K extends keyof ReadmeConfig>(key: K, value: ReadmeConfig[K]) => {
    onChange({ ...config, [key]: value });
  };

  const updateHeader = (subKey: keyof ReadmeConfig["header"], value: any) => {
    update("header", { ...config.header, [subKey]: value });
  };

  const updateAbout = (subKey: keyof ReadmeConfig["aboutMe"], value: any) => {
    update("aboutMe", { ...config.aboutMe, [subKey]: value });
  };

  const updateSkills = (subKey: keyof ReadmeConfig["skills"], value: any) => {
    update("skills", { ...config.skills, [subKey]: value });
  };

  const updateStats = (subKey: keyof ReadmeConfig["githubStats"], value: any) => {
    update("githubStats", { ...config.githubStats, [subKey]: value });
  };

  const updateSocials = (subKey: keyof ReadmeConfig["socials"], value: any) => {
    update("socials", { ...config.socials, [subKey]: value });
  };

  const toggleSkill = (skillId: string) => {
    const current = new Set(config.skills.selectedSkills);
    if (current.has(skillId)) {
      current.delete(skillId);
    } else {
      current.add(skillId);
    }
    updateSkills("selectedSkills", Array.from(current));
  };

  const toggleRepo = (index: number) => {
    const newRepos = [...config.featuredRepos.repos];
    newRepos[index] = {
      ...newRepos[index],
      selected: newRepos[index].selected === false ? true : false,
    };
    update("featuredRepos", { ...config.featuredRepos, repos: newRepos });
  };

  const filteredSkills = SKILLS_CATALOG.filter((skill) => {
    const matchesCategory = skillCategory === "all" || skill.category === skillCategory;
    const matchesSearch =
      skill.name.toLowerCase().includes(skillSearch.toLowerCase()) ||
      skill.id.toLowerCase().includes(skillSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const templates: Array<{
    id: ReadmeTemplate;
    title: string;
    description: string;
    badge: string;
  }> = [
    {
      id: "modern",
      title: "Modern Developer",
      description: "Clean typography, typing hero, sleek stats, badges & featured repos.",
      badge: "Popular",
    },
    {
      id: "minimal",
      title: "Minimalist Clean",
      description: "Typography-forward, distraction-free highlights, compact metrics.",
      badge: "Clean",
    },
    {
      id: "showcase",
      title: "Showcase Portfolio",
      description: "Comprehensive hero, detailed tables, skill matrix, and trophies.",
      badge: "Feature-Rich",
    },
    {
      id: "cyberpunk",
      title: "Cyberpunk Terminal",
      description: "Hacker / terminal aesthetic, interactive code block, neon telemetry.",
      badge: "Techy",
    },
  ];

  return (
    <div className="flex flex-col h-full rounded-2xl overflow-hidden border border-white/10 bg-surface">
      {/* Controls Navigation Tabs */}
      <div className="flex items-center overflow-x-auto border-b border-white/10 bg-surface-2/60 p-2 gap-1.5 scrollbar-none">
        <button
          onClick={() => setActiveTab("template")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === "template"
              ? "bg-primary text-text-inverse shadow-md"
              : "text-text-muted hover:text-text hover:bg-white/5"
          }`}
        >
          <HiSparkles className="w-4 h-4" />
          <span>Template</span>
        </button>

        <button
          onClick={() => setActiveTab("header")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === "header"
              ? "bg-primary text-text-inverse shadow-md"
              : "text-text-muted hover:text-text hover:bg-white/5"
          }`}
        >
          <HiUser className="w-4 h-4" />
          <span>Profile</span>
        </button>

        <button
          onClick={() => setActiveTab("about")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === "about"
              ? "bg-primary text-text-inverse shadow-md"
              : "text-text-muted hover:text-text hover:bg-white/5"
          }`}
        >
          <HiBriefcase className="w-4 h-4" />
          <span>About Me</span>
        </button>

        <button
          onClick={() => setActiveTab("skills")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === "skills"
              ? "bg-primary text-text-inverse shadow-md"
              : "text-text-muted hover:text-text hover:bg-white/5"
          }`}
        >
          <HiCodeBracket className="w-4 h-4" />
          <span>Tech Stack</span>
          <span className="px-1.5 py-0.2 rounded-full bg-surface-offset text-[10px] text-text font-mono">
            {config.skills.selectedSkills.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("stats")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === "stats"
              ? "bg-primary text-text-inverse shadow-md"
              : "text-text-muted hover:text-text hover:bg-white/5"
          }`}
        >
          <HiChartBar className="w-4 h-4" />
          <span>Stats & Rhythm</span>
        </button>

        <button
          onClick={() => setActiveTab("repos")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === "repos"
              ? "bg-primary text-text-inverse shadow-md"
              : "text-text-muted hover:text-text hover:bg-white/5"
          }`}
        >
          <HiFolder className="w-4 h-4" />
          <span>Repositories</span>
        </button>

        <button
          onClick={() => setActiveTab("socials")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === "socials"
              ? "bg-primary text-text-inverse shadow-md"
              : "text-text-muted hover:text-text hover:bg-white/5"
          }`}
        >
          <HiShare className="w-4 h-4" />
          <span>Socials</span>
        </button>
      </div>

      {/* Tab Panels Body */}
      <div className="p-5 overflow-y-auto space-y-6 max-h-[620px] text-sm">
        {/* 1. TEMPLATE TAB */}
        {activeTab === "template" && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-3">
                Choose README Template
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {templates.map((tpl) => {
                  const isSelected = config.template === tpl.id;
                  return (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => update("template", tpl.id)}
                      className={`text-left p-4 rounded-xl border transition-all relative ${
                        isSelected
                          ? "border-primary bg-primary/10 shadow-md ring-1 ring-primary/40"
                          : "border-white/10 bg-surface-2/60 hover:border-white/20 hover:bg-surface-2"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <strong className="font-bold text-text">{tpl.title}</strong>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isSelected
                              ? "bg-primary text-text-inverse"
                              : "bg-surface-offset text-text-muted"
                          }`}
                        >
                          {tpl.badge}
                        </span>
                      </div>
                      <p className="text-xs text-text-muted leading-relaxed">
                        {tpl.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stats Card Theme Picker */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                Stats Cards Color Palette
              </label>
              <select
                value={config.statsTheme}
                onChange={(e) => update("statsTheme", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-white/10 text-text text-sm focus:outline-none focus:border-primary"
              >
                {STATS_THEMES.map((theme) => (
                  <option key={theme.id} value={theme.id}>
                    {theme.name} Theme
                  </option>
                ))}
              </select>
              <p className="text-xs text-text-muted mt-1.5">
                Applied to GitHub Stats, Streak, and Top Languages visual cards.
              </p>
            </div>

            {/* Extras Toggles */}
            <div className="p-4 rounded-xl bg-surface-2/40 border border-white/5 space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted">
                Extras & Badges
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.extras.showVisitorBadge}
                  onChange={(e) =>
                    update("extras", {
                      ...config.extras,
                      showVisitorBadge: e.target.checked,
                    })
                  }
                  className="w-4 h-4 accent-primary rounded cursor-pointer"
                />
                <span className="text-xs text-text">Show Profile Views Counter badge</span>
              </label>
            </div>
          </div>
        )}

        {/* 2. HEADER TAB */}
        {activeTab === "header" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-text-muted mb-1.5">
                  Greeting Phrase
                </label>
                <input
                  type="text"
                  value={config.header.greeting}
                  onChange={(e) => updateHeader("greeting", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-white/10 text-text text-sm focus:outline-none focus:border-primary"
                  placeholder="Hi there 👋, I'm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-muted mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  value={config.header.name}
                  onChange={(e) => updateHeader("name", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-white/10 text-text text-sm focus:outline-none focus:border-primary"
                  placeholder="Your Name"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-muted mb-1.5">
                Subtitle / Headline
              </label>
              <input
                type="text"
                value={config.header.title}
                onChange={(e) => updateHeader("title", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-white/10 text-text text-sm focus:outline-none focus:border-primary"
                placeholder="Full Stack Developer & Open Source Contributor"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-text-muted mb-1.5">
                  Header Alignment
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => updateHeader("align", "center")}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      config.header.align === "center"
                        ? "bg-primary/20 border-primary text-primary"
                        : "bg-surface-2 border-white/10 text-text-muted"
                    }`}
                  >
                    Center
                  </button>
                  <button
                    type="button"
                    onClick={() => updateHeader("align", "left")}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      config.header.align === "left"
                        ? "bg-primary/20 border-primary text-primary"
                        : "bg-surface-2 border-white/10 text-text-muted"
                    }`}
                  >
                    Left
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-muted mb-1.5">
                  Avatar Display
                </label>
                <label className="flex items-center gap-3 p-2 rounded-xl bg-surface-2 border border-white/10 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.header.showAvatar}
                    onChange={(e) => updateHeader("showAvatar", e.target.checked)}
                    className="w-4 h-4 accent-primary rounded cursor-pointer"
                  />
                  <span className="text-xs text-text">Show GitHub avatar in header</span>
                </label>
              </div>
            </div>

            {/* Dynamic Typing Banner Settings */}
            <div className="p-4 rounded-xl bg-surface-2/40 border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <strong className="text-xs font-bold text-text block">
                    Dynamic Typing SVG Banner
                  </strong>
                  <span className="text-xs text-text-muted">
                    Animated typing effect for roles and mottos
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={config.header.typingEffect}
                  onChange={(e) => updateHeader("typingEffect", e.target.checked)}
                  className="w-4 h-4 accent-primary rounded cursor-pointer"
                />
              </div>

              {config.header.typingEffect && (
                <div className="space-y-2 pt-2">
                  <label className="block text-xs text-text-muted">
                    Typing lines (one per line):
                  </label>
                  <textarea
                    rows={3}
                    value={config.header.typingLines.join("\n")}
                    onChange={(e) =>
                      updateHeader(
                        "typingLines",
                        e.target.value.split("\n").filter((l) => l.trim().length > 0)
                      )
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-white/10 text-text text-xs focus:outline-none focus:border-primary font-mono"
                    placeholder="Enter lines..."
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. ABOUT ME TAB */}
        {activeTab === "about" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-2 border border-white/10">
              <span className="font-semibold text-text text-xs">Include About Me Section</span>
              <input
                type="checkbox"
                checked={config.aboutMe.show}
                onChange={(e) => updateAbout("show", e.target.checked)}
                className="w-4 h-4 accent-primary rounded cursor-pointer"
              />
            </div>

            {config.aboutMe.show && (
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-text-muted mb-1.5">
                    Bio Description
                  </label>
                  <textarea
                    rows={3}
                    value={config.aboutMe.bio}
                    onChange={(e) => updateAbout("bio", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-white/10 text-text text-sm focus:outline-none focus:border-primary"
                    placeholder="Write a brief introduction about yourself..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-muted mb-1">
                    🔭 Currently working on
                  </label>
                  <input
                    type="text"
                    value={config.aboutMe.workingOn}
                    onChange={(e) => updateAbout("workingOn", e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-2 border border-white/10 text-text text-sm focus:outline-none focus:border-primary"
                    placeholder="My Next.js SaaS, Open source CLI..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-muted mb-1">
                    🌱 Currently learning
                  </label>
                  <input
                    type="text"
                    value={config.aboutMe.learning}
                    onChange={(e) => updateAbout("learning", e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-2 border border-white/10 text-text text-sm focus:outline-none focus:border-primary"
                    placeholder="Rust, WebAssembly, Distributed systems..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-muted mb-1">
                    👯 Looking to collaborate on
                  </label>
                  <input
                    type="text"
                    value={config.aboutMe.collaborateOn}
                    onChange={(e) => updateAbout("collaborateOn", e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-2 border border-white/10 text-text text-sm focus:outline-none focus:border-primary"
                    placeholder="Open-source dev tools, AI workflows..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-muted mb-1">
                    💬 Ask me about
                  </label>
                  <input
                    type="text"
                    value={config.aboutMe.askMeAbout}
                    onChange={(e) => updateAbout("askMeAbout", e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-2 border border-white/10 text-text text-sm focus:outline-none focus:border-primary"
                    placeholder="React, TypeScript, GraphQL, Architecture..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-muted mb-1">
                    📫 How to reach me
                  </label>
                  <input
                    type="text"
                    value={config.aboutMe.reachMe}
                    onChange={(e) => updateAbout("reachMe", e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-2 border border-white/10 text-text text-sm focus:outline-none focus:border-primary"
                    placeholder="Email or Twitter handle"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-muted mb-1">
                    ⚡ Fun fact
                  </label>
                  <input
                    type="text"
                    value={config.aboutMe.funFact}
                    onChange={(e) => updateAbout("funFact", e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-2 border border-white/10 text-text text-sm focus:outline-none focus:border-primary"
                    placeholder="I convert coffee into clean code ☕"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. TECH STACK TAB */}
        {activeTab === "skills" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-text-muted">Badge Style:</span>
                <button
                  type="button"
                  onClick={() => updateSkills("badgeStyle", "shields")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    config.skills.badgeStyle === "shields"
                      ? "bg-primary text-text-inverse shadow-sm"
                      : "bg-surface-2 text-text-muted hover:text-text"
                  }`}
                >
                  Shields.io Badges
                </button>
                <button
                  type="button"
                  onClick={() => updateSkills("badgeStyle", "skillicons")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    config.skills.badgeStyle === "skillicons"
                      ? "bg-primary text-text-inverse shadow-sm"
                      : "bg-surface-2 text-text-muted hover:text-text"
                  }`}
                >
                  SkillIcons
                </button>
              </div>

              <div className="text-xs text-primary font-mono font-bold">
                {config.skills.selectedSkills.length} selected
              </div>
            </div>

            {/* Search and Category filters */}
            <div className="space-y-2">
              <div className="relative">
                <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  value={skillSearch}
                  onChange={(e) => setSkillSearch(e.target.value)}
                  placeholder="Search skills (e.g. React, Rust, Docker)..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface-2 border border-white/10 text-text text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex gap-1.5 overflow-x-auto py-1 scrollbar-none">
                {[
                  { id: "all", label: "All" },
                  { id: "languages", label: "Languages" },
                  { id: "frontend", label: "Frontend" },
                  { id: "backend", label: "Backend" },
                  { id: "databases", label: "Databases" },
                  { id: "devops", label: "DevOps & Cloud" },
                  { id: "tools", label: "Tools" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSkillCategory(cat.id)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all shrink-0 ${
                      skillCategory === cat.id
                        ? "bg-primary/20 text-primary border border-primary/40"
                        : "bg-surface-2 text-text-muted hover:text-text border border-white/5"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Skills Chip Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 max-h-[350px] overflow-y-auto pr-1">
              {filteredSkills.map((skill) => {
                const isSelected = config.skills.selectedSkills.includes(skill.id);
                return (
                  <button
                    key={skill.id}
                    type="button"
                    onClick={() => toggleSkill(skill.id)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      isSelected
                        ? "bg-primary/15 border-primary/50 text-text shadow-sm"
                        : "bg-surface-2/60 border-white/5 text-text-muted hover:border-white/20 hover:text-text"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: `#${skill.badge.color}` }}
                      />
                      <span className="truncate">{skill.name}</span>
                    </div>
                    {isSelected && <HiCheck className="w-4 h-4 text-primary shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 5. STATS TAB */}
        {activeTab === "stats" && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-between">
              <div>
                <strong className="text-sm font-bold text-primary block">
                  Gitcon Profile & Momentum Badge
                </strong>
                <p className="text-xs text-text-muted mt-0.5">
                  Link directly to your live Gitcon rhythm and analytics page
                </p>
              </div>
              <input
                type="checkbox"
                checked={config.githubStats.showGitconBadge}
                onChange={(e) => updateStats("showGitconBadge", e.target.checked)}
                className="w-4 h-4 accent-primary rounded cursor-pointer"
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-xl bg-surface-2 border border-white/10 cursor-pointer">
                <div>
                  <strong className="text-xs font-bold text-text block">GitHub Stats Card</strong>
                  <span className="text-xs text-text-muted">Total stars, commits, PRs, and issues</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.githubStats.showStatsCard}
                  onChange={(e) => updateStats("showStatsCard", e.target.checked)}
                  className="w-4 h-4 accent-primary rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-surface-2 border border-white/10 cursor-pointer">
                <div>
                  <strong className="text-xs font-bold text-text block">Streak Stats Card</strong>
                  <span className="text-xs text-text-muted">Current and longest contribution streak</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.githubStats.showStreakCard}
                  onChange={(e) => updateStats("showStreakCard", e.target.checked)}
                  className="w-4 h-4 accent-primary rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-surface-2 border border-white/10 cursor-pointer">
                <div>
                  <strong className="text-xs font-bold text-text block">Top Languages Card</strong>
                  <span className="text-xs text-text-muted">Breakdown of most used languages</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.githubStats.showTopLangsCard}
                  onChange={(e) => updateStats("showTopLangsCard", e.target.checked)}
                  className="w-4 h-4 accent-primary rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-surface-2 border border-white/10 cursor-pointer">
                <div>
                  <strong className="text-xs font-bold text-text block">GitHub Profile Trophies</strong>
                  <span className="text-xs text-text-muted">Show dynamic trophy badges for stars, PRs, etc.</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.githubStats.showTrophies}
                  onChange={(e) => updateStats("showTrophies", e.target.checked)}
                  className="w-4 h-4 accent-primary rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-surface-2 border border-white/10 cursor-pointer">
                <div>
                  <strong className="text-xs font-bold text-text block">Activity Graph SVG</strong>
                  <span className="text-xs text-text-muted">Visual wavy commit frequency graph</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.githubStats.showActivityGraph}
                  onChange={(e) => updateStats("showActivityGraph", e.target.checked)}
                  className="w-4 h-4 accent-primary rounded cursor-pointer"
                />
              </label>
            </div>
          </div>
        )}

        {/* 6. REPOSITORIES TAB */}
        {activeTab === "repos" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-2 border border-white/10">
              <div>
                <span className="font-semibold text-text text-xs block">Featured Projects Section</span>
                <span className="text-xs text-text-muted">Showcase your top starred open-source works</span>
              </div>
              <input
                type="checkbox"
                checked={config.featuredRepos.show}
                onChange={(e) =>
                  update("featuredRepos", {
                    ...config.featuredRepos,
                    show: e.target.checked,
                  })
                }
                className="w-4 h-4 accent-primary rounded cursor-pointer"
              />
            </div>

            {config.featuredRepos.show && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider block">
                  Select repositories to include:
                </span>
                {config.featuredRepos.repos.length === 0 ? (
                  <p className="text-xs text-text-muted p-4">No public repositories found for this account.</p>
                ) : (
                  config.featuredRepos.repos.map((repo, idx) => (
                    <label
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl bg-surface-2 border border-white/5 hover:border-white/20 transition-all cursor-pointer"
                    >
                      <div className="min-w-0 pr-3">
                        <div className="flex items-center gap-2">
                          <strong className="text-xs font-bold text-text truncate">{repo.name}</strong>
                          {repo.stars > 0 && (
                            <span className="text-[10px] font-mono text-amber-400">⭐ {repo.stars}</span>
                          )}
                          {repo.language && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-surface-offset text-text-muted font-mono">
                              {repo.language}
                            </span>
                          )}
                        </div>
                        {repo.description && (
                          <p className="text-[11px] text-text-muted truncate mt-0.5">
                            {repo.description}
                          </p>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        checked={repo.selected !== false}
                        onChange={() => toggleRepo(idx)}
                        className="w-4 h-4 accent-primary rounded cursor-pointer shrink-0"
                      />
                    </label>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* 7. SOCIALS TAB */}
        {activeTab === "socials" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-2 border border-white/10">
              <span className="font-semibold text-text text-xs">Include Social Links Section</span>
              <input
                type="checkbox"
                checked={config.socials.show}
                onChange={(e) => updateSocials("show", e.target.checked)}
                className="w-4 h-4 accent-primary rounded cursor-pointer"
              />
            </div>

            {config.socials.show && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-text-muted mb-1">GitHub Username</label>
                  <input
                    type="text"
                    value={config.socials.github}
                    onChange={(e) => updateSocials("github", e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-2 border border-white/10 text-text text-sm focus:outline-none focus:border-primary"
                    placeholder="username"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-muted mb-1">LinkedIn Username</label>
                  <input
                    type="text"
                    value={config.socials.linkedin}
                    onChange={(e) => updateSocials("linkedin", e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-2 border border-white/10 text-text text-sm focus:outline-none focus:border-primary"
                    placeholder="in/username"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-muted mb-1">Twitter / X Handle</label>
                  <input
                    type="text"
                    value={config.socials.twitter}
                    onChange={(e) => updateSocials("twitter", e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-2 border border-white/10 text-text text-sm focus:outline-none focus:border-primary"
                    placeholder="@username"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-muted mb-1">Portfolio / Website</label>
                  <input
                    type="text"
                    value={config.socials.portfolio}
                    onChange={(e) => updateSocials("portfolio", e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-2 border border-white/10 text-text text-sm focus:outline-none focus:border-primary"
                    placeholder="https://mysite.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-muted mb-1">Email Address</label>
                  <input
                    type="email"
                    value={config.socials.email}
                    onChange={(e) => updateSocials("email", e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-2 border border-white/10 text-text text-sm focus:outline-none focus:border-primary"
                    placeholder="hello@example.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-muted mb-1">Dev.to Handle</label>
                  <input
                    type="text"
                    value={config.socials.devto}
                    onChange={(e) => updateSocials("devto", e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-2 border border-white/10 text-text text-sm focus:outline-none focus:border-primary"
                    placeholder="devusername"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

