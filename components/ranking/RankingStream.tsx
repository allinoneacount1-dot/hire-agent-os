// components/ranking/RankingStream.tsx
'use client';

import { motion } from 'framer-motion';
import { mockCandidates } from '@/mock/candidates.seed';
import { cn, formatScore, getScoreColor } from '@/lib/utils';
import { TrendingUp } from 'lucide-react';

export function RankingStream() {
  const topCandidates = [...mockCandidates]
    .sort((a, b) => b.signal_strength - a.signal_strength)
    .slice(0, 8);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-mono text-text-muted uppercase tracking-wider">Live Rankings</h3>
        <TrendingUp className="h-3.5 w-3.5 text-accent" />
      </div>
      <div className="space-y-2">
        {topCandidates.map((candidate, i) => (
          <motion.div
            key={candidate.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-3 rounded-lg bg-bg-card/30 border border-border p-2.5 hover:border-accent/20 transition-colors cursor-pointer"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded bg-bg text-[10px] font-mono font-bold text-text-muted">
              #{i + 1}
            </div>
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary/20 text-secondary text-[10px] font-bold shrink-0">
              {candidate.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-text-primary truncate">{candidate.name}</div>
              <div className="text-[10px] text-text-muted truncate">{candidate.role}</div>
            </div>
            <div className={cn('text-xs font-mono font-bold', getScoreColor(candidate.signal_strength))}>
              {formatScore(candidate.signal_strength)}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
