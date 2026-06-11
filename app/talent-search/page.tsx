// app/talent-search/page.tsx — Talent Search (Scout + Cognition + Fitment)
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, SlidersHorizontal, ChevronDown, MapPin, Briefcase, GraduationCap, ExternalLink } from 'lucide-react';
import { mockCandidates, searchCandidates, type CandidateSeed } from '@/mock/candidates.seed';
import { calculateFitment, type FitmentResult } from '@/lib/scoring/fitment';
import { cn, formatScore, getScoreColor, getScoreBarColor, getRecommendationColor, getRecommendationLabel } from '@/lib/utils';

const requiredSkills = ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS'];

export default function TalentSearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CandidateSeed[]>(mockCandidates);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateSeed | null>(null);
  const [fitment, setFitment] = useState<FitmentResult | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (query.length > 0) {
      setResults(searchCandidates(query));
    } else {
      setResults(mockCandidates);
    }
  }, [query]);

  useEffect(() => {
    if (selectedCandidate) {
      const result = calculateFitment({
        candidateSkills: selectedCandidate.skills,
        requiredSkills,
        projectCount: selectedCandidate.project_count,
        maxProjectComplexity: selectedCandidate.max_project_complexity,
        domainExperience: selectedCandidate.experience_years,
        targetDomain: 'SaaS',
        jobHops: selectedCandidate.job_hops_5yr,
        avgTenure: selectedCandidate.avg_tenure_years,
      });
      setFitment(result);
    }
  }, [selectedCandidate]);

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-display text-text-primary">Talent Search</h1>
        <p className="text-sm text-text-secondary mt-1">Scout · Cognition · Fitment Engine</p>
      </motion.div>

      {/* Search Bar */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="flex gap-3">
          <div className="flex-1 flex items-center gap-2 rounded-xl border border-border bg-bg-card/50 px-4 py-3 focus-within:border-accent/40 focus-within:shadow-glow-cyan transition-all">
            <Search className="h-4 w-4 text-text-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, skill, role, location..."
              className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'flex items-center gap-2 rounded-xl border px-4 py-3 text-sm transition-all',
              showFilters ? 'border-accent/40 bg-accent/10 text-accent' : 'border-border bg-bg-card/50 text-text-secondary hover:border-accent/25'
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="glass rounded-xl p-4 mt-3 border border-border">
                <div className="text-xs font-mono text-text-muted uppercase tracking-wider mb-3">Required Skills</div>
                <div className="flex flex-wrap gap-2">
                  {requiredSkills.map(skill => (
                    <span key={skill} className="px-3 py-1 rounded-full bg-accent/10 border border-accent/25 text-xs font-mono text-accent">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Candidate List */}
        <div className="lg:col-span-2 space-y-3">
          <div className="text-xs font-mono text-text-muted uppercase tracking-wider">
            {results.length} candidates found
          </div>
          <div className="space-y-2 stagger-children">
            {results.map((candidate) => (
              <motion.div
                key={candidate.id}
                layoutId={candidate.id}
                onClick={() => setSelectedCandidate(candidate)}
                className={cn(
                  'glass glass-hover rounded-xl p-4 cursor-pointer transition-all border',
                  selectedCandidate?.id === candidate.id ? 'border-accent/40 shadow-glow-cyan' : 'border-transparent'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/20 text-secondary text-sm font-bold shrink-0">
                    {candidate.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-text-primary">{candidate.name}</h3>
                      <span className="text-xs font-mono text-success font-bold">
                        {Math.round(candidate.signal_strength * 100)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-text-muted">
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-3 w-3" />
                        {candidate.role}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {candidate.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <GraduationCap className="h-3 w-3" />
                        {candidate.experience_years}yr
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {candidate.skills.slice(0, 5).map(skill => (
                        <span key={skill} className="px-2 py-0.5 rounded bg-bg-card text-[10px] font-mono text-text-secondary">
                          {skill}
                        </span>
                      ))}
                      {candidate.skills.length > 5 && (
                        <span className="px-2 py-0.5 rounded bg-bg-card text-[10px] font-mono text-text-muted">
                          +{candidate.skills.length - 5}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Candidate Detail + Fitment */}
        <div className="space-y-4">
          {selectedCandidate && fitment ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass rounded-xl p-5 space-y-4"
            >
              {/* Candidate Header */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/20 text-secondary text-lg font-bold">
                    {selectedCandidate.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-text-primary">{selectedCandidate.name}</h3>
                    <p className="text-xs text-text-muted">{selectedCandidate.role}</p>
                  </div>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">{selectedCandidate.bio}</p>
              </div>

              {/* Fitment Score */}
              <div className="rounded-lg bg-bg-card/50 p-4 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-text-muted uppercase tracking-wider">Fitment Score</span>
                  <span className={cn('text-lg font-bold font-mono', getScoreColor(fitment.finalScore))}>
                    {formatScore(fitment.finalScore)}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-bg overflow-hidden">
                  <div
                    className={cn('h-full rounded-full score-bar', getScoreBarColor(fitment.finalScore))}
                    style={{ width: `${fitment.finalScore * 100}%` }}
                  />
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="space-y-2">
                {[
                  { label: 'Skill Fit', value: fitment.skillFit, weight: '×0.45' },
                  { label: 'Project Depth', value: fitment.projectDepth, weight: '×0.25' },
                  { label: 'Domain Match', value: fitment.domainMatch, weight: '×0.15' },
                  { label: 'Behavior Stability', value: fitment.behaviorStability, weight: '×0.15' },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="text-[11px] text-text-muted w-28 shrink-0">{item.label}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-bg overflow-hidden">
                      <div
                        className={cn('h-full rounded-full', getScoreBarColor(item.value))}
                        style={{ width: `${item.value * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-text-muted w-8 text-right">{item.weight}</span>
                  </div>
                ))}
              </div>

              {/* Recommendation Badge */}
              <div className={cn('rounded-lg p-3 border text-center', getRecommendationColor(fitment.recommendation))}>
                <span className="text-xs font-mono font-bold tracking-wider">
                  {getRecommendationLabel(fitment.recommendation)}
                </span>
              </div>

              {/* Strengths & Risks */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[10px] font-mono text-success uppercase tracking-wider mb-1">Strengths</div>
                  {fitment.strengths.map((s, i) => (
                    <div key={i} className="text-[11px] text-text-secondary mb-0.5">✓ {s}</div>
                  ))}
                </div>
                <div>
                  <div className="text-[10px] font-mono text-risk uppercase tracking-wider mb-1">Risks</div>
                  {fitment.risks.length > 0 ? fitment.risks.map((r, i) => (
                    <div key={i} className="text-[11px] text-text-secondary mb-0.5">⚠ {r}</div>
                  )) : (
                    <div className="text-[11px] text-text-muted">No risks detected</div>
                  )}
                </div>
              </div>

              {/* Decision Logic */}
              <div className="rounded-lg bg-bg-card/30 p-3 border border-border">
                <div className="text-[10px] font-mono text-accent uppercase tracking-wider mb-1">Decision Logic</div>
                <p className="text-[11px] text-text-muted leading-relaxed">{fitment.decision_logic}</p>
              </div>
            </motion.div>
          ) : (
            <div className="glass rounded-xl p-8 text-center">
              <Search className="h-8 w-8 text-text-muted mx-auto mb-3" />
              <p className="text-sm text-text-muted">Select a candidate to view fitment analysis</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
