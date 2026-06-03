import React from 'react';
import { FiLoader } from 'react-icons/fi';
import classNames from '../../utils/classNames';

export default function Button({
  children,
  type = 'button',
  onClick,
  loading = false,
  disabled = false,
  variant = 'primary', // primary | secondary | ghost | outline
  className = '',
  ...rest
}) {
  const baseClasses = 'rounded-lg font-medium transition-all inline-flex items-center justify-center';
  const variants = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 disabled:bg-primary-400 shadow-glow',
    secondary: 'bg-secondary-500 text-white hover:bg-secondary-600 disabled:bg-secondary-400',
    outline: 'bg-white border border-glassBorder text-slate-700 hover:bg-slate-50 hover:text-slate-900 disabled:text-slate-400',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:text-slate-400',
  };
  const disabledState = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabledState}
      className={classNames(
        baseClasses,
        variants[variant] || variants.primary,
        'px-4 py-2',
        disabledState && 'opacity-70 cursor-not-allowed shadow-none',
        className
      )}
      {...rest}
    >
      {loading ? (
        <FiLoader className="animate-spin mr-2" />
      ) : null}
      {children}
    </button>
  );
}
