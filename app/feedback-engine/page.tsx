// app/feedback-engine/page.tsx — Feedback Engine (Learning Loop Dashboard)
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, TrendingUp, AlertTriangle, Target, RefreshCw } from 'lucide-react';
import { processFeedback } from '@/lib/scoring/feedback';
import { cn } from '@/lib/utils';

const mockFeedbackData = {
  candidateId: 'cand_001',
  decision: 'hired' as const,
  predictionScores: {
    skillFit: 0.85,
    projectDepth: 0.72,
    domainMatch: 0.9,
    behaviorStability: 0.8,
    finalScore: 0.82,
  },
  realWorldOutcome: {
    performanceScore: 0.91,
    retention: 8,
    satisfactionScore: 0.88,
  },
};

const weightHistory = [
  { feature: 'Skill Fit', initial: 0.45, current: 0.47, trend: 'up' },
  { feature: 'Project Depth', initial: 0.25, current: 0.28, trend: 'up' },
  { feature: 'Domain Match', initial: 0.15, current: 0.13, trend: 'down' },
  { feature: 'Behavior Stability', initial: 0.15, current: 0.12, trend: 'down' },
];

const predictionVsReality = [
  { month: 'Jan', predicted: 0.75, actual: 0.72 },
  { month: 'Feb', predicted: 0.82, actual: 0.78 },
  { month: 'Mar', predicted: 0.78, actual: 0.85 },
  { month: 'Apr', predicted: 0.85, actual: 0.91 },
  { month: 'May', predicted: 0.80, actual: 0.82 },
  { month: 'Jun', predicted: 0.83, actual: 0.88 },
];

export default function FeedbackEnginePage() {
  const [feedback] = useState(() => processFeedback(mockFeedbackData));

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-display text-text-primary">Feedback Engine</h1>
        <p className="text-sm text-text-secondary mt-1">Learning Loop — Continuous Model Improvement</p>
      </motion.div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'Model Accuracy', value: '87%', icon: Target, color: 'text-success' },
          { label: 'Predictions Made', value: '156', icon: BrainCircuit, color: 'text-accent' },
          { label: 'Bias Detected', value: '2', icon: AlertTriangle, color: 'text-warning' },
          { label: 'Learning Rate', value: '0.05', icon: RefreshCw, color: 'text-secondary' },
        ].map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass glass-hover rounded-xl p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className={cn('h-4 w-4', kpi.color)} />
                <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">{kpi.label}</span>
              </div>
              <div className={cn('text-xl font-bold font-mono', kpi.color)}>{kpi.value}</div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weight Adjustments */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-xl p-5"
        >
          <h2 className="text-xs font-mono text-text-muted uppercase tracking-wider mb-4">Weight Adjustments</h2>
          <div className="space-y-4">
            {weightHistory.map(item => (
              <div key={item.feature}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-text-secondary">{item.feature}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-text-muted">{item.initial}</span>
                    <span className="text-text-muted">→</span>
                    <span className={cn('text-xs font-mono font-bold',
                      item.trend === 'up' ? 'text-success' : 'text-risk'
                    )}>
                      {item.current}
                    </span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-bg overflow-hidden">
                  <div
                    className={cn('h-full rounded-full',
                      item.trend === 'up' ? 'bg-success' : 'bg-warning'
                    )}
                    style={{ width: `${item.current * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Prediction vs Reality */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-xl p-5"
        >
          <h2 className="text-xs font-mono text-text-muted uppercase tracking-wider mb-4">Prediction vs Reality</h2>
          <div className="space-y-3">
            {predictionVsReality.map(item => (
              <div key={item.month} className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-text-muted w-8">{item.month}</span>
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 h-3 rounded-full bg-bg overflow-hidden relative">
                    <div
                      className="absolute h-full rounded-full bg-accent/40"
                      style={{ width: `${item.predicted * 100}%` }}
                    />
                    <div
                      className="absolute h-full rounded-full bg-success"
                      style={{ width: `${item.actual * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono text-accent">{Math.round(item.predicted * 100)}%</div>
                  <div className="text-[10px] font-mono text-success">{Math.round(item.actual * 100)}%</div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4 text-[10px] font-mono text-text-muted">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-accent/60" />
              Predicted
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-success" />
              Actual
            </div>
          </div>
        </motion.div>

        {/* Bias Detection */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <h2 className="text-xs font-mono text-text-muted uppercase tracking-wider">Bias Detected</h2>
          </div>
          <div className="space-y-2">
            {feedback.biasDetected.length > 0 ? feedback.biasDetected.map((bias, i) => (
              <div key={i} className="flex items-start gap-2 rounded-lg bg-warning/5 border border-warning/20 p-3">
                <AlertTriangle className="h-3.5 w-3.5 text-warning shrink-0 mt-0.5" />
                <span className="text-xs text-text-secondary">{bias}</span>
              </div>
            )) : (
              <div className="text-xs text-text-muted text-center py-4">No significant bias detected</div>
            )}
          </div>
        </motion.div>

        {/* Insights & Next Focus */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-accent" />
            <h2 className="text-xs font-mono text-text-muted uppercase tracking-wider">Insights & Next Focus</h2>
          </div>
          <div className="space-y-3">
            {feedback.insights.map((insight, i) => (
              <div key={i} className="text-xs text-text-secondary flex items-start gap-2">
                <span className="text-accent">→</span>
                {insight}
              </div>
            ))}
            <div className="border-t border-border pt-3 mt-3">
              <div className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-2">Next Focus</div>
              {feedback.nextFocus.map((focus, i) => (
                <div key={i} className="text-xs text-secondary flex items-start gap-2 mb-1">
                  <span className="text-secondary">★</span>
                  {focus}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
