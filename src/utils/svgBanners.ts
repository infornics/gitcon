/**
 * Standalone High-Craft SVG Banner Generator for Gitcon.
 * Purely self-contained - zero external server or API requirements.
 * Generates data URI SVGs with glow aura, glassmorphism, animated orbs, and telemetry.
 */

export interface BannerParams {
  username: string;
  name: string;
  title: string;
  avatarUrl: string;
  stars: number;
  followers?: number;
  contributions?: number;
  languages: string[];
  theme?: "cyan" | "emerald" | "purple" | "amber" | "rose" | "dark";
}

const THEME_COLORS: Record<string, { primary: string; secondary: string; tertiary: string }> = {
  cyan: { primary: "#06B6D4", secondary: "#3B82F6", tertiary: "#8B5CF6" },
  emerald: { primary: "#10B981", secondary: "#06B6D4", tertiary: "#3B82F6" },
  purple: { primary: "#8B5CF6", secondary: "#EC4899", tertiary: "#3B82F6" },
  amber: { primary: "#F59E0B", secondary: "#EF4444", tertiary: "#8B5CF6" },
  rose: { primary: "#F43F5E", secondary: "#8B5CF6", tertiary: "#3B82F6" },
  dark: { primary: "#58AAB0", secondary: "#10B981", tertiary: "#6366F1" },
};

function formatCount(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return String(num);
}

/**
 * Creates the signature Hero Visual Banner (resembling GitSkins' signature glowing card).
 */
export function createHeroBannerSvg(params: BannerParams): string {
  const { username, name, title, avatarUrl, stars, languages, theme = "dark" } = params;
  const colors = THEME_COLORS[theme] || THEME_COLORS.dark;

  const langsChips = languages
    .slice(0, 4)
    .map((lang, idx) => {
      const x = 46 + idx * 126;
      const delay = idx * 90;
      return `
        <g class="aura-chip" style="animation-delay:${delay}ms">
          <rect x="${x}" y="166" width="116" height="28" rx="14" fill="rgba(255,255,255,0.06)" stroke="${colors.primary}" stroke-opacity="0.5"/>
          <text x="${x + 16}" y="185" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="12" font-weight="700" fill="#e6edf3">${lang}</text>
        </g>`;
    })
    .join("");

  const starsFormatted = formatCount(stars);
  const cleanUsername = username.replace(/[^a-zA-Z0-9_\-]/g, "");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="860" height="240" viewBox="0 0 860 240">
  <defs>
    <linearGradient id="bg-${cleanUsername}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#090d16"/>
      <stop offset="50%" stop-color="#111827"/>
      <stop offset="100%" stop-color="#090d16"/>
    </linearGradient>
    <radialGradient id="orb1-${cleanUsername}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${colors.primary}" stop-opacity="0.65"/>
      <stop offset="100%" stop-color="${colors.primary}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="orb2-${cleanUsername}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${colors.secondary}" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="${colors.secondary}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="orb3-${cleanUsername}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${colors.tertiary}" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="${colors.tertiary}" stop-opacity="0"/>
    </radialGradient>
    <clipPath id="av-${cleanUsername}"><circle cx="96" cy="94" r="45"/></clipPath>
  </defs>
  <style>
    .aura-orb-a { animation: float-a 9s ease-in-out infinite; }
    .aura-orb-b { animation: float-b 11s ease-in-out infinite 1.1s; }
    .aura-ring { animation: ring 8s ease-in-out infinite; }
    @keyframes float-a { 0%,100% { transform: translate(0,0); opacity: .58; } 50% { transform: translate(25px,-18px); opacity: .86; } }
    @keyframes float-b { 0%,100% { transform: translate(0,0); opacity: .42; } 50% { transform: translate(-20px,16px); opacity: .72; } }
    @keyframes ring { 0%,100% { opacity: .12; } 50% { opacity: .35; } }
  </style>
  <rect width="860" height="240" rx="20" fill="url(#bg-${cleanUsername})"/>
  <ellipse class="aura-orb-a" cx="140" cy="45" rx="200" ry="110" fill="url(#orb1-${cleanUsername})"/>
  <ellipse class="aura-orb-b" cx="660" cy="55" rx="240" ry="100" fill="url(#orb2-${cleanUsername})"/>
  <ellipse class="aura-orb-a" cx="500" cy="210" rx="300" ry="80" fill="url(#orb3-${cleanUsername})"/>
  
  <!-- Outer glass panel -->
  <rect x="24" y="24" width="812" height="192" rx="18" fill="rgba(8,12,20,0.55)" stroke="${colors.primary}" stroke-opacity="0.45" stroke-width="1.5"/>
  
  <!-- Right Stats Orbit -->
  <circle class="aura-ring" cx="735" cy="118" r="48" fill="none" stroke="#e6edf3" stroke-width="1.2"/>
  <circle class="aura-ring" cx="735" cy="118" r="78" fill="none" stroke="#e6edf3" stroke-width="0.8"/>
  <text x="735" y="112" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="34" font-weight="900" fill="${colors.primary}">${starsFormatted}</text>
  <text x="735" y="134" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="10" font-weight="800" letter-spacing="2.5" fill="#94A3B8">TOTAL STARS</text>

  <!-- Avatar -->
  <circle cx="96" cy="94" r="48" fill="rgba(255,255,255,0.06)" stroke="${colors.primary}" stroke-opacity="0.85" stroke-width="2"/>
  ${
    avatarUrl
      ? `<image href="${avatarUrl}" x="51" y="49" width="90" height="90" clip-path="url(#av-${cleanUsername})" preserveAspectRatio="xMidYMid slice"/>`
      : `<circle cx="96" cy="94" r="45" fill="${colors.primary}" fill-opacity="0.3"/>`
  }

  <!-- User Details -->
  <text x="166" y="69" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="13" font-weight="800" letter-spacing="2.5" fill="#94A3B8">@${username.toUpperCase()}</text>
  <text x="166" y="122" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="44" font-weight="850" letter-spacing="-1.2" fill="#F8FAFC">${name}</text>
  <text x="168" y="148" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="15" fill="#94A3B8">${title}</text>

  <!-- Tags -->
  ${langsChips}
  
  <text x="825" y="232" text-anchor="end" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="9" font-weight="700" letter-spacing="1" fill="#64748B">GITCON STUDIO</text>
  <rect x="0.5" y="0.5" width="859" height="239" rx="19.5" fill="none" stroke="${colors.primary}" stroke-opacity="0.35"/>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Creates the Retro Audiophile Mixtape Cassette SVG.
 */
export function createMixtapeCassetteSvg(params: BannerParams): string {
  const { username, name, title, languages } = params;
  const langText = languages.slice(0, 4).join(" · ") || "TypeScript · React · Python";
  const cleanUsername = username.replace(/[^a-zA-Z0-9_\-]/g, "");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="860" height="260" viewBox="0 0 860 260">
  <defs>
    <linearGradient id="c-bg-${cleanUsername}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#18181B"/>
      <stop offset="50%" stop-color="#27272A"/>
      <stop offset="100%" stop-color="#18181B"/>
    </linearGradient>
    <linearGradient id="c-label-${cleanUsername}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#F43F5E"/>
      <stop offset="50%" stop-color="#FB923C"/>
      <stop offset="100%" stop-color="#FBBF24"/>
    </linearGradient>
  </defs>
  <!-- Cassette Body -->
  <rect x="40" y="20" width="780" height="220" rx="18" fill="url(#c-bg-${cleanUsername})" stroke="#3F3F46" stroke-width="2"/>
  
  <!-- Top Label Area -->
  <rect x="70" y="40" width="720" height="110" rx="10" fill="#FAFAFA"/>
  <rect x="70" y="40" width="720" height="26" rx="10" fill="url(#c-label-${cleanUsername})"/>
  
  <text x="90" y="58" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="12" font-weight="900" letter-spacing="2" fill="#FFFFFF">SIDE A: GREATEST HITS // 90 MIN</text>
  <text x="760" y="58" text-anchor="end" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="12" font-weight="900" fill="#FFFFFF">HI-FI STEREO</text>
  
  <text x="90" y="92" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="24" font-weight="900" fill="#18181B">${name} · ${username}</text>
  <text x="90" y="118" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="13" font-weight="600" fill="#52525B">${title} — [ ${langText} ]</text>
  <line x1="90" y1="134" x2="770" y2="134" stroke="#E4E4E7" stroke-width="1.5"/>

  <!-- Reel Window -->
  <rect x="230" y="160" width="400" height="66" rx="8" fill="#09090B" stroke="#3F3F46"/>
  <!-- Left Wheel -->
  <circle cx="310" cy="193" r="22" fill="#27272A" stroke="#71717A" stroke-width="2"/>
  <circle cx="310" cy="193" r="8" fill="#FAFAFA"/>
  <!-- Right Wheel -->
  <circle cx="550" cy="193" r="22" fill="#27272A" stroke="#71717A" stroke-width="2"/>
  <circle cx="550" cy="193" r="8" fill="#FAFAFA"/>
  <!-- Tape Window Glass -->
  <rect x="360" y="175" width="140" height="36" rx="4" fill="rgba(255,255,255,0.08)" stroke="#52525B"/>
  <text x="430" y="198" text-anchor="middle" font-family="monospace" font-size="11" font-weight="bold" fill="#F43F5E">[52-WK EQUALIZER]</text>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Creates the Retro 8-Bit Arcade Cabinet Marquee SVG.
 */
export function createArcadeCabinetSvg(params: BannerParams): string {
  const { username, name, stars, contributions = 2500 } = params;
  const cleanUsername = username.replace(/[^a-zA-Z0-9_\-]/g, "");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="860" height="240" viewBox="0 0 860 240">
  <defs>
    <linearGradient id="arc-bg-${cleanUsername}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#050505"/>
      <stop offset="100%" stop-color="#14061A"/>
    </linearGradient>
  </defs>
  <!-- Cabinet Border -->
  <rect x="20" y="15" width="820" height="210" rx="14" fill="url(#arc-bg-${cleanUsername})" stroke="#F43F5E" stroke-width="3"/>
  
  <!-- CRT Screen Grid Lines -->
  <line x1="20" y1="70" x2="840" y2="70" stroke="#F43F5E" stroke-opacity="0.4" stroke-width="1"/>
  
  <!-- Header Marquee -->
  <text x="50" y="52" font-family="'Courier New', Courier, monospace" font-size="20" font-weight="900" fill="#F43F5E" letter-spacing="3">★ ★ ARCADE ARENA 1984 ★ ★</text>
  <text x="810" y="52" text-anchor="end" font-family="'Courier New', Courier, monospace" font-size="14" font-weight="bold" fill="#38BDF8">CREDITS: 99</text>

  <!-- Player 1 Profile Card -->
  <text x="50" y="105" font-family="'Courier New', Courier, monospace" font-size="14" font-weight="bold" fill="#FBBF24">1P &gt;&gt; ${username.toUpperCase()}</text>
  <text x="50" y="135" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="30" font-weight="900" fill="#FFFFFF">${name}</text>
  <text x="50" y="165" font-family="'Courier New', Courier, monospace" font-size="13" fill="#A1A1AA">LEVEL: MAX (CONTRIBUTIONS: ${contributions.toLocaleString()})</text>
  
  <!-- High Score Badge -->
  <rect x="580" y="90" width="230" height="90" rx="8" fill="#18181B" stroke="#FBBF24" stroke-width="2"/>
  <text x="695" y="118" text-anchor="middle" font-family="'Courier New', Courier, monospace" font-size="12" font-weight="bold" fill="#FBBF24">HIGH SCORE</text>
  <text x="695" y="152" text-anchor="middle" font-family="'Courier New', Courier, monospace" font-size="28" font-weight="900" fill="#FFFFFF">${stars.toLocaleString()} PTS</text>
  <text x="695" y="172" text-anchor="middle" font-family="'Courier New', Courier, monospace" font-size="10" font-weight="bold" fill="#34D399">RANK #1 DEVELOPER</text>
  
  <!-- Controls Bar -->
  <rect x="20" y="195" width="820" height="30" fill="#18181B"/>
  <circle cx="60" cy="210" r="8" fill="#EF4444"/>
  <circle cx="85" cy="210" r="8" fill="#3B82F6"/>
  <circle cx="110" cy="210" r="8" fill="#10B981"/>
  <text x="140" y="214" font-family="'Courier New', Courier, monospace" font-size="11" fill="#71717A">[JOYSTICK: INSERT COMMITS TO ADVANCE STAGE]</text>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
