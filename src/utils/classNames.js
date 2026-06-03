// src/utils/classNames.js
/**
 * Simple className concatenator that removes falsy values.
 * Usage: cn('flex', isActive && 'bg-blue-500')
 */
export default function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}
