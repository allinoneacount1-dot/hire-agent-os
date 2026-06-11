// app/layout.tsx — Updated for mobile responsive
import type { Metadata } from 'next';
import './globals.css';
import { SideNav } from '@/components/nav/SideNav';
import { TopBar } from '@/components/nav/TopBar';
import { InsightPanel } from '@/components/insight/InsightPanel';
import { EventBusProvider } from '@/lib/events/EventBusProvider';
import { QueryProvider } from '@/lib/QueryProvider';
import { CommandPalette } from '@/components/CommandPalette';

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
              {/* Left Navigation */}
              <SideNav />

              {/* Main Content Area */}
              <div className="flex flex-1 flex-col overflow-hidden lg:ml-[var(--nav-width)]">
                {/* Top Bar */}
                <TopBar />

                {/* Center + Right Panel */}
                <div className="flex flex-1 overflow-hidden">
                  {/* Center Content */}
                  <main className="flex-1 overflow-y-auto overflow-x-hidden grid-bg scanline relative">
                    <div className="relative z-10 p-4 sm:p-6 pt-16 lg:pt-6">
                      {children}
                    </div>
                  </main>

                  {/* Right Insight Panel — hidden on mobile */}
                  <div className="hidden xl:block">
                    <InsightPanel />
                  </div>
                </div>
              </div>
            </div>

            {/* Command Palette */}
            <CommandPalette />
          </EventBusProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
