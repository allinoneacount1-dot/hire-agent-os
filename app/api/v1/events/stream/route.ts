// app/api/v1/events/stream/route.ts
import { NextRequest } from 'next/server';
import { mockCandidates } from '@/mock/candidates.seed';

const eventTypes = [
  { type: 'talent.discovered', message: 'New candidate discovered from {source}' },
  { type: 'skill.inferred', message: 'Skill inferred: {skill} ({confidence}% confidence)' },
  { type: 'candidate.scored', message: 'Candidate scored: {score}% — {recommendation}' },
  { type: 'outreach.sent', message: 'Outreach sent via {channel} ({probability}% response probability)' },
  { type: 'interview.completed', message: 'Interview completed: {score}% — {red_flags} red flags' },
  { type: 'hire.outcome', message: 'Hire outcome: {decision} (prediction error: {error}%)' },
  { type: 'system.feedback', message: 'Model weights updated: {features} adjusted' },
  { type: 'market.update', message: 'Market signal: {skill} demand up {percent}%' },
];

const sources = ['GitHub', 'LinkedIn', 'Stack Overflow', 'Conference', 'Twitter', 'Referral'];
const skills = ['Rust', 'AI/ML', 'React', 'TypeScript', 'Kubernetes', 'Solidity', 'Go', 'Python'];
const channels = ['email', 'LinkedIn', 'Twitter', 'GitHub'];
const recommendations = ['Strong Hire', 'Hire', 'Consider'];
const decisions = ['hired', 'rejected'];

function generateEvent() {
  const template = eventTypes[Math.floor(Math.random() * eventTypes.length)];
  let message = template.message;

  message = message.replace('{source}', sources[Math.floor(Math.random() * sources.length)]);
  message = message.replace('{skill}', skills[Math.floor(Math.random() * skills.length)]);
  message = message.replace('{confidence}', String(Math.floor(60 + Math.random() * 35)));
  message = message.replace('{score}', String(Math.floor(70 + Math.random() * 25)));
  message = message.replace('{recommendation}', recommendations[Math.floor(Math.random() * recommendations.length)]);
  message = message.replace('{channel}', channels[Math.floor(Math.random() * channels.length)]);
  message = message.replace('{probability}', String(Math.floor(40 + Math.random() * 50)));
  message = message.replace('{red_flags}', String(Math.floor(Math.random() * 3)));
  message = message.replace('{decision}', decisions[Math.floor(Math.random() * decisions.length)]);
  message = message.replace('{error}', String(Math.floor(5 + Math.random() * 15)));
  message = message.replace('{features}', String(Math.floor(2 + Math.random() * 4)));
  message = message.replace('{percent}', String(Math.floor(10 + Math.random() * 30)));

  return {
    id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    type: template.type,
    message,
    timestamp: new Date().toISOString(),
  };
}

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send initial event
      const initial = generateEvent();
      controller.enqueue(encoder.encode(`data: ${JSON.stringify(initial)}\n\n`));

      // Send events every 5-10 seconds
      const interval = setInterval(() => {
        const event = generateEvent();
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      }, 5000 + Math.random() * 5000);

      // Cleanup on close
      req.signal.addEventListener('abort', () => {
        clearInterval(interval);
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
