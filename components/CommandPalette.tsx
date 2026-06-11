// components/CommandPalette.tsx — ⌘K Command Palette
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, LayoutDashboard, SearchIcon, Magnet, MessageSquare,
  Swords, BrainCircuit, Zap, ArrowRight,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface CommandItem {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  shortcut?: string;
  action: () => void;
  category: 'navigation' | 'action' | 'system';
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: CommandItem[] = [
    { id: 'dashboard', label: 'Go to Dashboard', description: 'Command Center overview', icon: LayoutDashboard, shortcut: '⌘1', action: () => router.push('/'), category: 'navigation' },
    { id: 'talent-search', label: 'Talent Search', description: 'Scout, Cognition, Fitment', icon: SearchIcon, shortcut: '⌘2', action: () => router.push('/talent-search'), category: 'navigation' },
    { id: 'job-magnet', label: 'Job Magnet', description: 'Reverse hiring & attraction', icon: Magnet, shortcut: '⌘3', action: () => router.push('/job-magnet'), category: 'navigation' },
    { id: 'outreach', label: 'Outreach Console', description: 'Auto-Reachout engine', icon: MessageSquare, shortcut: '⌘4', action: () => router.push('/outreach'), category: 'navigation' },
    { id: 'interview-lab', label: 'Interview Lab', description: 'Adaptive duel interface', icon: Swords, shortcut: '⌘5', action: () => router.push('/interview-lab'), category: 'navigation' },
    { id: 'feedback-engine', label: 'Feedback Engine', description: 'Learning loop dashboard', icon: BrainCircuit, shortcut: '⌘6', action: () => router.push('/feedback-engine'), category: 'navigation' },
    { id: 'run-scout', label: 'Run Scout Scan', description: 'Discover new candidates', icon: Search, action: () => {}, category: 'action' },
    { id: 'send-outreach', label: 'Send Batch Outreach', description: 'Send to top candidates', icon: MessageSquare, action: () => {}, category: 'action' },
    { id: 'system-health', label: 'System Health', description: 'Check all agents status', icon: Zap, action: () => {}, category: 'system' },
  ];

  const filtered = query
    ? commands.filter(c =>
        c.label.toLowerCase().includes(query.toLowerCase()) ||
        c.description.toLowerCase().includes(query.toLowerCase())
      )
    : commands;

  const executeCommand = useCallback((cmd: CommandItem) => {
    cmd.action();
    setIsOpen(false);
    setQuery('');
    setSelectedIndex(0);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
        if (!isOpen) {
          setTimeout(() => inputRef.current?.focus(), 100);
        }
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setQuery('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      executeCommand(filtered[selectedIndex]);
    }
  };

  return (
    <>
      {/* Trigger hint in TopBar area */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-bg/80 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Palette */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="fixed top-[20%] left-1/2 -translate-x-1/2 z-[101] w-full max-w-lg"
            >
              <div className="glass rounded-2xl border border-border-accent overflow-hidden shadow-2xl shadow-accent/10">
                {/* Search Input */}
                <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                  <Search className="h-4 w-4 text-accent shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a command or search..."
                    className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
                    autoFocus
                  />
                  <kbd className="hidden sm:inline-flex h-5 items-center rounded border border-border bg-bg px-1.5 text-[10px] font-mono text-text-muted">
                    ESC
                  </kbd>
                </div>

                {/* Results */}
                <div className="max-h-[300px] overflow-y-auto p-2">
                  {filtered.length === 0 ? (
                    <div className="py-8 text-center text-sm text-text-muted">
                      No commands found
                    </div>
                  ) : (
                    filtered.map((cmd, i) => {
                      const Icon = cmd.icon;
                      return (
                        <button
                          key={cmd.id}
                          onClick={() => executeCommand(cmd)}
                          onMouseEnter={() => setSelectedIndex(i)}
                          className={cn(
                            'w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all',
                            i === selectedIndex
                              ? 'bg-accent/10 border border-accent/20'
                              : 'border border-transparent hover:bg-bg-card/50'
                          )}
                        >
                          <div className={cn(
                            'flex h-8 w-8 items-center justify-center rounded-lg',
                            i === selectedIndex ? 'bg-accent/15' : 'bg-bg-card'
                          )}>
                            <Icon className={cn('h-4 w-4', i === selectedIndex ? 'text-accent' : 'text-text-muted')} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={cn('text-sm font-medium', i === selectedIndex ? 'text-accent' : 'text-text-primary')}>
                              {cmd.label}
                            </div>
                            <div className="text-[10px] text-text-muted truncate">{cmd.description}</div>
                          </div>
                          {cmd.shortcut && (
                            <kbd className="hidden sm:inline-flex h-5 items-center rounded border border-border bg-bg px-1.5 text-[10px] font-mono text-text-muted">
                              {cmd.shortcut}
                            </kbd>
                          )}
                          {i === selectedIndex && (
                            <ArrowRight className="h-3 w-3 text-accent" />
                          )}
                        </button>
                      );
                    })
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-border px-4 py-2 text-[10px] font-mono text-text-muted">
                  <span>↑↓ Navigate</span>
                  <span>↵ Select</span>
                  <span>ESC Close</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
