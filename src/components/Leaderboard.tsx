import React, { useEffect, useState } from "react";
import { Link } from "revine";
import {
  fetchGlobalLeaderboard,
  calculateStats,
} from "../utils/github";
import hardcodedUsers from "../constants/users.json";

interface LeaderboardUser {
  login: string;
  name: string;
  avatarUrl: string;
  totalContributions: number;
  longestStreak: number;
  currentStreak: number;
}

export default function Leaderboard() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const topUsers = await fetchGlobalLeaderboard(12, hardcodedUsers);
        const results = topUsers.map((data) => {
          const merged = data.contributionsCollection.contributionCalendar.weeks.flatMap(
            (w) =>
              w.contributionDays.map((d) => ({
                date: d.date,
                count: d.contributionCount,
              })),
          );
          const stats = calculateStats(merged);
          return {
            login: data.login,
            name: data.name || data.login,
            avatarUrl: data.avatarUrl,
            totalContributions:
              data.contributionsCollection.contributionCalendar
                .totalContributions,
            longestStreak: stats.longest,
            currentStreak: stats.current,
          };
        });

        setUsers(
          results
            .filter((u) => u.totalContributions > 0)
            .sort((a, b) => b.totalContributions - a.totalContributions),
        );
      } catch (error) {
        console.error("Failed to load leaderboard:", error);
      } finally {
        setLoading(false);
      }
    }
    loadLeaderboard();
  }, []);

  if (loading) {
    return (
      <section className="panel">
        <div className="panel-head">
          <h2>Global Leaderboard</h2>
          <p>Loading top contributors...</p>
        </div>
        <div className="flex flex-col gap-4 mt-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-surface-offset animate-pulse rounded-lg" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="panel">
      <div className="panel-head">
        <div>
          <h2>Global Leaderboard</h2>
          <p>Top developers ranked by yearly contributions.</p>
        </div>
      </div>
      <div className="leaderboard-list mt-6">
        {users.map((user, i) => (
          <Link
            key={user.login}
            href={`/user/${user.login}`}
            className="leaderboard-item"
          >
            <div className="flex items-center gap-4">
              <span className="rank">{i + 1}</span>
              <img
                src={user.avatarUrl}
                alt={user.login}
                className="w-10 h-10 rounded-full border border-white/5"
              />
              <div>
                <div className="font-bold">{user.name}</div>
                <div className="text-xs opacity-60">@{user.login}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono font-bold text-primary">
                {user.totalContributions.toLocaleString()}
              </div>
              <div className="text-[10px] uppercase tracking-wider opacity-50">
                Contributions
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
