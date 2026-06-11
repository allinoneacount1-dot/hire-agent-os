// lib/scoring/fitment.ts — Fitment Scoring Engine
// FINAL_SCORE = Skill_Fit*0.45 + Project_Depth*0.25 + Domain_Match*0.15 + Behavior_Stability*0.15

export interface FitmentInput {
  candidateSkills: string[];
  requiredSkills: string[];
  projectCount: number;
  maxProjectComplexity: number; // 1-10
  domainExperience: number; // years
  targetDomain: string;
  jobHops: number; // number of job changes in last 5 years
  avgTenure: number; // average years per job
}

export interface FitmentResult {
  finalScore: number;
  confidence: number;
  skillFit: number;
  projectDepth: number;
  domainMatch: number;
  behaviorStability: number;
  strengths: string[];
  risks: string[];
  evidence: string[];
  recommendation: 'strong_hire' | 'hire' | 'consider' | 'reject';
  decision_logic: string;
}

const WEIGHTS = {
  skillFit: 0.45,
  projectDepth: 0.25,
  domainMatch: 0.15,
  behaviorStability: 0.15,
};

export function calculateFitment(input: FitmentInput): FitmentResult {
  const strengths: string[] = [];
  const risks: string[] = [];
  const evidence: string[] = [];

  // 1. Skill Fit (0-1)
  const matchedSkills = input.candidateSkills.filter(s =>
    input.requiredSkills.some(rs => rs.toLowerCase() === s.toLowerCase())
  );
  const skillFit = input.requiredSkills.length > 0
    ? matchedSkills.length / input.requiredSkills.length
    : 0;

  if (skillFit >= 0.8) strengths.push(`Strong skill match: ${matchedSkills.join(', ')}`);
  else if (skillFit >= 0.5) strengths.push(`Moderate skill match: ${matchedSkills.length}/${input.requiredSkills.length}`);
  else risks.push(`Skill gap: only ${matchedSkills.length}/${input.requiredSkills.length} required skills`);

  evidence.push(`Matched ${matchedSkills.length} of ${input.requiredSkills.length} required skills`);

  // 2. Project Depth (0-1)
  const projectDepth = Math.min(
    (input.projectCount / 10) * 0.5 + (input.maxProjectComplexity / 10) * 0.5,
    1
  );

  if (input.maxProjectComplexity >= 8) strengths.push('Led high-complexity projects');
  if (input.projectCount >= 5) strengths.push(`Rich project portfolio (${input.projectCount} projects)`);
  if (input.projectCount < 2) risks.push('Limited project evidence');

  evidence.push(`${input.projectCount} projects, max complexity ${input.maxProjectComplexity}/10`);

  // 3. Domain Match (0-1)
  const domainMatch = Math.min(input.domainExperience / 5, 1);

  if (input.domainExperience >= 3) strengths.push(`${input.domainExperience}+ years in ${input.targetDomain}`);
  if (input.domainExperience < 1) risks.push(`Limited ${input.targetDomain} experience`);

  evidence.push(`${input.domainExperience} years in ${input.targetDomain}`);

  // 4. Behavior Stability (0-1)
  const stabilityScore = Math.min(
    (input.avgTenure / 3) * 0.6 + (Math.max(0, 5 - input.jobHops) / 5) * 0.4,
    1
  );

  if (input.jobHops >= 4) risks.push(`High job mobility: ${input.jobHops} changes in 5 years`);
  if (input.avgTenure >= 3) strengths.push(`Stable tenure: ${input.avgTenure} years average`);
  if (input.avgTenure < 1) risks.push(`Short average tenure: ${input.avgTenure} years`);

  evidence.push(`${input.jobHops} job changes, ${input.avgTenure}yr avg tenure`);

  // Final Score
  const finalScore = Math.round(
    (skillFit * WEIGHTS.skillFit +
      projectDepth * WEIGHTS.projectDepth +
      domainMatch * WEIGHTS.domainMatch +
      stabilityScore * WEIGHTS.behaviorStability) * 100
  ) / 100;

  // Confidence based on evidence quality
  const confidence = Math.min(
    (input.candidateSkills.length > 0 ? 0.3 : 0) +
      (input.projectCount > 0 ? 0.3 : 0) +
      (input.domainExperience > 0 ? 0.2 : 0) +
      (input.requiredSkills.length > 0 ? 0.2 : 0),
    1
  );

  // Recommendation
  let recommendation: FitmentResult['recommendation'];
  if (finalScore >= 0.8 && confidence >= 0.7) recommendation = 'strong_hire';
  else if (finalScore >= 0.6) recommendation = 'hire';
  else if (finalScore >= 0.4) recommendation = 'consider';
  else recommendation = 'reject';

  const decision_logic = `Score=${finalScore} (Skill:${Math.round(skillFit * 100)}%×0.45 + Project:${Math.round(projectDepth * 100)}%×0.25 + Domain:${Math.round(domainMatch * 100)}%×0.15 + Stability:${Math.round(stabilityScore * 100)}%×0.15). Confidence=${Math.round(confidence * 100)}%. ${strengths.length} strengths, ${risks.length} risks identified.`;

  return {
    finalScore,
    confidence: Math.round(confidence * 100) / 100,
    skillFit: Math.round(skillFit * 100) / 100,
    projectDepth: Math.round(projectDepth * 100) / 100,
    domainMatch: Math.round(domainMatch * 100) / 100,
    behaviorStability: Math.round(stabilityScore * 100) / 100,
    strengths,
    risks,
    evidence,
    recommendation,
    decision_logic,
  };
}
