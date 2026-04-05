import React, { useState, useEffect, useMemo } from 'react';
import { StatCard } from '../components/StatCard';
import { ContributionGrid } from '../components/ContributionGrid';
import { 
  fetchContributions, 
  mergeSeries, 
  calculateStats, 
  buildDateSeries,
  GithubUserData 
} from '../utils/github';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function GitconTracker() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });
  const [username, setUsername] = useState('');
  const [range, setRange] = useState(365);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('Enter a username and load the graph.');
  const [userData, setUserData] = useState<GithubUserData | null>(null);
  const [series, setSeries] = useState<Array<{ date: string; count: number }>>([]);
  const [repos, setRepos] = useState<Array<{ name: string; owner: string; count: number }>>([]);
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number; show: boolean }>({
    text: '', x: 0, y: 0, show: false
  });

  // Theme Sync
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Starter Data
  useEffect(() => {
    const starterDays = buildDateSeries(365).dates.map(date => {
      const seed = new Date(date + 'T00:00:00Z').getUTCDate();
      const count = seed % 6 === 0 ? 8 : seed % 5 === 0 ? 5 : seed % 4 === 0 ? 2 : 0;
      return { date, count };
    });
    setSeries(starterDays);
  }, []);

  const stats = useMemo(() => calculateStats(series), [series]);
  const months = useMemo(() => {
    const weeks: string[][] = [];
    for (let i = 0; i < series.length; i += 7) weeks.push(series.slice(i, i + 7).map(d => d.date));
    return weeks.map(week => {
      const d = new Date(week[0] + 'T00:00:00Z');
      return d.getUTCDate() <= 7 ? MONTH_NAMES[d.getUTCMonth()] : '';
    });
  }, [series]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;
    setLoading(true);
    setStatus('Loading contribution data…');
    
    try {
      const user = await fetchContributions(username, range);
      const merged = mergeSeries(range, user.contributionsCollection.contributionCalendar.weeks);
      const extractedRepos = (user.contributionsCollection.commitContributionsByRepository || [])
        .map(item => ({ 
          name: item.repository.name, 
          owner: item.repository.owner.login, 
          count: item.contributions.totalCount 
        }))
        .sort((a, b) => b.count - a.count);
        
      setUserData(user);
      setSeries(merged);
      setRepos(extractedRepos);
      setStatus(`Loaded ${user.contributionsCollection.contributionCalendar.totalContributions.toLocaleString()} contributions for ${user.login}.`);
    } catch (err: any) {
      setStatus(err.message);
    } finally {
      setLoading(false);
    }
  };

  const showTooltip = (day: { date: string; count: number }, x: number, y: number) => {
    const dateFormatted = new Date(day.date + 'T00:00:00Z').toLocaleDateString(undefined, { 
      month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' 
    });
    setTooltip({
      text: `${day.count} contributions • ${dateFormatted}`,
      x, y, show: true
    });
  };

  return (
    <div className="page-shell-wrapper">
      <div className="page-shell">
        <header>
          <a className="brand" href="/" aria-label="Gitcon home">
            <div className="brand-mark" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="5" height="16" rx="2"></rect>
                <rect x="10" y="9" width="5" height="11" rx="2"></rect>
                <path d="M17 14a4 4 0 1 1 4 4h-2"></path>
              </svg>
            </div>
          <div className="brand-copy">
            <strong>Gitcon</strong>
            <span>Track daily GitHub momentum</span>
          </div>
        </a>
        <button 
          className="theme-toggle" 
          type="button" 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="Switch theme"
        >
          {theme === 'dark' ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </button>
      </header>

      <main>
        <section className="hero">
          <div>
            <div className="eyebrow">GitHub activity dashboard</div>
            <h1 className="tracker-title">See your coding streak as a living contribution graph.</h1>
            <p>Paste a GitHub username, choose a time window, and get a clean heatmap with streaks, totals, and busiest repositories.</p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#tracker">Open tracker</a>
              <a className="btn btn-secondary" href="https://docs.github.com/en/account-and-profile/concepts/contributions-on-your-profile" target="_blank" rel="noopener noreferrer">How counts work</a>
            </div>
          </div>
          <aside className="hero-card">
            <div className="hero-card-header">
              <div>
                <div className="label">Preview snapshot</div>
                <div className="value">{userData?.login || 'octocat'}</div>
              </div>
              <div className="label">Intensity</div>
            </div>
            <ContributionGrid 
              days={series.slice(-126)} 
              maxCount={stats.max} 
              skeleton={loading}
              onHover={showTooltip}
              onLeave={() => setTooltip(p => ({ ...p, show: false }))}
            />
            <div className="mini-kpis">
              <StatCard label="Total" value={stats.total.toLocaleString()} isMini />
              <StatCard label="Longest streak" value={stats.longest} isMini />
            </div>
          </aside>
        </section>

        <section className="workspace" id="tracker">
          <div>
            <section className="panel">
              <div className="panel-head">
                <div>
                  <h2>Contribution graph</h2>
                  <p>Fetch live public contribution data and map it into a heatmap.</p>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="control-grid">
                <div className="field">
                  <label htmlFor="username">GitHub username</label>
                  <input 
                    id="username" 
                    className="tracker-input"
                    placeholder="octocat" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required 
                  />
                </div>
                <div className="field">
                  <label htmlFor="range">Range</label>
                  <select 
                    id="range" 
                    className="tracker-select"
                    value={range}
                    onChange={(e) => setRange(Number(e.target.value))}
                  >
                    <option value="182">Last 6 months</option>
                    <option value="365">Last 12 months</option>
                    <option value="730">Last 24 months</option>
                  </select>
                </div>
                <div className="flex items-end pb-1">
                  <button className="btn btn-primary w-full" type="submit" disabled={loading}>
                    {loading ? 'Fetching...' : 'Load graph'}
                  </button>
                </div>
              </form>
              <div className="status">{status}</div>
              
              <div className="graph-wrap">
                <div className="graph-header">
                  <div className="label">
                    {userData ? `${userData.name || userData.login} · ${series.length} days` : 'No profile loaded'}
                  </div>
                  <div className="legend">
                    <span className="muted">Less</span>
                    <div className="legend-scale">
                      <span className="lvl-0"></span><span className="lvl-1"></span><span className="lvl-2"></span><span className="lvl-3"></span><span className="lvl-4"></span>
                    </div>
                    <span className="muted">More</span>
                  </div>
                </div>
                <div className="months">
                  {months.map((m, i) => <div key={i}>{m}</div>)}
                </div>
                <ContributionGrid 
                  days={series} 
                  maxCount={stats.max} 
                  skeleton={loading}
                  onHover={showTooltip}
                  onLeave={() => setTooltip(p => ({ ...p, show: false }))}
                />
              </div>
              <p className="footer-note">Private contributions only appear if enabled on your profile. Timestamps follow UTC.</p>
            </section>
          </div>

          <aside>
            <section className="panel">
              <div className="panel-head">
                <div>
                  <h2>Momentum</h2>
                  <p>Consistency and intensity signals.</p>
                </div>
              </div>
              <div className="kpi-stack">
                <StatCard 
                  label="Total contributions" 
                  value={stats.total.toLocaleString()} 
                  subValue={`${stats.activeDays ? (stats.total / stats.activeDays).toFixed(1) : '0.0'} per active day`}
                />
                <StatCard 
                  label="Current streak" 
                  value={`${stats.current} days`} 
                  subValue="Measured from the latest day."
                />
                <div className="kpi">
                  <div className="label">Longest streak</div>
                  <strong>{stats.longest} days</strong>
                  <div className="streak-meter">
                    <span style={{ width: `${Math.min(100, stats.longest ? (stats.current / stats.longest) * 100 : 0)}%` }}></span>
                  </div>
                </div>
                <StatCard 
                  label="Best day" 
                  value={stats.best.date ? new Date(stats.best.date + 'T00:00:00Z').toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—'} 
                  subValue={stats.best.date ? `${stats.best.count} contributions in a day` : 'No data yet.'}
                />
              </div>
            </section>

            <section className="panel">
              <div className="panel-head">
                <div>
                  <h2>Top repositories</h2>
                  <p>Ranked by commit contributions in selected range.</p>
                </div>
              </div>
              <div className="repo-list">
                {repos.length > 0 ? (
                  repos.slice(0, 5).map((repo, i) => (
                    <div key={i} className="repo-item">
                      <div>
                        <strong>{repo.name}</strong>
                        <span>{repo.owner}</span>
                      </div>
                      <strong>{repo.count}</strong>
                    </div>
                  ))
                ) : (
                  <div className="repo-item">
                    <div><strong>No data yet</strong><span>Load a profile to see repos.</span></div>
                    <strong>—</strong>
                  </div>
                )}
              </div>
            </section>
          </aside>
        </section>
      </main>

      {tooltip.show && (
        <div 
          className="tooltip show" 
          style={{ 
            left: tooltip.x, 
            top: tooltip.y,
            transform: 'translate(12px, 12px)'
          }}
        >
          {tooltip.text}
        </div>
      )}
      </div>
    </div>
  );
}
