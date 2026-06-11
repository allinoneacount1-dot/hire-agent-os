// components/ui/Skeleton.tsx
'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animated?: boolean;
}

export function Skeleton({
  className,
  variant = 'text',
  width,
  height,
  animated = true,
}: SkeletonProps) {
  return (
    <div
      className={cn(
        'rounded bg-bg-card/60',
        animated && 'animate-pulse',
        variant === 'circular' && 'rounded-full',
        variant === 'text' && 'rounded h-4',
        variant === 'rectangular' && 'rounded-lg',
        className
      )}
      style={{ width, height }}
    />
  );
}

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          width={i === lines - 1 ? '60%' : '100%'}
          height={14}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('glass rounded-xl p-4 space-y-3', className)}>
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1 space-y-2">
          <Skeleton width="60%" height={14} />
          <Skeleton width="40%" height={10} />
        </div>
      </div>
      <SkeletonText lines={2} />
      <div className="flex gap-2">
        <Skeleton width={60} height={24} className="rounded-full" />
        <Skeleton width={50} height={24} className="rounded-full" />
        <Skeleton width={55} height={24} className="rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton width={200} height={28} />
        <Skeleton width={300} height={16} />
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton variant="circular" width={36} height={36} />
              <Skeleton width={40} height={16} />
            </div>
            <Skeleton width={60} height={28} />
            <Skeleton width={80} height={12} />
          </div>
        ))}
      </div>

      {/* Two Column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass rounded-xl p-5 space-y-3">
          <Skeleton width={120} height={14} />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton variant="circular" width={32} height={32} />
              <div className="flex-1 space-y-1">
                <Skeleton width="70%" height={12} />
                <Skeleton width="50%" height={10} />
              </div>
              <Skeleton width={40} height={14} />
            </div>
          ))}
        </div>
        <div className="glass rounded-xl p-5 space-y-3">
          <Skeleton width={100} height={14} />
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton variant="circular" width={6} height={6} className="mt-2" />
              <div className="flex-1 space-y-1">
                <Skeleton width="80%" height={11} />
                <Skeleton width={60} height={9} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="glass rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-border p-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} width={`${100 / cols}%`} height={14} />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="flex items-center gap-4 border-b border-border/50 p-4">
          {Array.from({ length: cols }).map((_, colIdx) => (
            <Skeleton key={colIdx} width={`${100 / cols}%`} height={12} />
          ))}
        </div>
      ))}
    </div>
  );
}
