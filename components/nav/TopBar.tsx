// components/nav/TopBar.tsx
'use client';

import { Bell, Search, Settings, Wallet } from 'lucide-react';
import { useState } from 'react';

export function TopBar() {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header
      className="flex h-16 items-center justify-between border-b border-border bg-bg-surface/60 backdrop-blur-glass px-6"
      style={{ height: 'var(--topbar-height)' }}
    >
      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div
          className={`flex items-center gap-2 rounded-lg border bg-bg-card/50 px-3 py-2 transition-all ${
            searchFocused ? 'border-accent/40 shadow-glow-cyan' : 'border-border'
          }`}
        >
          <Search className="h-4 w-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search candidates, skills, roles..."
            className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          <kbd className="hidden sm:inline-flex h-5 items-center rounded border border-border bg-bg px-1.5 text-[10px] font-mono text-text-muted">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 ml-4">
        {/* Notifications */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-bg-card/50 text-text-secondary hover:text-text-primary hover:border-accent/25 transition-colors">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-risk text-[9px] font-bold text-white">
            3
          </span>
        </button>

        {/* Wallet Connect */}
        <button className="flex items-center gap-2 rounded-lg border border-accent/25 bg-accent/5 px-3 py-2 text-sm font-medium text-accent hover:bg-accent/10 transition-colors">
          <Wallet className="h-4 w-4" />
          <span className="hidden sm:inline">Connect</span>
        </button>

        {/* Settings */}
        <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-bg-card/50 text-text-secondary hover:text-text-primary hover:border-accent/25 transition-colors">
          <Settings className="h-4 w-4" />
        </button>

        {/* Avatar */}
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary/20 border border-secondary/30 text-secondary text-xs font-bold">
          HA
        </div>
      </div>
    </header>
  );
}
