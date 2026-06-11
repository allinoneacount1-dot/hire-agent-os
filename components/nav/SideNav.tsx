// components/nav/SideNav.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Search,
  Magnet,
  MessageSquare,
  Swords,
  BrainCircuit,
  Zap,
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/talent-search', label: 'Talent Search', icon: Search },
  { href: '/job-magnet', label: 'Job Magnet', icon: Magnet },
  { href: '/outreach', label: 'Outreach', icon: MessageSquare },
  { href: '/interview-lab', label: 'Interview Lab', icon: Swords },
  { href: '/feedback-engine', label: 'Feedback Engine', icon: BrainCircuit },
];

export function SideNav() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-border bg-bg-surface/80 backdrop-blur-glass"
      style={{ width: 'var(--nav-width)' }}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 border border-accent/25">
          <Zap className="h-5 w-5 text-accent" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold font-display tracking-wide text-text-primary">
            HIRE AGENT
          </span>
          <span className="text-[10px] font-mono text-accent tracking-widest uppercase">
            OS v1.0
          </span>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-accent/10 text-accent border border-accent/20 shadow-glow-cyan'
                    : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary border border-transparent'
                )}
              >
                <Icon
                  className={cn(
                    'h-4.5 w-4.5 transition-colors',
                    isActive ? 'text-accent' : 'text-text-muted group-hover:text-text-secondary'
                  )}
                />
                <span>{item.label}</span>
                {isActive && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom Status */}
      <div className="border-t border-border p-4">
        <div className="glass rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-mono text-text-secondary">SYSTEM ONLINE</span>
          </div>
          <div className="text-[10px] font-mono text-text-muted">
            12 candidates tracked
          </div>
          <div className="text-[10px] font-mono text-text-muted">
            3 active pipelines
          </div>
        </div>
      </div>
    </aside>
  );
}
