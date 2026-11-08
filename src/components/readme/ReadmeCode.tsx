import { useState } from "react";
import { HiArrowDownTray, HiCheck, HiClipboardDocument } from "react-icons/hi2";
import { downloadMarkdownFile } from "../../utils/readme";

interface ReadmeCodeProps {
  markdown: string;
  username: string;
  onMarkdownChange?: (val: string) => void;
}

export function ReadmeCode({ markdown, username, onMarkdownChange }: ReadmeCodeProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    downloadMarkdownFile(`README-${username || "profile"}`, markdown);
  };

  const lineCount = markdown.split("\n").length;
  const charCount = markdown.length;

  return (
    <div className="flex flex-col h-full rounded-2xl overflow-hidden border border-white/10 bg-surface">
      {/* Code Toolbar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-surface-2/60 flex-wrap gap-2">
        <div className="flex items-center gap-3 text-xs text-text-muted font-mono">
          <span className="font-semibold text-text">README.md</span>
          <span>•</span>
          <span>{lineCount} lines</span>
          <span>•</span>
          <span>{charCount} chars</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className={`btn !min-h-0 !py-1.5 !px-3.5 text-xs font-semibold rounded-lg transition-all ${
              copied
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                : "bg-surface-offset hover:bg-white/10 text-text border border-white/10"
            }`}
            title="Copy entire markdown to clipboard"
          >
            {copied ? <HiCheck className="w-4 h-4 text-emerald-400" /> : <HiClipboardDocument className="w-4 h-4" />}
            <span>{copied ? "Copied!" : "Copy Code"}</span>
          </button>

          <button
            onClick={handleDownload}
            className="btn !min-h-0 !py-1.5 !px-3.5 text-xs font-semibold rounded-lg bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30 transition-all"
            title="Download README.md"
          >
            <HiArrowDownTray className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Editor / Code Container */}
      <div className="relative flex-1 p-4 font-mono text-xs sm:text-sm overflow-auto">
        <textarea
          value={markdown}
          onChange={(e) => onMarkdownChange?.(e.target.value)}
          readOnly={!onMarkdownChange}
          className="w-full h-full min-h-[500px] bg-transparent text-text font-mono text-xs sm:text-sm resize-none focus:outline-none border-none p-0 leading-relaxed selection:bg-primary/30"
          spellCheck={false}
        />
      </div>
    </div>
  );
}

