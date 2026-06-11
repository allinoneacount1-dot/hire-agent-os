// lib/agents/discovery.ts — Agent 1: Discovery
// Scrapes mock sources (GitHub/LinkedIn/StackOverflow/Conferences) for candidates

import { eventBus, generateEventId } from '@/lib/events/bus';
import { mockCandidates, type CandidateSeed } from '@/mock/candidates.seed';

export interface DiscoveryConfig {
  sources: ('github' | 'linkedin' | 'stackoverflow' | 'conference' | 'referral')[];
  min_signal_strength: number;
  max_results: number;
  auto_score: boolean;
}

const DEFAULT_CONFIG: DiscoveryConfig = {
  sources: ['github', 'linkedin', 'stackoverflow', 'conference', 'referral'],
  min_signal_strength: 0.6,
  max_results: 20,
  auto_score: true,
};

// Mock "scraping" — simulates finding candidates from various sources
export function runDiscovery(config: Partial<DiscoveryConfig> = {}): CandidateSeed[] {
  const cfg = { ...DEFAULT_CONFIG, ...config };

  // Simulate: pick random candidates from mock pool (as if "discovered")
  const shuffled = [...mockCandidates].sort(() => Math.random() - 0.5);
  const discovered = shuffled.slice(0, Math.min(cfg.max_results, shuffled.length));

  // Filter by min signal strength
  const filtered = discovered.filter(c => c.signal_strength >= cfg.min_signal_strength);

  // Emit discovery events
  filtered.forEach(candidate => {
    const source = cfg.sources[Math.floor(Math.random() * cfg.sources.length)];
    eventBus.emit({
      id: generateEventId(),
      type: 'talent.discovered',
      timestamp: Date.now(),
      tenant_id: 'default',
      payload: {
        candidate_id: candidate.id,
        source,
        signal_strength: candidate.signal_strength,
        raw_data: {
          name: candidate.name,
          role: candidate.role,
          skills: candidate.skills,
          location: candidate.location,
        },
      },
    });

    // Auto-enrich
    eventBus.emit({
      id: generateEventId(),
      type: 'talent.enriched',
      timestamp: Date.now(),
      tenant_id: 'default',
      payload: {
        candidate_id: candidate.id,
        skills: candidate.skills,
        experience_years: candidate.experience_years,
        domain: candidate.domain,
      },
    });
  });

  // Infer skills from discovered candidates
  filtered.forEach(candidate => {
    candidate.skills.forEach(skill => {
      eventBus.emit({
        id: generateEventId(),
        type: 'skill.inferred',
        timestamp: Date.now(),
        tenant_id: 'default',
        payload: {
          candidate_id: candidate.id,
          skill,
          confidence: 0.7 + Math.random() * 0.3,
          evidence: [`Found in ${candidate.role} profile`, `Listed on ${candidate.source}`],
        },
      });
    });
  });

  return filtered;
}

// Get discovery stats
export function getDiscoveryStats() {
  const log = eventBus.getEventLog();
  return {
    total_discovered: log.filter(e => e.type === 'talent.discovered').length,
    total_enriched: log.filter(e => e.type === 'talent.enriched').length,
    total_skills_inferred: log.filter(e => e.type === 'skill.inferred').length,
    by_source: {
      github: log.filter(e => e.type === 'talent.discovered' && (e as any).payload?.source === 'github').length,
      linkedin: log.filter(e => e.type === 'talent.discovered' && (e as any).payload?.source === 'linkedin').length,
      stackoverflow: log.filter(e => e.type === 'talent.discovered' && (e as any).payload?.source === 'stackoverflow').length,
      conference: log.filter(e => e.type === 'talent.discovered' && (e as any).payload?.source === 'conference').length,
      referral: log.filter(e => e.type === 'talent.discovered' && (e as any).payload?.source === 'referral').length,
    },
  };
}
