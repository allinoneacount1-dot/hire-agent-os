// app/api/v1/talent/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { mockCandidates, searchCandidates } from '@/mock/candidates.seed';
import { calculateFitment } from '@/lib/scoring/fitment';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query = '', skills = [], limit = 20 } = body;

    let results = query ? searchCandidates(query) : mockCandidates;

    if (skills.length > 0) {
      results = results.filter(c =>
        skills.some((s: string) => c.skills.some(cs => cs.toLowerCase().includes(s.toLowerCase())))
      );
    }

    results = results.slice(0, limit);

    // Calculate fitment for each
    const candidatesWithScore = results.map(c => {
      const fitment = calculateFitment({
        candidateSkills: c.skills,
        requiredSkills: skills.length > 0 ? skills : ['React', 'TypeScript', 'Node.js'],
        projectCount: c.project_count,
        maxProjectComplexity: c.max_project_complexity,
        domainExperience: c.experience_years,
        targetDomain: c.domain,
        jobHops: c.job_hops_5yr,
        avgTenure: c.avg_tenure_years,
      });

      return {
        id: c.id,
        name: c.name,
        role: c.role,
        location: c.location,
        experience_years: c.experience_years,
        skills: c.skills,
        domain: c.domain,
        signal_strength: c.signal_strength,
        fitment: {
          final_score: fitment.finalScore,
          confidence: fitment.confidence,
          recommendation: fitment.recommendation,
          strengths: fitment.strengths,
          risks: fitment.risks,
        },
        decision_logic: fitment.decision_logic,
      };
    });

    return NextResponse.json({
      ok: true,
      count: candidatesWithScore.length,
      candidates: candidatesWithScore,
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: 'Search failed' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    count: mockCandidates.length,
    candidates: mockCandidates.map(c => ({
      id: c.id,
      name: c.name,
      role: c.role,
      location: c.location,
      signal_strength: c.signal_strength,
    })),
  });
}
