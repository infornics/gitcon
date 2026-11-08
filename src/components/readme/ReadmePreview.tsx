import { useMemo } from "react";
import { marked } from "marked";

interface ReadmePreviewProps {
  markdown: string;
}

export function ReadmePreview({ markdown }: ReadmePreviewProps) {
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

  return (
    <div className="readme-preview-wrapper p-6 sm:p-8 overflow-x-auto min-h-[500px]">
      <div
        className="github-markdown-body"
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
  );
}

