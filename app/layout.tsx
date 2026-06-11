// app/layout.tsx — Root Layout: Shell with Left Nav + Center + Right Insight Panel
import type { Metadata } from 'next';
import './globals.css';
import { SideNav } from '@/components/nav/SideNav';
import { TopBar } from '@/components/nav/TopBar';
import { InsightPanel } from '@/components/insight/InsightPanel';
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
              {/* Left Navigation */}
              <SideNav />

              {/* Main Content Area */}
              <div className="flex flex-1 flex-col overflow-hidden" style={{ marginLeft: 'var(--nav-width)' }}>
                {/* Top Bar */}
                <TopBar />

                {/* Center + Right Panel */}
                <div className="flex flex-1 overflow-hidden">
                  {/* Center Content */}
                  <main className="flex-1 overflow-y-auto overflow-x-hidden grid-bg scanline relative">
                    <div className="relative z-10 p-6">
                      {children}
                    </div>
                  </main>

                  {/* Right Insight Panel */}
                  <InsightPanel />
                </div>
              </div>
            </div>
          </EventBusProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
