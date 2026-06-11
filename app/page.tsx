// app/page.tsx — Dashboard (Overview + Live KPIs)
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Target,
  MessageSquare,
  TrendingUp,
  Activity,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { mockCandidates } from '@/mock/candidates.seed';

const kpiData = [
  {
    label: 'Candidates Tracked',
    value: '12',
    change: '+3',
    changeType: 'up' as const,
    icon: Users,
    color: 'text-accent',
    bgColor: 'bg-accent/10',
    borderColor: 'border-accent/25',
  },
  {
    label: 'Active Pipelines',
    value: '3',
    change: '+1',
    changeType: 'up' as const,
    icon: Target,
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
    borderColor: 'border-secondary/25',
  },
  {
    label: 'Outreach Sent',
    value: '24',
    change: '+8',
    changeType: 'up' as const,
    icon: MessageSquare,
    color: 'text-success',
    bgColor: 'bg-success/10',
    borderColor: 'border-success/25',
  },
  {
    label: 'Avg Fit Score',
    value: '82%',
    change: '-3%',
    changeType: 'down' as const,
    icon: TrendingUp,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    borderColor: 'border-warning/25',
  },
];

const recentActivity = [
  { time: '2 min ago', action: 'Sarah Chen scored 92% — Strong Hire', type: 'score' },
  { time: '5 min ago', action: 'Outreach sent to Marcus Johnson', type: 'outreach' },
  { time: '12 min ago', action: 'New candidate: Aiko Tanaka (ML Engineer)', type: 'discover' },
  { time: '18 min ago', action: 'Interview completed — James Wright: 95%', type: 'interview' },
  { time: '25 min ago', action: 'Feedback processed — weight updated', type: 'feedback' },
  { time: '32 min ago', action: 'Talent Magnet updated for Rust role', type: 'magnet' },
];

const topCandidates = [...mockCandidates]
  .sort((a, b) => b.signal_strength - a.signal_strength)
  .slice(0, 5);

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex items-center gap-3 text-text-muted">
          <Activity className="h-5 w-5 animate-pulse text-accent" />
          <span className="text-sm font-mono">Initializing Command Center...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold font-display text-text-primary">
          Command Center
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Real-time talent intelligence overview
        </p>
      </motion.div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className={`glass glass-hover rounded-xl p-4 border ${kpi.borderColor}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${kpi.bgColor}`}>
                  <Icon className={`h-4.5 w-4.5 ${kpi.color}`} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-mono ${
                  kpi.changeType === 'up' ? 'text-success' : 'text-risk'
                }`}>
                  {kpi.changeType === 'up' ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {kpi.change}
                </div>
              </div>
              <div className="text-2xl font-bold font-mono text-text-primary">
                {kpi.value}
              </div>
              <div className="text-xs text-text-muted mt-1">{kpi.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Candidates */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="glass rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-mono font-semibold tracking-wider text-text-secondary uppercase">
              Top Candidates
            </h2>
            <Zap className="h-4 w-4 text-accent" />
          </div>
          <div className="space-y-3">
            {topCandidates.map((candidate, i) => (
              <div
                key={candidate.id}
                className="flex items-center gap-3 rounded-lg bg-bg-card/50 p-3 border border-border hover:border-accent/20 transition-colors cursor-pointer"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/20 text-secondary text-xs font-bold">
                  {candidate.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-text-primary truncate">
                    {candidate.name}
                  </div>
                  <div className="text-xs text-text-muted truncate">
                    {candidate.role} · {candidate.location}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-mono font-bold text-success">
                    {Math.round(candidate.signal_strength * 100)}%
                  </div>
                  <div className="text-[10px] font-mono text-text-muted">MATCH</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="glass rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-mono font-semibold tracking-wider text-text-secondary uppercase">
              Recent Activity
            </h2>
            <Activity className="h-4 w-4 text-accent" />
          </div>
          <div className="space-y-2">
            {recentActivity.map((activity, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-lg p-2 hover:bg-bg-card/30 transition-colors"
              >
                <div className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${
                  activity.type === 'score' ? 'bg-success' :
                  activity.type === 'outreach' ? 'bg-accent' :
                  activity.type === 'discover' ? 'bg-secondary' :
                  activity.type === 'interview' ? 'bg-warning' :
                  activity.type === 'feedback' ? 'bg-text-muted' :
                  'bg-accent'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-text-primary">{activity.action}</div>
                  <div className="text-[10px] font-mono text-text-muted">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Agent Pipeline Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="glass rounded-xl p-5"
      >
        <h2 className="text-sm font-mono font-semibold tracking-wider text-text-secondary uppercase mb-4">
          Agent Pipeline Flow
        </h2>
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
          {[
            { label: 'Scout', count: 12, color: 'bg-accent' },
            { label: 'Cognition', count: 10, color: 'bg-secondary' },
            { label: 'Fitment', count: 8, color: 'bg-success' },
            { label: 'Outreach', count: 5, color: 'bg-warning' },
            { label: 'Interview', count: 3, color: 'bg-risk' },
            { label: 'Hired', count: 1, color: 'bg-success' },
          ].map((stage, i) => (
            <div key={stage.label} className="flex items-center gap-2">
              <div className="flex flex-col items-center gap-1 min-w-[60px]">
                <div className={`h-10 w-10 rounded-lg ${stage.color}/20 border ${stage.color}/30 flex items-center justify-center`}>
                  <span className="text-sm font-mono font-bold text-text-primary">{stage.count}</span>
                </div>
                <span className="text-[10px] font-mono text-text-muted">{stage.label}</span>
              </div>
              {i < 5 && (
                <div className="h-px w-8 bg-border mb-4" />
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
