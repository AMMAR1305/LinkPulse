import React from 'react';
import classNames from '../../utils/classNames';

export default function Badge({ children, status, className = '' }) {
  const getStatusStyles = () => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'disabled':
        return 'bg-rose-50 text-rose-700 border border-rose-200';
      case 'expired':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      default:
        return 'bg-slate-50 text-slate-600 border border-slate-200';
    }
  };

  return (
    <span className={classNames('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', getStatusStyles(), className)}>
      {children}
    </span>
  );
}
