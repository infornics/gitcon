import { useEffect, useMemo, useRef } from "react";
import { marked } from "marked";
import { FaGithub } from "react-icons/fa";

interface ReadmePreviewProps {
  markdown: string;
}

export function ReadmePreview({ markdown }: ReadmePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const html = useMemo(() => {
    try {
      // Configure marked for GitHub Flavored Markdown
      const parsed = marked.parse(markdown, {
        async: false,
        gfm: true,
        breaks: true,
      }) as string;
      return parsed;
    } catch (e) {
      console.error("Marked parse error:", e);
      return `<p class="text-rose-400">Failed to render markdown preview.</p>`;
    }
  }, [markdown]);

  useEffect(() => {
    if (!containerRef.current) return;
    const images = containerRef.current.querySelectorAll("img");
    images.forEach((img) => {
      img.onerror = () => {
        // Subtle fallback when a third-party image service is temporarily offline
        img.style.opacity = "0.6";
        img.title = "Image service temporarily offline or loading";
      };
    });
  }, [html]);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-white/10 text-xs select-none">
        <div className="flex items-center gap-2">
          {/* Mac Traffic Lights */}
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block shadow-sm" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block shadow-sm" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block shadow-sm" />
          </div>
          <FaGithub className="w-4 h-4 text-text-muted" />
          <span className="font-mono text-text font-medium text-[11px] opacity-80">
            README.md
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 font-semibold">
            Live Preview
          </span>
        </div>
      </div>

      {/* Main Document Body */}
      <div className="readme-preview-wrapper p-6 sm:p-10 overflow-x-auto flex-1 min-h-0 bg-[#0d1117]" ref={containerRef}>
        <div
          className="github-markdown-body max-w-4xl mx-auto"
          dangerouslySetInnerHTML={{ __html: html }}
          onClick={(e) => {
            // Open external links safely in new tab
            const target = e.target as HTMLElement;
            const anchor = target.closest("a");
            if (anchor && anchor.href && !anchor.href.startsWith("javascript:")) {
              anchor.setAttribute("target", "_blank");
              anchor.setAttribute("rel", "noopener noreferrer");
            }
          }}
        />
      </div>
    </div>
  );
}
