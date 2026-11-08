import { useState } from "react";
import { HiArrowTopRightOnSquare, HiCheck, HiClipboardDocument, HiXMark } from "react-icons/hi2";

interface HowToUseModalProps {
  username: string;
  isOpen: boolean;
  onClose: () => void;
}

export function HowToUseModal({ username, isOpen, onClose }: HowToUseModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const repoName = username || "your-username";
  const newRepoUrl = `https://github.com/new?name=${encodeURIComponent(repoName)}&public=true`;

  const copyRepoName = () => {
    navigator.clipboard.writeText(repoName);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-surface border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-surface-2/60">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-primary/20 text-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </span>
            <h3 className="text-lg font-bold text-text">How to Add to GitHub</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-text-muted hover:text-text hover:bg-white/10 transition-colors"
            title="Close"
          >
            <HiXMark className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Secret repository tip */}
          <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex gap-3">
            <span className="text-xl">✨</span>
            <div className="space-y-1">
              <strong className="text-primary font-semibold block">GitHub Secret Repository</strong>
              <p className="text-text-muted text-xs leading-relaxed">
                When you create a repository named identically to your username (<code className="px-1.5 py-0.5 rounded bg-black/40 text-primary font-mono">{repoName}</code>), GitHub automatically renders its <code className="px-1.5 py-0.5 rounded bg-black/40 text-primary font-mono">README.md</code> on your public profile!
              </p>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            <div className="flex gap-3.5">
              <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                1
              </div>
              <div className="space-y-2 flex-1">
                <p className="font-semibold text-text">Create the Special Repository</p>
                <p className="text-xs text-text-muted">
                  Create a new repository on GitHub and set the repository name to:
                </p>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-lg bg-surface-2 border border-white/10 font-mono text-primary font-bold text-sm">
                    {repoName}
                  </span>
                  <button
                    onClick={copyRepoName}
                    className="p-2 rounded-lg bg-surface-2 hover:bg-surface-offset border border-white/10 text-xs font-semibold text-text-muted hover:text-text inline-flex items-center gap-1 transition-colors"
                    title="Copy repository name"
                  >
                    {copied ? <HiCheck className="w-4 h-4 text-emerald-400" /> : <HiClipboardDocument className="w-4 h-4" />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3.5">
              <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                2
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-text">Set Visibility to Public</p>
                <p className="text-xs text-text-muted leading-relaxed">
                  Make sure you choose <strong className="text-text">Public</strong> (otherwise it won't be visible on your profile), and check <strong className="text-text">Add a README file</strong>.
                </p>
              </div>
            </div>

            <div className="flex gap-3.5">
              <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                3
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-text">Paste the Generated Markdown</p>
                <p className="text-xs text-text-muted leading-relaxed">
                  Click <strong className="text-text">Copy Markdown</strong> in Gitcon, open your repository's <code className="px-1 py-0.5 rounded bg-black/40 text-primary font-mono text-xs">README.md</code> in edit mode, paste the markdown, and commit!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-surface-2/60">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-text-muted hover:text-text transition-colors"
          >
            Close
          </button>
          <a
            href={newRepoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary !min-h-0 !py-2.5 !px-5 text-xs font-bold inline-flex items-center gap-2 shadow-lg"
          >
            <span>Create Repository on GitHub</span>
            <HiArrowTopRightOnSquare className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
