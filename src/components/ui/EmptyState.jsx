import React from 'react';
import { motion } from 'framer-motion';
import classNames from '../../utils/classNames';

export default function EmptyState({ icon: Icon, title, description, action, className = '' }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={classNames("flex flex-col items-center justify-center p-12 text-center glass rounded-xl border border-glassBorder bg-white", className)}
    >
      {Icon && (
        <div className="text-indigo-600 mb-4 p-4 bg-indigo-50 rounded-full shadow-sm">
          <Icon size={48} />
        </div>
      )}
      <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500 max-w-sm mb-6">{description}</p>
      {action && <div>{action}</div>}
    </motion.div>
  );
}
