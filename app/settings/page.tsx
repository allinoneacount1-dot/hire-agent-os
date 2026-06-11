// app/settings/page.tsx — Settings Page
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Database,
  Key,
  Monitor,
  Moon,
  Globe,
  Save,
  RotateCcw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type SettingsTab = 'general' | 'notifications' | 'appearance' | 'data' | 'api' | 'about';

const tabs: { id: SettingsTab; label: string; icon: typeof Settings }[] = [
  { id: 'general', label: 'General', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'data', label: 'Data & Privacy', icon: Database },
  { id: 'api', label: 'API & Keys', icon: Key },
  { id: 'about', label: 'About', icon: Monitor },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-display text-text-primary">Settings</h1>
        <p className="text-sm text-text-secondary mt-1">Configure your HIRE AGENT OS</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="glass rounded-xl p-3 space-y-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                  activeTab === tab.id
                    ? 'bg-accent/10 text-accent border border-accent/20'
                    : 'text-text-secondary hover:bg-bg-card/50 border border-transparent'
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="lg:col-span-3 glass rounded-xl p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-text-primary">General Settings</h2>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-mono text-text-muted uppercase tracking-wider block mb-2">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    defaultValue="HIRE AGENT OS"
                    className="w-full rounded-lg border border-border bg-bg-card/50 px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent/40 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-text-muted uppercase tracking-wider block mb-2">
                    Default Timezone
                  </label>
                  <select className="w-full rounded-lg border border-border bg-bg-card/50 px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent/40 transition-colors">
                    <option>UTC</option>
                    <option>America/New_York</option>
                    <option>America/Los_Angeles</option>
                    <option>Europe/London</option>
                    <option>Asia/Tokyo</option>
                    <option>Asia/Singapore</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-text-muted uppercase tracking-wider block mb-2">
                    Default Platform
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {['Email', 'LinkedIn', 'Twitter', 'GitHub'].map(p => (
                      <button
                        key={p}
                        className="rounded-lg border border-border bg-bg-card/50 px-3 py-2 text-xs font-mono text-text-secondary hover:border-accent/25 transition-colors"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-bg-card/30 border border-border p-4">
                  <div>
                    <div className="text-sm font-medium text-text-primary">Auto-score candidates</div>
                    <div className="text-xs text-text-muted">Automatically calculate fitment score for new candidates</div>
                  </div>
                  <button className="h-6 w-11 rounded-full bg-accent/30 relative">
                    <div className="absolute right-0.5 top-0.5 h-5 w-5 rounded-full bg-accent transition-all" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-text-primary">Notification Preferences</h2>

              <div className="space-y-3">
                {[
                  { label: 'New candidate discovered', desc: 'When scout finds a new candidate', enabled: true },
                  { label: 'High-fit candidate alert', desc: 'When fitment score > 80%', enabled: true },
                  { label: 'Outreach response', desc: 'When candidate replies to outreach', enabled: true },
                  { label: 'Interview completed', desc: 'Interview simulation results', enabled: false },
                  { label: 'Model weight updates', desc: 'Feedback loop adjustments', enabled: false },
                  { label: 'Weekly digest', desc: 'Summary of hiring activity', enabled: true },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-bg-card/30 border border-border p-4">
                    <div>
                      <div className="text-sm font-medium text-text-primary">{item.label}</div>
                      <div className="text-xs text-text-muted">{item.desc}</div>
                    </div>
                    <button className={cn(
                      'h-6 w-11 rounded-full relative transition-colors',
                      item.enabled ? 'bg-accent/30' : 'bg-bg-card'
                    )}>
                      <div className={cn(
                        'absolute top-0.5 h-5 w-5 rounded-full transition-all',
                        item.enabled ? 'right-0.5 bg-accent' : 'left-0.5 bg-text-muted'
                      )} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-text-primary">Appearance</h2>

              <div>
                <label className="text-xs font-mono text-text-muted uppercase tracking-wider block mb-3">
                  Theme
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'dark', label: 'Dark', icon: Moon, active: true },
                    { id: 'system', label: 'System', icon: Monitor, active: false },
                    { id: 'light', label: 'Light', icon: Globe, active: false },
                  ].map(theme => {
                    const Icon = theme.icon;
                    return (
                      <button
                        key={theme.id}
                        className={cn(
                          'flex flex-col items-center gap-2 rounded-xl border p-4 transition-all',
                          theme.active
                            ? 'border-accent/30 bg-accent/5'
                            : 'border-border bg-bg-card/30 hover:border-accent/20'
                        )}
                      >
                        <Icon className={cn('h-5 w-5', theme.active ? 'text-accent' : 'text-text-muted')} />
                        <span className={cn('text-xs font-mono', theme.active ? 'text-accent' : 'text-text-secondary')}>
                          {theme.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-text-muted uppercase tracking-wider block mb-3">
                  Accent Color
                </label>
                <div className="flex gap-3">
                  {[
                    { color: 'bg-[#00E5FF]', name: 'Cyan', active: true },
                    { color: 'bg-[#7C4DFF]', name: 'Violet', active: false },
                    { color: 'bg-[#00FF9D]', name: 'Green', active: false },
                    { color: 'bg-[#FF3B3B]', name: 'Red', active: false },
                    { color: 'bg-[#FFB800]', name: 'Gold', active: false },
                  ].map(c => (
                    <button
                      key={c.name}
                      className={cn(
                        'h-10 w-10 rounded-full border-2 transition-all',
                        c.color,
                        c.active ? 'border-text-primary scale-110' : 'border-transparent hover:scale-105'
                      )}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-bg-card/30 border border-border p-4">
                <div>
                  <div className="text-sm font-medium text-text-primary">Animations</div>
                  <div className="text-xs text-text-muted">Enable motion effects and transitions</div>
                </div>
                <button className="h-6 w-11 rounded-full bg-accent/30 relative">
                  <div className="absolute right-0.5 top-0.5 h-5 w-5 rounded-full bg-accent" />
                </button>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-text-primary">Data & Privacy</h2>

              <div className="space-y-3">
                {[
                  { label: 'Store conversation history', desc: 'Keep a record of all interactions', enabled: true },
                  { label: 'Share analytics', desc: 'Help improve the product with anonymous data', enabled: false },
                  { label: 'Auto-delete old data', desc: 'Delete data older than 90 days', enabled: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-bg-card/30 border border-border p-4">
                    <div>
                      <div className="text-sm font-medium text-text-primary">{item.label}</div>
                      <div className="text-xs text-text-muted">{item.desc}</div>
                    </div>
                    <button className={cn(
                      'h-6 w-11 rounded-full relative transition-colors',
                      item.enabled ? 'bg-accent/30' : 'bg-bg-card'
                    )}>
                      <div className={cn(
                        'absolute top-0.5 h-5 w-5 rounded-full transition-all',
                        item.enabled ? 'right-0.5 bg-accent' : 'left-0.5 bg-text-muted'
                      )} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="rounded-lg bg-risk/5 border border-risk/20 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-risk" />
                  <span className="text-sm font-medium text-risk">Danger Zone</span>
                </div>
                <p className="text-xs text-text-muted mb-3">These actions are irreversible.</p>
                <div className="flex gap-2">
                  <button className="rounded-lg bg-risk/10 border border-risk/25 px-3 py-2 text-xs font-medium text-risk hover:bg-risk/20 transition-colors">
                    Export All Data
                  </button>
                  <button className="rounded-lg bg-risk/10 border border-risk/25 px-3 py-2 text-xs font-medium text-risk hover:bg-risk/20 transition-colors">
                    Delete All Data
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-text-primary">API & Integration</h2>

              <div>
                <label className="text-xs font-mono text-text-muted uppercase tracking-wider block mb-2">
                  API Key
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value="hrosk_a1b2c3d4e5f6g7h8i9j0"
                    readOnly
                    className="flex-1 rounded-lg border border-border bg-bg-card/50 px-4 py-2.5 text-sm font-mono text-text-primary outline-none"
                  />
                  <button className="rounded-lg bg-accent/10 border border-accent/25 px-4 py-2 text-xs font-medium text-accent hover:bg-accent/20 transition-colors">
                    Regenerate
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-text-muted uppercase tracking-wider block">
                  Webhook URL
                </label>
                <input
                  type="text"
                  placeholder="https://your-app.com/webhook"
                  className="w-full rounded-lg border border-border bg-bg-card/50 px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent/40 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-text-muted uppercase tracking-wider block mb-2">
                  Rate Limit
                </label>
                <div className="rounded-lg bg-bg-card/30 border border-border p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-primary">100 requests / minute</span>
                    <span className="text-xs font-mono text-accent">Free Tier</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-text-primary">About</h2>

              <div className="space-y-4">
                <div className="flex items-center gap-4 rounded-lg bg-bg-card/30 border border-border p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 border border-accent/25">
                    <Settings className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <div className="text-base font-bold text-text-primary">HIRE AGENT OS</div>
                    <div className="text-xs text-text-muted">Autonomous Talent Intelligence System</div>
                    <div className="text-xs font-mono text-accent mt-0.5">Version 1.0.0</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Build</span>
                    <span className="text-text-secondary font-mono">2026.06.11</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Next.js</span>
                    <span className="text-text-secondary font-mono">16.2.9</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">React</span>
                    <span className="text-text-secondary font-mono">19.x</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">TypeScript</span>
                    <span className="text-text-secondary font-mono">5.x</span>
                  </div>
                </div>

                <div className="rounded-lg bg-bg-card/30 border border-border p-4">
                  <div className="text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Tech Stack</div>
                  <div className="flex flex-wrap gap-1.5">
                    {['Next.js', 'TypeScript', 'Tailwind v4', 'Framer Motion', 'TanStack Query', 'Zustand', 'Lucide Icons'].map(tech => (
                      <span key={tech} className="px-2 py-1 rounded bg-bg-card text-[10px] font-mono text-text-secondary">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-border">
            <button className="flex items-center gap-2 rounded-lg border border-border bg-bg-card/50 px-4 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors">
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
            <button
              onClick={handleSave}
              className={cn(
                'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all',
                saved
                  ? 'bg-success/20 border border-success/30 text-success'
                  : 'bg-accent/20 border border-accent/30 text-accent hover:bg-accent/30'
              )}
            >
              <Save className="h-3.5 w-3.5" />
              {saved ? 'Saved!' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
