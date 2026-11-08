import { useState } from "react";
import {
  HiAdjustmentsHorizontal,
  HiBriefcase,
  HiChartBar,
  HiCheck,
  HiCodeBracket,
  HiCommandLine,
  HiDocumentText,
  HiEye,
  HiFolder,
  HiMagnifyingGlass,
  HiShare,
  HiSparkles,
  HiTrash,
  HiUser,
  HiXMark,
} from "react-icons/hi2";
import {
  ReadmeConfig,
  ReadmeProfileData,
  ReadmeTemplate,
  SKILLS_CATALOG,
  STATS_THEMES,
  StatsThemeItem,
} from "../../utils/readme";
import { ToggleSwitch } from "./ToggleSwitch";

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
    badgeColor: string;
    layoutType: "modern" | "minimal" | "showcase" | "cyberpunk";
  }> = [
    {
      id: "modern",
      title: "Modern Developer",
      description: "Balanced hero, animated typing effect, sleek analytics cards, badges & repos.",
      badge: "Popular",
      badgeColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      layoutType: "modern",
    },
    {
      id: "minimal",
      title: "Minimalist Clean",
      description: "Typography-forward, distraction-free highlights, compact metrics without clutter.",
      badge: "Clean",
      badgeColor: "bg-sky-500/15 text-sky-400 border-sky-500/30",
      layoutType: "minimal",
    },
    {
      id: "showcase",
      title: "Showcase Portfolio",
      description: "Full-featured presentation with achievements, detailed tables, and skill matrix.",
      badge: "Feature-Rich",
      badgeColor: "bg-purple-500/15 text-purple-400 border-purple-500/30",
      layoutType: "showcase",
    },
    {
      id: "cyberpunk",
      title: "Cyberpunk Terminal",
      description: "Hacker / terminal aesthetic, interactive code block, and synthwave telemetry.",
      badge: "Terminal",
      badgeColor: "bg-amber-500/15 text-amber-400 border-amber-500/30",
      layoutType: "cyberpunk",
    },
  ];

  // Helper to render mini visual wireframe layouts for template cards
  const renderMiniWireframe = (type: "modern" | "minimal" | "showcase" | "cyberpunk") => {
    switch (type) {
      case "modern":
        return (
          <div className="w-full h-14 rounded-lg bg-black/40 border border-white/5 p-2 flex flex-col justify-between mb-2.5 overflow-hidden">
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded-full bg-primary/70 shrink-0" />
              <div className="h-2 w-16 rounded bg-white/20" />
              <div className="h-1.5 w-10 rounded bg-white/10" />
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <div className="h-4 rounded bg-primary/20 border border-primary/30" />
              <div className="h-4 rounded bg-white/10 border border-white/10" />
            </div>
          </div>
        );
      case "minimal":
        return (
          <div className="w-full h-14 rounded-lg bg-black/40 border border-white/5 p-2 flex flex-col justify-between mb-2.5 overflow-hidden">
            <div className="space-y-1">
              <div className="h-2.5 w-20 rounded bg-white/30" />
              <div className="h-1.5 w-28 rounded bg-white/15" />
            </div>
            <div className="flex gap-1 items-center">
              <div className="h-2 w-8 rounded-full bg-white/20" />
              <div className="h-2 w-8 rounded-full bg-white/20" />
              <div className="h-2 w-8 rounded-full bg-white/20" />
            </div>
          </div>
        );
      case "showcase":
        return (
          <div className="w-full h-14 rounded-lg bg-black/40 border border-white/5 p-2 flex flex-col justify-between mb-2.5 overflow-hidden">
            <div className="flex justify-center">
              <div className="h-2 w-24 rounded bg-primary/50" />
            </div>
            <div className="flex justify-center gap-1">
              <div className="w-3 h-3 rounded bg-amber-400/30 border border-amber-400/40" />
              <div className="w-3 h-3 rounded bg-amber-400/30 border border-amber-400/40" />
              <div className="w-3 h-3 rounded bg-amber-400/30 border border-amber-400/40" />
            </div>
            <div className="grid grid-cols-3 gap-1">
              <div className="h-2 rounded bg-white/10" />
              <div className="h-2 rounded bg-white/10" />
              <div className="h-2 rounded bg-white/10" />
            </div>
          </div>
        );
      case "cyberpunk":
        return (
          <div className="w-full h-14 rounded-lg bg-black/50 border border-white/5 p-1.5 flex flex-col justify-between mb-2.5 overflow-hidden font-mono">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500/80" />
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500/80" />
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
              <div className="h-1.5 w-12 rounded bg-white/10 ml-1" />
            </div>
            <div className="text-[8px] text-primary/80 font-mono leading-tight">
              $&gt; const dev = &#123; mode: &apos;cyber&apos; &#125;;
            </div>
            <div className="h-1.5 w-full rounded bg-gradient-to-r from-pink-500/40 via-purple-500/40 to-cyan-500/40" />
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full rounded-2xl overflow-hidden border border-white/10 bg-surface shadow-2xl backdrop-blur-xl">
      {/* Controls Segmented Header Navigation */}
      <div className="border-b border-white/10 bg-surface-2/80 p-2 backdrop-blur-md">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-0.5">
          {[
            { id: "template" as TabType, label: "Template", icon: HiSparkles },
            { id: "header" as TabType, label: "Profile", icon: HiUser },
            { id: "about" as TabType, label: "About Me", icon: HiBriefcase },
            {
              id: "skills" as TabType,
              label: "Tech Stack",
              icon: HiCodeBracket,
              badge: config.skills.selectedSkills.length,
            },
            { id: "stats" as TabType, label: "Stats & Cards", icon: HiChartBar },
            {
              id: "repos" as TabType,
              label: "Repos",
              icon: HiFolder,
              badge: config.featuredRepos.repos.filter((r) => r.selected !== false).length,
            },
            { id: "socials" as TabType, label: "Socials", icon: HiShare },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 shrink-0 ${
                  isActive
                    ? "bg-gradient-to-b from-primary/25 to-primary/10 text-primary border border-primary/40 shadow-[0_2px_12px_rgba(88,170,176,0.18)] font-bold"
                    : "text-text-muted hover:text-text hover:bg-white/5 border border-transparent"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-primary" : "opacity-70"}`} />
                <span>{tab.label}</span>
                {typeof tab.badge === "number" && (
                  <span
                    className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      isActive
                        ? "bg-primary text-text-inverse font-bold"
                        : "bg-surface-offset text-text-muted"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Panels Body */}
      <div className="p-5 overflow-y-auto space-y-6 max-h-[640px] text-sm">
        {/* =========================================================================
            1. TEMPLATE TAB
            ========================================================================= */}
        {activeTab === "template" && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                    Choose README Template
                  </span>
                </div>
                <span className="text-[11px] text-text-muted">4 curated presets</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {templates.map((tpl) => {
                  const isSelected = config.template === tpl.id;
                  return (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => update("template", tpl.id)}
                      className={`text-left p-4 rounded-xl border transition-all duration-200 relative group flex flex-col justify-between ${
                        isSelected
                          ? "border-primary bg-gradient-to-br from-primary/15 via-primary/5 to-transparent shadow-[0_0_20px_-5px_rgba(88,170,176,0.25)] ring-1 ring-primary/40"
                          : "border-white/10 bg-surface-2/60 hover:border-white/25 hover:bg-surface-2 hover:-translate-y-0.5"
                      }`}
                    >
                      {/* Active Checkmark Pill in Top Corner */}
                      {isSelected && (
                        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary text-text-inverse flex items-center justify-center shadow-md">
                          <HiCheck className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}

                      {/* Mini Layout Diagram */}
                      {renderMiniWireframe(tpl.layoutType)}

                      <div>
                        <div className="flex items-center justify-between mb-1.5 pr-5">
                          <strong className="font-bold text-text text-sm group-hover:text-primary transition-colors">
                            {tpl.title}
                          </strong>
                        </div>
                        <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
                          {tpl.description}
                        </p>
                      </div>

                      <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tpl.badgeColor}`}
                        >
                          {tpl.badge}
                        </span>
                        <span className="text-[11px] font-semibold text-text-muted group-hover:text-text transition-colors">
                          {isSelected ? "Active" : "Apply"} →
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Visual Color Palette Theme Swatch Selector */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                    Stats Cards Palette
                  </span>
                </div>
                <span className="text-[11px] text-text-muted">Live preview swatches</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {STATS_THEMES.map((theme: StatsThemeItem) => {
                  const isSelected = config.statsTheme === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => update("statsTheme", theme.id)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all duration-200 ${
                        isSelected
                          ? "border-primary bg-primary/10 shadow-[0_0_12px_rgba(88,170,176,0.2)] ring-1 ring-primary/40"
                          : "border-white/10 bg-surface-2/60 hover:border-white/20 hover:bg-surface-2"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 pr-1">
                        {/* 3 mini color dots representing the theme's colors */}
                        <div className="flex items-center -space-x-1 shrink-0">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-sm"
                            style={{ backgroundColor: theme.bg }}
                          />
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-sm"
                            style={{ backgroundColor: theme.accent }}
                          />
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-sm"
                            style={{ backgroundColor: theme.text }}
                          />
                        </div>
                        <span className="text-xs font-medium text-text truncate">
                          {theme.name}
                        </span>
                      </div>
                      {isSelected && <HiCheck className="w-3.5 h-3.5 text-primary shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Extras & Badges Card */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  Extras & Badges
                </span>
              </div>

              <div className="p-4 rounded-xl bg-surface-2/60 border border-white/10 hover:border-white/20 transition-all flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    <HiEye className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-xs font-bold text-text block">
                      Profile Views Counter Badge
                    </strong>
                    <span className="text-[11px] text-text-muted">
                      Embeds an auto-updating visitor count badge
                    </span>
                  </div>
                </div>
                <ToggleSwitch
                  checked={config.extras.showVisitorBadge}
                  onChange={(val) =>
                    update("extras", {
                      ...config.extras,
                      showVisitorBadge: val,
                    })
                  }
                />
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            2. PROFILE & HEADER TAB
            ========================================================================= */}
        {activeTab === "header" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-text-muted mb-1.5">
                  Greeting Phrase
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={config.header.greeting}
                    onChange={(e) => updateHeader("greeting", e.target.value)}
                    className="w-full pl-3.5 pr-4 py-2.5 rounded-xl bg-surface-2 border border-white/10 text-text text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                    placeholder="Hi there 👋, I'm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-muted mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  value={config.header.name}
                  onChange={(e) => updateHeader("name", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-white/10 text-text text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
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
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-white/10 text-text text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                placeholder="Full Stack Developer & Open Source Contributor"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-text-muted mb-1.5">
                  Header Alignment
                </label>
                <div className="flex gap-2 p-1 rounded-xl bg-surface-2 border border-white/10">
                  <button
                    type="button"
                    onClick={() => updateHeader("align", "center")}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      config.header.align === "center"
                        ? "bg-primary text-text-inverse font-bold shadow-sm"
                        : "text-text-muted hover:text-text"
                    }`}
                  >
                    Center
                  </button>
                  <button
                    type="button"
                    onClick={() => updateHeader("align", "left")}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      config.header.align === "left"
                        ? "bg-primary text-text-inverse font-bold shadow-sm"
                        : "text-text-muted hover:text-text"
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
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-2 border border-white/10">
                  <div className="flex items-center gap-2">
                    {profile.avatarUrl ? (
                      <img
                        src={profile.avatarUrl}
                        alt="Avatar"
                        className="w-6 h-6 rounded-full border border-primary/40 object-cover"
                      />
                    ) : (
                      <HiUser className="w-4 h-4 text-text-muted" />
                    )}
                    <span className="text-xs font-medium text-text">Header Avatar</span>
                  </div>
                  <ToggleSwitch
                    checked={config.header.showAvatar}
                    onChange={(val) => updateHeader("showAvatar", val)}
                    size="sm"
                  />
                </div>
              </div>
            </div>

            {/* Dynamic Typing Banner Settings */}
            <div className="p-4 rounded-xl bg-surface-2/60 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    <HiCommandLine className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-xs font-bold text-text block">
                      Dynamic Typing SVG Banner
                    </strong>
                    <span className="text-[11px] text-text-muted">
                      Animates your roles, interests, and specialties
                    </span>
                  </div>
                </div>
                <ToggleSwitch
                  checked={config.header.typingEffect}
                  onChange={(val) => updateHeader("typingEffect", val)}
                />
              </div>

              {config.header.typingEffect && (
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <label className="block text-xs text-text-muted font-medium">
                    Typing lines (one phrase per line):
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-white/10 text-text text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 font-mono leading-relaxed"
                    placeholder="Enter lines..."
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            3. ABOUT ME TAB
            ========================================================================= */}
        {activeTab === "about" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-2/80 border border-white/10">
              <div className="flex items-center gap-2.5">
                <HiBriefcase className="w-4 h-4 text-primary" />
                <span className="font-bold text-text text-xs">Include About Me Section</span>
              </div>
              <ToggleSwitch
                checked={config.aboutMe.show}
                onChange={(val) => updateAbout("show", val)}
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-white/10 text-text text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all leading-relaxed"
                    placeholder="Write a brief introduction about yourself..."
                  />
                </div>

                <div className="space-y-3">
                  {[
                    { key: "workingOn" as const, label: "🔭 Currently working on", placeholder: "My Next.js SaaS, Open source CLI..." },
                    { key: "learning" as const, label: "🌱 Currently learning", placeholder: "Rust, Distributed Systems, AI Agents..." },
                    { key: "collaborateOn" as const, label: "👯 Looking to collaborate on", placeholder: "Open-source developer tools, AI workflows..." },
                    { key: "askMeAbout" as const, label: "💬 Ask me about", placeholder: "React, TypeScript, GraphQL, Architecture..." },
                    { key: "reachMe" as const, label: "📫 How to reach me", placeholder: "Email or Twitter handle" },
                    { key: "funFact" as const, label: "⚡ Fun fact", placeholder: "I convert coffee into clean code ☕" },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-xs font-semibold text-text-muted mb-1">
                        {field.label}
                      </label>
                      <input
                        type="text"
                        value={config.aboutMe[field.key]}
                        onChange={(e) => updateAbout(field.key, e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-surface-2 border border-white/10 text-text text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                        placeholder={field.placeholder}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            4. TECH STACK TAB
            ========================================================================= */}
        {activeTab === "skills" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap p-3 rounded-xl bg-surface-2/80 border border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-text-muted">Style:</span>
                <div className="flex gap-1 p-0.5 rounded-lg bg-surface border border-white/10">
                  <button
                    type="button"
                    onClick={() => updateSkills("badgeStyle", "shields")}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                      config.skills.badgeStyle === "shields"
                        ? "bg-primary text-text-inverse font-bold shadow-sm"
                        : "text-text-muted hover:text-text"
                    }`}
                  >
                    Shields.io
                  </button>
                  <button
                    type="button"
                    onClick={() => updateSkills("badgeStyle", "skillicons")}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                      config.skills.badgeStyle === "skillicons"
                        ? "bg-primary text-text-inverse font-bold shadow-sm"
                        : "text-text-muted hover:text-text"
                    }`}
                  >
                    SkillIcons
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-primary font-mono font-bold">
                  {config.skills.selectedSkills.length} selected
                </span>
                <button
                  type="button"
                  onClick={() => updateSkills("selectedSkills", [])}
                  className="text-text-muted hover:text-rose-400 transition-colors text-xs"
                >
                  Clear all
                </button>
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
                  placeholder="Filter skills (e.g. React, Rust, Docker)..."
                  className="w-full pl-10 pr-9 py-2 rounded-xl bg-surface-2 border border-white/10 text-text text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                />
                {skillSearch && (
                  <button
                    type="button"
                    onClick={() => setSkillSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                  >
                    <HiXMark className="w-3.5 h-3.5" />
                  </button>
                )}
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
                        ? "bg-primary/20 text-primary border border-primary/40 font-bold"
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
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition-all duration-150 ${
                      isSelected
                        ? "bg-primary/15 border-primary/50 text-text shadow-[0_0_10px_rgba(88,170,176,0.15)] ring-1 ring-primary/30"
                        : "bg-surface-2/60 border-white/5 text-text-muted hover:border-white/20 hover:text-text hover:bg-surface-2"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: `#${skill.badge.color}` }}
                      />
                      <span className="truncate">{skill.name}</span>
                    </div>
                    {isSelected && <HiCheck className="w-3.5 h-3.5 text-primary shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            5. STATS & RHYTHM TAB
            ========================================================================= */}
        {activeTab === "stats" && (
          <div className="space-y-3.5">
            {/* Spotlight Gitcon Badge */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-primary/15 via-primary/5 to-transparent border border-primary/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/20 text-primary shrink-0">
                  <HiSparkles className="w-5 h-5" />
                </div>
                <div>
                  <strong className="text-sm font-bold text-primary block">
                    Gitcon Profile & Momentum Badge
                  </strong>
                  <p className="text-xs text-text-muted mt-0.5">
                    Embeds live Gitcon telemetry linking to your rhythm dashboard
                  </p>
                </div>
              </div>
              <ToggleSwitch
                checked={config.githubStats.showGitconBadge}
                onChange={(val) => updateStats("showGitconBadge", val)}
              />
            </div>

            <div className="space-y-2.5">
              {[
                {
                  key: "showStatsCard" as const,
                  title: "GitHub Stats Card",
                  sub: "Displays total stars, commits, PRs, and issues count",
                  icon: HiChartBar,
                },
                {
                  key: "showStreakCard" as const,
                  title: "Streak Stats Card",
                  sub: "Visualizes your current and longest commit streaks",
                  icon: HiCommandLine,
                },
                {
                  key: "showTopLangsCard" as const,
                  title: "Top Languages Card",
                  sub: "Breakdown of the programming languages you code in most",
                  icon: HiCodeBracket,
                },
                {
                  key: "showTrophies" as const,
                  title: "GitHub Profile Trophies",
                  sub: "Renders badge trophies for stars, PRs, and repositories",
                  icon: HiSparkles,
                },
                {
                  key: "showActivityGraph" as const,
                  title: "Activity Graph SVG",
                  sub: "Generates an organic wavy activity density graph",
                  icon: HiChartBar,
                },
              ].map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.key}
                    className="p-3.5 rounded-xl bg-surface-2/60 border border-white/10 hover:border-white/20 transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-surface text-text-muted">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <strong className="text-xs font-bold text-text block">
                          {card.title}
                        </strong>
                        <span className="text-[11px] text-text-muted">{card.sub}</span>
                      </div>
                    </div>
                    <ToggleSwitch
                      checked={config.githubStats[card.key]}
                      onChange={(val) => updateStats(card.key, val)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            6. REPOSITORIES TAB
            ========================================================================= */}
        {activeTab === "repos" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-2/80 border border-white/10">
              <div className="flex items-center gap-2.5">
                <HiFolder className="w-4 h-4 text-primary" />
                <div>
                  <span className="font-bold text-text text-xs block">
                    Featured Projects Section
                  </span>
                  <span className="text-[11px] text-text-muted">
                    Showcase your top starred open-source works
                  </span>
                </div>
              </div>
              <ToggleSwitch
                checked={config.featuredRepos.show}
                onChange={(val) =>
                  update("featuredRepos", {
                    ...config.featuredRepos,
                    show: val,
                  })
                }
              />
            </div>

            {config.featuredRepos.show && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider block">
                  Select repositories to include:
                </span>
                {config.featuredRepos.repos.length === 0 ? (
                  <p className="text-xs text-text-muted p-4">
                    No public repositories found for this account.
                  </p>
                ) : (
                  config.featuredRepos.repos.map((repo, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-surface-2/60 border border-white/10 hover:border-white/20 transition-all"
                    >
                      <div className="min-w-0 pr-3">
                        <div className="flex items-center gap-2">
                          <strong className="text-xs font-bold text-text truncate">
                            {repo.name}
                          </strong>
                          {repo.stars > 0 && (
                            <span className="text-[10px] font-mono text-amber-400">
                              ⭐ {repo.stars}
                            </span>
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
                      <ToggleSwitch
                        checked={repo.selected !== false}
                        onChange={() => toggleRepo(idx)}
                        size="sm"
                      />
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            7. SOCIALS TAB
            ========================================================================= */}
        {activeTab === "socials" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-2/80 border border-white/10">
              <div className="flex items-center gap-2.5">
                <HiShare className="w-4 h-4 text-primary" />
                <span className="font-bold text-text text-xs">
                  Include Social & Contact Badges
                </span>
              </div>
              <ToggleSwitch
                checked={config.socials.show}
                onChange={(val) => updateSocials("show", val)}
              />
            </div>

            {config.socials.show && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  { key: "github" as const, label: "GitHub Username", placeholder: "username" },
                  { key: "linkedin" as const, label: "LinkedIn Handle/URL", placeholder: "in/username" },
                  { key: "twitter" as const, label: "Twitter / X Handle", placeholder: "@username" },
                  { key: "portfolio" as const, label: "Portfolio / Website", placeholder: "https://mysite.com" },
                  { key: "email" as const, label: "Email Address", placeholder: "hello@example.com" },
                  { key: "devto" as const, label: "Dev.to Username", placeholder: "username" },
                  { key: "youtube" as const, label: "YouTube Channel", placeholder: "@channel" },
                  { key: "discord" as const, label: "Discord Handle/Server", placeholder: "username#0000" },
                ].map((s) => (
                  <div key={s.key}>
                    <label className="block text-xs font-semibold text-text-muted mb-1">
                      {s.label}
                    </label>
                    <input
                      type="text"
                      value={config.socials[s.key]}
                      onChange={(e) => updateSocials(s.key, e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-surface-2 border border-white/10 text-text text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                      placeholder={s.placeholder}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
