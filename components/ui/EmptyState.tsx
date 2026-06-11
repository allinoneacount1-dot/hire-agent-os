// components/ui/EmptyState.tsx
'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Search, Inbox, FileText, Users, MessageSquare, BrainCircuit } from 'lucide-react';

interface EmptyStateProps {
  icon?: 'search' | 'inbox' | 'file' | 'users' | 'message' | 'brain';
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const iconMap = {
  search: Search,
  inbox: Inbox,
  file: FileText,
  users: Users,
  message: MessageSquare,
  brain: BrainCircuit,
};

export function EmptyState({
  icon = 'inbox',
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const Icon = iconMap[icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex flex-col items-center justify-center py-16 px-8 text-center',
        className
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-bg-card border border-border mb-4">
        <Icon className="h-7 w-7 text-text-muted" />
      </div>
      <h3 className="text-base font-semibold text-text-primary mb-1">{title}</h3>
      <p className="text-sm text-text-muted max-w-sm mb-4">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="flex items-center gap-2 rounded-lg bg-accent/10 border border-accent/25 px-4 py-2 text-sm font-medium text-accent hover:bg-accent/20 transition-colors"
        >
          {action.label}
        </button>
      )}
    </motion.div>
  );
}

export function NoSearchResults({ query }: { query: string }) {
  return (
    <EmptyState
      icon="search"
      title="No results found"
      description={`We couldn't find anything matching "${query}". Try different keywords or broaden your search.`}
    />
  );
}

export function NoCandidates() {
  return (
    <EmptyState
      icon="users"
      title="No candidates yet"
      description="Start by searching for talent or importing candidates from your ATS."
      action={{ label: 'Search Talent', onClick: () => {} }}
    />
  );
}

export function NoMessages() {
  return (
    <EmptyState
      icon="message"
      title="No messages yet"
      description="Your outreach messages will appear here once you start engaging candidates."
    />
  );
}

export function NoFeedback() {
  return (
    <EmptyState
      icon="brain"
      title="No feedback data yet"
      description="Feedback from hiring outcomes will appear here to help improve the scoring model."
    />
  );
}
