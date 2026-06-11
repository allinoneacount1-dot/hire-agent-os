// lib/scoring/timing.ts — Response Probability Model
// Response_Probability = Activity*0.4 + Engagement_Pattern*0.3 + TimeZone_Fit*0.2 + Past_Response*0.1

export interface TimingInput {
  activityScore: number;      // 0-1: recent online activity
  engagementPattern: number;  // 0-1: historical engagement rate
  timeZoneFit: number;        // 0-1: how well send time matches their timezone
  pastResponseRate: number;   // 0-1: historical response rate
  candidateTimezone: string;
  platform: 'email' | 'linkedin' | 'twitter' | 'github';
}

export interface TimingResult {
  responseProbability: number;
  bestTime: string;
  followUpSchedule: string[];
  confidenceScore: number;
}

const WEIGHTS = {
  activity: 0.4,
  engagement: 0.3,
  timeZone: 0.2,
  pastResponse: 0.1,
};

const BEST_TIMES: Record<string, string[]> = {
  email: ['Tuesday 9:00 AM', 'Wednesday 10:00 AM', 'Thursday 9:00 AM'],
  linkedin: ['Tuesday 8:00 AM', 'Wednesday 12:00 PM', 'Thursday 8:00 AM'],
  twitter: ['Monday 11:00 AM', 'Wednesday 1:00 PM', 'Friday 10:00 AM'],
  github: ['Monday 10:00 AM', 'Wednesday 2:00 PM', 'Friday 11:00 AM'],
};

export function calculateTiming(input: TimingInput): TimingResult {
  const responseProbability = Math.round(
    (input.activityScore * WEIGHTS.activity +
      input.engagementPattern * WEIGHTS.engagement +
      input.timeZoneFit * WEIGHTS.timeZone +
      input.pastResponseRate * WEIGHTS.pastResponse) * 100
  ) / 100;

  const platformTimes = BEST_TIMES[input.platform] || BEST_TIMES.email;
  const bestTime = platformTimes[0];

  const followUpSchedule = [
    'Day 2: Follow-up with additional context',
    'Day 5: Share relevant content/insight',
    'Day 10: Final touchpoint with urgency',
  ];

  const confidenceScore = Math.round(
    (input.activityScore > 0 ? 0.3 : 0) +
      (input.engagementPattern > 0 ? 0.3 : 0) +
      (input.pastResponseRate > 0 ? 0.4 : 0)
  );

  return {
    responseProbability,
    bestTime,
    followUpSchedule,
    confidenceScore,
  };
}
