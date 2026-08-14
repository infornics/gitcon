import { useState, useEffect } from "react";
import { Link } from "revine";
import { parseRepoInput, hasCustomGithubToken, setGithubToken } from "@/utils/github";
import { HiKey } from "react-icons/hi2";

export default function Header() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme") as "light" | "dark";
      if (savedTheme) return savedTheme;
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  });

  const [scrolled, setScrolled] = useState(false);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [tokenInput, setTokenInput] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    setHasToken(hasCustomGithubToken());
    if (typeof window !== "undefined") {
      setTokenInput(localStorage.getItem("gitcon_pat") || "");
    }
  }, []);

  const handleSaveToken = (e: React.FormEvent) => {
    e.preventDefault();
    setGithubToken(tokenInput);
    setHasToken(hasCustomGithubToken());
    setSaveMessage("Access token saved successfully! Reloading page...");
    setTimeout(() => {
      setShowTokenModal(false);
      setSaveMessage("");
      window.location.reload();
    }, 1000);
  };

  const handleClearToken = () => {
    setGithubToken("");
    setTokenInput("");
    setHasToken(false);
    setSaveMessage("Access token removed.");
    setTimeout(() => {
      setShowTokenModal(false);
      setSaveMessage("");
      window.location.reload();
    }, 1000);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const [query, setQuery] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get("q") || "";
    }
    return "";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.location.pathname === "/search") {
        const params = new URLSearchParams(window.location.search);
        setQuery(params.get("q") || "");
      } else {
        setQuery("");
      }
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const val = query.trim();
    if (!val) return;
    window.location.href = `/search?q=${encodeURIComponent(val)}`;
  };

  const handleLeaderboardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.location.pathname === "/") {
      const el = document.getElementById("leaderboard");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.location.href = "/#leaderboard";
    }
  };

  return (
    <header className={scrolled ? "scrolled" : ""}>
      <Link className="brand" href="/" aria-label="Gitcon home">
        <div className="brand-mark" aria-hidden="true">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="5" height="16" rx="2"></rect>
            <rect x="10" y="9" width="5" height="11" rx="2"></rect>
            <path d="M17 14a4 4 0 1 1 4 4h-2"></path>
          </svg>
        </div>
        <div className="brand-copy">
          <strong className="text-xl">Gitcon</strong>
        </div>
      </Link>

      <form className="header-search" onSubmit={handleSearch}>
        <input
          id="global-search-input"
          type="text"
          placeholder="Search user or owner/repo..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search GitHub username or repository"
        />
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </form>

      <div className="flex items-center gap-2">
        <a
          href="/#leaderboard"
          onClick={handleLeaderboardClick}
          className="text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-surface-2 transition-colors opacity-80 hover:opacity-100 cursor-pointer"
        >
          Leaderboard
        </a>
        <Link
          href="/repo"
          className="text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-surface-2 transition-colors opacity-80 hover:opacity-100"
        >
          Repo Stats
        </Link>
        <button
          onClick={() => setShowTokenModal(true)}
          className={`text-xs font-mono font-semibold px-3 py-1.5 rounded-full transition-all inline-flex items-center gap-1.5 cursor-pointer border ${
            hasToken
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:border-emerald-500/50"
              : "bg-surface-2 text-text-muted border-white/10 hover:text-white hover:border-white/20"
          }`}
          title="Configure Personal Access Token (PAT) for Private Repos"
        >
          <HiKey className="w-3.5 h-3.5" />
          <span>{hasToken ? "PAT Active" : "Access Token"}</span>
        </button>
      </div>

      <div className="flex items-center gap-3">
        <a
          href="https://github.com/infornics/gitcon"
          target="_blank"
          rel="noopener noreferrer"
          className="theme-toggle"
          aria-label="GitHub repository"
          title="View GitHub repository"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
          </svg>
        </a>

        <button
          className="theme-toggle"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          aria-label="Toggle theme"
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          )}
        </button>
      </div>

      {/* Access Token Modal */}
      {showTokenModal && (
        <div
          onClick={() => setShowTokenModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-surface border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200 cursor-default"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <HiKey className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-display text-white">GitHub Access Token</h3>
                  <p className="text-xs text-text-muted">Unlock Private Repository Statistics</p>
                </div>
              </div>
              <button
                onClick={() => setShowTokenModal(false)}
                className="p-1 rounded-lg text-text-muted hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <p className="text-xs text-text-muted leading-relaxed mb-4">
              Provide your GitHub Personal Access Token (PAT) with <code className="text-primary font-mono bg-primary/10 px-1 py-0.5 rounded">repo</code> scope to view private repositories you have access to. Your token is stored locally in your browser and never leaves your client.
            </p>

            <form onSubmit={handleSaveToken} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1.5">
                  Personal Access Token (classic or fine-grained)
                </label>
                <input
                  type="password"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="ghp_... or github_pat_..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              {saveMessage && (
                <div className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
                  {saveMessage}
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                {hasToken ? (
                  <button
                    type="button"
                    onClick={handleClearToken}
                    className="text-xs text-rose-400 hover:underline cursor-pointer font-medium"
                  >
                    Remove Saved Token
                  </button>
                ) : <span />}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowTokenModal(false)}
                    className="btn btn-secondary text-xs px-3.5 py-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary text-xs px-4 py-2"
                  >
                    Save Token
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
