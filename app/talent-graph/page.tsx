// app/talent-graph/page.tsx — Dedicated Talent Graph Page
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ZoomIn, ZoomOut, Maximize2, Filter } from 'lucide-react';
import { mockCandidates } from '@/mock/candidates.seed';
import { cn } from '@/lib/utils';

const graphNodes = [
  { id: 'n1', label: 'Sarah Chen', type: 'candidate' as const, x: 400, y: 250, size: 28, color: '#7C4DFF' },
  { id: 'n2', label: 'React', type: 'skill' as const, x: 250, y: 150, size: 16, color: '#00E5FF' },
  { id: 'n3', label: 'TypeScript', type: 'skill' as const, x: 550, y: 150, size: 16, color: '#00E5FF' },
  { id: 'n4', label: 'Node.js', type: 'skill' as const, x: 300, y: 380, size: 14, color: '#00E5FF' },
  { id: 'n5', label: 'AWS', type: 'skill' as const, x: 500, y: 380, size: 14, color: '#00E5FF' },
  { id: 'n6', label: 'Marcus J.', type: 'candidate' as const, x: 180, y: 420, size: 22, color: '#7C4DFF' },
  { id: 'n7', label: 'Python', type: 'skill' as const, x: 80, y: 320, size: 14, color: '#00E5FF' },
  { id: 'n8', label: 'Aiko Tanaka', type: 'candidate' as const, x: 620, y: 420, size: 22, color: '#7C4DFF' },
  { id: 'n9', label: 'ML/AI', type: 'skill' as const, x: 720, y: 320, size: 16, color: '#00E5FF' },
  { id: 'n10', label: 'Raj Patel', type: 'candidate' as const, x: 350, y: 480, size: 20, color: '#7C4DFF' },
  { id: 'n11', label: 'Kubernetes', type: 'skill' as const, x: 200, y: 520, size: 14, color: '#00E5FF' },
  { id: 'n12', label: 'Go', type: 'skill' as const, x: 500, y: 520, size: 12, color: '#00E5FF' },
  { id: 'n13', label: 'Elena V.', type: 'candidate' as const, x: 680, y: 180, size: 20, color: '#7C4DFF' },
  { id: 'n14', label: 'Next.js', type: 'skill' as const, x: 600, y: 80, size: 14, color: '#00E5FF' },
  { id: 'n15', label: 'Tailwind', type: 'skill' as const, x: 750, y: 100, size: 12, color: '#00E5FF' },
];

const graphEdges = [
  { source: 'n1', target: 'n2', strength: 0.9 },
  { source: 'n1', target: 'n3', strength: 0.9 },
  { source: 'n1', target: 'n4', strength: 0.8 },
  { source: 'n1', target: 'n5', strength: 0.7 },
  { source: 'n6', target: 'n7', strength: 0.9 },
  { source: 'n6', target: 'n4', strength: 0.6 },
  { source: 'n8', target: 'n9', strength: 0.9 },
  { source: 'n8', target: 'n7', strength: 0.7 },
  { source: 'n2', target: 'n3', strength: 0.8 },
  { source: 'n10', target: 'n11', strength: 0.9 },
  { source: 'n10', target: 'n5', strength: 0.7 },
  { source: 'n10', target: 'n12', strength: 0.6 },
  { source: 'n13', target: 'n14', strength: 0.9 },
  { source: 'n13', target: 'n15', strength: 0.8 },
  { source: 'n13', target: 'n2', strength: 0.7 },
  { source: 'n14', target: 'n3', strength: 0.8 },
];

export default function TalentGraphPage() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'candidate' | 'skill'>('all');

  const filteredNodes = graphNodes.filter(n => filter === 'all' || n.type === filter);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-display text-text-primary">Talent Graph</h1>
        <p className="text-sm text-text-secondary mt-1">Interactive Neo4j-style node graph — skills as glowing nodes, edges = experience links</p>
      </motion.div>

      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-bg-card/50 px-3 py-2 flex-1 max-w-xs">
          <Search className="h-4 w-4 text-text-muted" />
          <input
            type="text"
            placeholder="Filter nodes..."
            className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
          />
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-border bg-bg-card/50 p-1">
          {(['all', 'candidate', 'skill'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-3 py-1.5 rounded-md text-xs font-mono transition-all',
                filter === f ? 'bg-accent/20 text-accent' : 'text-text-muted hover:text-text-secondary'
              )}
            >
              {f === 'all' ? 'ALL' : f === 'candidate' ? 'CANDIDATES' : 'SKILLS'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 ml-auto">
          <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-bg-card/50 text-text-muted hover:text-text-secondary transition-colors">
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-bg-card/50 text-text-muted hover:text-text-secondary transition-colors">
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-bg-card/50 text-text-muted hover:text-text-secondary transition-colors">
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Graph */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="glass rounded-xl p-4 h-[500px] relative overflow-hidden"
      >
        {/* Legend */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-secondary" />
            <span className="text-[10px] font-mono text-text-muted">Candidate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-accent" />
            <span className="text-[10px] font-mono text-text-muted">Skill</span>
          </div>
        </div>

        {/* Node count */}
        <div className="absolute top-4 right-4 z-10 text-[10px] font-mono text-text-muted">
          {filteredNodes.length} nodes · {graphEdges.length} edges
        </div>

        <svg viewBox="0 0 800 600" className="w-full h-full">
          <defs>
            <filter id="glow-strong">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Edges */}
          {graphEdges.map((edge, i) => {
            const source = graphNodes.find(n => n.id === edge.source);
            const target = graphNodes.find(n => n.id === edge.target);
            if (!source || !target) return null;
            const isVisible = filteredNodes.includes(source) && filteredNodes.includes(target);
            if (!isVisible) return null;

            return (
              <line
                key={i}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                stroke="rgba(0, 229, 255, 0.12)"
                strokeWidth={edge.strength * 2.5}
              />
            );
          })}

          {/* Nodes */}
          {filteredNodes.map((node) => {
            const isHovered = hoveredNode === node.id;

            return (
              <g
                key={node.id}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                className="cursor-pointer"
              >
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.size + 6}
                  fill={node.color}
                  opacity={isHovered ? 0.4 : 0.15}
                  filter="url(#glow-strong)"
                />
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.size}
                  fill={node.color}
                  opacity={isHovered ? 1 : 0.7}
                  stroke={node.color}
                  strokeWidth={isHovered ? 2 : 1}
                  className="transition-all duration-200"
                />
                <text
                  x={node.x}
                  y={node.y + 4}
                  textAnchor="middle"
                  fill="#fff"
                  fontSize={node.type === 'candidate' ? '9' : '7'}
                  fontWeight="600"
                  className="pointer-events-none select-none"
                >
                  {node.label.length > 10 ? node.label.substring(0, 9) + '…' : node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </motion.div>

      {/* Selected Node Info */}
      {hoveredNode && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-4"
        >
          {(() => {
            const node = graphNodes.find(n => n.id === hoveredNode);
            if (!node) return null;
            const candidate = mockCandidates.find(c => c.name === node.label);
            if (candidate) {
              return (
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/20 text-secondary text-lg font-bold">
                    {candidate.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-text-primary">{candidate.name}</h3>
                    <p className="text-xs text-text-muted">{candidate.role} · {candidate.location} · {candidate.experience_years}yr exp</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {candidate.skills.slice(0, 6).map(s => (
                        <span key={s} className="px-1.5 py-0.5 rounded bg-bg-card text-[10px] font-mono text-text-secondary">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="text-lg font-bold font-mono text-success">{Math.round(candidate.signal_strength * 100)}%</div>
                    <div className="text-[10px] font-mono text-text-muted">SIGNAL</div>
                  </div>
                </div>
              );
            }
            return (
              <div>
                <h3 className="text-sm font-bold text-accent">{node.label}</h3>
                <p className="text-xs text-text-muted">Skill node — {graphEdges.filter(e => e.source === node.id || e.target === node.id).length} connections</p>
              </div>
            );
          })()}
        </motion.div>
      )}
    </div>
  );
}
