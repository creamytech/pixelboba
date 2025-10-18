'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Keyboard } from 'lucide-react';

interface ShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

const shortcuts = [
  {
    category: 'general',
    items: [
      { keys: ['⌘', 'K'], description: 'search tasks' },
      { keys: ['⌘', 'N'], description: 'create new task' },
      { keys: ['⌘', 'F'], description: 'toggle filters' },
      { keys: ['?'], description: 'show keyboard shortcuts' },
      { keys: ['Esc'], description: 'close modal / clear selection' },
    ],
  },
  {
    category: 'navigation',
    items: [
      { keys: ['J'], description: 'next task' },
      { keys: ['K'], description: 'previous task' },
      { keys: ['Enter'], description: 'open selected task' },
    ],
  },
  {
    category: 'task actions',
    items: [
      { keys: ['E'], description: 'edit task (when selected)' },
      { keys: ['D'], description: 'delete task (when selected)' },
      { keys: ['C'], description: 'add comment (when viewing task)' },
    ],
  },
];

export default function KeyboardShortcutsHelp({ isOpen, onClose }: ShortcutsHelpProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-brown-sugar/20 z-[101] overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-brown-sugar/20 bg-gradient-to-r from-taro/10 to-brown-sugar/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-taro/20 rounded-lg">
                  <Keyboard className="w-6 h-6 text-taro" />
                </div>
                <h2 className="font-display text-2xl font-bold text-ink lowercase">
                  keyboard shortcuts
                </h2>
              </div>
              <motion.button
                onClick={onClose}
                className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5 text-ink/60" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-8 max-h-[600px] overflow-y-auto">
              {shortcuts.map((section, sectionIndex) => (
                <motion.div
                  key={section.category}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: sectionIndex * 0.1 }}
                >
                  <h3 className="font-display font-semibold text-taro uppercase text-sm tracking-wide mb-4">
                    {section.category}
                  </h3>
                  <div className="space-y-3">
                    {section.items.map((item, itemIndex) => (
                      <motion.div
                        key={itemIndex}
                        className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-brown-sugar/10 hover:shadow-md transition-shadow"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: sectionIndex * 0.1 + itemIndex * 0.05 }}
                      >
                        <span className="font-display text-ink/80 lowercase">
                          {item.description}
                        </span>
                        <div className="flex items-center gap-1">
                          {item.keys.map((key, keyIndex) => (
                            <span key={keyIndex} className="flex items-center gap-1">
                              <kbd className="px-3 py-1.5 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-300 rounded-lg shadow-sm font-mono text-sm font-semibold text-gray-700 min-w-[40px] text-center">
                                {key}
                              </kbd>
                              {keyIndex < item.keys.length - 1 && (
                                <span className="text-ink/40 text-sm font-medium">+</span>
                              )}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-brown-sugar/20 bg-gray-50/50 text-center">
              <p className="text-xs text-ink/60 font-display">
                press{' '}
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">
                  ?
                </kbd>{' '}
                anytime to toggle this help
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
