// app/job-magnet/page.tsx — Job Magnet (Gravity Field + Heatmap)
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Magnet, Sparkles, TrendingUp, MapPin, Users, Target } from 'lucide-react';
import { calculateAttraction } from '@/lib/scoring/attraction';
import { cn, formatScore } from '@/lib/utils';

const jobPostings = [
  {
    id: 'job_001',
    title: 'Senior Full-Stack Engineer',
    domain: 'SaaS',
    location: 'Remote (US)',
    salary: '$180K - $250K',
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS'],
  },
  {
    id: 'job_002',
    title: 'ML Engineer',
    domain: 'AI/ML',
    location: 'San Francisco / Remote',
    salary: '$200K - $300K',
    skills: ['Python', 'PyTorch', 'MLOps', 'Kubernetes'],
  },
  {
    id: 'job_003',
    title: 'Blockchain Engineer',
    domain: 'Web3',
    location: 'Remote (Global)',
    salary: '$160K - $220K',
    skills: ['Solidity', 'Rust', 'TypeScript', 'Web3.js'],
  },
];

const attractionFactors = [
  { label: 'Challenge', value: 0.85, weight: 0.3 },
  { label: 'Growth', value: 0.75, weight: 0.25 },
  { label: 'Tech Excitement', value: 0.9, weight: 0.2 },
  { label: 'Autonomy', value: 0.8, weight: 0.15 },
  { label: 'Compensation', value: 0.7, weight: 0.1 },
];

const heatmapData = [
  { region: 'San Francisco', density: 95, color: 'bg-risk' },
  { region: 'New York', density: 82, color: 'bg-warning' },
  { region: 'London', density: 78, color: 'bg-warning' },
  { region: 'Berlin', density: 65, color: 'bg-accent' },
  { region: 'Singapore', density: 72, color: 'bg-accent' },
  { region: 'Tokyo', density: 58, color: 'bg-secondary' },
  { region: 'Bangalore', density: 88, color: 'bg-warning' },
  { region: 'Toronto', density: 55, color: 'bg-secondary' },
];

export default function JobMagnetPage() {
  const [selectedJob, setSelectedJob] = useState(jobPostings[0]);
  const [attraction] = useState(() => calculateAttraction({
    challengeScore: 0.85,
    growthScore: 0.75,
    techExcitement: 0.9,
    autonomyScore: 0.8,
    compensationScore: 0.7,
  }));

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-display text-text-primary">Job Magnet</h1>
        <p className="text-sm text-text-secondary mt-1">Reverse Hiring — Attract Candidates Inbound</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Job Selection */}
        <div className="glass rounded-xl p-4">
          <h2 className="text-xs font-mono text-text-muted uppercase tracking-wider mb-3">Select Job Posting</h2>
          <div className="space-y-2">
            {jobPostings.map(job => (
              <button
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className={cn(
                  'w-full text-left rounded-lg p-3 border transition-all',
                  selectedJob.id === job.id
                    ? 'border-accent/30 bg-accent/5'
                    : 'border-border bg-bg-card/30 hover:border-accent/20'
                )}
              >
                <div className="text-sm font-medium text-text-primary">{job.title}</div>
                <div className="text-[10px] text-text-muted mt-1">{job.location} · {job.salary}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Attraction Analysis */}
        <div className="lg:col-span-2 space-y-4">
          {/* Attraction Score */}
          <div className="glass rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Magnet className="h-5 w-5 text-accent" />
                <h2 className="text-sm font-mono font-semibold text-text-primary">Attraction Score</h2>
              </div>
              <div className="text-2xl font-bold font-mono text-accent">
                {formatScore(attraction.attractionScore)}
              </div>
            </div>

            {/* Factor Breakdown */}
            <div className="space-y-3">
              {attractionFactors.map(factor => (
                <div key={factor.label} className="flex items-center gap-3">
                  <span className="text-xs text-text-muted w-28 shrink-0">{factor.label}</span>
                  <div className="flex-1 h-2 rounded-full bg-bg overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${factor.value * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className={cn('h-full rounded-full',
                        factor.value >= 0.8 ? 'bg-success' :
                        factor.value >= 0.6 ? 'bg-accent' : 'bg-warning'
                      )}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-text-muted w-12 text-right">
                    ×{factor.weight}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Why It Attracts */}
          <div className="glass rounded-xl p-5">
            <h3 className="text-xs font-mono text-text-muted uppercase tracking-wider mb-3">Why This Attracts</h3>
            <div className="space-y-2">
              {attraction.whyItAttracts.map((reason, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                  <Sparkles className="h-3.5 w-3.5 text-accent shrink-0" />
                  {reason}
                </div>
              ))}
            </div>
          </div>

          {/* Talent Heatmap */}
          <div className="glass rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-4 w-4 text-accent" />
              <h3 className="text-xs font-mono text-text-muted uppercase tracking-wider">Talent Density Heatmap</h3>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {heatmapData.map(region => (
                <div key={region.region} className="text-center">
                  <div
                    className={cn(
                      'h-16 rounded-lg flex items-center justify-center border border-border',
                      region.color,
                      'bg-opacity-20'
                    )}
                  >
                    <span className="text-lg font-bold font-mono text-text-primary">
                      {region.density}
                    </span>
                  </div>
                  <div className="text-[10px] text-text-muted mt-1">{region.region}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Distribution Strategy */}
          <div className="glass rounded-xl p-5">
            <h3 className="text-xs font-mono text-text-muted uppercase tracking-wider mb-3">Distribution Strategy</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { platform: 'LinkedIn', reach: '2.4M', cost: '$0.45/click' },
                { platform: 'GitHub', reach: '890K', cost: 'Organic' },
                { platform: 'Twitter', reach: '1.2M', cost: '$0.32/click' },
              ].map(p => (
                <div key={p.platform} className="rounded-lg bg-bg-card/50 border border-border p-3 text-center">
                  <div className="text-sm font-medium text-text-primary">{p.platform}</div>
                  <div className="text-xs text-text-muted mt-1">{p.reach} reach</div>
                  <div className="text-[10px] font-mono text-accent">{p.cost}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
