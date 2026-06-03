import React from 'react';
import classNames from '../../utils/classNames';

/**
 * Avatar component displays a user picture or initials.
 * Props:
 * - src: image URL (optional)
 * - name: full name (used for initials if no src)
 * - size: number (width/height in px, default 40)
 */
export default function Avatar({ src, name = '', size = 40 }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const style = {
    width: size,
    height: size,
    borderRadius: '9999px',
    backgroundColor: src ? 'transparent' : 'rgba(255,255,255,0.15)',
  };

  return (
    <div className="flex items-center justify-center overflow-hidden" style={style}>
      {src ? (
        <img src={src} alt="avatar" className="object-cover w-full h-full" />
      ) : (
        <span className="text-sm font-medium text-white">{initials}</span>
      )}
    </div>
  );
}
