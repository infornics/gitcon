import { parseRepoInput } from "@/utils/github";
import { useState } from "react";
import { Link } from "revine";

const FEATURED_REPOS = [
  {
    owner: "facebook",
    name: "react",
    desc: "The library for web and native user interfaces",
    category: "Framework",
    iconColor: "#61dafb",
  },
  {
    owner: "vercel",
    name: "next.js",
    desc: "The React Framework for the Web",
    category: "Full-Stack",
    iconColor: "#000000",
  },
  {
    owner: "tailwindlabs",
    name: "tailwindcss",
    desc: "A utility-first CSS framework for rapid UI development",
    category: "CSS",
    iconColor: "#38bdf8",
  },
  {
    owner: "torvalds",
    name: "linux",
    desc: "Linux kernel source tree",
    category: "Kernel",
    iconColor: "#f59e0b",
  },
  {
    owner: "microsoft",
    name: "vscode",
    desc: "Visual Studio Code editor",
    category: "IDE",
    iconColor: "#007acc",
  },
  {
    owner: "denoland",
    name: "deno",
    desc: "A modern runtime for JavaScript and TypeScript",
    category: "Runtime",
    iconColor: "#ffffff",
  },
];

export default function RepoLanding() {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsed = parseRepoInput(input);
    if (!parsed) {
      setError(
        "Please enter a valid format, like 'owner/repo' or a GitHub URL (e.g. facebook/react).",
      );
      return;
    }
    window.location.href = `/repo/${parsed.owner}/${parsed.name}`;
  };

  return (
    <main className="py-10">
      <section className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto py-16 px-4">
        <div className="eyebrow">Deep-dive repository analytics</div>
        <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight max-w-3xl mt-4 mb-4 leading-tight">
          Inspect stats for any GitHub repository.
        </h1>
        <p className="text-base sm:text-lg text-text-muted max-w-2xl mx-auto mb-8">
          Analyze stars, forks, open issues, language breakdown, pull requests,
          and activity health metrics in seconds.
        </p>

        {error && (
          <div className="text-rose-500 text-sm mt-4 font-medium">{error}</div>
        )}
      </section>

      <section className="mt-16">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold font-display">
              Popular Repositories
            </h2>
            <p className="text-sm opacity-60">
              Explore analytics for top open-source projects
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURED_REPOS.map((repo) => (
            <Link
              key={`${repo.owner}/${repo.name}`}
              href={`/repo/${repo.owner}/${repo.name}`}
              className="panel p-6 hover:scale-[1.02] hover:border-primary/30 transition-all duration-300 group flex flex-col justify-between text-inherit no-underline"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                    {repo.category}
                  </span>
                  <span className="text-xs opacity-40 group-hover:text-primary transition-colors">
                    View Stats →
                  </span>
                </div>
                <strong className="text-xl font-bold font-display group-hover:text-primary transition-colors block mb-1">
                  {repo.owner} / {repo.name}
                </strong>
                <p className="text-xs opacity-70 line-clamp-2 leading-relaxed">
                  {repo.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-xs font-mono opacity-60">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: repo.iconColor }}
                />
                <span>
                  github.com/{repo.owner}/{repo.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
