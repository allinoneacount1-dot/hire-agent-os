// lib/scoring/attraction.ts — Talent Magnet Attraction Model
// ATTRACTION = Challenge*0.3 + Growth*0.25 + Tech_Excitement*0.2 + Autonomy*0.15 + Compensation*0.1

export interface AttractionInput {
  challengeScore: number;      // 0-1: how challenging is the role
  growthScore: number;         // 0-1: career growth potential
  techExcitement: number;      // 0-1: how exciting is the tech stack
  autonomyScore: number;       // 0-1: level of autonomy
  compensationScore: number;   // 0-1: compensation competitiveness
}

export interface AttractionResult {
  attractionScore: number;
  matchStrength: number;
  whyItAttracts: string[];
  suggestions: string[];
}

const WEIGHTS = {
  challenge: 0.3,
  growth: 0.25,
  tech: 0.2,
  autonomy: 0.15,
  compensation: 0.1,
};

export function calculateAttraction(input: AttractionInput): AttractionResult {
  const attractionScore = Math.round(
    (input.challengeScore * WEIGHTS.challenge +
      input.growthScore * WEIGHTS.growth +
      input.techExcitement * WEIGHTS.tech +
      input.autonomyScore * WEIGHTS.autonomy +
      input.compensationScore * WEIGHTS.compensation) * 100
  ) / 100;

  const whyItAttracts: string[] = [];
  const suggestions: string[] = [];

  if (input.challengeScore >= 0.7) whyItAttracts.push('High-impact challenging work');
  else suggestions.push('Emphasize the challenging aspects of the role');

  if (input.growthScore >= 0.7) whyItAttracts.push('Clear career growth trajectory');
  else suggestions.push('Add growth path and learning opportunities');

  if (input.techExcitement >= 0.7) whyItAttracts.push('Cutting-edge technology stack');
  else suggestions.push('Highlight modern tech and innovation');

  if (input.autonomyScore >= 0.7) whyItAttracts.push('High autonomy and ownership');
  else suggestions.push('Emphasize ownership and decision-making freedom');

  if (input.compensationScore >= 0.7) whyItAttracts.push('Competitive compensation package');
  else suggestions.push('Consider improving comp transparency');

  return {
    attractionScore,
    matchStrength: attractionScore,
    whyItAttracts,
    suggestions,
  };
}
