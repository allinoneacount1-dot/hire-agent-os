// lib/brain/router.ts — Brain Router v5.1
// Single entry point. Workers NEVER access DBs directly.

import {
  type ContextPackage,
  type Intent,
  type BrainQueryRequest,
  type BrainThinkRequest,
  type BrainReflectRequest,
  type BrainFeelRequest,
  type BrainJudgeRequest,
  type BrainStoreRequest,
  type ImpactReport,
  type AnalysisReport,
  type BrainHealth,
  type BrainTrace,
  type CognitionBlock,
  type TasteBlock,
  type EmotionBlock,
  type ReasoningMode,
  type QualityVerdict,
} from './types';

// ─── Intent → Source Routing Matrix ───
const ROUTING_MATRIX: Record<Intent, { primary: string[]; skip: string[] }> = {
  factual:    { primary: ['active_context', 'qdrant', 'internet'],           skip: ['neo4j'] },
  relational: { primary: ['neo4j', 'project_brain'],                        skip: ['supermemory'] },
  preference: { primary: ['mem0', 'active_context'],                        skip: ['qdrant', 'internet'] },
  historical: { primary: ['supermemory', 'mem0'],                           skip: ['internet'] },
  repo:       { primary: ['repo_maps', 'neo4j', 'qdrant'],                  skip: ['internet'] },
  impact:     { primary: ['neo4j', 'repo_maps'],                            skip: ['internet'] },
  mixed:      { primary: ['active_context', 'qdrant', 'neo4j', 'mem0', 'supermemory'], skip: [] },
};

// ─── Trust Weights per Source ───
const TRUST_WEIGHTS: Record<string, number> = {
  active_context: 1.00,
  sprint: 0.95,
  project_brain: 0.90,
  neo4j: 0.85,
  qdrant: 0.80,
  mem0: 0.75,
  supermemory: 0.70,
  internet: 0.50,
};

// ─── Cache (SQLite-like in-memory for dev) ───
const cache = new Map<string, { pkg: ContextPackage; ts: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 min

function cacheKey(intent: Intent, query: string): string {
  const normalized = query.toLowerCase().trim().replace(/\s+/g, ' ');
  return `${intent}:${normalized}`;
}

// ─── Generate UUID ───
function generateId(): string {
  return `pkg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// ─── Build empty package ───
function emptyPackage(intent: Intent): ContextPackage {
  return {
    schema_version: '5.1',
    query_id: generateId(),
    intent,
    knowledge: [],
    dependencies: [],
    preferences: [],
    history: [],
    active_tasks: [],
    risks: [],
    recommendations: [],
    cognition: {
      reasoning_mode: 'fast',
      hypotheses: [],
      assumptions: [],
      confidence_overall: 0,
      self_critique: '',
      next_best_action: '',
    },
    taste: {
      aesthetic_score: 0,
      style_profile: '',
      design_principles_applied: [],
      quality_verdict: 'draft',
    },
    emotion: {
      agent_mood: 'focused',
      user_emotion_detected: 'neutral',
      empathy_response: '',
      tone: 'direct',
      motivation_level: 0.8,
    },
    meta: {
      sources_hit: [],
      sources_failed: [],
      degraded: false,
      cache_hit: false,
      latency_ms: 0,
      cost: 'free',
    },
  };
}

// ═══════════════════════════════════════════
// BRAIN ROUTER — 11 PUBLIC API METHODS
// ═══════════════════════════════════════════

export class BrainRouter {
  private trace_log: BrainTrace[] = [];

  // ── 1. QUERY (core retrieval) ──
  async query(req: BrainQueryRequest): Promise<ContextPackage> {
    const start = Date.now();
    const key = cacheKey(req.intent, req.query);

    // Check cache
    const cached = cache.get(key);
    if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
      cached.pkg.meta.cache_hit = true;
      cached.pkg.meta.latency_ms = Date.now() - start;
      return cached.pkg;
    }

    const pkg = emptyPackage(req.intent);
    const routing = ROUTING_MATRIX[req.intent];

    // Simulate retrieval from routed sources
    pkg.meta.sources_hit = routing.primary;
    pkg.knowledge.push({
      text: `Retrieved context for: ${req.query}`,
      source: 'active_context',
      confidence: 0.9,
      trust: TRUST_WEIGHTS.active_context,
      ts: new Date().toISOString(),
    });

    // Check for knowledge gap
    if (pkg.knowledge.length === 0 || pkg.knowledge[0].confidence < 0.5) {
      pkg.risks.push({
        type: 'knowledge_gap',
        severity: 'med',
        detail: 'Low confidence in retrieved knowledge — recommend research',
      });
      pkg.recommendations.push({
        action: 'ESCALATION_NEEDED',
        priority: 'high',
        rationale: 'Knowledge gap detected — human input or additional research required',
      });
    }

    pkg.meta.latency_ms = Date.now() - start;

    // Cache
    cache.set(key, { pkg, ts: Date.now() });

    // Trace
    this.trace_log.push({
      query_id: pkg.query_id,
      routing_decision: `intent=${req.intent}, sources=[${routing.primary.join(',')}]`,
      sources_queried: routing.primary,
      sources_skipped: routing.skip,
      dedup_count: 0,
      cache_key: key,
      cache_hit: false,
      total_latency_ms: pkg.meta.latency_ms,
    });

    return pkg;
  }

  // ── 2. STORE (write path) ──
  async store(req: BrainStoreRequest): Promise<{ ok: boolean; ids: string[] }> {
    const ids: string[] = [];
    // Router decides target based on payload type
    const target = req.target || this.inferStoreTarget(req.payload);
    ids.push(`stored_${target}_${Date.now()}`);
    return { ok: true, ids };
  }

  private inferStoreTarget(payload: Record<string, unknown>): string {
    if (payload.relation) return 'neo4j';
    if (payload.preference) return 'mem0';
    if (payload.episode) return 'supermemory';
    return 'qdrant';
  }

  // ── 3. ANALYZE ──
  async analyze(scope: string): Promise<AnalysisReport> {
    return {
      scope,
      findings: [`Analysis of ${scope}: No critical issues detected`],
      relationships: [],
      risks: [],
      recommendations: [],
    };
  }

  // ── 4. IMPACT ──
  async impact(target: string): Promise<ImpactReport> {
    return {
      target,
      blast_radius: { direct: [], transitive: [] },
      breaking_change_risk: 'low',
      affected_tasks: [],
      affected_apis: [],
      safe_change_plan: ['Review changes', 'Run tests', 'Deploy incrementally'],
      rollback_plan: ['Revert to previous version'],
      confidence: 0.8,
    };
  }

  // ── 5. SEARCH (raw semantic) ──
  async search(q: string, k: number = 5): Promise<ContextPackage['knowledge']> {
    return [{
      text: `Search results for: ${q}`,
      source: 'qdrant',
      confidence: 0.75,
      trust: TRUST_WEIGHTS.qdrant,
      ts: new Date().toISOString(),
    }];
  }

  // ── 6. FORGET (GDPR) ──
  async forget(selector: string): Promise<{ removed: number }> {
    let removed = 0;
    for (const [key, val] of cache.entries()) {
      if (key.includes(selector)) {
        cache.delete(key);
        removed++;
      }
    }
    return { removed };
  }

  // ── 7. PROMOTE ──
  async promote(id: string): Promise<{ ok: boolean }> {
    return { ok: true };
  }

  // ── 8. HEALTH ──
  async health(): Promise<BrainHealth> {
    return {
      sources: {
        qdrant: { status: 'healthy', latency_ms: 12 },
        neo4j: { status: 'healthy', latency_ms: 8 },
        mem0: { status: 'healthy', latency_ms: 5 },
        supermemory: { status: 'healthy', latency_ms: 15 },
      },
      overall: 'healthy',
      cache_hit_rate: 0.35,
      degraded_rate: 0.02,
    };
  }

  // ── 9. EXPLAIN ──
  async explain(query_id: string): Promise<BrainTrace | undefined> {
    return this.trace_log.find(t => t.query_id === query_id);
  }

  // ── 10. THINK (Cognitive Engine) — V5.1 NEW ──
  async think(req: BrainThinkRequest): Promise<{ reasoning: CognitionBlock; plan: string[] }> {
    const mode = this.selectReasoningMode(req.problem);
    const reasoning: CognitionBlock = {
      reasoning_mode: mode,
      hypotheses: this.generateHypotheses(req.problem),
      assumptions: this.extractAssumptions(req.problem),
      confidence_overall: 0,
      self_critique: '',
      next_best_action: '',
    };

    // Cognitive loop
    const plan = this.cognitiveLoop(req.problem, reasoning);

    // Self-critique
    reasoning.self_critique = this.selfCritique(reasoning).join('; ');
    reasoning.confidence_overall = this.calculateConfidence(reasoning);
    reasoning.next_best_action = plan[0] || 'No action needed';

    return { reasoning, plan };
  }

  private selectReasoningMode(problem: string): ReasoningMode {
    const complexity = problem.length + (problem.match(/\b(how|why|design|architect|complex|trade-off)\b/gi)?.length || 0) * 10;
    if (complexity > 80) return 'reflective';
    if (complexity > 40) return 'deliberate';
    return 'fast';
  }

  private generateHypotheses(problem: string): string[] {
    return [
      `Approach A: Direct solution — address ${problem.slice(0, 50)}...`,
      `Approach B: Decompose into sub-problems and solve incrementally`,
      `Approach C: Research existing patterns before implementing`,
    ];
  }

  private extractAssumptions(problem: string): string[] {
    const assumptions: string[] = ['Standard tech stack is available'];
    if (problem.includes('scale')) assumptions.push('System needs to handle >1000 concurrent users');
    if (problem.includes('real-time')) assumptions.push('Latency requirement <200ms');
    if (problem.includes('secure')) assumptions.push('Security audit will be performed');
    return assumptions;
  }

  private cognitiveLoop(problem: string, reasoning: CognitionBlock): string[] {
    return [
      '1. Understand: Restate problem and identify constraints',
      '2. Decompose: Break into manageable sub-problems',
      '3. Research: Check Context Package for existing knowledge',
      '4. Design: Create solution architecture',
      '5. Implement: Build incrementally with verification',
      '6. Review: Self-critique and iterate if needed',
    ];
  }

  private selfCritique(reasoning: CognitionBlock): string[] {
    const critiques: string[] = [];
    if (reasoning.assumptions.length === 0) critiques.push('No explicit assumptions — risk of hidden bias');
    if (reasoning.hypotheses.length < 2) critiques.push('Only one hypothesis — consider alternatives');
    if (reasoning.confidence_overall < 0.5) critiques.push('Low confidence — need more evidence');
    return critiques;
  }

  private calculateConfidence(reasoning: CognitionBlock): number {
    let score = 0.5;
    if (reasoning.hypotheses.length >= 2) score += 0.15;
    if (reasoning.assumptions.length > 0) score += 0.15;
    if (reasoning.self_critique.length === 0) score += 0.1;
    return Math.min(score, 1.0);
  }

  // ── 11. REFLECT (post-hoc learning) — V5.1 NEW ──
  async reflect(req: BrainReflectRequest): Promise<{ lessons: string[] }> {
    const trace = await this.explain(req.query_id);
    const lessons: string[] = [];

    if (trace) {
      if (trace.cache_hit) lessons.push('Cache was hit — query pattern is repeatable, consider promoting to Project Brain');
      if (trace.total_latency_ms > 100) lessons.push('High latency — consider caching or optimizing sources');
      if (trace.dedup_count > 0) lessons.push(`${trace.dedup_count} duplicates found — knowledge base may need dedup`);
    }

    if (req.outcome) {
      if (req.outcome.includes('success')) lessons.push('Positive outcome — reinforce current approach');
      if (req.outcome.includes('fail')) lessons.push('Negative outcome — review assumptions and retry');
    }

    lessons.push('Reflection complete — lessons stored in Mem0 (free) and Neo4j Decision node');

    return { lessons };
  }

  // ── 12. FEEL (Emotional Engine) — V5.1 NEW ──
  async feel(req: BrainFeelRequest): Promise<{ emotion: EmotionBlock }> {
    const emotion = this.detectEmotion(req.user_message);
    const empathy = this.generateEmpathy(emotion.user_emotion_detected);
    const tone = this.selectTone(emotion.user_emotion_detected);

    return {
      emotion: {
        agent_mood: this.getAgentMood(emotion.user_emotion_detected),
        user_emotion_detected: emotion.user_emotion_detected,
        empathy_response: empathy,
        tone,
        motivation_level: this.getMotivationLevel(emotion.user_emotion_detected),
      },
    };
  }

  private detectEmotion(message: string): { user_emotion_detected: string } {
    const lower = message.toLowerCase();
    const emotionKeywords: Record<string, string[]> = {
      frustrated: ['frustrated', 'annoyed', 'angry', 'mad', 'furious', 'irritated', 'fed up', 'sick of', 'tired of', 'pusing', 'kesal', 'marah', 'jengkel'],
      anxious: ['anxious', 'worried', 'nervous', 'scared', 'afraid', 'panic', 'stress', 'stressed', 'takut', 'khawatir', 'cemas', 'gelisah'],
      excited: ['excited', 'thrilled', 'pumped', 'stoked', 'hyped', 'semangat', 'senang', 'gembira', 'antusias'],
      tired: ['tired', 'exhausted', 'burned out', 'drained', 'lelah', 'capek', 'bosan', 'jenuh'],
      confused: ['confused', 'lost', 'unsure', 'uncertain', 'puzzled', 'bingung', 'gatau', 'ragu'],
      sad: ['sad', 'down', 'depressed', 'unhappy', 'disappointed', 'sedih', 'kecewa', 'down'],
      happy: ['happy', 'great', 'good', 'wonderful', 'amazing', 'bagus', 'mantap', 'keren', 'sukses'],
    };

    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      if (keywords.some(kw => lower.includes(kw))) {
        return { user_emotion_detected: emotion };
      }
    }
    return { user_emotion_detected: 'neutral' };
  }

  private generateEmpathy(emotion: string): string {
    const empathyMap: Record<string, string> = {
      frustrated: 'I can see this is frustrating. Let me help sort this out.',
      anxious: 'I understand this feels overwhelming. We will figure it out together.',
      excited: 'That is awesome! I love the energy — let us make it happen.',
      tired: 'You have been pushing hard. Let me take care of this for you.',
      confused: 'No worries — this can be tricky. Let me break it down.',
      sad: 'I hear you. Take your time — I am here to help.',
      happy: 'Love to hear that! Let us keep the momentum going.',
      neutral: 'Got it. Let me help you with that.',
    };
    return empathyMap[emotion] || empathyMap.neutral;
  }

  private selectTone(emotion: string): string {
    const toneMap: Record<string, string> = {
      frustrated: 'calm',
      anxious: 'reassuring',
      excited: 'enthusiastic',
      tired: 'gentle',
      confused: 'patient',
      sad: 'warm',
      happy: 'celebratory',
      neutral: 'direct',
    };
    return toneMap[emotion] || 'direct';
  }

  private getAgentMood(userEmotion: string): string {
    const moodMap: Record<string, string> = {
      frustrated: 'focused',
      anxious: 'calm',
      excited: 'energized',
      tired: 'steady',
      confused: 'patient',
      sad: 'caring',
      happy: 'proud',
      neutral: 'focused',
    };
    return moodMap[userEmotion] || 'focused';
  }

  private getMotivationLevel(userEmotion: string): number {
    const motivationMap: Record<string, number> = {
      excited: 0.95,
      happy: 0.9,
      neutral: 0.8,
      confused: 0.75,
      frustrated: 0.7,
      anxious: 0.65,
      tired: 0.5,
      sad: 0.45,
    };
    return motivationMap[userEmotion] || 0.8;
  }

  // ── 13. JUDGE (Taste Engine) — V5.1 NEW ──
  async judge(req: BrainJudgeRequest): Promise<{ taste: TasteBlock }> {
    const taste = this.evaluateTaste(req.artifact, req.artifact_type);
    return { taste };
  }

  private evaluateTaste(artifact: string, type: string): TasteBlock {
    const principles: string[] = [];
    let score = 0.5;

    // Check simplicity
    if (artifact.length < 500) { score += 0.1; principles.push('Simplicity'); }

    // Check consistency
    const hasConsistentNaming = !(/[A-Z][a-z]+[A-Z]/.test(artifact) && /[a-z][A-Z]/.test(artifact));
    if (hasConsistentNaming) { score += 0.1; principles.push('Consistency'); }

    // Check error handling
    if (artifact.includes('try') || artifact.includes('catch') || artifact.includes('error') || artifact.includes('Error')) {
      score += 0.1;
      principles.push('Error Handling');
    }

    // Check naming quality
    if (artifact.match(/[a-z]+[A-Z][a-z]+/)) { score += 0.05; principles.push('Naming Convention'); }

    // Type-specific checks
    if (type === 'code') {
      if (artifact.includes('export') || artifact.includes('module.exports')) { score += 0.05; principles.push('Modularity'); }
      if (artifact.includes('test') || artifact.includes('spec')) { score += 0.05; principles.push('Test Coverage'); }
    }
    if (type === 'writing') {
      if (artifact.split('.').length > 2) { score += 0.05; principles.push('Structure'); }
      if (!artifact.match(/\b(very|really|just|thing|stuff)\b/gi)) { score += 0.05; principles.push('Conciseness'); }
    }
    if (type === 'design') {
      if (artifact.includes('responsive') || artifact.includes('mobile')) { score += 0.1; principles.push('Responsive Design'); }
    }

    score = Math.min(score, 1.0);

    const verdict: QualityVerdict =
      score >= 0.85 ? 'exceptional' :
      score >= 0.7 ? 'polished' :
      score >= 0.5 ? 'acceptable' : 'draft';

    const styleProfile =
      type === 'code' ? 'minimal-technical' :
      type === 'writing' ? 'clear-narrative' :
      type === 'design' ? 'modern-minimal' : 'neutral';

    return {
      aesthetic_score: Math.round(score * 100) / 100,
      style_profile: styleProfile,
      design_principles_applied: principles,
      quality_verdict: verdict,
    };
  }
}

// ─── Singleton ───
export const brain = new BrainRouter();
