// app/layout.tsx — Root Layout v2
import type { Metadata } from 'next';
import './globals.css';
import { SideNav } from '@/components/nav/SideNav';
import { TopBar } from '@/components/nav/TopBar';
import { InsightPanel } from '@/components/insight/InsightPanel';
import { CommandPalette } from '@/components/CommandPalette';
import { EventBusProvider } from '@/lib/events/EventBusProvider';
import { QueryProvider } from '@/lib/QueryProvider';

export const metadata: Metadata = {
  title: 'HIRE AGENT OS — Autonomous Talent Intelligence System',
  description: 'A self-improving hiring brain that discovers, evaluates, engages, tests, attracts, and learns from human talent signals.',
  keywords: ['AI hiring', 'talent intelligence', 'recruitment AI', 'autonomous agents'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="h-screen w-screen overflow-hidden bg-bg text-text-primary">
        <QueryProvider>
          <EventBusProvider>
            <div className="flex h-screen w-screen">
              <SideNav />
              <div className="flex flex-1 flex-col overflow-hidden" style={{ marginLeft: 'var(--nav-width)' }}>
                <TopBar />
                <div className="flex flex-1 overflow-hidden">
                  <main className="flex-1 overflow-y-auto overflow-x-hidden grid-bg scanline relative">
                    <div className="relative z-10 p-6">
                      {children}
                    </div>
                  </main>
                  <InsightPanel />
                </div>
              </div>
            </div>
            {/* Command Palette — rendered at root level for ⌘K access */}
            <CommandPalette />
          </EventBusProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
