# Gitcon

Gitcon is a high-performance, premium GitHub contribution dashboard built with **Revine**, the developer-first React framework. Gitcon fetches and aggregates public user activity to visualize daily rhythms, streaks, cumulative growth, and project-level momentum in a dark-themed, glassmorphic layout.

![Framework](https://img.shields.io/badge/Framework-Revine-58aab0)
![Library](https://img.shields.io/badge/Library-React-61dafb?logo=react)
![Styling](https://img.shields.io/badge/Styling-Tailwind_CSS-38bdf8?logo=tailwind-css)
![Language](https://img.shields.io/badge/Language-TypeScript-3178c6?logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green)

---

## Features

- **Dynamic Contribution Heatmap**: Interactive calendar grid visualization with configurable filters (supporting last 6 months or last 12 months) and detailed tooltip counts.
- **Weekly Coding Rhythm**: Graph highlighting weekly peaks and low-productivity days to discover when you code best.
- **Productivity Hours**: SVG distribution chart plotting commit density by hour of the day to define core active periods.
- **Top Contributed Accounts**: Automatically lists other GitHub user and organization accounts whose repositories you have contributed to, with direct external redirects.
- **Most Used Languages**: Complete breakdown of programming languages used across projects, accompanied by dynamic color-coded visual progress indicators.
- **Streak & Growth Calculators**: Computes acceleration indexes, active streaks, and all-time record contribution metrics.
- **Modern Dark-Mode Aesthetics**: Premium CSS glassmorphism, harmonious palettes, fluid micro-animations, and responsive column layouts designed for desktop and mobile displays.

---

## Getting Started

### 1. Installation

Clone the repository and install the application dependencies:

```bash
npm install
```

### 2. Configure Access Token (Recommended)

To avoid GitHub GraphQL API rate limiting, create a GitHub Personal Access Token (PAT) and place it in a `.env` file at the project root:

```env
REVINE_PUBLIC_GITHUB_TOKEN=your_personal_access_token_here
```

### 3. Local Development

Spin up the local hot-reloading development server:

```bash
npm run dev
```

By default, the server runs on [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```text
src/
├── components/     # Reusable layout and graphic widgets (ContributionGrid, StatCard, Leaderboard)
├── pages/          # File-based SPA routing
│   └── user/
│       └── [username]/
│           ├── accounts.tsx      # All contributed accounts subpage
│           ├── languages.tsx     # All languages breakdown subpage
│           ├── repositories.tsx  # All repositories subpage
│           └── [username].tsx    # Main profile container and rhythm charts
├── styles/         # Global design tokens and tracker layouts
├── utils/          # Data calculation, NVM random seeding, and GraphQL clients
└── root.tsx        # Application entry point
```

---

## Tech Stack

- **Revine**: Single-page React framework built for optimal development speed.
- **React**: Modern functional structure with UI-bound memoized states.
- **Tailwind CSS**: Responsive grid columns, animations, and typography tokens.
- **GitHub GraphQL API**: Deep queries fetching complex calendar nodes.

---

## License

This project is licensed under the MIT License.
