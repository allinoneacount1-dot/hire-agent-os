// tailwind.config.ts — HIRE AGENT OS Neon Theme
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './styles/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Base
        bg: {
          DEFAULT: '#0B0F14',
          surface: '#111820',
          card: '#161D27',
          hover: '#1C2533',
        },
        // Accents
        accent: {
          DEFAULT: '#00E5FF',
          dim: '#00B8CC',
          glow: 'rgba(0, 229, 255, 0.15)',
        },
        secondary: {
          DEFAULT: '#7C4DFF',
          dim: '#5C3DCC',
          glow: 'rgba(124, 77, 255, 0.15)',
        },
        // Semantic
        risk: {
          DEFAULT: '#FF3B3B',
          glow: 'rgba(255, 59, 59, 0.15)',
        },
        success: {
          DEFAULT: '#00FF9D',
          glow: 'rgba(0, 255, 157, 0.15)',
        },
        warning: {
          DEFAULT: '#FFB800',
          glow: 'rgba(255, 184, 0, 0.15)',
        },
        // Text
        text: {
          primary: '#E8ECF1',
          secondary: '#8892A4',
          muted: '#4A5568',
        },
        // Borders
        border: {
          DEFAULT: 'rgba(255, 255, 255, 0.06)',
          accent: 'rgba(0, 229, 255, 0.25)',
          glow: 'rgba(0, 229, 255, 0.4)',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', '"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 229, 255, 0.15)',
        'glow-violet': '0 0 20px rgba(124, 77, 255, 0.15)',
        'glow-red': '0 0 20px rgba(255, 59, 59, 0.15)',
        'glow-green': '0 0 20px rgba(0, 255, 157, 0.15)',
        'glass': '0 4px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
        'neon-cyan': '0 0 8px rgba(0, 229, 255, 0.4), 0 0 24px rgba(0, 229, 255, 0.1)',
        'neon-violet': '0 0 8px rgba(124, 77, 255, 0.4), 0 0 24px rgba(124, 77, 255, 0.1)',
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(0, 229, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 229, 255, 0.03) 1px, transparent 1px)',
        'scanline': 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
        'gradient-radial': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
        'ripple': 'ripple 600ms ease-out',
        'fade-in': 'fadeIn 300ms ease-out',
        'slide-up': 'slideUp 300ms ease-out',
        'score-fill': 'scoreFill 1s ease-out',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 8px rgba(0, 229, 255, 0.2)' },
          '100%': { boxShadow: '0 0 24px rgba(0, 229, 255, 0.4), 0 0 48px rgba(0, 229, 255, 0.1)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '0.5' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scoreFill: {
          '0%': { width: '0%' },
          '100%': { width: 'var(--score-width)' },
        },
      },
      backdropBlur: {
        glass: '16px',
      },
    },
  },
  plugins: [],
};

export default config;
