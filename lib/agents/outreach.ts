// lib/agents/outreach.ts — Agent 2: Auto-Reachout
// Generates personalized messages + optimal send strategy

import { eventBus, generateEventId } from '@/lib/events/bus';
import { calculateTiming } from '@/lib/scoring/timing';
import { type CandidateSeed } from '@/mock/candidates.seed';

export interface OutreachConfig {
  platform: 'email' | 'linkedin' | 'twitter' | 'github';
  tone: 'professional' | 'casual' | 'direct' | 'enthusiastic' | 'challenger';
  auto_send: boolean;
  follow_up_enabled: boolean;
}

const DEFAULT_CONFIG: OutreachConfig = {
  platform: 'email',
  tone: 'professional',
  auto_send: true,
  follow_up_enabled: true,
};

// Generate personalized message based on candidate data
function generateMessage(candidate: CandidateSeed, tone: string): string {
  const firstName = candidate.name.split(' ')[0];
  const topSkills = candidate.skills.slice(0, 3).join(', ');
  const domain = candidate.domain;

  const hooks: Record<string, string> = {
    professional: `I came across your profile and was impressed by your expertise in ${domain}.`,
    casual: `Hey ${firstName}! Your work in ${domain} caught my eye.`,
    direct: `${firstName}, your ${domain} experience is exactly what we're looking for.`,
    enthusiastic: `Wow ${firstName} — your background in ${domain} is incredible!`,
    challenger: `${firstName}, here's a challenge: can you build the future of hiring AI?`,
  };

  const bodies: Record<string, string> = {
    professional: `With your ${candidate.experience_years}+ years of experience in ${topSkills}, you'd be a strong fit for our team. We're building an AI-powered talent intelligence platform that's redefining how companies discover and evaluate talent.`,
    casual: `We're working on something pretty exciting — an AI hiring platform. Given your skills in ${topSkills}, I think you'd love what we're building.`,
    direct: `We're hiring a ${candidate.role}. ${topSkills} — that's exactly what we need. Interested in a quick chat?`,
    enthusiastic: `We're creating the next generation of AI hiring technology! Your experience in ${topSkills} makes you a dream candidate. Want to hear more?`,
    challenger: `Most hiring is broken. We're fixing it with AI. Your ${topSkills} skills + our mission = something extraordinary. Ready to prove what you've got?`,
  };

  const closings: Record<string, string> = {
    professional: `\n\nWould you be open to a brief conversation this week?\n\nBest regards,\nHIRE AGENT Team`,
    casual: `\n\nWant to chat? No pressure, just good vibes and interesting tech.\n\nCheers!\nHIRE AGENT`,
    direct: `\n\nLet me know if you're in.\n\n— HIRE AGENT`,
    enthusiastic: `\n\nLet's build something amazing together! 🚀\n\n— The HIRE AGENT Team`,
    challenger: `\n\nThink you can handle it? Let's find out.\n\n— HIRE AGENT`,
  };

  return `${hooks[tone] || hooks.professional}\n\n${bodies[tone] || bodies.professional}${closings[tone] || closings.professional}`;
}

// Run outreach for a list of candidates
export function runOutreach(
  candidates: CandidateSeed[],
  config: Partial<OutreachConfig> = {}
): Array<{ candidate: CandidateSeed; message: string; subject: string; timing: ReturnType<typeof calculateTiming>; sent: boolean }> {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const results = [];

  for (const candidate of candidates) {
    const message = generateMessage(candidate, cfg.tone);
    const subject = `Opportunity: ${candidate.role} — AI Hiring Platform`;
    const timing = calculateTiming({
      activityScore: 0.7 + Math.random() * 0.3,
      engagementPattern: 0.5 + Math.random() * 0.4,
      timeZoneFit: 0.8,
      pastResponseRate: 0.3 + Math.random() * 0.4,
      candidateTimezone: candidate.timezone,
      platform: cfg.platform,
    });

    // Emit outreach event
    eventBus.emit({
      id: generateEventId(),
      type: 'outreach.sent',
      timestamp: Date.now(),
      tenant_id: 'default',
      payload: {
        candidate_id: candidate.id,
        channel: cfg.platform,
        response_probability: timing.responseProbability,
        message_id: `msg_${generateEventId()}`,
      },
    });

    results.push({ candidate, message, subject, timing, sent: cfg.auto_send });
  }

  return results;
}

// Simulate response (for mock)
export function simulateResponse(candidateId: string, responseType: 'positive' | 'negative' | 'neutral'): void {
  eventBus.emit({
    id: generateEventId(),
    type: 'outreach.responded',
    timestamp: Date.now(),
    tenant_id: 'default',
    payload: {
      candidate_id: candidateId,
      message_id: `msg_${Date.now()}`,
      response_type: responseType,
      response_time_minutes: Math.floor(Math.random() * 720) + 30,
    },
  });
}

export function getOutreachStats() {
  const log = eventBus.getEventLog();
  const sent = log.filter(e => e.type === 'outreach.sent');
  const responded = log.filter(e => e.type === 'outreach.responded');
  return {
    total_sent: sent.length,
    total_responded: responded.length,
    response_rate: sent.length > 0 ? responded.length / sent.length : 0,
    positive: responded.filter((e: any) => e.payload?.response_type === 'positive').length,
    negative: responded.filter((e: any) => e.payload?.response_type === 'negative').length,
    neutral: responded.filter((e: any) => e.payload?.response_type === 'neutral').length,
  };
}
