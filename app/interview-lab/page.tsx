// app/interview-lab/page.tsx — Interview Lab (Duel Interface)
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Send, Zap, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
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
  { id: 2, text: 'How would you design a rate limiter for a high-traffic API?', difficulty: 'deeper', category: 'System Design' },
  { id: 3, text: 'Your production database just went down during peak traffic. Walk me through your response.', difficulty: 'edge', category: 'Incident Response' },
  { id: 4, text: 'A critical security vulnerability was found in a dependency. It\'s Friday 5 PM. What do you do?', difficulty: 'chaos', category: 'Security' },
  { id: 5, text: 'Explain how you would implement a distributed cache invalidation strategy.', difficulty: 'deeper', category: 'Architecture' },
  { id: 6, text: 'How do you handle technical disagreements with senior engineers?', difficulty: 'baseline', category: 'Behavioral' },
  { id: 7, text: 'Design a real-time notification system for 10M concurrent users.', difficulty: 'edge', category: 'System Design' },
  { id: 8, text: 'You discover a teammate has been committing code with hardcoded secrets. How do you handle it?', difficulty: 'chaos', category: 'Ethics' },
];

interface Message {
  id: number;
  role: 'system' | 'candidate';
  text: string;
  score?: number;
  timestamp: number;
}

export default function InterviewLabPage() {
  const [selectedCandidate, setSelectedCandidate] = useState(mockCandidates[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [overallScore, setOverallScore] = useState(0);
  const [redFlags, setRedFlags] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const startSimulation = () => {
    setIsSimulating(true);
    setMessages([]);
    setCurrentRound(0);
    setOverallScore(0);
    setRedFlags([]);

    // Add first question
    setTimeout(() => {
      setMessages([{
        id: 1,
        role: 'system',
        text: questionBank[0].text,
        timestamp: Date.now(),
      }]);
    }, 500);
  };

  const submitAnswer = () => {
    const round = currentRound;
    const mockScore = 0.6 + Math.random() * 0.35;

    // Add candidate response
    const responses = [
      "Great question. I'd approach this by first understanding the requirements and constraints...",
      "In my experience, I've dealt with similar challenges. The key is to balance trade-offs...",
      "That's an interesting scenario. Let me think through this systematically...",
      "I've actually faced this exact situation before. Here's what I learned...",
    ];

    setMessages(prev => [...prev, {
      id: prev.length + 1,
      role: 'candidate',
      text: responses[Math.floor(Math.random() * responses.length)],
      score: mockScore,
      timestamp: Date.now(),
    }]);

    setOverallScore(prev => (prev + mockScore) / (prev === 0 ? 1 : 2));

    // Next question or end
    if (round < 3) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          role: 'system',
          text: questionBank[round + 1].text,
          timestamp: Date.now(),
        }]);
        setCurrentRound(round + 1);
      }, 1500);
    } else {
      // End simulation
      setTimeout(() => {
        setIsSimulating(false);
        const flags: string[] = [];
        if (overallScore < 0.5) flags.push('Low technical depth');
        if (Math.random() > 0.7) flags.push('Vague responses');
        setRedFlags(flags);
      }, 2000);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const difficultyColors = {
    baseline: 'text-accent border-accent/30 bg-accent/10',
    deeper: 'text-secondary border-secondary/30 bg-secondary/10',
    edge: 'text-warning border-warning/30 bg-warning/10',
    chaos: 'text-risk border-risk/30 bg-risk/10',
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-display text-text-primary">Interview Lab</h1>
        <p className="text-sm text-text-secondary mt-1">Adaptive Duel Interface — Real Capability Testing</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Candidate Selection + Score */}
        <div className="space-y-4">
          <div className="glass rounded-xl p-4">
            <h2 className="text-xs font-mono text-text-muted uppercase tracking-wider mb-3">Candidate</h2>
            <div className="space-y-2">
              {mockCandidates.slice(0, 5).map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCandidate(c)}
                  className={cn(
                    'w-full flex items-center gap-2 rounded-lg p-2 text-left transition-all border',
                    selectedCandidate.id === c.id ? 'border-accent/30 bg-accent/5' : 'border-transparent hover:bg-bg-card/50'
                  )}
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary/20 text-secondary text-[10px] font-bold">
                    {c.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="text-xs">
                    <div className="text-text-primary font-medium">{c.name}</div>
                    <div className="text-text-muted text-[10px]">{c.role}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Live Score */}
          <div className="glass rounded-xl p-4">
            <h2 className="text-xs font-mono text-text-muted uppercase tracking-wider mb-3">Live Score</h2>
            <div className="text-center">
              <div className="text-3xl font-bold font-mono text-accent">
                {isSimulating ? Math.round(overallScore * 100) : '—'}%
              </div>
              <div className="text-[10px] text-text-muted mt-1">
                {isSimulating ? `Round ${currentRound + 1}/4` : 'Not started'}
              </div>
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

          <button
            onClick={startSimulation}
            disabled={isSimulating}
            className={cn(
              'w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium transition-all',
              isSimulating
                ? 'bg-bg-card border border-border text-text-muted cursor-not-allowed'
                : 'bg-accent/20 border border-accent/30 text-accent hover:bg-accent/30'
            )}
          >
            <Swords className="h-4 w-4" />
            {isSimulating ? 'In Progress...' : 'Start Duel'}
          </button>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-3 glass rounded-xl flex flex-col h-[600px]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <Swords className="h-4 w-4 text-accent" />
              <span className="text-xs font-mono text-text-secondary">Interview Duel — {selectedCandidate.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-mono border', difficultyColors[questionBank[currentRound]?.difficulty || 'baseline'])}>
                {questionBank[currentRound]?.difficulty?.toUpperCase() || 'READY'}
              </span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    'max-w-[80%] rounded-xl p-3',
                    msg.role === 'system'
                      ? 'bg-accent/10 border border-accent/20 mr-auto'
                      : 'bg-secondary/10 border border-secondary/20 ml-auto'
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {msg.role === 'system' ? (
                      <Zap className="h-3 w-3 text-accent" />
                    ) : (
                      <div className="h-3 w-3 rounded-full bg-secondary/30" />
                    )}
                    <span className="text-[10px] font-mono text-text-muted">
                      {msg.role === 'system' ? 'SYSTEM' : 'CANDIDATE'}
                    </span>
                    {msg.score !== undefined && (
                      <span className="text-[10px] font-mono text-success ml-auto">
                        {Math.round(msg.score * 100)}%
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-text-primary">{msg.text}</p>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border p-4">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder={isSimulating ? "Type your answer..." : "Start the duel to begin..."}
                disabled={!isSimulating}
                className="flex-1 rounded-lg border border-border bg-bg-card/50 px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent/40 transition-colors disabled:opacity-50"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && isSimulating) {
                    submitAnswer();
                  }
                }}
              />
              <button
                onClick={submitAnswer}
                disabled={!isSimulating}
                className="flex items-center gap-2 rounded-lg bg-accent/20 border border-accent/30 px-4 py-2.5 text-sm text-accent hover:bg-accent/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
