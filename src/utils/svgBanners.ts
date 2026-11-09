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
  avatarBase64?: string;
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

function encodeSvgDataUri(svg: string): string {
  // Use Base64 encoding to guarantee 100% reliable rendering in all browsers, img tags, and markdown parsers
  if (typeof btoa !== "undefined") {
    try {
      return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
    } catch {
      return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    }
  } else if (typeof Buffer !== "undefined") {
    return `data:image/svg+xml;base64,${Buffer.from(svg, "utf-8").toString("base64")}`;
  }
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Creates the signature Hero Visual Banner.
 */
export function createHeroBannerSvg(params: BannerParams): string {
  const { username, name, title, avatarUrl, avatarBase64, stars, languages, theme = "dark" } = params;
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

  const initial = (name || username || "D").charAt(0).toUpperCase();

  // If avatarBase64 is provided, embed real user GitHub DP with smooth circular clipping
  const avatarElement = avatarBase64
    ? `
  <defs>
    <clipPath id="av-clip-${cleanUsername}">
      <circle cx="96" cy="94" r="46"/>
    </clipPath>
  </defs>
  <circle cx="96" cy="94" r="48" fill="${colors.primary}" fill-opacity="0.2" stroke="${colors.primary}" stroke-opacity="0.6" stroke-width="2"/>
  <image href="${avatarBase64}" x="50" y="48" width="92" height="92" preserveAspectRatio="xMidYMid slice" clip-path="url(#av-clip-${cleanUsername})"/>`
    : `
  <circle cx="96" cy="94" r="46" fill="url(#av-grad-${cleanUsername})" stroke="#FFFFFF" stroke-opacity="0.25" stroke-width="2"/>
  <text x="96" y="108" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="38" font-weight="900" fill="#FFFFFF">${initial}</text>`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="860" height="240" viewBox="0 0 860 240">
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
    <linearGradient id="av-grad-${cleanUsername}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${colors.primary}"/>
      <stop offset="100%" stop-color="${colors.secondary}"/>
    </linearGradient>
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

  <!-- Avatar Badge (Embedded GitHub DP with Vector Fallback) -->
  ${avatarElement}

  <!-- User Details -->
  <text x="166" y="69" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="13" font-weight="800" letter-spacing="2.5" fill="#94A3B8">@${username.toUpperCase()}</text>
  <text x="166" y="122" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="44" font-weight="850" letter-spacing="-1.2" fill="#F8FAFC">${name}</text>
  <text x="168" y="148" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="15" fill="#94A3B8">${title}</text>

  <!-- Tags -->
  ${langsChips}
  
  <text x="825" y="232" text-anchor="end" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="9" font-weight="700" letter-spacing="1" fill="#64748B">gitcon.infornics.com</text>
  <rect x="0.5" y="0.5" width="859" height="239" rx="19.5" fill="none" stroke="${colors.primary}" stroke-opacity="0.35"/>
</svg>`;

  return encodeSvgDataUri(svg);
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

  return encodeSvgDataUri(svg);
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

  return encodeSvgDataUri(svg);
}

/**
 * Creates the Realistic macOS / Linux Terminal Window SVG.
 * High-craft CRT scanlines, neon syntax colors, traffic light controls, and live git prompt.
 */
export function createTerminalWindowSvg(params: BannerParams): string {
  const { username, name, title, stars, followers = 0, contributions = 0, languages, avatarBase64 } = params;
  const cleanUsername = username.replace(/[^a-zA-Z0-9_\-]/g, "");
  const langsList = languages.slice(0, 5).join(" · ") || "TypeScript · Rust · Python";

  // Avatar circular clip
  const avatarTag = avatarBase64
    ? `
    <defs>
      <clipPath id="term-av-clip-${cleanUsername}">
        <circle cx="80" cy="115" r="38"/>
      </clipPath>
    </defs>
    <circle cx="80" cy="115" r="40" fill="#22C55E" fill-opacity="0.2" stroke="#22C55E" stroke-opacity="0.8" stroke-width="2"/>
    <image href="${avatarBase64}" x="40" y="75" width="80" height="80" preserveAspectRatio="xMidYMid slice" clip-path="url(#term-av-clip-${cleanUsername})"/>`
    : `
    <circle cx="80" cy="115" r="38" fill="#1E293B" stroke="#22C55E" stroke-width="2"/>
    <text x="80" y="125" text-anchor="middle" font-family="'JetBrains Mono', 'Fira Code', monospace" font-size="28" font-weight="900" fill="#22C55E">&gt;_</text>`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="860" height="280" viewBox="0 0 860 280">
  <defs>
    <linearGradient id="term-grad-${cleanUsername}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
    <filter id="neon-glow-${cleanUsername}" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <style>
    .cursor-blink { animation: blink 1s step-end infinite; }
    .term-code { font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, Menlo, Monaco, Consolas, monospace; }
    @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
  </style>

  <!-- Outer Window Shadow / Glow Shell -->
  <rect x="15" y="15" width="830" height="250" rx="14" fill="#000000" fill-opacity="0.6"/>
  <rect x="15" y="15" width="830" height="250" rx="14" fill="url(#term-grad-${cleanUsername})" stroke="#22C55E" stroke-opacity="0.4" stroke-width="1.5"/>

  <!-- Window Titlebar -->
  <path d="M 15 29 Q 15 15 29 15 L 831 15 Q 845 15 845 29 L 845 52 L 15 52 Z" fill="#1e293b" fill-opacity="0.8"/>
  <line x1="15" y1="52" x2="845" y2="52" stroke="#334155" stroke-width="1"/>

  <!-- Traffic Lights -->
  <circle cx="38" cy="33" r="6" fill="#EF4444"/>
  <circle cx="56" cy="33" r="6" fill="#F59E0B"/>
  <circle cx="74" cy="33" r="6" fill="#22C55E"/>

  <!-- Window Title -->
  <text x="430" y="37" text-anchor="middle" class="term-code" font-size="12" font-weight="600" fill="#94A3B8">bash — ${username}@gitcon:~ (zsh)</text>
  <rect x="760" y="24" width="70" height="18" rx="4" fill="#22C55E" fill-opacity="0.15" stroke="#22C55E" stroke-opacity="0.3"/>
  <text x="795" y="37" text-anchor="middle" class="term-code" font-size="10" font-weight="700" fill="#4ADE80">ONLINE</text>

  <!-- Avatar Badge Section -->
  ${avatarTag}

  <!-- Command Prompt Line -->
  <g transform="translate(140, 85)">
    <text x="0" y="0" class="term-code" font-size="13" font-weight="700">
      <tspan fill="#38BDF8">➜</tspan>
      <tspan fill="#A855F7"> ~</tspan>
      <tspan fill="#64748B"> git:(</tspan><tspan fill="#F43F5E">main</tspan><tspan fill="#64748B">)</tspan>
      <tspan fill="#F8FAFC"> whoami --details</tspan>
      <tspan fill="#22C55E" class="cursor-blink"> █</tspan>
    </text>

    <!-- Terminal Output -->
    <text x="0" y="28" class="term-code" font-size="22" font-weight="800" fill="#F8FAFC">${name}</text>
    <text x="0" y="50" class="term-code" font-size="13" font-weight="500" fill="#38BDF8">&gt; ${title}</text>

    <text x="0" y="74" class="term-code" font-size="12" fill="#94A3B8">
      <tspan fill="#F59E0B">STACK:</tspan> <tspan fill="#E2E8F0">${langsList}</tspan>
    </text>

    <text x="0" y="96" class="term-code" font-size="12" fill="#94A3B8">
      <tspan fill="#22C55E">STATS:</tspan> <tspan fill="#E2E8F0">${stars.toLocaleString()} Stars</tspan>
      <tspan fill="#64748B"> │ </tspan>
      <tspan fill="#E2E8F0">${followers.toLocaleString()} Followers</tspan>
      <tspan fill="#64748B"> │ </tspan>
      <tspan fill="#E2E8F0">${contributions.toLocaleString()} Contributions</tspan>
    </text>
  </g>

  <!-- Bottom Terminal Status Bar -->
  <rect x="15" y="246" width="830" height="24" fill="#0f172a" stroke="#1e293b" stroke-width="1"/>
  <rect x="15" y="246" width="90" height="24" fill="#22C55E"/>
  <text x="60" y="262" text-anchor="middle" class="term-code" font-size="11" font-weight="800" fill="#020617">NORMAL</text>
  <text x="120" y="262" class="term-code" font-size="11" font-weight="500" fill="#64748B">utf-8 [unix] │ gitcon.infornics.com</text>
  <text x="830" y="262" text-anchor="end" class="term-code" font-size="11" font-weight="600" fill="#4ADE80">100% ⚡ 0.02ms</text>
</svg>`;

  return encodeSvgDataUri(svg);
}

/**
 * Creates the Viral "Velvet Editorial / Crimson Silk" Hero Banner SVG.
 * Inspired by the high-craft Instagram viral editorial aesthetic:
 * - Rich deep plum/crimson/wine radial lighting (#190B12, #2A0E1B, #701A3D)
 * - Shimmering serif editorial typography with animated sheen
 * - Precision architectural portrait arch frame with rotating astrolabe rings
 * - Live dynamic user avatar, title, stack tags, and achievements
 */
export function createVelvetEditorialHeroSvg(params: BannerParams): string {
  const { username, name, title, stars, followers = 0, contributions = 0, languages, avatarBase64 } = params;
  const cleanUsername = username.replace(/[^a-zA-Z0-9_\-]/g, "");
  const langsFormatted = languages.slice(0, 3).map((l) => l.toUpperCase()).join("  ·  ") || "AI  ·  ENGINEERING  ·  SYSTEMS";

  // Name split into 2 lines if long
  const nameParts = name.trim().split(" ");
  let line1 = name;
  let line2 = "";
  if (nameParts.length >= 2) {
    line1 = nameParts.slice(0, Math.ceil(nameParts.length / 2)).join(" ");
    line2 = nameParts.slice(Math.ceil(nameParts.length / 2)).join(" ") + ".";
  } else {
    line1 = name + ".";
  }

  // Portrait Arch Frame (or vector fallback)
  const portraitElement = avatarBase64
    ? `
    <defs>
      <clipPath id="velvet-arch-${cleanUsername}">
        <path d="M 850 420 V 220 A 110 110 0 0 1 1070 220 V 420 Z" />
      </clipPath>
    </defs>
    <path d="M 850 420 V 220 A 110 110 0 0 1 1070 220 V 420 Z" fill="#2A0E1B" stroke="#E5B5C7" stroke-width="2" stroke-opacity="0.8"/>
    <image href="${avatarBase64}" x="840" y="90" width="240" height="340" preserveAspectRatio="xMidYMid slice" clip-path="url(#velvet-arch-${cleanUsername})"/>
    <!-- Subtle gradient overlay on portrait bottom for depth -->
    <path d="M 850 340 L 1070 340 L 1070 420 L 850 420 Z" fill="url(#velvet-photo-shade-${cleanUsername})" clip-path="url(#velvet-arch-${cleanUsername})" />`
    : `
    <defs>
      <clipPath id="velvet-arch-${cleanUsername}">
        <path d="M 850 420 V 220 A 110 110 0 0 1 1070 220 V 420 Z" />
      </clipPath>
    </defs>
    <path d="M 850 420 V 220 A 110 110 0 0 1 1070 220 V 420 Z" fill="#2A0E1B" stroke="#E5B5C7" stroke-width="2" stroke-opacity="0.8"/>
    <text x="960" y="310" text-anchor="middle" font-family="Georgia, serif" font-size="72" font-weight="700" fill="#E5B5C7">${name.charAt(0).toUpperCase()}</text>`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 480" width="1200" height="480">
  <defs>
    <radialGradient id="velvet-bg-${cleanUsername}" cx="72%" cy="38%" r="80%">
      <stop offset="0%" stop-color="#2A0E1B"/>
      <stop offset="55%" stop-color="#190B12"/>
      <stop offset="100%" stop-color="#10070C"/>
    </radialGradient>
    <radialGradient id="velvet-light-a-${cleanUsername}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#701A3D" stop-opacity="0.75"/>
      <stop offset="100%" stop-color="#701A3D" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="velvet-light-b-${cleanUsername}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#C77B9B" stop-opacity="0.32"/>
      <stop offset="100%" stop-color="#C77B9B" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="velvet-sheen-${cleanUsername}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#F8F0F3"/>
      <stop offset="50%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#E5B5C7"/>
    </linearGradient>
    <linearGradient id="velvet-photo-shade-${cleanUsername}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#10070C" stop-opacity="0"/>
      <stop offset="100%" stop-color="#10070C" stop-opacity="0.85"/>
    </linearGradient>
    <pattern id="velvet-grid-${cleanUsername}" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#C77B9B" stroke-opacity="0.08" stroke-width="1"/>
    </pattern>
    <clipPath id="velvet-clip-${cleanUsername}"><rect width="1200" height="480" rx="20"/></clipPath>
  </defs>

  <style>
    .v-serif { font-family: 'Playfair Display', Georgia, 'Iowan Old Style', 'Palatino Linotype', 'Times New Roman', serif; }
    .v-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
    .v-sans { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    @keyframes orb-float { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-30px, 15px); } }
    .v-glow-a { animation: orb-float 12s ease-in-out infinite; }
  </style>

  <g clip-path="url(#velvet-clip-${cleanUsername})">
    <!-- Velvet Darkroom Canvas -->
    <rect width="1200" height="480" fill="url(#velvet-bg-${cleanUsername})"/>

    <!-- Luminous Ambient Light Fields -->
    <ellipse class="v-glow-a" cx="950" cy="180" rx="420" ry="320" fill="url(#velvet-light-a-${cleanUsername})"/>
    <ellipse cx="200" cy="420" rx="380" ry="240" fill="url(#velvet-light-b-${cleanUsername})"/>

    <!-- Architectural Grid Overlay -->
    <rect width="1200" height="480" fill="url(#velvet-grid-${cleanUsername})"/>

    <!-- Precision Astrolabe Celestial Orbiting Rings around Portrait -->
    <g transform="translate(960 270)">
      <circle r="220" fill="none" stroke="#C77B9B" stroke-opacity="0.12" stroke-dasharray="2 10"/>
      <circle r="190" fill="none" stroke="#E5B5C7" stroke-opacity="0.25" stroke-width="1"/>
      <circle r="150" fill="none" stroke="#701A3D" stroke-opacity="0.35" stroke-dasharray="4 8"/>
      <circle cx="134" cy="-134" r="3.5" fill="#F8F0F3" opacity="0.8"/>
      <circle cx="-106" cy="106" r="2.5" fill="#E5B5C7" opacity="0.6"/>
    </g>

    <!-- Top Terminal Command Line Pill -->
    <g transform="translate(60, 48)">
      <rect width="280" height="28" rx="14" fill="#190B12" fill-opacity="0.8" stroke="#701A3D" stroke-width="1"/>
      <text x="20" y="19" class="v-mono" font-size="11.5" font-weight="700" fill="#E5B5C7">~/${username} $ build --intelligent</text>
    </g>

    <!-- Category / Thesis Subheader -->
    <text x="60" y="112" class="v-mono" font-size="12" letter-spacing="4" font-weight="800" fill="#C77B9B">
      ${langsFormatted}
    </text>

    <!-- Main Editorial Display Name (Serif Headline) -->
    <text x="60" y="180" class="v-serif" font-size="58" font-weight="400" letter-spacing="-1.5" fill="url(#velvet-sheen-${cleanUsername})">${line1}</text>
    ${line2 ? `<text x="60" y="244" class="v-serif" font-size="58" font-weight="400" letter-spacing="-1.5" fill="url(#velvet-sheen-${cleanUsername})">${line2}</text>` : ""}

    <!-- Role / Title Pill Deck -->
    <text x="60" y="286" class="v-mono" font-size="12" letter-spacing="2.5" font-weight="700" fill="#E5B5C7">
      ${title.toUpperCase()}
    </text>

    <!-- Philosophy Tagline -->
    <text x="60" y="316" class="v-sans" font-size="15" font-style="italic" fill="#DDA3B8">
      Engineering intelligence. Designing experiences.
    </text>

    <!-- Divider Line -->
    <line x1="60" y1="344" x2="760" y2="344" stroke="#701A3D" stroke-width="1.2"/>

    <!-- Key Telemetry Highlights Bar -->
    <g transform="translate(60, 375)">
      <text x="0" y="0" class="v-mono" font-size="11" font-weight="700" letter-spacing="1.5" fill="#E5B5C7">
        ECOSYSTEM: <tspan fill="#F8F0F3">${stars.toLocaleString()} STARS</tspan>   ·   NETWORK: <tspan fill="#F8F0F3">${followers.toLocaleString()} DEVELOPERS</tspan>   ·   CONTRIBUTIONS: <tspan fill="#F8F0F3">${contributions.toLocaleString()}</tspan>
      </text>
      <text x="0" y="24" class="v-mono" font-size="11" font-weight="600" letter-spacing="1" fill="#C77B9B">
        GITCON VERIFIED TELEMETRY   ·   ${languages.slice(0, 4).join("  ·  ")}
      </text>
    </g>

    <!-- Arch Portrait Frame -->
    ${portraitElement}

    <!-- Watermark Brand -->
    <text x="1140" y="456" text-anchor="end" class="v-mono" font-size="9" font-weight="700" letter-spacing="2" fill="#701A3D">gitcon.infornics.com</text>
    <rect x="0.5" y="0.5" width="1199" height="479" rx="19.5" fill="none" stroke="#701A3D" stroke-opacity="0.4"/>
  </g>
</svg>`;

  return encodeSvgDataUri(svg);
}

/**
 * Creates the Velvet Editorial Section Title Divider Banner SVG.
 * Matching the signature "01 ABOUT — Hello, I'm ...", "03 WORK — Products, not assignments", "04 TOOLKIT", etc.
 */
export function createVelvetSectionDividerSvg(sectionNum: string, sectionTitle: string, subtitle: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" width="1200" height="120">
  <defs>
    <linearGradient id="v-sec-line" x1="40" y1="0" x2="1160" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#C77B9B"/>
      <stop offset="60%" stop-color="#701A3D"/>
      <stop offset="100%" stop-color="#701A3D" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="v-sec-sheen" x1="-300" y1="0" x2="0" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#E5B5C7"/>
      <stop offset="50%" stop-color="#F8F0F3"/>
      <stop offset="100%" stop-color="#E5B5C7"/>
    </linearGradient>
  </defs>
  <style>
    .vs-serif { font-family: 'Playfair Display', Georgia, serif; }
    .vs-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
  </style>

  <!-- Number & Section Tracker -->
  <text class="vs-mono" x="40" y="34" font-size="12" letter-spacing="3" fill="#C77B9B">
    <tspan fill="#E5B5C7">${sectionNum}</tspan>   ${sectionTitle.toUpperCase()}
  </text>

  <!-- Editorial Title -->
  <text class="vs-serif" x="38" y="84" font-size="42" font-weight="300" letter-spacing="-1" fill="#F8F0F3">
    ${subtitle}
  </text>

  <text class="vs-mono" x="1160" y="34" text-anchor="end" font-size="10.5" letter-spacing="2.4" fill="#B6A3AC">
    gitcon.infornics.com
  </text>

  <!-- Dividing Line -->
  <path d="M 40 106 H 1160" stroke="url(#v-sec-line)" stroke-width="1.2"/>
</svg>`;

  return encodeSvgDataUri(svg);
}

export interface VelvetProjectCardParams {
  index: number;
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  tags?: string[];
  repoUrl: string;
}

/**
 * Creates the high-craft Velvet Editorial Project Card with moving borders,
 * deep wine gradient background, ambient luminous orb, technical grid,
 * and animated running laser trace border.
 */
export function createVelvetProjectCardSvg(params: VelvetProjectCardParams): string {
  const { index, name, description, language, stars, forks, tags = [] } = params;
  const numStr = String(index).padStart(2, "0");
  const cleanName = name.replace(/[^a-zA-Z0-9_\-]/g, "");
  const tagList = tags.length > 0 ? tags : [language || "Software", "Production", "Verified", "Open Source"];

  const tagChips = tagList
    .slice(0, 4)
    .map((tag, i) => {
      const x = 50 + i * 115;
      return `
      <g>
        <rect x="${x}" y="222" width="105" height="24" rx="12" fill="#27101C" stroke="#C77B9B" stroke-opacity="0.35"/>
        <text x="${x + 52}" y="238" text-anchor="middle" font-family="ui-monospace, monospace" font-size="10.5" font-weight="600" fill="#E5B5C7">${tag}</text>
      </g>`;
    })
    .join("");

  const descClean = description || "Production system and verified implementation.";
  const descLine1 = descClean.length > 70 ? descClean.substring(0, 68) + "..." : descClean;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 270" width="1200" height="270">
  <defs>
    <linearGradient id="vp-bg-${cleanName}-${index}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1F0D17"/>
      <stop offset="50%" stop-color="#14080F"/>
      <stop offset="100%" stop-color="#0E050A"/>
    </linearGradient>
    <radialGradient id="vp-glow-${cleanName}-${index}" cx="85%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#701A3D" stop-opacity="0.75"/>
      <stop offset="60%" stop-color="#451126" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#190B12" stop-opacity="0"/>
    </radialGradient>
    <pattern id="vp-grid-${cleanName}-${index}" width="28" height="28" patternUnits="userSpaceOnUse">
      <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#C77B9B" stroke-opacity="0.08" stroke-width="1"/>
    </pattern>
    <linearGradient id="vp-trace-${cleanName}-${index}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#F8F0F3"/>
      <stop offset="35%" stop-color="#E5B5C7"/>
      <stop offset="70%" stop-color="#C77B9B"/>
      <stop offset="100%" stop-color="#701A3D" stop-opacity="0"/>
    </linearGradient>
    <clipPath id="vp-clip-${cleanName}-${index}"><rect width="1200" height="270" rx="16"/></clipPath>
  </defs>

  <style>
    .vp-serif { font-family: 'Playfair Display', Georgia, 'Times New Roman', serif; }
    .vp-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
    .vp-sans { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    
    /* Continuous Moving Laser Border */
    .vp-laser {
      stroke-dasharray: 480 2460;
      stroke-dashoffset: 2940;
      animation: vp-laser-run 6.5s linear infinite;
    }
    @keyframes vp-laser-run {
      to { stroke-dashoffset: 0; }
    }

    /* Ambient Pulsing Glow */
    .vp-orb {
      animation: vp-orb-pulse 8s ease-in-out infinite alternate;
    }
    @keyframes vp-orb-pulse {
      0% { transform: scale(1) translate(0, 0); opacity: 0.7; }
      100% { transform: scale(1.1) translate(-20px, 10px); opacity: 0.95; }
    }
  </style>

  <g clip-path="url(#vp-clip-${cleanName}-${index})">
    <!-- Velvet Darkroom Base Background -->
    <rect width="1200" height="270" fill="url(#vp-bg-${cleanName}-${index})"/>
    
    <!-- Ambient Luminous Moving Glow Orb -->
    <ellipse class="vp-orb" cx="950" cy="90" rx="360" ry="220" fill="url(#vp-glow-${cleanName}-${index})"/>

    <!-- Architectural Grid on right -->
    <rect x="650" width="550" height="270" fill="url(#vp-grid-${cleanName}-${index})"/>

    <!-- Index & Sub-headline Deck -->
    <text class="vp-mono" x="50" y="48" font-size="11.5" letter-spacing="2.8" font-weight="700" fill="#C77B9B">
      <tspan fill="#E5B5C7">${numStr} · PRODUCTION REPOSITORY</tspan> · ${language.toUpperCase() || "ENGINEERING"}
    </text>

    <!-- Main Project Name (Editorial Serif) -->
    <text class="vp-serif" x="48" y="104" font-size="44" font-weight="400" letter-spacing="-1" fill="#F8F0F3">
      ${name}
    </text>

    <!-- Description -->
    <text class="vp-sans" x="50" y="142" font-size="15" fill="#DDA3B8">
      ${descLine1}
    </text>

    <!-- Subtitle Bullet -->
    <text class="vp-mono" x="50" y="172" font-size="11.5" fill="#E5B5C7">
      <tspan fill="#C77B9B">ARCHITECTURE ›</tspan> Optimized runtime, modular components &amp; verified GitHub release
    </text>

    <!-- Divider Line -->
    <line x1="50" y1="198" x2="680" y2="198" stroke="#701A3D" stroke-opacity="0.4" stroke-width="1"/>

    <!-- Tags Row -->
    ${tagChips}

    <!-- Right Telemetry Metrics Module -->
    <g transform="translate(860, 45)">
      <rect width="280" height="180" rx="14" fill="#180A12" fill-opacity="0.85" stroke="#701A3D" stroke-width="1.2"/>
      
      <!-- Stars Metric -->
      <g transform="translate(30, 48)">
        <text class="vp-serif" font-size="34" font-weight="400" fill="#F8F0F3">${stars.toLocaleString()}</text>
        <text class="vp-sans" y="24" font-size="12" font-weight="600" fill="#C77B9B">★ REPOSITORY STARS</text>
      </g>

      <!-- Forks Metric -->
      <g transform="translate(160, 48)">
        <text class="vp-serif" font-size="34" font-weight="400" fill="#F8F0F3">${forks.toLocaleString()}</text>
        <text class="vp-sans" y="24" font-size="12" font-weight="600" fill="#C77B9B">⑂ NETWORK FORKS</text>
      </g>

      <!-- Language Badge -->
      <g transform="translate(30, 118)">
        <rect width="220" height="32" rx="16" fill="#2A0E1B" stroke="#E5B5C7" stroke-opacity="0.4"/>
        <text x="110" y="20" text-anchor="middle" class="vp-mono" font-size="11" font-weight="700" fill="#F8F0F3">
          PRIMARY: ${language.toUpperCase() || "CODE"}
        </text>
      </g>
    </g>

    <!-- Static Subtle Border -->
    <rect x="0.5" y="0.5" width="1199" height="269" rx="15.5" fill="none" stroke="#701A3D" stroke-opacity="0.35"/>

    <!-- Dynamic Animated Running Laser Trace Border -->
    <rect class="vp-laser" x="0.5" y="0.5" width="1199" height="269" rx="15.5" fill="none" stroke="url(#vp-trace-${cleanName}-${index})" stroke-width="2" stroke-linecap="round"/>
  </g>
</svg>`;

  return encodeSvgDataUri(svg);
}
