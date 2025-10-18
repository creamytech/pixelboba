import { useEffect } from 'react';

interface ShortcutHandlers {
  onNewTask?: () => void;
  onSearch?: () => void;
  onToggleFilters?: () => void;
  onNextTask?: () => void;
  onPrevTask?: () => void;
  onEscape?: () => void;
  onHelp?: () => void;
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers, enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore shortcuts when typing in inputs
      const target = event.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      // Command/Ctrl + K - Search (Global)
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        handlers.onSearch?.();
        return;
      }

      // Command/Ctrl + N - New Task (Global)
      if ((event.metaKey || event.ctrlKey) && event.key === 'n') {
        event.preventDefault();
        handlers.onNewTask?.();
        return;
      }

      // Command/Ctrl + F - Toggle Filters (Global)
      if ((event.metaKey || event.ctrlKey) && event.key === 'f') {
        event.preventDefault();
        handlers.onToggleFilters?.();
        return;
      }

      // ? - Show help (when not typing)
      if (event.key === '?' && !isInput && event.shiftKey) {
        event.preventDefault();
        handlers.onHelp?.();
        return;
      }

      // Escape - Close modals/clear selection
      if (event.key === 'Escape') {
        handlers.onEscape?.();
        return;
      }

      // J/K navigation (when not typing)
      if (!isInput) {
        if (event.key === 'j') {
          event.preventDefault();
          handlers.onNextTask?.();
        } else if (event.key === 'k') {
          event.preventDefault();
          handlers.onPrevTask?.();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers, enabled]);
}
