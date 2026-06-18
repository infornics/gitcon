export default function Analytics() {
  return (
    <section className="panel">
      <div className="panel-head">
        <div>
          <h2>Advanced Project Analytics</h2>
          <p>Uncover repository impact and developer network contributions.</p>
        </div>
      </div>
      <div className="flex flex-col gap-6 mt-6">
        <div className="flex items-start gap-4">
          <div className="p-3.5 rounded-xl bg-primary/10 text-primary shrink-0">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-lg">Contributed Accounts</h3>
            <p className="text-sm opacity-70 mt-1">
              Discovers which organizations, namespaces, and creator accounts
              you commit to most, highlighting collaborative contributions.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-3.5 rounded-xl bg-primary/10 text-primary shrink-0">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-lg">Language Genomics</h3>
            <p className="text-sm opacity-70 mt-1">
              Detailed breakdown of languages used across repositories. Track
              language dominance percentages and stack evolution.
            </p>
          </div>
        </div>

        <div className="mt-2 p-4 rounded-xl bg-surface-2/50 border border-white/5 flex flex-col gap-2.5">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold">TypeScript</span>
            <span className="opacity-60">72.4%</span>
          </div>
          <div className="h-2 rounded-full bg-surface-offset overflow-hidden">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: "72.4%" }}
            />
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold">CSS / Styling</span>
            <span className="opacity-60">15.8%</span>
          </div>
          <div className="h-2 rounded-full bg-surface-offset overflow-hidden">
            <div
              className="h-full rounded-full bg-[#38bdf8]"
              style={{ width: "15.8%" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
