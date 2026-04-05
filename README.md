# gitcon-web

Welcome to your new Revine project!

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Start development server
```bash
npm run dev
```

## Scripts
- npm run dev - Start dev server

- npm run build - Production build

- npm run preview - Preview production build

## Project Structure
```bash
src/
├── pages/         # Application routes
│   └── index.tsx  # Home page
├── App.tsx        # Router configuration
└── main.tsx       # Application entry point
```

## Customization
### Add a New Page
Create new .tsx file in src/pages

```tsx
// src/pages/about.tsx
export default function About() {
  return <h1>About Page</h1>
}
```
Access at /about

### Modify Vite Config
Edit vite.config.ts:

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080 // Custom port
  }
});
```

## Deployment
Build for production:

```bash
npm run build
```
The build artifacts will be in dist/ directory.