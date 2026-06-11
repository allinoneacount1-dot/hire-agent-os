// lib/agents/orchestrator.ts — Agent Orchestrator
// Coordinates all 5 agents: Discovery → Scoring → Outreach → Interview → Feedback

import { eventBus, generateEventId } from '@/lib/events/bus';
import { runDiscovery, getDiscoveryStats } from './discovery';
import { runOutreach, getOutreachStats, simulateResponse } from './outreach';
import { runInterview, getInterviewStats } from './interview';
import { scoreBatch, getScoringStats } from './scoring';
import { recordOutcome, getModelState, getFeedbackStats, simulateOutcomes } from './feedback';
import { mockCandidates } from '@/mock/candidates.seed';

export type AgentStatus = 'idle' | 'running' | 'completed' | 'error';
export type AgentName = 'discovery' | 'scoring' | 'outreach' | 'interview' | 'feedback';

export interface AgentState {
  name: AgentName;
  status: AgentStatus;
  last_run: number | null;
  run_count: number;
  error: string | null;
}

export interface OrchestratorState {
  agents: Record<AgentName, AgentState>;
  pipeline_active: boolean;
  total_candidates_discovered: number;
  total_candidates_scored: number;
  total_outreach_sent: number;
  total_interviews_completed: number;
  total_outcomes_recorded: number;
  last_event: string | null;
}

const agentStates: Record<AgentName, AgentState> = {
  discovery: { name: 'discovery', status: 'idle', last_run: null, run_count: 0, error: null },
  scoring: { name: 'scoring', status: 'idle', last_run: null, run_count: 0, error: null },
  outreach: { name: 'outreach', status: 'idle', last_run: null, run_count: 0, error: null },
  interview: { name: 'interview', status: 'idle', last_run: null, run_count: 0, error: null },
  feedback: { name: 'feedback', status: 'idle', last_run: null, run_count: 0, error: null },
};

// Run full pipeline (all 5 agents in sequence)
export function runFullPipeline(): OrchestratorState {
  // 1. Discovery
  agentStates.discovery.status = 'running';
  const discovered = runDiscovery({ max_results: 10, min_signal_strength: 0.6 });
  agentStates.discovery.status = 'completed';
  agentStates.discovery.last_run = Date.now();
  agentStates.discovery.run_count++;

  // 2. Scoring
  agentStates.scoring.status = 'running';
  const scored = scoreBatch(discovered);
  agentStates.scoring.status = 'completed';
  agentStates.scoring.last_run = Date.now();
  agentStates.scoring.run_count++;

  // 3. Outreach (to top 5 candidates)
  agentStates.outreach.status = 'running';
  const topCandidates = scored.slice(0, 5).map(s => s.candidate);
  const outreachResults = runOutreach(topCandidates, { platform: 'email', tone: 'professional' });
  agentStates.outreach.status = 'completed';
  agentStates.outreach.last_run = Date.now();
  agentStates.outreach.run_count++;

  // 4. Interview (to top 3 candidates)
  agentStates.interview.status = 'running';
  const interviewCandidates = scored.slice(0, 3).map(s => s.candidate);
  const interviewResults = interviewCandidates.map(c => runInterview(c, { max_rounds: 4 }));
  agentStates.interview.status = 'completed';
  agentStates.interview.last_run = Date.now();
  agentStates.interview.run_count++;

  // 5. Feedback (simulate outcomes for hired candidates)
  agentStates.feedback.status = 'running';
  const hiredCandidates = scored.filter(s => s.fitment.recommendation === 'strong_hire' || s.fitment.recommendation === 'hire').map(s => s.candidate);
  simulateOutcomes(hiredCandidates.slice(0, 3));
  agentStates.feedback.status = 'completed';
  agentStates.feedback.last_run = Date.now();
  agentStates.feedback.run_count++;

  return getOrchestratorState();
}

// Run single agent
export function runAgent(agentName: AgentName): OrchestratorState {
  switch (agentName) {
    case 'discovery':
      agentStates.discovery.status = 'running';
      runDiscovery();
      agentStates.discovery.status = 'completed';
      agentStates.discovery.last_run = Date.now();
      agentStates.discovery.run_count++;
      break;
    case 'scoring':
      agentStates.scoring.status = 'running';
      scoreBatch(mockCandidates);
      agentStates.scoring.status = 'completed';
      agentStates.scoring.last_run = Date.now();
      agentStates.scoring.run_count++;
      break;
    case 'outreach':
      agentStates.outreach.status = 'running';
      runOutreach(mockCandidates.slice(0, 5));
      agentStates.outreach.status = 'completed';
      agentStates.outreach.last_run = Date.now();
      agentStates.outreach.run_count++;
      break;
    case 'interview':
      agentStates.interview.status = 'running';
      mockCandidates.slice(0, 3).forEach(c => runInterview(c));
      agentStates.interview.status = 'completed';
      agentStates.interview.last_run = Date.now();
      agentStates.interview.run_count++;
      break;
    case 'feedback':
      agentStates.feedback.status = 'running';
      simulateOutcomes(mockCandidates.slice(0, 3));
      agentStates.feedback.status = 'completed';
      agentStates.feedback.last_run = Date.now();
      agentStates.feedback.run_count++;
      break;
  }

  return getOrchestratorState();
}

// Get full orchestrator state
export function getOrchestratorState(): OrchestratorState {
  const discoveryStats = getDiscoveryStats();
  const outreachStats = getOutreachStats();
  const interviewStats = getInterviewStats();
  const scoringStats = getScoringStats();
  const feedbackStats = getFeedbackStats();

  return {
    agents: { ...agentStates },
    pipeline_active: Object.values(agentStates).some(a => a.status === 'running'),
    total_candidates_discovered: discoveryStats.total_discovered,
    total_candidates_scored: scoringStats.total_scored,
    total_outreach_sent: outreachStats.total_sent,
    total_interviews_completed: interviewStats.total_interviews,
    total_outcomes_recorded: feedbackStats.total_outcomes,
    last_event: eventBus.getEventLog().slice(-1)[0]?.type || null,
  };
}

// Reset all agents
export function resetAgents(): void {
  Object.keys(agentStates).forEach(key => {
    const k = key as AgentName;
    agentStates[k] = { name: k, status: 'idle', last_run: null, run_count: 0, error: null };
  });
  eventBus.clearLog();
}
