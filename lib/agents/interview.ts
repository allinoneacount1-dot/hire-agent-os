// lib/agents/interview.ts — Agent 3: Interview Simulator
// Adaptive chat-based interview with escalation rounds

import { eventBus, generateEventId } from '@/lib/events/bus';
import { type CandidateSeed } from '@/mock/candidates.seed';

export type Difficulty = 'baseline' | 'deeper' | 'edge' | 'chaos';
export type InterviewMode = 'technical' | 'behavioral' | 'system-design' | 'mixed';

export interface InterviewConfig {
  mode: InterviewMode;
  max_rounds: number;
  auto_escalate: boolean;
  difficulty_cap: Difficulty;
}

const DEFAULT_CONFIG: InterviewConfig = {
  mode: 'mixed',
  max_rounds: 4,
  auto_escalate: true,
  difficulty_cap: 'chaos',
};

interface Question {
  text: string;
  difficulty: Difficulty;
  category: string;
}

const questionBank: Question[] = [
  // Baseline
  { text: 'Tell me about yourself and your most impactful project.', difficulty: 'baseline', category: 'Behavioral' },
  { text: 'Explain the difference between SQL and NoSQL databases.', difficulty: 'baseline', category: 'Technical' },
  { text: 'How do you handle disagreements with teammates?', difficulty: 'baseline', category: 'Behavioral' },
  { text: 'What is your approach to debugging a production issue?', difficulty: 'baseline', category: 'Technical' },
  // Deeper
  { text: 'Design a rate limiter for a high-traffic API handling 1M requests/sec.', difficulty: 'deeper', category: 'System Design' },
  { text: 'How would you implement a distributed cache invalidation strategy?', difficulty: 'deeper', category: 'Architecture' },
  { text: 'Explain CAP theorem. How does it apply to your past projects?', difficulty: 'deeper', category: 'Technical' },
  { text: 'How do you balance technical debt vs. feature delivery?', difficulty: 'deeper', category: 'Leadership' },
  // Edge
  { text: 'Your production database just went down during Black Friday. Walk me through your response.', difficulty: 'edge', category: 'Incident Response' },
  { text: 'Design a real-time notification system for 10M concurrent users.', difficulty: 'edge', category: 'System Design' },
  { text: 'A critical CVE was found in a core dependency at 5 PM Friday. What do you do?', difficulty: 'edge', category: 'Security' },
  // Chaos
  { text: 'Write a system that generates infinite recursive agent simulations. What breaks first?', difficulty: 'chaos', category: 'Abstract' },
  { text: 'Your entire team quit. You have a launch in 48 hours. What do you do?', difficulty: 'chaos', category: 'Crisis' },
  { text: 'Design an AI hiring agent that can\'t be biased. What\'s the fundamental impossibility?', difficulty: 'chaos', category: 'Ethics' },
];

// Mock AI evaluation of answer (simulates LLM scoring)
function evaluateAnswer(question: Question, candidate: CandidateSeed): {
  score: number;
  analysis: string;
  follow_up: string;
} {
  const baseScore = candidate.signal_strength;
  const difficultyMultiplier = { baseline: 1.0, deeper: 0.85, edge: 0.7, chaos: 0.55 };
  const randomVariance = (Math.random() - 0.5) * 0.2;
  const score = Math.min(1, Math.max(0, baseScore * difficultyMultiplier[question.difficulty] + randomVariance));

  const analyses = [
    `Strong alignment with candidate's ${candidate.domain} experience.`,
    `Demonstrates ${candidate.experience_years}+ years of practical knowledge.`,
    `Response shows depth in ${candidate.skills[0]} and ${candidate.skills[1]}.`,
    `Well-structured thinking, good problem decomposition.`,
  ];

  const followUps = [
    'Can you go deeper on the scalability aspect?',
    'How would this change with 10x the load?',
    'What would you do differently in retrospect?',
    'How does this relate to your past experience?',
  ];

  return {
    score,
    analysis: analyses[Math.floor(Math.random() * analyses.length)],
    follow_up: followUps[Math.floor(Math.random() * followUps.length)],
  };
}

export interface InterviewResult {
  candidate_id: string;
  rounds: Array<{
    question: string;
    difficulty: Difficulty;
    category: string;
    score: number;
    analysis: string;
    follow_up: string;
  }>;
  final_assessment: {
    technical_depth: number;
    reasoning_strength: number;
    hire_recommendation: string;
  };
  red_flags: string[];
}

// Run full interview simulation
export function runInterview(
  candidate: CandidateSeed,
  config: Partial<InterviewConfig> = {}
): InterviewResult {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const rounds: InterviewResult['rounds'] = [];
  const red_flags: string[] = [];

  const difficulties: Difficulty[] = ['baseline', 'deeper', 'edge', 'chaos'];

  for (let i = 0; i < cfg.max_rounds; i++) {
    const difficulty = difficulties[i];
    const questions = questionBank.filter(q => q.difficulty === difficulty);
    const question = questions[Math.floor(Math.random() * questions.length)];

    // Pick appropriate question based on candidate skills
    const relevantQuestion = questionBank.find(q =>
      q.difficulty === difficulty && candidate.skills.some(s => q.text.toLowerCase().includes(s.toLowerCase()))
    ) || question;

    const evaluation = evaluateAnswer(relevantQuestion, candidate);

    rounds.push({
      question: relevantQuestion.text,
      difficulty,
      category: relevantQuestion.category,
      score: evaluation.score,
      analysis: evaluation.analysis,
      follow_up: evaluation.follow_up,
    });

    // Detect red flags
    if (evaluation.score < 0.4) {
      red_flags.push(`Low performance on ${difficulty} question in ${relevantQuestion.category}`);
    }
  }

  // Calculate final assessment
  const avgScore = rounds.reduce((sum, r) => sum + r.score, 0) / rounds.length;
  const technicalRounds = rounds.filter(r => ['Technical', 'System Design', 'Architecture'].includes(r.category));
  const technicalDepth = technicalRounds.length > 0
    ? technicalRounds.reduce((sum, r) => sum + r.score, 0) / technicalRounds.length
    : avgScore;
  const reasoningStrength = rounds.reduce((sum, r) => sum + r.score, 0) / rounds.length;

  let hire_recommendation: string;
  if (avgScore >= 0.8 && red_flags.length === 0) hire_recommendation = 'strong_hire';
  else if (avgScore >= 0.6) hire_recommendation = 'hire';
  else if (avgScore >= 0.4) hire_recommendation = 'consider';
  else hire_recommendation = 'reject';

  // Emit interview event
  eventBus.emit({
    id: generateEventId(),
    type: 'interview.completed',
    timestamp: Date.now(),
    tenant_id: 'default',
    payload: {
      candidate_id: candidate.id,
      score: avgScore,
      technical_depth: technicalDepth,
      reasoning_strength: reasoningStrength,
      red_flags,
    },
  });

  return {
    candidate_id: candidate.id,
    rounds,
    final_assessment: {
      technical_depth: Math.round(technicalDepth * 100) / 100,
      reasoning_strength: Math.round(reasoningStrength * 100) / 100,
      hire_recommendation,
    },
    red_flags,
  };
}

export function getInterviewStats() {
  const log = eventBus.getEventLog();
  const interviews = log.filter(e => e.type === 'interview.completed');
  return {
    total_interviews: interviews.length,
    avg_score: interviews.length > 0
      ? interviews.reduce((sum: number, e: any) => sum + (e.payload?.score || 0), 0) / interviews.length
      : 0,
    total_red_flags: interviews.reduce((sum: number, e: any) => sum + ((e.payload?.red_flags as any[])?.length || 0), 0),
  };
}
