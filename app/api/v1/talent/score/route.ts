// app/api/v1/talent/score/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCandidateById } from '@/mock/candidates.seed';
import { calculateFitment } from '@/lib/scoring/fitment';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { candidate_id, required_skills = [], target_domain = 'SaaS' } = body;

    const candidate = getCandidateById(candidate_id);
    if (!candidate) {
      return NextResponse.json({ ok: false, error: 'Candidate not found' }, { status: 404 });
    }

    const fitment = calculateFitment({
      candidateSkills: candidate.skills,
      requiredSkills: required_skills,
      projectCount: candidate.project_count,
      maxProjectComplexity: candidate.max_project_complexity,
      domainExperience: candidate.experience_years,
      targetDomain: target_domain,
      jobHops: candidate.job_hops_5yr,
      avgTenure: candidate.avg_tenure_years,
    });

    return NextResponse.json({
      ok: true,
      candidate: {
        id: candidate.id,
        name: candidate.name,
        role: candidate.role,
      },
      fitment: {
        final_score: fitment.finalScore,
        confidence: fitment.confidence,
        skill_fit: fitment.skillFit,
        project_depth: fitment.projectDepth,
        domain_match: fitment.domainMatch,
        behavior_stability: fitment.behaviorStability,
        recommendation: fitment.recommendation,
        strengths: fitment.strengths,
        risks: fitment.risks,
        evidence: fitment.evidence,
        decision_logic: fitment.decision_logic,
      },
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: 'Scoring failed' }, { status: 500 });
  }
}
