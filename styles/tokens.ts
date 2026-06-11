// styles/tokens.ts — HIRE AGENT OS Design Tokens
// "AI Hiring Command Center" — Bloomberg Terminal x Sci-fi OS

export const tokens = {
  colors: {
    // Base
    bg: '#0B0F14',
    bgSurface: '#111820',
    bgCard: '#161D27',
    bgHover: '#1C2533',

    // Accents
    accent: '#00E5FF',      // electric cyan
    accentDim: '#00B8CC',
    accentGlow: 'rgba(0, 229, 255, 0.15)',

    secondary: '#7C4DFF',   // violet glow
    secondaryDim: '#5C3DCC',
    secondaryGlow: 'rgba(124, 77, 255, 0.15)',

    // Semantic
    risk: '#FF3B3B',        // red pulse
    riskGlow: 'rgba(255, 59, 59, 0.15)',
    success: '#00FF9D',     // neon green
    successGlow: 'rgba(0, 255, 157, 0.15)',
    warning: '#FFB800',     // amber
    warningGlow: 'rgba(255, 184, 0, 0.15)',

    // Text
    textPrimary: '#E8ECF1',
    textSecondary: '#8892A4',
    textMuted: '#4A5568',

    // Borders
    border: 'rgba(255, 255, 255, 0.06)',
    borderAccent: 'rgba(0, 229, 255, 0.25)',
    borderGlow: 'rgba(0, 229, 255, 0.4)',
  },

  typography: {
    fontDisplay: '"Space Grotesk", "Inter", system-ui, sans-serif',
    fontMono: '"JetBrains Mono", "Fira Code", monospace',
    fontBody: '"Inter", system-ui, sans-serif',
  },

  spacing: {
    navWidth: '260px',
    topbarHeight: '64px',
    insightWidth: '320px',
    gap: '16px',
    gapSm: '8px',
    gapLg: '24px',
  },

  animation: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    spring: { type: 'spring' as const, stiffness: 300, damping: 30 },
    glow: 'glow 2s ease-in-out infinite alternate',
    pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    scanline: 'scanline 8s linear infinite',
  },

  glass: {
    bg: 'rgba(11, 15, 20, 0.7)',
    border: '1px solid rgba(0, 229, 255, 0.12)',
    blur: 'blur(16px)',
    glow: '0 0 20px rgba(0, 229, 255, 0.08)',
  },
} as const;

export type Tokens = typeof tokens;
