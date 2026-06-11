// lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatScore(score: number): string {
  return `${Math.round(score * 100)}%`;
}

export function getScoreColor(score: number): string {
  if (score >= 0.8) return 'text-success';
  if (score >= 0.6) return 'text-accent';
  if (score >= 0.4) return 'text-warning';
  return 'text-risk';
}

export function getScoreBarColor(score: number): string {
  if (score >= 0.8) return 'bg-success';
  if (score >= 0.6) return 'bg-accent';
  if (score >= 0.4) return 'bg-warning';
  return 'bg-risk';
}

export function getRecommendationColor(rec: string): string {
  switch (rec) {
    case 'strong_hire': return 'text-success border-success/30 bg-success/10';
    case 'hire': return 'text-accent border-accent/30 bg-accent/10';
    case 'consider': return 'text-warning border-warning/30 bg-warning/10';
    case 'reject': return 'text-risk border-risk/30 bg-risk/10';
    default: return 'text-text-secondary border-border bg-bg-card';
  }
}

export function getRecommendationLabel(rec: string): string {
  switch (rec) {
    case 'strong_hire': return 'STRONG HIRE';
    case 'hire': return 'HIRE';
    case 'consider': return 'CONSIDER';
    case 'reject': return 'REJECT';
    default: return rec.toUpperCase();
  }
}
