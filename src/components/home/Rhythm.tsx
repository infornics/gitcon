export default function Rhythm() {
  return (
    <section className="panel">
      <div className="panel-head">
        <div>
          <h2>Developer Rhythms & Insights</h2>
          <p>Analyze your daily patterns and coding rhythms over time.</p>
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
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-lg">Weekly Activity Rhythm</h3>
            <p className="text-sm opacity-70 mt-1">
              Identifies your peak coding days and active streaks. Tracks
              day-of-week averages to help optimize your coding schedule.
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
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-lg">Hourly Focus Distribution</h3>
            <p className="text-sm opacity-70 mt-1">
              Plots commit density by the hour of the day. Pinpoint your core
              focus hours, whether you are a morning coder or a late-night
              developer.
            </p>
          </div>
        </div>

        <div className="mt-2 p-4 rounded-xl bg-surface-2/50 border border-white/5">
          <div className="flex justify-between items-center mb-3 text-xs opacity-60">
            <span>Activity Pattern</span>
            <span>Peak focus: Afternoon</span>
          </div>
          <div className="flex items-end gap-1.5 h-16 px-2">
            {[20, 35, 15, 60, 80, 45, 10].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-primary/20 hover:bg-primary transition-colors"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
