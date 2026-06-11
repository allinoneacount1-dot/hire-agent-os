// components/graph/TalentGraph.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface GraphNode {
  id: string;
  label: string;
  type: 'candidate' | 'skill' | 'role';
  x: number;
  y: number;
  size: number;
}

interface GraphEdge {
  source: string;
  target: string;
  strength: number;
}

const mockNodes: GraphNode[] = [
  { id: 'n1', label: 'Sarah Chen', type: 'candidate', x: 400, y: 300, size: 24 },
  { id: 'n2', label: 'React', type: 'skill', x: 250, y: 200, size: 14 },
  { id: 'n3', label: 'TypeScript', type: 'skill', x: 550, y: 200, size: 14 },
  { id: 'n4', label: 'Node.js', type: 'skill', x: 300, y: 400, size: 12 },
  { id: 'n5', label: 'AWS', type: 'skill', x: 500, y: 400, size: 12 },
  { id: 'n6', label: 'Marcus J.', type: 'candidate', x: 200, y: 450, size: 18 },
  { id: 'n7', label: 'Python', type: 'skill', x: 100, y: 350, size: 12 },
  { id: 'n8', label: 'Aiko Tanaka', type: 'candidate', x: 600, y: 450, size: 18 },
  { id: 'n9', label: 'ML/AI', type: 'skill', x: 700, y: 350, size: 14 },
];

const mockEdges: GraphEdge[] = [
  { source: 'n1', target: 'n2', strength: 0.9 },
  { source: 'n1', target: 'n3', strength: 0.9 },
  { source: 'n1', target: 'n4', strength: 0.8 },
  { source: 'n1', target: 'n5', strength: 0.7 },
  { source: 'n6', target: 'n7', strength: 0.9 },
  { source: 'n6', target: 'n4', strength: 0.6 },
  { source: 'n8', target: 'n9', strength: 0.9 },
  { source: 'n8', target: 'n7', strength: 0.7 },
  { source: 'n2', target: 'n3', strength: 0.8 },
];

const nodeColors = {
  candidate: { fill: '#7C4DFF', stroke: '#7C4DFF', glow: 'rgba(124, 77, 255, 0.3)' },
  skill: { fill: '#00E5FF', stroke: '#00E5FF', glow: 'rgba(0, 229, 255, 0.3)' },
  role: { fill: '#00FF9D', stroke: '#00FF9D', glow: 'rgba(0, 255, 157, 0.3)' },
};

export function TalentGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-xl p-4 h-[400px] relative overflow-hidden"
    >
      <div className="absolute top-3 left-4 z-10">
        <h3 className="text-xs font-mono text-text-muted uppercase tracking-wider">Talent Graph</h3>
        <div className="flex items-center gap-3 mt-1">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-secondary" />
            <span className="text-[10px] text-text-muted">Candidate</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-accent" />
            <span className="text-[10px] text-text-muted">Skill</span>
          </div>
        </div>
      </div>

      <svg
        ref={svgRef}
        viewBox="0 0 800 500"
        className="w-full h-full"
        style={{ marginTop: '20px' }}
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Edges */}
        {mockEdges.map((edge, i) => {
          const source = mockNodes.find(n => n.id === edge.source);
          const target = mockNodes.find(n => n.id === edge.target);
          if (!source || !target) return null;

          return (
            <line
              key={i}
              x1={source.x}
              y1={source.y}
              x2={target.x}
              y2={target.y}
              stroke="rgba(0, 229, 255, 0.15)"
              strokeWidth={edge.strength * 2}
              className="transition-all duration-300"
            />
          );
        })}

        {/* Nodes */}
        {mockNodes.map((node) => {
          const colors = nodeColors[node.type];
          const isHovered = hoveredNode === node.id;

          return (
            <g
              key={node.id}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              className="cursor-pointer"
            >
              {/* Glow */}
              <circle
                cx={node.x}
                cy={node.y}
                r={node.size + 4}
                fill={colors.glow}
                opacity={isHovered ? 0.6 : 0.3}
                filter="url(#glow)"
                className="transition-all duration-300"
              />
              {/* Node */}
              <circle
                cx={node.x}
                cy={node.y}
                r={node.size}
                fill={colors.fill}
                opacity={isHovered ? 1 : 0.8}
                stroke={colors.stroke}
                strokeWidth={isHovered ? 2 : 1}
                className="transition-all duration-300"
              />
              {/* Label */}
              <text
                x={node.x}
                y={node.y + node.size + 14}
                textAnchor="middle"
                className="fill-text-secondary text-[10px] font-mono"
                style={{ fontSize: '10px' }}
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </motion.div>
  );
}
