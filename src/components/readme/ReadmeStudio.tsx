import { useEffect, useMemo, useState } from "react";
import {
  HiArrowDownTray,
  HiArrowPath,
  HiCheck,
  HiClipboardDocument,
  HiCodeBracket,
  HiEye,
  HiMagnifyingGlass,
  HiQuestionMarkCircle,
  HiSparkles,
} from "react-icons/hi2";
import { Link } from "revine";
import {
  buildDefaultConfig,
  downloadMarkdownFile,
  fetchReadmeData,
  generateReadmeMarkdown,
  ReadmeConfig,
  ReadmeProfileData,
} from "../../utils/readme";
import { HowToUseModal } from "./HowToUseModal";
import { ReadmeCode } from "./ReadmeCode";
import { ReadmeControls } from "./ReadmeControls";
import { ReadmePreview } from "./ReadmePreview";

interface ReadmeStudioProps {
  initialUsername?: string;
  backHref?: string;
}

const POPULAR_SUGGESTIONS = [
  "rachit-bharadwaj",
  "torvalds",
  "shadcn",
  "leerob",
  "gaearon",
];

export function ReadmeStudio({ initialUsername = "rachit-bharadwaj", backHref }: ReadmeStudioProps) {
  const [usernameInput, setUsernameInput] = useState(initialUsername);
  const [currentUsername, setCurrentUsername] = useState(initialUsername);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ReadmeProfileData | null>(null);
  const [config, setConfig] = useState<ReadmeConfig | null>(null);
  const [customMarkdown, setCustomMarkdown] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview");
  const [isHowToModalOpen, setIsHowToModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Load data whenever currentUsername changes
  useEffect(() => {
    if (currentUsername) {
      loadProfile(currentUsername);
    }
  }, [currentUsername]);

  // Keep input in sync if initialUsername changes
  useEffect(() => {
    if (initialUsername && initialUsername !== currentUsername) {
      setUsernameInput(initialUsername);
      setCurrentUsername(initialUsername);
    }
  }, [initialUsername]);

  async function loadProfile(targetUsername: string) {
    if (!targetUsername.trim()) return;
    setLoading(true);
    setError(null);
    setCustomMarkdown(null);
    try {
      const data = await fetchReadmeData(targetUsername.trim());
      setProfileData(data);
      setConfig(buildDefaultConfig(data));
    } catch (err: any) {
      console.error("Error fetching readme data:", err);
      setError(err.message || "Failed to load GitHub user data.");
    } finally {
      setLoading(false);
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput.trim()) {
      setCurrentUsername(usernameInput.trim());
    }
  };

  const generatedMarkdown = useMemo(() => {
    if (customMarkdown !== null) return customMarkdown;
    if (!profileData || !config) return "";
    return generateReadmeMarkdown(profileData, config);
  }, [profileData, config, customMarkdown]);

  const handleCopy = () => {
    if (!generatedMarkdown) return;
    navigator.clipboard.writeText(generatedMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!generatedMarkdown) return;
    downloadMarkdownFile(`README-${currentUsername}`, generatedMarkdown);
  };

  const handleConfigChange = (newConfig: ReadmeConfig) => {
    setConfig(newConfig);
    setCustomMarkdown(null); // Reset manual edits when config changes
  };

  return (
    <div className="readme-studio-page py-6 space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col gap-4">
        {backHref && (
          <div>
            <Link
              href={backHref}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-primary transition-colors"
            >
              ← Back to Profile Dashboard
            </Link>
          </div>
        )}

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 text-primary shadow-sm border border-primary/20">
                <HiSparkles className="w-5 h-5" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
                GitHub Profile README Generator
              </h1>
            </div>
            <p className="text-sm text-text-muted">
              Auto-generate dynamic, high-converting GitHub profile READMEs based on your GitHub activity and Gitcon momentum.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsHowToModalOpen(true)}
              className="btn btn-secondary !min-h-0 !py-2 !px-3.5 text-xs font-bold inline-flex items-center gap-1.5 hover:border-white/30"
              title="Step-by-step guide to add to GitHub"
            >
              <HiQuestionMarkCircle className="w-4 h-4 text-primary" />
              <span>How to Use</span>
            </button>

            <button
              onClick={handleCopy}
              disabled={loading || !generatedMarkdown}
              className={`btn !min-h-0 !py-2 !px-4 text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-md ${
                copied
                  ? "bg-emerald-500 text-white shadow-emerald-500/25"
                  : "btn-primary shadow-primary/20"
              }`}
            >
              {copied ? <HiCheck className="w-4 h-4" /> : <HiClipboardDocument className="w-4 h-4" />}
              <span>{copied ? "Copied!" : "Copy Markdown"}</span>
            </button>

            <button
              onClick={handleDownload}
              disabled={loading || !generatedMarkdown}
              className="btn btn-secondary !min-h-0 !py-2 !px-3 text-xs font-bold inline-flex items-center gap-1.5 hover:border-white/30"
              title="Download README.md"
            >
              <HiArrowDownTray className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </button>
          </div>
        </div>
      </div>

      {/* Profile Bar / User Search */}
      <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-white/10 shadow-xl backdrop-blur-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* User Info or Search Form */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted font-mono font-bold text-xs">
              @
            </span>
            <input
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder="Enter GitHub username..."
              className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-surface-2 border border-white/10 text-text text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary !min-h-0 !py-2.5 !px-4 text-xs font-bold inline-flex items-center gap-1.5 shrink-0"
          >
            {loading ? (
              <HiArrowPath className="w-4 h-4 animate-spin" />
            ) : (
              <HiMagnifyingGlass className="w-4 h-4" />
            )}
            <span>Generate</span>
          </button>
        </form>

        {/* Quick suggestions or loaded profile preview */}
        {profileData ? (
          <div className="flex items-center gap-3 bg-surface-2/60 px-4 py-2 rounded-xl border border-white/5">
            {profileData.avatarUrl && (
              <img
                src={profileData.avatarUrl}
                alt={profileData.username}
                className="w-9 h-9 rounded-full border border-primary/40 object-cover shadow-sm"
              />
            )}
            <div>
              <div className="flex items-center gap-1.5">
                <strong className="text-xs font-bold text-text">{profileData.name}</strong>
                <span className="text-xs text-text-muted">(@{profileData.username})</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-text-muted">
                <span>{profileData.publicRepos} Repos</span>
                <span>•</span>
                <span>{profileData.followers} Followers</span>
                {profileData.contributionsStats.totalContributions > 0 && (
                  <>
                    <span>•</span>
                    <span className="text-primary font-bold">
                      {profileData.contributionsStats.totalContributions.toLocaleString()} Contributions
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs text-text-muted">
            <span className="shrink-0 font-medium">Quick load:</span>
            {POPULAR_SUGGESTIONS.map((user) => (
              <button
                key={user}
                type="button"
                onClick={() => {
                  setUsernameInput(user);
                  setCurrentUsername(user);
                }}
                className="px-2.5 py-1 rounded-lg bg-surface-2 hover:bg-surface-offset text-text-muted hover:text-text border border-white/5 transition-colors shrink-0 font-mono text-[11px]"
              >
                @{user}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Error display */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => loadProfile(currentUsername)}
            className="font-bold underline hover:no-underline ml-4 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Main Studio Area (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Customizer Controls (5 cols) */}
        <div className="lg:col-span-5 w-full">
          {loading && !profileData ? (
            <div className="p-16 text-center rounded-2xl bg-surface border border-white/10 space-y-3">
              <HiArrowPath className="w-8 h-8 text-primary animate-spin mx-auto" />
              <p className="text-xs font-semibold text-text-muted">
                Fetching GitHub activity & profile insights...
              </p>
            </div>
          ) : profileData && config ? (
            <ReadmeControls
              config={config}
              profile={profileData}
              onChange={handleConfigChange}
            />
          ) : (
            <div className="p-16 text-center rounded-2xl bg-surface border border-white/10 text-xs text-text-muted">
              Enter a GitHub username above to start customizing.
            </div>
          )}
        </div>

        {/* Right Column: Studio Live Preview & Code (7 cols) */}
        <div className="lg:col-span-7 w-full flex flex-col gap-3">
          {/* Studio Viewer Controls & Mockup Header */}
          <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-surface border border-white/10 flex-wrap gap-2 shadow-sm">
            <div className="flex items-center gap-3">
              {/* macOS / Window dots */}
              <div className="flex items-center gap-1.5 opacity-60 hidden sm:flex">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>

              {/* Segmented Mode Switcher */}
              <div className="flex items-center gap-1 p-0.5 rounded-lg bg-surface-2 border border-white/5">
                <button
                  type="button"
                  onClick={() => setViewMode("preview")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    viewMode === "preview"
                      ? "bg-primary text-text-inverse font-bold shadow-sm"
                      : "text-text-muted hover:text-text"
                  }`}
                >
                  <HiEye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode("code")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    viewMode === "code"
                      ? "bg-primary text-text-inverse font-bold shadow-sm"
                      : "text-text-muted hover:text-text"
                  }`}
                >
                  <HiCodeBracket className="w-3.5 h-3.5" />
                  <span>Markdown</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
              <span className="text-text font-semibold">
                {currentUsername}/{currentUsername}/README.md
              </span>
            </div>
          </div>

          {/* Viewer Card */}
          <div className="rounded-2xl border border-white/10 bg-surface shadow-2xl overflow-hidden min-h-[580px] backdrop-blur-xl">
            {loading ? (
              <div className="p-20 text-center space-y-4">
                <HiArrowPath className="w-8 h-8 text-primary animate-spin mx-auto" />
                <p className="text-xs font-semibold text-text-muted">
                  Generating profile README for @{currentUsername}...
                </p>
              </div>
            ) : viewMode === "preview" ? (
              <ReadmePreview markdown={generatedMarkdown} />
            ) : (
              <ReadmeCode
                markdown={generatedMarkdown}
                username={currentUsername}
                onMarkdownChange={(newVal) => setCustomMarkdown(newVal)}
              />
            )}
          </div>
        </div>
      </div>

      {/* How to use modal */}
      <HowToUseModal
        username={currentUsername}
        isOpen={isHowToModalOpen}
        onClose={() => setIsHowToModalOpen(false)}
      />
    </div>
  );
}
