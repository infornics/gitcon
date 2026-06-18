import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "revine";
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
  followers: number;
}

export default function Leaderboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const topUsers = await fetchGlobalLeaderboard(10, hardcodedUsers);
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
            followers: data.followers?.totalCount || 0,
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

  const totalPages = Math.ceil(users.length / rowsPerPage);
  const paginatedUsers = users.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  if (loading) {
    return (
      <section className="panel leaderboard-panel">
        <div className="panel-head">
          <div>
            <h2>Global Leaderboard</h2>
            <p>Loading top contributors...</p>
          </div>
        </div>
        <div className="leaderboard-table-wrapper">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th className="text-center w-16">Rank</th>
                <th>Developer</th>
                <th className="!text-center">Contributions</th>
                <th className="!text-center">Longest Streak</th>
                <th className="!text-center">Current Streak</th>
                <th className="!text-center">Followers</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i}>
                  <td className="rank text-center">
                    <div className="skeleton h-6 w-8 mx-auto rounded" />
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="skeleton w-10 h-10 rounded-full shrink-0" />
                      <div className="flex flex-col gap-1.5">
                        <div className="skeleton h-4 w-28 rounded" />
                        <div className="skeleton h-3 w-20 rounded" />
                      </div>
                    </div>
                  </td>
                  <td className="!text-center">
                    <div className="skeleton h-5 w-16 mx-auto rounded" />
                  </td>
                  <td className="!text-center">
                    <div className="skeleton h-5 w-20 mx-auto rounded" />
                  </td>
                  <td className="!text-center">
                    <div className="skeleton h-5 w-20 mx-auto rounded" />
                  </td>
                  <td className="!text-center">
                    <div className="skeleton h-5 w-16 mx-auto rounded" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
              <th className="!text-center">Contributions</th>
              <th className="!text-center">Longest Streak</th>
              <th className="!text-center">Current Streak</th>
              <th className="!text-center">Followers</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user, i) => {
              const globalRank = (currentPage - 1) * rowsPerPage + i + 1;
              return (
                <tr
                  key={user.login}
                  className="cursor-pointer"
                  onClick={() => navigate(`/user/${user.login}`)}
                >
                  <td className={`rank text-center ${
                    globalRank === 1 ? "gold" : 
                    globalRank === 2 ? "silver" : 
                    globalRank === 3 ? "bronze" : ""
                  }`}>
                    {globalRank}
                  </td>
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
                  <td className="!text-center font-mono font-bold text-primary">
                    {user.totalContributions.toLocaleString()}
                  </td>
                  <td className="!text-center font-mono">
                    {user.longestStreak} days
                  </td>
                  <td className="!text-center font-mono">
                    {user.currentStreak} days
                  </td>
                  <td className="!text-center font-mono font-bold text-primary">
                    {user.followers.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          className="pagination-btn"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        >
          Previous
        </button>
        <span className="page-info">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="pagination-btn"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        >
          Next
        </button>
      </div>
    </section>
  );
}
