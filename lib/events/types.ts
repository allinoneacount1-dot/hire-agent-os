// lib/events/types.ts — Event Schemas for Kafka-style Event Bus

export type EventType =
  | 'talent.discovered'
  | 'talent.enriched'
  | 'skill.inferred'
  | 'candidate.scored'
  | 'outreach.sent'
  | 'outreach.responded'
  | 'interview.completed'
  | 'hire.outcome'
  | 'system.feedback'
  | 'market.update';

export interface BaseEvent {
  id: string;
  type: EventType;
  timestamp: number;
  tenant_id: string;
}

export interface TalentDiscoveredEvent extends BaseEvent {
  type: 'talent.discovered';
  payload: {
    candidate_id: string;
    source: string;
    signal_strength: number;
    raw_data: Record<string, unknown>;
  };
}

export interface TalentEnrichedEvent extends BaseEvent {
  type: 'talent.enriched';
  payload: {
    candidate_id: string;
    skills: string[];
    experience_years: number;
    domain: string;
  };
}

export interface SkillInferredEvent extends BaseEvent {
  type: 'skill.inferred';
  payload: {
    candidate_id: string;
    skill: string;
    confidence: number;
    evidence: string[];
  };
}

export interface CandidateScoredEvent extends BaseEvent {
  type: 'candidate.scored';
  payload: {
    candidate_id: string;
    final_score: number;
    ranking_position: number;
    recommendation: string;
  };
}

export interface OutreachSentEvent extends BaseEvent {
  type: 'outreach.sent';
  payload: {
    candidate_id: string;
    channel: string;
    response_probability: number;
    message_id: string;
  };
}

export interface OutreachRespondedEvent extends BaseEvent {
  type: 'outreach.responded';
  payload: {
    candidate_id: string;
    message_id: string;
    response_type: 'positive' | 'negative' | 'neutral';
    response_time_minutes: number;
  };
}

export interface InterviewCompletedEvent extends BaseEvent {
  type: 'interview.completed';
  payload: {
    candidate_id: string;
    score: number;
    technical_depth: number;
    reasoning_strength: number;
    red_flags: string[];
  };
}

export interface HireOutcomeEvent extends BaseEvent {
  type: 'hire.outcome';
  payload: {
    candidate_id: string;
    decision: 'hired' | 'rejected';
    performance_score: number;
    retention: number;
    prediction_error: number;
  };
}

export interface SystemFeedbackEvent extends BaseEvent {
  type: 'system.feedback';
  payload: {
    weight_updates: Array<{ feature: string; old_weight: number; new_weight: number }>;
    bias_detected: string[];
    insights: string[];
  };
}

export interface MarketUpdateEvent extends BaseEvent {
  type: 'market.update';
  payload: {
    top_rising_skills: string[];
    declining_skills: string[];
    regional_hotspots: string[];
    salary_pressure_index: number;
  };
}

export type HireAgentEvent =
  | TalentDiscoveredEvent
  | TalentEnrichedEvent
  | SkillInferredEvent
  | CandidateScoredEvent
  | OutreachSentEvent
  | OutreachRespondedEvent
  | InterviewCompletedEvent
  | HireOutcomeEvent
  | SystemFeedbackEvent
  | MarketUpdateEvent;
