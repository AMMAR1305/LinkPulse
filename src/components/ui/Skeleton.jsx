import React from 'react';

/**
 * Skeleton component – shows a gray pulsing block.
 * Props:
 *   width: string (e.g., 'w-full', 'w-32')
 *   height: string (e.g., 'h-4', 'h-8')
 *   className: additional Tailwind classes
 */
export default function Skeleton({ width = 'w-full', height = 'h-4', className = '' }) {
  return (
    <div
      className={`${width} ${height} bg-slate-100/50 animate-pulse rounded ${className}`}
      style={{ backgroundColor: '#E9E8E3' }}
    />
  );
}
