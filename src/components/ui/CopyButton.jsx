import React, { useState } from 'react';
import { FiCopy, FiCheck } from 'react-icons/fi';
import { toast } from 'react-toastify';
import classNames from '../../utils/classNames';

export default function CopyButton({ textToCopy, className = '' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    toast.success('Copied to clipboard!');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleCopy} 
      className={classNames('transition-all duration-300 flex items-center justify-center', className)}
      title="Copy"
    >
      {copied ? <FiCheck className="text-green-400" size={16} /> : <FiCopy size={16} />}
    </button>
  );
}
