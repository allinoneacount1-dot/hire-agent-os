// lib/agents/feedback.ts — Agent 5: Feedback Loop
// Learns from real-world hiring outcomes, adjusts weights

import { eventBus, generateEventId } from '@/lib/events/bus';
import { processFeedback, type FeedbackInput } from '@/lib/scoring/feedback';
import { type CandidateSeed } from '@/mock/candidates.seed';

export interface FeedbackConfig {
  learning_rate: number;
  auto_adjust: boolean;
  min_samples_before_adjust: number;
}

const DEFAULT_CONFIG: FeedbackConfig = {
  learning_rate: 0.05,
  auto_adjust: true,
  min_samples_before_adjust: 3,
};

// Current model weights (mutable)
let modelWeights = {
  skillFit: 0.45,
  projectDepth: 0.25,
  domainMatch: 0.15,
  behaviorStability: 0.15,
};

// Outcome history for learning
const outcomeHistory: Array<{
  candidate_id: string;
  predicted: number;
  actual: number;
  error: number;
  timestamp: number;
}> = [];

// Record a hiring outcome
export function recordOutcome(
  candidate: CandidateSeed,
  decision: 'hired' | 'rejected',
  performanceScore: number,
  retention: number,
  satisfactionScore: number
): ReturnType<typeof processFeedback> {
  const predictedScore = candidate.signal_strength;

  const feedbackInput: FeedbackInput = {
    candidateId: candidate.id,
    decision,
    predictionScores: {
      skillFit: 0.7 + Math.random() * 0.2,
      projectDepth: 0.6 + Math.random() * 0.3,
      domainMatch: 0.5 + Math.random() * 0.4,
      behaviorStability: 0.6 + Math.random() * 0.3,
      finalScore: predictedScore,
    },
    realWorldOutcome: {
      performanceScore,
      retention,
      satisfactionScore,
    },
  };

  const result = processFeedback(feedbackInput);

  // Record outcome
  const error = performanceScore - predictedScore;
  outcomeHistory.push({
    candidate_id: candidate.id,
    predicted: predictedScore,
    actual: performanceScore,
    error,
    timestamp: Date.now(),
  });

  // Auto-adjust weights if enabled
  if (outcomeHistory.length >= DEFAULT_CONFIG.min_samples_before_adjust) {
    adjustWeights(result.weightUpdates);
  }

  // Emit feedback event
  eventBus.emit({
    id: generateEventId(),
    type: 'system.feedback',
    timestamp: Date.now(),
    tenant_id: 'default',
    payload: {
      weight_updates: result.weightUpdates,
      bias_detected: result.biasDetected,
      insights: result.insights,
    },
  });

  // Emit hire outcome event
  eventBus.emit({
    id: generateEventId(),
    type: 'hire.outcome',
    timestamp: Date.now(),
    tenant_id: 'default',
    payload: {
      candidate_id: candidate.id,
      decision,
      performance_score: performanceScore,
      retention,
      prediction_error: error,
    },
  });

  return result;
}

// Adjust model weights based on feedback
function adjustWeights(updates: Array<{ feature: string; oldWeight: number; newWeight: number }>): void {
  for (const update of updates) {
    const key = update.feature.replace(' ', '') as keyof typeof modelWeights;
    if (key in modelWeights) {
      modelWeights[key] = update.newWeight;
    }
  }
}

// Get current model state
export function getModelState() {
  return {
    weights: { ...modelWeights },
    total_outcomes: outcomeHistory.length,
    avg_error: outcomeHistory.length > 0
      ? outcomeHistory.reduce((sum, o) => sum + Math.abs(o.error), 0) / outcomeHistory.length
      : 0,
    recent_outcomes: outcomeHistory.slice(-5),
  };
}

// Simulate batch outcomes (for mock)
export function simulateOutcomes(candidates: CandidateSeed[]): void {
  candidates.forEach(candidate => {
    const hired = candidate.signal_strength > 0.7;
    recordOutcome(
      candidate,
      hired ? 'hired' : 'rejected',
      hired ? 0.6 + Math.random() * 0.35 : 0.2 + Math.random() * 0.3,
      hired ? Math.floor(Math.random() * 24) + 3 : 0,
      hired ? 0.5 + Math.random() * 0.5 : 0.3 + Math.random() * 0.3
    );
  });
}

export function getFeedbackStats() {
  const log = eventBus.getEventLog();
  const outcomes = log.filter(e => e.type === 'hire.outcome');
  const feedbacks = log.filter(e => e.type === 'system.feedback');
  return {
    total_outcomes: outcomes.length,
    total_feedbacks: feedbacks.length,
    hired: outcomes.filter((e: any) => e.payload?.decision === 'hired').length,
    rejected: outcomes.filter((e: any) => e.payload?.decision === 'rejected').length,
    avg_performance: outcomes.length > 0
      ? outcomes.reduce((sum: number, e: any) => sum + (e.payload?.performance_score || 0), 0) / outcomes.length
      : 0,
    avg_prediction_error: outcomes.length > 0
      ? outcomes.reduce((sum: number, e: any) => sum + Math.abs(e.payload?.prediction_error || 0), 0) / outcomes.length
      : 0,
  };
}
