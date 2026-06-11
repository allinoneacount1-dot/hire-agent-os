// lib/scoring/feedback.ts — Feedback Learning Loop
// error = actual - predicted ; new_weight = old_weight + learning_rate * gradient

export interface FeedbackInput {
  candidateId: string;
  decision: 'hired' | 'rejected';
  predictionScores: {
    skillFit: number;
    projectDepth: number;
    domainMatch: number;
    behaviorStability: number;
    finalScore: number;
  };
  realWorldOutcome: {
    performanceScore: number;  // 0-1: actual performance
    retention: number;         // months retained
    satisfactionScore: number; // 0-1: candidate satisfaction
  };
}

export interface FeedbackResult {
  weightUpdates: Array<{ feature: string; oldWeight: number; newWeight: number }>;
  biasDetected: string[];
  insights: string[];
  graphUpdates: string[];
  nextFocus: string[];
}

const LEARNING_RATE = 0.05;

export function processFeedback(input: FeedbackInput): FeedbackResult {
  const { predictionScores, realWorldOutcome } = input;

  // Calculate prediction error
  const error = realWorldOutcome.performanceScore - predictionScores.finalScore;

  // Attribute feature impact (simplified gradient)
  const gradients = {
    skillFit: error * predictionScores.skillFit,
    projectDepth: error * predictionScores.projectDepth,
    domainMatch: error * predictionScores.domainMatch,
    behaviorStability: error * predictionScores.behaviorStability,
  };

  // Current weights (from fitment.ts)
  const currentWeights = {
    skillFit: 0.45,
    projectDepth: 0.25,
    domainMatch: 0.15,
    behaviorStability: 0.15,
  };

  // Update weights
  const weightUpdates = Object.entries(gradients).map(([feature, gradient]) => {
    const oldWeight = currentWeights[feature as keyof typeof currentWeights];
    const newWeight = Math.max(0.05, Math.min(0.6, oldWeight + LEARNING_RATE * gradient));
    return { feature, oldWeight, newWeight: Math.round(newWeight * 100) / 100 };
  });

  // Detect bias
  const biasDetected: string[] = [];
  if (Math.abs(error) > 0.3) {
    biasDetected.push(`Large prediction error (${Math.round(error * 100)}%) — model may be miscalibrated`);
  }
  if (predictionScores.skillFit > 0.8 && realWorldOutcome.performanceScore < 0.5) {
    biasDetected.push('Skill fit overestimated — may be relying too heavily on keyword matching');
  }
  if (predictionScores.behaviorStability < 0.3 && realWorldOutcome.retention > 12) {
    biasDetected.push('Job hopping penalized too heavily — candidate proved stable');
  }

  // Generate insights
  const insights: string[] = [];
  if (error > 0.2) {
    insights.push('Model underestimated candidate — consider raising weights on strong signals');
  } else if (error < -0.2) {
    insights.push('Model overestimated candidate — review scoring criteria');
  }
  if (realWorldOutcome.retention < 6) {
    insights.push('Early departure — review culture fit signals');
  }
  if (realWorldOutcome.satisfactionScore < 0.5) {
    insights.push('Low satisfaction — JD may not match reality');
  }

  // Graph updates
  const graphUpdates = [
    `Update candidate node: performance=${realWorldOutcome.performanceScore}`,
    `Update skill edges: ${Object.keys(gradients).join(', ')}`,
    `Add outcome edge: ${input.candidateId} → ${input.decision}`,
  ];

  // Next focus
  const nextFocus: string[] = [];
  if (biasDetected.length > 0) {
    nextFocus.push('Recalibrate scoring weights based on detected bias');
  }
  if (realWorldOutcome.performanceScore > 0.8) {
    nextFocus.push('Study high-performer patterns for future scoring');
  }
  nextFocus.push('Collect more outcome data for model validation');

  return {
    weightUpdates,
    biasDetected,
    insights,
    graphUpdates,
    nextFocus,
  };
}
