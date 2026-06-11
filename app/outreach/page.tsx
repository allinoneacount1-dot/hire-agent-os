// app/outreach/page.tsx — Outreach Console
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Clock, Sparkles, ChevronRight, Mail, Link, FolderGit, MessageSquare } from 'lucide-react';
import { mockCandidates } from '@/mock/candidates.seed';
import { calculateTiming } from '@/lib/scoring/timing';
import { cn } from '@/lib/utils';

const platforms = [
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'linkedin', label: 'LinkedIn', icon: Link },
  { id: 'twitter', label: 'Twitter', icon: MessageSquare },
  { id: 'github', label: 'GitHub', icon: FolderGit },
] as const;

const tones = ['Professional', 'Casual', 'Direct', 'Enthusiastic', 'Challenger'];

export default function OutreachPage() {
  const [selectedCandidate, setSelectedCandidate] = useState(mockCandidates[0]);
  const [platform, setPlatform] = useState<'email' | 'linkedin' | 'twitter' | 'github'>('email');
  const [tone, setTone] = useState('Professional');
  const [message, setMessage] = useState('');
  const [generated, setGenerated] = useState(false);

  const timing = calculateTiming({
    activityScore: 0.8,
    engagementPattern: 0.7,
    timeZoneFit: 0.9,
    pastResponseRate: 0.6,
    candidateTimezone: selectedCandidate.timezone,
    platform,
  });

  const handleGenerate = () => {
    setGenerated(true);
    setMessage(`Hi ${selectedCandidate.name.split(' ')[0]},

I came across your profile and was impressed by your work in ${selectedCandidate.domain.toLowerCase()}. Your experience with ${selectedCandidate.skills.slice(0, 3).join(', ')} really stands out.

We're building something exciting at HIRE AGENT OS — an AI-powered talent intelligence platform that's redefining how companies find and evaluate talent. Given your background, I think you'd be a fantastic fit for our ${selectedCandidate.role} position.

Would you be open to a quick chat this week?

Best,
HIRE AGENT Team`);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-display text-text-primary">Outreach Console</h1>
        <p className="text-sm text-text-secondary mt-1">Auto-Reachout Engine — Personalized Communication</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Candidate Selection */}
        <div className="glass rounded-xl p-4">
          <h2 className="text-xs font-mono text-text-muted uppercase tracking-wider mb-3">Select Candidate</h2>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {mockCandidates.slice(0, 6).map(c => (
              <button
                key={c.id}
                onClick={() => { setSelectedCandidate(c); setGenerated(false); }}
                className={cn(
                  'w-full flex items-center gap-3 rounded-lg p-2.5 text-left transition-all border',
                  selectedCandidate.id === c.id
                    ? 'border-accent/30 bg-accent/5'
                    : 'border-transparent hover:bg-bg-card/50'
                )}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/20 text-secondary text-xs font-bold shrink-0">
                  {c.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-text-primary truncate">{c.name}</div>
                  <div className="text-[10px] text-text-muted truncate">{c.role}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Message Composer */}
        <div className="lg:col-span-2 space-y-4">
          {/* Platform & Tone */}
          <div className="glass rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-mono text-text-muted uppercase tracking-wider">Platform & Tone</h2>
              <div className="flex items-center gap-2 text-xs text-accent">
                <Sparkles className="h-3 w-3" />
                <span className="font-mono">AI-Assisted</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-2 block">Platform</label>
                <div className="grid grid-cols-4 gap-2">
                  {platforms.map(p => {
                    const Icon = p.icon;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setPlatform(p.id)}
                        className={cn(
                          'flex flex-col items-center gap-1 rounded-lg p-2 border text-xs transition-all',
                          platform === p.id
                            ? 'border-accent/30 bg-accent/10 text-accent'
                            : 'border-border bg-bg-card/50 text-text-muted hover:border-accent/20'
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-[10px]">{p.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-2 block">Tone</label>
                <div className="flex flex-wrap gap-1.5">
                  {tones.map(t => (
                    <button
                      key={t}
                      onClick={() => setTone(t)}
                      className={cn(
                        'px-2.5 py-1 rounded-full border text-[11px] transition-all',
                        tone === t
                          ? 'border-secondary/30 bg-secondary/10 text-secondary'
                          : 'border-border bg-bg-card/50 text-text-muted hover:border-secondary/20'
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Message Editor */}
          <div className="glass rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-mono text-text-muted uppercase tracking-wider">Message</h2>
              <button
                onClick={handleGenerate}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/25 text-xs font-mono text-accent hover:bg-accent/20 transition-colors"
              >
                <Sparkles className="h-3 w-3" />
                Generate
              </button>
            </div>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Click 'Generate' to create a personalized outreach message, or write your own..."
              className="w-full h-48 rounded-lg border border-border bg-bg-card/30 p-3 text-sm text-text-primary placeholder:text-text-muted outline-none resize-none focus:border-accent/40 transition-colors"
            />

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-4 text-[10px] font-mono text-text-muted">
                <span>{message.length} chars</span>
                <span>~{Math.ceil(message.split(' ').length / 200)} min read</span>
              </div>
              <button
                disabled={!message}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  message
                    ? 'bg-accent/20 border border-accent/30 text-accent hover:bg-accent/30'
                    : 'bg-bg-card border border-border text-text-muted cursor-not-allowed'
                )}
              >
                <Send className="h-3.5 w-3.5" />
                Send
              </button>
            </div>
          </div>

          {/* Timing & Preview */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-4 w-4 text-accent" />
                <h3 className="text-xs font-mono text-text-muted uppercase tracking-wider">Optimal Timing</h3>
              </div>
              <div className="text-lg font-bold font-mono text-text-primary">{timing.bestTime}</div>
              <div className="text-xs text-text-muted mt-1">
                Response probability: <span className="text-success font-mono">{Math.round(timing.responseProbability * 100)}%</span>
              </div>
              <div className="mt-3 space-y-1">
                {timing.followUpSchedule.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px] text-text-muted">
                    <ChevronRight className="h-3 w-3 text-text-muted" />
                    {f}
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-xl p-4">
              <h3 className="text-xs font-mono text-text-muted uppercase tracking-wider mb-3">Personalization</h3>
              <div className="space-y-2">
                <div className="text-[11px] text-text-secondary">
                  ✓ References {selectedCandidate.domain} experience
                </div>
                <div className="text-[11px] text-text-secondary">
                  ✓ Mentions {selectedCandidate.skills.slice(0, 2).join(' & ')}
                </div>
                <div className="text-[11px] text-text-secondary">
                  ✓ {selectedCandidate.experience_years} years experience acknowledged
                </div>
                <div className="text-[11px] text-text-secondary">
                  ✓ {tone.toLowerCase()} tone applied
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
