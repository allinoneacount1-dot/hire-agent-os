// app/page.tsx — Dashboard v2 (Improved)
'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Target, MessageSquare, TrendingUp, Activity, Zap,
  ArrowUpRight, ArrowDownRight, Radio, BrainCircuit, Swords,
  Magnet, BarChart3, Clock, CheckCircle2, AlertTriangle,
} from 'lucide-react';
import { mockCandidates } from '@/mock/candidates.seed';
import { TalentGraph } from '@/components/graph/TalentGraph';
import { RankingStream } from '@/components/ranking/RankingStream';
import { useEventBus } from '@/lib/events/EventBusProvider';
import { generateEventId } from '@/lib/events/bus';
import type { EventType } from '@/lib/events/types';

const kpiData = [
  { label: 'Candidates Tracked', value: '12', change: '+3', changeType: 'up' as const, icon: Users, color: 'text-accent', bgColor: 'bg-accent/10', borderColor: 'border-accent/25' },
  { label: 'Active Pipelines', value: '3', change: '+1', changeType: 'up' as const, icon: Target, color: 'text-secondary', bgColor: 'bg-secondary/10', borderColor: 'border-secondary/25' },
  { label: 'Outreach Sent', value: '24', change: '+8', changeType: 'up' as const, icon: MessageSquare, color: 'text-success', bgColor: 'bg-success/10', borderColor: 'border-success/25' },
  { label: 'Avg Fit Score', value: '82%', change: '-3%', changeType: 'down' as const, icon: TrendingUp, color: 'text-warning', bgColor: 'bg-warning/10', borderColor: 'border-warning/25' },
];

const agentStages = [
  { label: 'Scout', count: 12, icon: Radio, color: '#00E5FF', description: 'Discovering candidates' },
  { label: 'Cognition', count: 10, icon: BrainCircuit, color: '#7C4DFF', description: 'Inferring skills' },
  { label: 'Fitment', count: 8, icon: BarChart3, color: '#00FF9D', description: 'Scoring candidates' },
  { label: 'Outreach', count: 5, icon: MessageSquare, color: '#FFB800', description: 'Sending messages' },
  { label: 'Interview', count: 3, icon: Swords, color: '#FF3B3B', description: 'Testing capability' },
  { label: 'Hired', count: 1, icon: CheckCircle2, color: '#00FF9D', description: 'Successfully placed' },
];

interface LiveEvent {
  id: string;
  time: string;
  action: string;
  type: 'score' | 'outreach' | 'discover' | 'interview' | 'feedback' | 'magnet';
}

const initialEvents: LiveEvent[] = [
  { id: 'e1', time: '2m ago', action: 'Sarah Chen scored 92% — Strong Hire', type: 'score' },
  { id: 'e2', time: '5m ago', action: 'Outreach sent to Marcus Johnson', type: 'outreach' },
  { id: 'e3', time: '12m ago', action: 'New candidate: Aiko Tanaka (ML Engineer)', type: 'discover' },
  { id: 'e4', time: '18m ago', action: 'Interview completed — James Wright: 95%', type: 'interview' },
  { id: 'e5', time: '25m ago', action: 'Feedback processed — weight updated', type: 'feedback' },
  { id: 'e6', time: '32m ago', action: 'Talent Magnet updated for Rust role', type: 'magnet' },
];

const eventColors: Record<string, string> = {
  score: 'bg-success', outreach: 'bg-accent', discover: 'bg-secondary',
  interview: 'bg-warning', feedback: 'bg-text-muted', magnet: 'bg-secondary',
};

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [events, setEvents] = useState<LiveEvent[]>(initialEvents);
  const [activeTab, setActiveTab] = useState<'candidates' | 'graph'>('candidates');

  useEffect(() => { setMounted(true); }, []);

  // Simulate live events
  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      const newEvents: LiveEvent[] = [
        { id: generateEventId(), time: 'Just now', action: `New candidate discovered: ${['Alex Kim', 'Maria Garcia', 'Chen Wei', 'Fatima Al-Hassan'][Math.floor(Math.random() * 4)]}`, type: 'discover' },
        { id: generateEventId(), time: 'Just now', action: `Fitment score updated: ${Math.floor(70 + Math.random() * 25)}% match`, type: 'score' },
        { id: generateEventId(), time: 'Just now', action: `Outreach response received — positive`, type: 'outreach' },
        { id: generateEventId(), time: 'Just now', action: `Interview round ${Math.floor(1 + Math.random() * 4)} completed`, type: 'interview' },
      ];
      const newEvent = newEvents[Math.floor(Math.random() * newEvents.length)];
      setEvents(prev => [newEvent, ...prev].slice(0, 10));
    }, 8000);
    return () => clearInterval(interval);
  }, [mounted]);

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
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-display text-text-primary flex items-center gap-3">
              Command Center
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 border border-success/25 text-[10px] font-mono text-success">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                LIVE
              </span>
            </h1>
            <p className="text-sm text-text-secondary mt-1">Real-time talent intelligence overview</p>
          </div>
          <div className="text-right">
            <div className="text-xs font-mono text-text-muted">System Status</div>
            <div className="text-sm font-mono text-success">All Agents Online</div>
          </div>
        </div>
      </motion.div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
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
              <div className="flex items-center justify-between mb-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${kpi.bgColor}`}>
                  <Icon className={`h-4 w-4 ${kpi.color}`} />
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-mono ${kpi.changeType === 'up' ? 'text-success' : 'text-risk'}`}>
                  {kpi.changeType === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {kpi.change}
                </div>
              </div>
              <div className="text-xl font-bold font-mono text-text-primary">{kpi.value}</div>
              <div className="text-[10px] text-text-muted mt-0.5">{kpi.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Agent Pipeline — Interactive */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass rounded-xl p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-mono font-semibold tracking-wider text-text-secondary uppercase">
            Agent Pipeline
          </h2>
          <div className="flex items-center gap-1 text-[10px] font-mono text-text-muted">
            <Zap className="h-3 w-3 text-accent" />
            7 Agents Active
          </div>
        </div>
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
          {agentStages.map((stage, i) => {
            const Icon = stage.icon;
            return (
              <motion.div
                key={stage.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className="relative group"
              >
                <div
                  className="flex flex-col items-center gap-2 rounded-xl p-3 border border-border bg-bg-card/30 hover:border-accent/20 transition-all cursor-pointer"
                >
                  <div
                    className="h-10 w-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${stage.color}15`, border: `1px solid ${stage.color}30` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: stage.color }} />
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold font-mono text-text-primary">{stage.count}</div>
                    <div className="text-[10px] font-mono text-text-muted">{stage.label}</div>
                  </div>
                </div>
                {i < 5 && (
                  <div className="hidden lg:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                    <div className="h-px w-4 bg-border" />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent border-l-[4px] border-l-border" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Main Content — 3 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Live Event Feed */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="lg:col-span-3"
        >
          <div className="glass rounded-xl p-4 h-full">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-mono font-semibold tracking-wider text-text-secondary uppercase">
                Live Events
              </h2>
              <div className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                <span className="text-[10px] font-mono text-success">LIVE</span>
              </div>
            </div>
            <div className="space-y-1.5 max-h-[400px] overflow-y-auto">
              <AnimatePresence mode="popLayout">
                {events.map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -10, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: 'auto' }}
                    exit={{ opacity: 0, x: 10, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-start gap-2 rounded-lg p-2 hover:bg-bg-card/30 transition-colors"
                  >
                    <div className={`mt-1 h-1.5 w-1.5 rounded-full shrink-0 ${eventColors[event.type]}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] text-text-primary leading-tight">{event.action}</div>
                      <div className="text-[9px] font-mono text-text-muted mt-0.5 flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" />
                        {event.time}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Center: Talent Graph or Candidates */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-6"
        >
          <div className="glass rounded-xl p-4">
            {/* Tab Switcher */}
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => setActiveTab('candidates')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  activeTab === 'candidates'
                    ? 'bg-accent/10 border border-accent/25 text-accent'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                Top Candidates
              </button>
              <button
                onClick={() => setActiveTab('graph')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  activeTab === 'graph'
                    ? 'bg-accent/10 border border-accent/25 text-accent'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                Talent Graph
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'candidates' ? (
                <motion.div
                  key="candidates"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-2"
                >
                  {[...mockCandidates].sort((a, b) => b.signal_strength - a.signal_strength).slice(0, 8).map((candidate, i) => (
                    <motion.div
                      key={candidate.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="flex items-center gap-3 rounded-lg bg-bg-card/30 p-3 border border-border hover:border-accent/20 transition-all cursor-pointer group"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary/20 text-secondary text-xs font-bold shrink-0">
                        {candidate.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-text-primary truncate group-hover:text-accent transition-colors">
                          {candidate.name}
                        </div>
                        <div className="text-[10px] text-text-muted truncate">
                          {candidate.role} · {candidate.location} · {candidate.experience_years}yr exp
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <div className="text-sm font-mono font-bold text-success">
                            {Math.round(candidate.signal_strength * 100)}%
                          </div>
                          <div className="text-[9px] font-mono text-text-muted">MATCH</div>
                        </div>
                        <div className="flex flex-wrap gap-0.5 max-w-[120px]">
                          {candidate.skills.slice(0, 3).map(s => (
                            <span key={s} className="px-1.5 py-0.5 rounded bg-bg text-[8px] font-mono text-text-muted">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="graph"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <TalentGraph />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Right: Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="lg:col-span-3 space-y-4"
        >
          {/* Skill Velocity */}
          <div className="glass rounded-xl p-4">
            <h3 className="text-xs font-mono text-text-muted uppercase tracking-wider mb-3">Skill Velocity</h3>
            <div className="space-y-2">
              {[
                { skill: 'Rust', change: '+340%', color: 'bg-success' },
                { skill: 'AI/ML', change: '+180%', color: 'bg-accent' },
                { skill: 'TypeScript', change: '+95%', color: 'bg-secondary' },
                { skill: 'Solidity', change: '+67%', color: 'bg-warning' },
                { skill: 'PHP', change: '-23%', color: 'bg-risk' },
              ].map(item => (
                <div key={item.skill} className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary">{item.skill}</span>
                  <span className={`text-[10px] font-mono font-bold ${item.change.startsWith('+') ? 'text-success' : 'text-risk'}`}>
                    {item.change}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Market Signals */}
          <div className="glass rounded-xl p-4">
            <h3 className="text-xs font-mono text-text-muted uppercase tracking-wider mb-3">Market Signals</h3>
            <div className="space-y-2">
              {[
                { label: 'Talent Demand', value: 'High', icon: TrendingUp, color: 'text-success' },
                { label: 'Competition', value: 'Medium', icon: AlertTriangle, color: 'text-warning' },
                { label: 'Salary Pressure', value: 'Rising', icon: ArrowUpRight, color: 'text-accent' },
                { label: 'Time to Fill', value: '18 days', icon: Clock, color: 'text-text-secondary' },
              ].map(signal => {
                const Icon = signal.icon;
                return (
                  <div key={signal.label} className="flex items-center gap-2">
                    <Icon className={`h-3 w-3 ${signal.color}`} />
                    <span className="text-[11px] text-text-muted flex-1">{signal.label}</span>
                    <span className={`text-[11px] font-mono font-medium ${signal.color}`}>{signal.value}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass rounded-xl p-4">
            <h3 className="text-xs font-mono text-text-muted uppercase tracking-wider mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { label: 'Run Scout Scan', icon: Radio },
                { label: 'Send Batch Outreach', icon: MessageSquare },
                { label: 'Schedule Interviews', icon: Swords },
                { label: 'Update Magnet', icon: Magnet },
              ].map(action => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    className="w-full flex items-center gap-2 rounded-lg p-2.5 border border-border bg-bg-card/30 hover:border-accent/20 hover:bg-accent/5 transition-all text-left"
                  >
                    <Icon className="h-3.5 w-3.5 text-accent" />
                    <span className="text-xs text-text-secondary">{action.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
