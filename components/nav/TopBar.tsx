// components/nav/TopBar.tsx — Mobile Responsive + Notifications
'use client';

import { Bell, Search, Settings, Wallet } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { NotificationsPanel } from '@/components/NotificationsPanel';

export function TopBar() {
  const [searchFocused, setSearchFocused] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close notifications on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header
      className="flex h-16 items-center justify-between border-b border-border bg-bg-surface/60 backdrop-blur-glass px-4 sm:px-6 pl-16 lg:pl-6 relative"
      style={{ height: 'var(--topbar-height)' }}
    >
      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div
          className={`flex items-center gap-2 rounded-lg border bg-bg-card/50 px-3 py-2 transition-all ${
            searchFocused ? 'border-accent/40' : 'border-border'
          }`}
        >
          <Search className="h-4 w-4 text-text-muted shrink-0" />
          <input
            type="text"
            placeholder="Search candidates, skills, roles..."
            className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none min-w-0"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          <kbd className="hidden sm:inline-flex h-5 items-center rounded border border-border bg-bg px-1.5 text-[10px] font-mono text-text-muted">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3 ml-3">
        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${
              showNotifications
                ? 'border-accent/40 bg-accent/10 text-accent'
                : 'border-border bg-bg-card/50 text-text-secondary hover:text-text-primary hover:border-accent/25'
            }`}
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-risk text-[9px] font-bold text-white">
              3
            </span>
          </button>

          {showNotifications && (
            <NotificationsPanel onClose={() => setShowNotifications(false)} />
          )}
        </div>

        {/* Wallet Connect — hidden on small screens */}
        <button className="hidden sm:flex items-center gap-2 rounded-lg border border-accent/25 bg-accent/5 px-3 py-2 text-sm font-medium text-accent hover:bg-accent/10 transition-colors">
          <Wallet className="h-4 w-4" />
          <span className="hidden md:inline">Connect</span>
        </button>

        {/* Settings */}
        <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-bg-card/50 text-text-secondary hover:text-text-primary hover:border-accent/25 transition-colors">
          <Settings className="h-4 w-4" />
        </button>

        {/* Avatar */}
        <div className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full bg-secondary/20 border border-secondary/30 text-secondary text-xs font-bold">
          HA
        </div>
      </div>
    </header>
  );
}
