// lib/agents/scoring.ts — Agent 4: Scoring Engine
// AI evaluation + fitment scoring + ranking

import { eventBus, generateEventId } from '@/lib/events/bus';
import { calculateFitment, type FitmentInput } from '@/lib/scoring/fitment';
import { type CandidateSeed } from '@/mock/candidates.seed';

export interface ScoringConfig {
  target_domain: string;
  required_skills: string[];
  auto_rank: boolean;
  auto_recommend: boolean;
}

const DEFAULT_CONFIG: ScoringConfig = {
  target_domain: 'SaaS',
  required_skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS'],
  auto_rank: true,
  auto_recommend: true,
};

export interface ScoredCandidate {
  candidate: CandidateSeed;
  fitment: ReturnType<typeof calculateFitment>;
  rank: number;
}

// Score a single candidate
export function scoreCandidate(
  candidate: CandidateSeed,
  config: Partial<ScoringConfig> = {}
): ScoredCandidate {
  const cfg = { ...DEFAULT_CONFIG, ...config };

  const fitment = calculateFitment({
    candidateSkills: candidate.skills,
    requiredSkills: cfg.required_skills,
    projectCount: candidate.project_count,
    maxProjectComplexity: candidate.max_project_complexity,
    domainExperience: candidate.experience_years,
    targetDomain: cfg.target_domain,
    jobHops: candidate.job_hops_5yr,
    avgTenure: candidate.avg_tenure_years,
  });

  return {
    candidate,
    fitment,
    rank: 0, // Will be set after batch scoring
  };
}

// Score and rank a batch of candidates
export function scoreBatch(
  candidates: CandidateSeed[],
  config: Partial<ScoringConfig> = {}
): ScoredCandidate[] {
  const cfg = { ...DEFAULT_CONFIG, ...config };

  let scored = candidates.map(c => scoreCandidate(c, cfg));

  // Rank by final score (descending)
  scored.sort((a, b) => b.fitment.finalScore - a.fitment.finalScore);
  scored = scored.map((s, i) => ({ ...s, rank: i + 1 }));

  // Emit scoring events
  scored.forEach(s => {
    eventBus.emit({
      id: generateEventId(),
      type: 'candidate.scored',
      timestamp: Date.now(),
      tenant_id: 'default',
      payload: {
        candidate_id: s.candidate.id,
        final_score: s.fitment.finalScore,
        ranking_position: s.rank,
        recommendation: s.fitment.recommendation,
      },
    });
  });

  return scored;
}

export function getScoringStats() {
  const log = eventBus.getEventLog();
  const scored = log.filter(e => e.type === 'candidate.scored');
  return {
    total_scored: scored.length,
    avg_score: scored.length > 0
      ? scored.reduce((sum: number, e: any) => sum + (e.payload?.final_score || 0), 0) / scored.length
      : 0,
    strong_hire: scored.filter((e: any) => e.payload?.recommendation === 'strong_hire').length,
    hire: scored.filter((e: any) => e.payload?.recommendation === 'hire').length,
    consider: scored.filter((e: any) => e.payload?.recommendation === 'consider').length,
    reject: scored.filter((e: any) => e.payload?.recommendation === 'reject').length,
  };
}
