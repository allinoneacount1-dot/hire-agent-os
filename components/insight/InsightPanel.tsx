// components/insight/InsightPanel.tsx
'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight, TrendingUp, AlertTriangle, CheckCircle, Brain } from 'lucide-react';

interface InsightItem {
  id: string;
  type: 'score' | 'risk' | 'trend' | 'recommendation';
  title: string;
  value: string;
  detail: string;
  color: string;
}

const mockInsights: InsightItem[] = [
  {
    id: '1',
    type: 'score',
    title: 'Top Candidate Score',
    value: '92%',
    detail: 'Sarah Chen — Senior Full-Stack',
    color: 'text-success',
  },
  {
    id: '2',
    type: 'trend',
    title: 'Skill Velocity',
    value: '+23%',
    detail: 'Rust, AI/ML skills rising',
    color: 'text-accent',
  },
  {
    id: '3',
    type: 'risk',
    title: 'Pipeline Risk',
    value: 'Low',
    detail: '3 candidates in final stage',
    color: 'text-success',
  },
  {
    id: '4',
    type: 'recommendation',
    title: 'AI Suggestion',
    value: 'Act Now',
    detail: 'Reach out to James Wright — 95% match',
    color: 'text-secondary',
  },
];

export function InsightPanel() {
  const [collapsed, setCollapsed] = useState(false);

  if (collapsed) {
    return (
      <div
        className="flex w-12 flex-col items-center border-l border-border bg-bg-surface/40 py-4 cursor-pointer"
        onClick={() => setCollapsed(false)}
      >
        <ChevronRight className="h-4 w-4 text-text-muted rotate-180" />
      </div>
    );
  }

  return (
    <aside
      className="flex flex-col border-l border-border bg-bg-surface/40 backdrop-blur-glass overflow-y-auto"
      style={{ width: 'var(--insight-width)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-accent" />
          <span className="text-xs font-mono font-semibold tracking-wider text-text-secondary uppercase">
            AI Insights
          </span>
        </div>
        <button
          onClick={() => setCollapsed(true)}
          className="flex h-6 w-6 items-center justify-center rounded text-text-muted hover:text-text-secondary transition-colors"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Insight Cards */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {mockInsights.map((insight) => (
          <div
            key={insight.id}
            className="glass glass-hover rounded-lg p-3 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">
                {insight.title}
              </span>
              {insight.type === 'score' && <CheckCircle className="h-3 w-3 text-success" />}
              {insight.type === 'trend' && <TrendingUp className="h-3 w-3 text-accent" />}
              {insight.type === 'risk' && <AlertTriangle className="h-3 w-3 text-warning" />}
              {insight.type === 'recommendation' && <Brain className="h-3 w-3 text-secondary" />}
            </div>
            <div className={cn('text-lg font-bold font-mono', insight.color)}>
              {insight.value}
            </div>
            <div className="text-[11px] text-text-muted mt-1">
              {insight.detail}
            </div>
          </div>
        ))}

        {/* Live Event Feed */}
        <div className="mt-4">
          <div className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-2">
            Live Events
          </div>
          <div className="space-y-2">
            {[
              { time: '2m ago', event: 'Candidate scored: 87%', color: 'bg-success' },
              { time: '5m ago', event: 'Outreach sent to 3 candidates', color: 'bg-accent' },
              { time: '12m ago', event: 'New candidate discovered', color: 'bg-secondary' },
              { time: '18m ago', event: 'Interview completed: 91%', color: 'bg-success' },
            ].map((evt, i) => (
              <div key={i} className="flex items-start gap-2 text-[11px]">
                <div className={cn('mt-1.5 h-1.5 w-1.5 rounded-full shrink-0', evt.color)} />
                <div>
                  <span className="text-text-muted">{evt.time}</span>
                  <span className="text-text-secondary ml-1">{evt.event}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
