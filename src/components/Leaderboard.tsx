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
    <section className="panel leaderboard-panel">
      <div className="panel-head">
        <div>
          <h2>Global Leaderboard</h2>
          <p>Top developers ranked by yearly contributions and consistency.</p>
        </div>
      </div>
      <div className="leaderboard-table-wrapper">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th className="text-center w-16">Rank</th>
              <th>Developer</th>
              <th className="text-right">Contributions</th>
              <th className="text-right">Longest Streak</th>
              <th className="text-right">Current Streak</th>
              <th className="text-center">Profile</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr key={user.login}>
                <td className="rank text-center">{i + 1}</td>
                <td>
                  <div className="flex items-center gap-3">
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
                </td>
                <td className="text-right font-mono font-bold text-primary">
                  {user.totalContributions.toLocaleString()}
                </td>
                <td className="text-right font-mono">
                  {user.longestStreak} days
                </td>
                <td className="text-right font-mono">
                  {user.currentStreak} days
                </td>
                <td className="text-center">
                  <Link
                    href={`/user/${user.login}`}
                    className="btn btn-secondary !py-1 !px-3 !text-xs"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
