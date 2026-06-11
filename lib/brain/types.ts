// lib/brain/types.ts — V5.1 Context Package Schema

export type Intent =
  | 'factual'
  | 'relational'
  | 'preference'
  | 'historical'
  | 'repo'
  | 'impact'
  | 'mixed';

export type ReasoningMode = 'fast' | 'deliberate' | 'reflective';

export type QualityVerdict = 'draft' | 'acceptable' | 'polished' | 'exceptional';

export type RiskType = 'architecture' | 'dependency' | 'task_conflict' | 'knowledge_gap';

export type RiskSeverity = 'low' | 'med' | 'high' | 'critical';

export interface Evidence {
  text: string;
  source: 'active_context' | 'sprint' | 'project_brain' | 'qdrant' | 'neo4j' | 'mem0' | 'supermemory' | 'internet';
  confidence: number;
  trust: number;
  ts: string;
}

export interface Dependency {
  from: string;
  to: string;
  type: 'uses' | 'imports' | 'calls' | 'depends_on';
}

export interface Preference {
  key: string;
  value: string;
  scope: 'user' | 'project' | 'agent';
}

export interface HistoryEntry {
  event: string;
  ts: string;
  superseded_by: string | null;
}

export interface ActiveTask {
  id: string;
  title: string;
  status: string;
  repo: string;
}

export interface Risk {
  type: RiskType;
  severity: RiskSeverity;
  detail: string;
}

export interface Recommendation {
  action: string;
  priority: 'low' | 'med' | 'high';
  rationale: string;
}

// V5.1 NEW: Cognition Block
export interface CognitionBlock {
  reasoning_mode: ReasoningMode;
  hypotheses: string[];
  assumptions: string[];
  confidence_overall: number;
  self_critique: string;
  next_best_action: string;
}

// V5.1 NEW: Taste Block
export interface TasteBlock {
  aesthetic_score: number;
  style_profile: string;
  design_principles_applied: string[];
  quality_verdict: QualityVerdict;
}

// V5.1 NEW: Emotion Block
export interface EmotionBlock {
  agent_mood: string;
  user_emotion_detected: string;
  empathy_response: string;
  tone: string;
  motivation_level: number;
}

export interface PackageMeta {
  sources_hit: string[];
  sources_failed: string[];
  degraded: boolean;
  cache_hit: boolean;
  latency_ms: number;
  cost: 'free' | 'paid';
}

// Full Context Package v5.1
export interface ContextPackage {
  schema_version: '5.1';
  query_id: string;
  intent: Intent;
  knowledge: Evidence[];
  dependencies: Dependency[];
  preferences: Preference[];
  history: HistoryEntry[];
  active_tasks: ActiveTask[];
  risks: Risk[];
  recommendations: Recommendation[];
  cognition: CognitionBlock;
  taste: TasteBlock;
  emotion: EmotionBlock;
  meta: PackageMeta;
}

// Brain Router API types
export interface BrainQueryRequest {
  intent: Intent;
  query: string;
  filters?: Record<string, unknown>;
}

export interface BrainStoreRequest {
  payload: Record<string, unknown>;
  target?: 'qdrant' | 'neo4j' | 'mem0' | 'supermemory';
}

export interface BrainThinkRequest {
  problem: string;
  context?: ContextPackage;
}

export interface BrainReflectRequest {
  query_id: string;
  outcome?: string;
}

export interface BrainFeelRequest {
  user_message: string;
  conversation_history?: string[];
}

export interface BrainJudgeRequest {
  artifact: string;
  artifact_type: 'code' | 'writing' | 'design' | 'decision';
}

export interface ImpactReport {
  target: string;
  blast_radius: { direct: string[]; transitive: string[] };
  breaking_change_risk: RiskSeverity;
  affected_tasks: string[];
  affected_apis: string[];
  safe_change_plan: string[];
  rollback_plan: string[];
  confidence: number;
}

export interface AnalysisReport {
  scope: string;
  findings: string[];
  relationships: Dependency[];
  risks: Risk[];
  recommendations: Recommendation[];
}

export interface BrainHealth {
  sources: Record<string, { status: 'healthy' | 'degraded' | 'down'; latency_ms: number }>;
  overall: 'healthy' | 'degraded' | 'down';
  cache_hit_rate: number;
  degraded_rate: number;
}

export interface BrainTrace {
  query_id: string;
  routing_decision: string;
  sources_queried: string[];
  sources_skipped: string[];
  dedup_count: number;
  cache_key: string;
  cache_hit: boolean;
  total_latency_ms: number;
}
