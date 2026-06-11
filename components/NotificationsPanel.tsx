// components/NotificationsPanel.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Check, Trash2, Settings, UserPlus, Star, MessageSquare, Swords, BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'candidate' | 'score' | 'outreach' | 'interview' | 'feedback' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'candidate',
    title: 'New candidate discovered',
    message: 'Sarah Chen — Senior Full-Stack Engineer from GitHub',
    time: '2 min ago',
    read: false,
  },
  {
    id: 'n2',
    type: 'score',
    title: 'High-fit candidate alert',
    message: 'James Wright scored 95% — Strong Hire recommendation',
    time: '5 min ago',
    read: false,
  },
  {
    id: 'n3',
    type: 'outreach',
    title: 'Outreach response received',
    message: 'Marcus Johnson replied positively to your message',
    time: '12 min ago',
    read: false,
  },
  {
    id: 'n4',
    type: 'interview',
    title: 'Interview completed',
    message: 'Aiko Tanaka completed interview simulation — Score: 88%',
    time: '18 min ago',
    read: true,
  },
  {
    id: 'n5',
    type: 'feedback',
    title: 'Model weights updated',
    message: 'Feedback loop adjusted Skill Fit weight: 0.45 → 0.47',
    time: '25 min ago',
    read: true,
  },
  {
    id: 'n6',
    type: 'system',
    title: 'System update available',
    message: 'HIRE AGENT OS v1.1.0 is now available',
    time: '1 hour ago',
    read: true,
  },
];

const typeIcons = {
  candidate: UserPlus,
  score: Star,
  outreach: MessageSquare,
  interview: Swords,
  feedback: BrainCircuit,
  system: Bell,
};

const typeColors = {
  candidate: 'text-secondary bg-secondary/10',
  score: 'text-success bg-success/10',
  outreach: 'text-accent bg-accent/10',
  interview: 'text-warning bg-warning/10',
  feedback: 'text-secondary bg-secondary/10',
  system: 'text-text-muted bg-bg-card',
};

export function NotificationsPanel({ onClose }: { onClose: () => void }) {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filtered = filter === 'unread' ? notifications.filter(n => !n.read) : notifications;
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className="absolute right-0 top-12 w-96 glass rounded-xl border border-border shadow-2xl z-50 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-accent" />
          <span className="text-sm font-semibold text-text-primary">Notifications</span>
          {unreadCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-bg">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={markAllRead}
            className="flex h-7 w-7 items-center justify-center rounded text-text-muted hover:text-text-secondary transition-colors"
            title="Mark all read"
          >
            <Check className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded text-text-muted hover:text-text-secondary transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-2">
        <button
          onClick={() => setFilter('all')}
          className={cn(
            'px-2.5 py-1 rounded-full text-[11px] font-mono transition-colors',
            filter === 'all' ? 'bg-accent/10 text-accent' : 'text-text-muted hover:text-text-secondary'
          )}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={cn(
            'px-2.5 py-1 rounded-full text-[11px] font-mono transition-colors',
            filter === 'unread' ? 'bg-accent/10 text-accent' : 'text-text-muted hover:text-text-secondary'
          )}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      <div className="max-h-80 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="py-8 text-center">
            <Bell className="h-8 w-8 text-text-muted mx-auto mb-2" />
            <p className="text-xs text-text-muted">No notifications</p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {filtered.map(notification => {
              const Icon = typeIcons[notification.type];
              const colorClass = typeColors[notification.type];

              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={cn(
                    'flex items-start gap-3 px-4 py-3 hover:bg-bg-card/30 transition-colors cursor-pointer',
                    !notification.read && 'bg-accent/5'
                  )}
                  onClick={() => markRead(notification.id)}
                >
                  <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg shrink-0', colorClass)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={cn('text-xs font-medium', notification.read ? 'text-text-secondary' : 'text-text-primary')}>
                        {notification.title}
                      </span>
                      {!notification.read && (
                        <div className="h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-text-muted mt-0.5 line-clamp-2">{notification.message}</p>
                    <span className="text-[10px] text-text-muted mt-1 block">{notification.time}</span>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteNotification(notification.id); }}
                    className="flex h-6 w-6 items-center justify-center rounded text-text-muted hover:text-risk transition-colors shrink-0"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border px-4 py-2 flex items-center justify-between">
        <button className="flex items-center gap-1 text-[11px] font-mono text-text-muted hover:text-text-secondary transition-colors">
          <Settings className="h-3 w-3" />
          Settings
        </button>
        <button className="text-[11px] font-mono text-accent hover:text-accent-dim transition-colors">
          View all →
        </button>
      </div>
    </motion.div>
  );
}
