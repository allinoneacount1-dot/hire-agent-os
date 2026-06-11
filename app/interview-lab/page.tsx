// app/interview-lab/page.tsx — Interview Lab v2 (Improved Duel)
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Send, Zap, AlertTriangle, CheckCircle, Clock, RotateCcw, Trophy, Skull } from 'lucide-react';
import { mockCandidates } from '@/mock/candidates.seed';
import { cn } from '@/lib/utils';

interface Question {
  id: number;
  text: string;
  difficulty: 'baseline' | 'deeper' | 'edge' | 'chaos';
  category: string;
}

const questionBank: Question[] = [
  { id: 1, text: 'Explain the difference between SQL and NoSQL databases. When would you choose one over the other?', difficulty: 'baseline', category: 'Technical' },
  { id: 2, text: 'How would you design a rate limiter for a high-traffic API handling 100K requests per second?', difficulty: 'deeper', category: 'System Design' },
  { id: 3, text: 'Your production database just went down during peak traffic. Walk me through your incident response.', difficulty: 'edge', category: 'Incident Response' },
  { id: 4, text: 'A critical zero-day vulnerability was found in a core dependency. It\'s Friday 5 PM. What do you do?', difficulty: 'chaos', category: 'Security' },
  { id: 5, text: 'Design a distributed cache invalidation strategy for a global e-commerce platform.', difficulty: 'deeper', category: 'Architecture' },
  { id: 6, text: 'How do you handle technical disagreements with senior engineers who have more experience?', difficulty: 'baseline', category: 'Behavioral' },
  { id: 7, text: 'Design a real-time notification system for 10M concurrent users with exactly-once delivery guarantees.', difficulty: 'edge', category: 'System Design' },
  { id: 8, text: 'You discover a teammate has been committing code with hardcoded secrets to a public repo. How do you handle it?', difficulty: 'chaos', category: 'Ethics' },
];

interface DuelMessage {
  id: number;
  role: 'system' | 'candidate';
  text: string;
  displayedText?: string;
  score?: number;
  timestamp: number;
}

// Typing animation component
function TypingText({ text, onComplete, speed = 30 }: { text: string; onComplete?: () => void; speed?: number }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setDone(true);
        onComplete?.();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span>
      {displayed}
      {!done && <span className="inline-block w-0.5 h-4 bg-accent ml-0.5 animate-pulse" />}
    </span>
  );
}

const difficultyConfig = {
  baseline: { color: 'text-accent border-accent/30 bg-accent/10', label: 'R1 — Baseline', icon: '◆' },
  deeper: { color: 'text-secondary border-secondary/30 bg-secondary/10', label: 'R2 — Deeper', icon: '◆◆' },
  edge: { color: 'text-warning border-warning/30 bg-warning/10', label: 'R3 — Edge Case', icon: '◆◆◆' },
  chaos: { color: 'text-risk border-risk/30 bg-risk/10', label: 'R4 — Chaos', icon: '◆◆◆◆' },
};

const candidateResponses = [
  "Great question. I'd approach this by first understanding the specific requirements and constraints. In my experience, the key is to balance trade-offs between consistency, availability, and partition tolerance. For a rate limiter specifically, I'd consider a token bucket algorithm with Redis as the backing store...",
  "That's an interesting scenario. Let me think through this systematically. First, I'd assess the blast radius — what services are affected? Then I'd initiate our incident response protocol: page the on-call engineer, start a war room, and begin systematic debugging...",
  "I've actually faced this exact situation before at my previous company. We had a similar zero-day in a logging library. What worked well was: 1) Immediately assess exposure, 2) Implement a WAF rule as a stopgap, 3) Coordinate with the security team for patching...",
  "This touches on both technical and ethical dimensions. First, I'd immediately secure the repo and rotate any exposed secrets. Then I'd have a private conversation with the teammate — they may not have realized the impact. Finally, I'd push for better tooling like git-secrets hooks...",
];

export default function InterviewLabPage() {
  const [selectedCandidate, setSelectedCandidate] = useState(mockCandidates[0]);
  const [messages, setMessages] = useState<DuelMessage[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [overallScore, setOverallScore] = useState(0);
  const [redFlags, setRedFlags] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [duelActive, setDuelActive] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  const startDuel = () => {
    setDuelActive(true);
    setShowResults(false);
    setMessages([]);
    setCurrentRound(0);
    setOverallScore(0);
    setRedFlags([]);

    // Opening message
    setTimeout(() => {
      setMessages([{
        id: 1,
        role: 'system',
        text: `⚔️ DUEL INITIATED — Testing ${selectedCandidate.name} for ${selectedCandidate.role}`,
        timestamp: Date.now(),
      }]);
    }, 500);

    // First question
    setTimeout(() => {
      addQuestion(0);
    }, 2000);
  };

  const addQuestion = (round: number) => {
    if (round >= 4) {
      finishDuel();
      return;
    }
    const q = questionBank[round];
    setMessages(prev => [...prev, {
      id: prev.length + 1,
      role: 'system',
      text: q.text,
      timestamp: Date.now(),
    }]);
    setIsTyping(false);
  };

  const submitAnswer = () => {
    if (isTyping) return;
    setIsTyping(true);

    const round = currentRound;
    const mockScore = 0.55 + Math.random() * 0.4;
    const response = candidateResponses[Math.floor(Math.random() * candidateResponses.length)];

    setMessages(prev => [...prev, {
      id: prev.length + 1,
      role: 'candidate',
      text: response,
      score: mockScore,
      timestamp: Date.now(),
    }]);

    setOverallScore(prev => prev === 0 ? mockScore : (prev + mockScore) / 2);

    // Next question after delay
    setTimeout(() => {
      setCurrentRound(round + 1);
      addQuestion(round + 1);
    }, 6000);
  };

  const finishDuel = () => {
    setIsTyping(false);
    const finalScore = overallScore;
    const flags: string[] = [];
    if (finalScore < 0.6) flags.push('Low technical depth detected');
    if (finalScore < 0.5) flags.push('Vague or evasive responses');
    if (Math.random() > 0.7) flags.push('Inconsistent experience claims');
    setRedFlags(flags);

    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        role: 'system',
        text: `⚔️ DUEL COMPLETE — Final Score: ${Math.round(finalScore * 100)}%`,
        score: finalScore,
        timestamp: Date.now(),
      }]);
      setShowResults(true);
      setDuelActive(false);
    }, 2000);
  };

  const resetDuel = () => {
    setShowResults(false);
    setMessages([]);
    setCurrentRound(0);
    setOverallScore(0);
    setRedFlags([]);
    setDuelActive(false);
    setIsTyping(false);
  };

  const currentDifficulty = questionBank[currentRound]?.difficulty || 'baseline';
  const diffConfig = difficultyConfig[currentDifficulty];

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-display text-text-primary flex items-center gap-3">
              Interview Lab
              {duelActive && (
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-risk/10 border border-risk/25 text-[10px] font-mono text-risk">
                  <span className="h-1.5 w-1.5 rounded-full bg-risk animate-pulse" />
                  DUEL ACTIVE
                </span>
              )}
            </h1>
            <p className="text-sm text-text-secondary mt-1">Adaptive Duel Interface — Real Capability Testing</p>
          </div>
          {showResults && (
            <button
              onClick={resetDuel}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-accent/25 bg-accent/10 text-xs font-mono text-accent hover:bg-accent/20 transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              New Duel
            </button>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left Panel — Candidate + Controls */}
        <div className="space-y-4">
          {/* Candidate Card */}
          <div className="glass rounded-xl p-4">
            <h2 className="text-xs font-mono text-text-muted uppercase tracking-wider mb-3">Opponent</h2>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/20 text-secondary text-lg font-bold">
                {selectedCandidate.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div className="text-sm font-bold text-text-primary">{selectedCandidate.name}</div>
                <div className="text-[10px] text-text-muted">{selectedCandidate.role}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="rounded-lg bg-bg-card/50 p-2 border border-border">
                <div className="text-text-muted">Experience</div>
                <div className="font-mono font-bold text-text-primary">{selectedCandidate.experience_years}yr</div>
              </div>
              <div className="rounded-lg bg-bg-card/50 p-2 border border-border">
                <div className="text-text-muted">Signal</div>
                <div className="font-mono font-bold text-success">{Math.round(selectedCandidate.signal_strength * 100)}%</div>
              </div>
            </div>
          </div>

          {/* Live Score */}
          <div className="glass rounded-xl p-4">
            <h2 className="text-xs font-mono text-text-muted uppercase tracking-wider mb-3">Score</h2>
            <div className="text-center mb-3">
              <div className={cn('text-4xl font-bold font-mono transition-colors',
                overallScore >= 0.8 ? 'text-success' :
                overallScore >= 0.6 ? 'text-accent' :
                overallScore >= 0.4 ? 'text-warning' : 'text-text-muted'
              )}>
                {duelActive || showResults ? Math.round(overallScore * 100) : '—'}%
              </div>
              <div className="text-[10px] text-text-muted mt-1">
                {duelActive ? `Round ${currentRound + 1}/4` : showResults ? 'Complete' : 'Ready'}
              </div>
            </div>
            {/* Score bar */}
            <div className="h-2 rounded-full bg-bg overflow-hidden">
              <motion.div
                className={cn('h-full rounded-full',
                  overallScore >= 0.8 ? 'bg-success' :
                  overallScore >= 0.6 ? 'bg-accent' : 'bg-warning'
                )}
                animate={{ width: `${(duelActive || showResults) ? overallScore * 100 : 0}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            {redFlags.length > 0 && (
              <div className="mt-3 space-y-1">
                {redFlags.map((flag, i) => (
                  <div key={i} className="flex items-center gap-1 text-[10px] text-risk">
                    <AlertTriangle className="h-3 w-3" />
                    {flag}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Start Button */}
          {!duelActive && !showResults && (
            <button
              onClick={startDuel}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium bg-accent/20 border border-accent/30 text-accent hover:bg-accent/30 transition-all"
            >
              <Swords className="h-4 w-4" />
              Start Duel
            </button>
          )}
        </div>

        {/* Right — Chat Interface */}
        <div className="lg:col-span-3 glass rounded-xl flex flex-col h-[600px]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-3">
              <Swords className="h-4 w-4 text-accent" />
              <span className="text-xs font-mono text-text-secondary">Interview Duel</span>
              <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-mono border', diffConfig.color)}>
                {diffConfig.label}
              </span>
            </div>
            {duelActive && (
              <div className="flex items-center gap-1 text-[10px] font-mono text-text-muted">
                <Clock className="h-3 w-3" />
                Round {currentRound + 1}/4
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    'max-w-[85%] rounded-xl p-4',
                    msg.role === 'system'
                      ? 'bg-accent/5 border border-accent/15 mr-auto'
                      : 'bg-secondary/5 border border-secondary/15 ml-auto'
                  )}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {msg.role === 'system' ? (
                      <Zap className="h-3.5 w-3.5 text-accent shrink-0" />
                    ) : (
                      <div className="h-3.5 w-3.5 rounded-full bg-secondary/30 flex items-center justify-center text-[8px] text-secondary font-bold shrink-0">
                        C
                      </div>
                    )}
                    <span className="text-[10px] font-mono text-text-muted">
                      {msg.role === 'system' ? 'SYSTEM ATTACK' : 'CANDIDATE'}
                    </span>
                    {msg.score !== undefined && (
                      <span className="text-[10px] font-mono text-success ml-auto flex items-center gap-1">
                        <Trophy className="h-3 w-3" />
                        {Math.round(msg.score * 100)}%
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-text-primary leading-relaxed">
                    {msg.role === 'system' && isTyping && msg === messages[messages.length - 1] ? (
                      <TypingText text={msg.text} speed={20} />
                    ) : msg.role === 'candidate' && isTyping && msg === messages[messages.length - 1] ? (
                      <TypingText text={msg.text} speed={25} />
                    ) : (
                      msg.text
                    )}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Results */}
            <AnimatePresence>
              {showResults && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    'rounded-xl p-5 border text-center',
                    overallScore >= 0.7 ? 'bg-success/5 border-success/20' :
                    overallScore >= 0.5 ? 'bg-warning/5 border-warning/20' : 'bg-risk/5 border-risk/20'
                  )}
                >
                  <div className="text-3xl mb-2">
                    {overallScore >= 0.7 ? '🏆' : overallScore >= 0.5 ? '⚡' : '💀'}
                  </div>
                  <div className="text-lg font-bold font-mono text-text-primary">
                    {overallScore >= 0.7 ? 'STRONG HIRE' : overallScore >= 0.5 ? 'CONSIDER' : 'REJECT'}
                  </div>
                  <div className="text-xs text-text-muted mt-1">
                    Final Score: {Math.round(overallScore * 100)}%
                  </div>
                  {redFlags.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {redFlags.map((flag, i) => (
                        <div key={i} className="text-[11px] text-risk flex items-center justify-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {flag}
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border p-4">
            {duelActive ? (
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Type your answer then press Enter or Send..."
                  disabled={isTyping}
                  className="flex-1 rounded-lg border border-border bg-bg-card/50 px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent/40 transition-colors disabled:opacity-50"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isTyping) {
                      submitAnswer();
                    }
                  }}
                />
                <button
                  onClick={submitAnswer}
                  disabled={isTyping}
                  className={cn(
                    'flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm transition-all',
                    isTyping
                      ? 'bg-bg-card border border-border text-text-muted cursor-not-allowed'
                      : 'bg-accent/20 border border-accent/30 text-accent hover:bg-accent/30'
                  )}
                >
                  <Send className="h-3.5 w-3.5" />
                  {isTyping ? 'Typing...' : 'Send'}
                </button>
              </div>
            ) : (
              <div className="text-center text-xs text-text-muted">
                {showResults ? 'Duel complete. Click "New Duel" to start again.' : 'Click "Start Duel" to begin the interview simulation.'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
