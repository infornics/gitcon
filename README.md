# Gitcon

A high-performance, premium GitHub contribution dashboard built with **Revine**, the next-generation React framework. Gitcon transforms your public activity into a living heatmap of coding momentum.

![Preview](https://github.githubassets.com/images/modules/profile/achievements/pull-shark-default.png)

## ✨ Features

- **Live Data Fetching**: Powered by GitHub's GraphQL API for accurate and detailed contribution metrics.
- **Dynamic Heatmap**: Interactive calendar grid with adjustable ranges (6, 12, or 24 months).
- **Momentum Tracking**: Real-time calculation of current streaks, longest streaks, and daily averages.
- **Repository Insights**: Discover your most productive projects with repository-level contribution breakdown.
- **Premium Design**: Built with Satoshi and Cabinet Grotesk typography, featuring a gorgeous dark mode and glassmorphism.
- **Ultra-Fast**: Built on **Revine** for instant hot-module reloading and a streamlined developer experience.

## 🚀 Getting Started

### 1. Clone & Install

```bash
npm install
```

### 2. Configure GitHub Token (Optional but Recommended)

To avoid GitHub API rate limits, create a Personal Access Token and add it to a `.env` file in the root:

```bash
REVINE_PUBLIC_GITHUB_TOKEN=your_github_token_here
```

### 3. Start Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🛠 Project Structure

```text
src/
├── components/   # Reusable Atomic UI elements (Grid, StatCard, etc.)
├── pages/        # File-based routing (index.tsx)
├── styles/       # Design system & Global CSS
├── utils/        # Business logic & GitHub API integration
└── root.tsx      # Application entry point
```

## 🏗 Built With

- **[Revine](https://revine.infornics.com)**: The developer-first React framework.
- **React**: Modern functional components with hooks.
- **Tailwind CSS**: Utility-first styling for layout.
- **GitHub GraphQL**: Advanced data queries.

## 📄 License

This project is open-source and available under the MIT License.
