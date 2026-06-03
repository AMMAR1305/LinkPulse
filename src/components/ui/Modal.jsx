import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Modal component
 * Props:
 * - isOpen: boolean – controls visibility
 * - onClose: function – callback when backdrop or close button is clicked
 * - title: string (optional)
 * - children: modal body
 */
export default function Modal({ isOpen, onClose, title, children }) {
  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="glass p-6 rounded-xl relative max-w-lg w-full mx-4 shadow-xl border border-glassBorder"
            role="dialog"
            aria-modal="true"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            {title && (
              <h2 className="text-lg font-bold text-slate-900 mb-4">{title}</h2>
            )}
            <button
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 focus:outline-none text-lg"
              onClick={onClose}
            >
              ✕
            </button>
            <div>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
