'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Send, Download, Archive, X, CheckSquare } from 'lucide-react';

interface BulkAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'danger';
  disabled?: boolean;
}

interface BulkActionBarProps {
  selectedCount: number;
  totalCount: number;
  actions: BulkAction[];
  onClear: () => void;
  onSelectAll: () => void;
}

export default function BulkActionBar({
  selectedCount,
  totalCount,
  actions,
  onClear,
  onSelectAll,
}: BulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40"
      >
        <div className="bg-white/95 backdrop-blur-lg border-2 border-taro/30 rounded-2xl shadow-2xl px-6 py-4 flex items-center gap-4">
          {/* Selection count */}
          <div className="flex items-center gap-3 pr-4 border-r border-ink/10">
            <CheckSquare className="w-5 h-5 text-taro" />
            <div>
              <p className="font-display font-semibold text-ink">{selectedCount} selected</p>
              <button
                onClick={selectedCount === totalCount ? onClear : onSelectAll}
                className="text-xs text-taro hover:text-taro/80 transition-colors"
              >
                {selectedCount === totalCount ? 'Clear selection' : `Select all ${totalCount}`}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {actions.map((action) => (
              <motion.button
                key={action.id}
                onClick={action.onClick}
                disabled={action.disabled}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-display font-medium text-sm transition-all ${
                  action.variant === 'danger'
                    ? 'bg-red-500 text-white hover:bg-red-600 disabled:opacity-50'
                    : 'bg-taro text-white hover:bg-taro/90 disabled:opacity-50'
                } disabled:cursor-not-allowed`}
                whileHover={!action.disabled ? { scale: 1.05 } : {}}
                whileTap={!action.disabled ? { scale: 0.95 } : {}}
              >
                {action.icon}
                <span className="hidden sm:inline">{action.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Clear button */}
          <button
            onClick={onClear}
            className="p-2 hover:bg-ink/5 rounded-xl transition-colors"
            title="Clear selection"
          >
            <X className="w-5 h-5 text-ink/60" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Hook for managing bulk selection
export function useBulkSelection<T extends { id: string }>(items: T[]) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectAll = () => {
    setSelectedIds(new Set(items.map((item) => item.id)));
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  const isSelected = (id: string) => selectedIds.has(id);

  const selectedItems = items.filter((item) => selectedIds.has(item.id));

  return {
    selectedIds,
    selectedCount: selectedIds.size,
    selectedItems,
    toggleSelection,
    selectAll,
    clearSelection,
    isSelected,
  };
}
