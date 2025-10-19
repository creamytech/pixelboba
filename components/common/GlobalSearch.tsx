'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  FileText,
  FolderOpen,
  Users,
  CreditCard,
  MessageSquare,
  Loader2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  type: 'project' | 'client' | 'invoice' | 'contract' | 'message' | 'file';
  url: string;
  metadata?: Record<string, any>;
}

interface GlobalSearchProps {
  onClose: () => void;
  isAdmin?: boolean;
}

export default function GlobalSearch({ onClose, isAdmin = false }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        handleSelectResult(results[selectedIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [results, selectedIndex, onClose]);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const searchDebounce = setTimeout(async () => {
      setLoading(true);
      try {
        const endpoint = isAdmin ? '/api/admin/search' : '/api/portal/search';
        const response = await fetch(`${endpoint}?q=${encodeURIComponent(query)}`);
        if (response.ok) {
          const data = await response.json();
          setResults(data.results || []);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(searchDebounce);
  }, [query, isAdmin]);

  const handleSelectResult = (result: SearchResult) => {
    router.push(result.url);
    onClose();
  };

  const getIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'project':
        return <FolderOpen className="w-5 h-5" />;
      case 'client':
        return <Users className="w-5 h-5" />;
      case 'invoice':
        return <CreditCard className="w-5 h-5" />;
      case 'contract':
        return <FileText className="w-5 h-5" />;
      case 'message':
        return <MessageSquare className="w-5 h-5" />;
      case 'file':
        return <FileText className="w-5 h-5" />;
      default:
        return <Search className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: SearchResult['type']) => {
    switch (type) {
      case 'project':
        return 'text-taro bg-taro/10';
      case 'client':
        return 'text-blue-600 bg-blue-100';
      case 'invoice':
        return 'text-green-600 bg-green-100';
      case 'contract':
        return 'text-purple-600 bg-purple-100';
      case 'message':
        return 'text-orange-600 bg-orange-100';
      case 'file':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-ink/60 bg-ink/10';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-ink/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-20"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Search Input */}
        <div className="relative border-b border-ink/10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, clients, invoices, contracts..."
            className="w-full pl-12 pr-12 py-4 text-lg font-display text-ink placeholder:text-ink/40 focus:outline-none"
          />
          {loading && (
            <Loader2 className="absolute right-12 top-1/2 -translate-y-1/2 w-5 h-5 text-taro animate-spin" />
          )}
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-ink/40 hover:text-ink transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {query.length < 2 ? (
            <div className="p-8 text-center">
              <Search className="w-12 h-12 text-ink/20 mx-auto mb-4" />
              <p className="text-ink/60 font-display">Type at least 2 characters to search</p>
              <p className="text-ink/40 text-sm mt-2">
                Press <kbd className="px-2 py-1 bg-ink/10 rounded">Esc</kbd> to close
              </p>
            </div>
          ) : results.length === 0 && !loading ? (
            <div className="p-8 text-center">
              <Search className="w-12 h-12 text-ink/20 mx-auto mb-4" />
              <p className="text-ink/60 font-display">No results found for &quot;{query}&quot;</p>
              <p className="text-ink/40 text-sm mt-2">Try different keywords</p>
            </div>
          ) : (
            <div className="divide-y divide-ink/10">
              <AnimatePresence>
                {results.map((result, index) => (
                  <motion.button
                    key={result.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleSelectResult(result)}
                    className={`w-full flex items-center gap-4 p-4 text-left transition-colors ${
                      index === selectedIndex ? 'bg-milk-tea/50' : 'hover:bg-milk-tea/30'
                    }`}
                  >
                    <div className={`p-2 rounded-xl ${getTypeColor(result.type)}`}>
                      {getIcon(result.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-medium text-ink truncate">{result.title}</p>
                      {result.subtitle && (
                        <p className="text-sm text-ink/60 truncate">{result.subtitle}</p>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      <span className="text-xs px-2 py-1 bg-ink/10 text-ink/60 rounded-full capitalize">
                        {result.type}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Footer */}
        {results.length > 0 && (
          <div className="border-t border-ink/10 px-4 py-3 bg-milk-tea/20 flex items-center justify-between text-xs text-ink/60">
            <div className="flex items-center gap-4">
              <span>
                <kbd className="px-2 py-1 bg-white rounded">↑</kbd>{' '}
                <kbd className="px-2 py-1 bg-white rounded">↓</kbd> Navigate
              </span>
              <span>
                <kbd className="px-2 py-1 bg-white rounded">Enter</kbd> Select
              </span>
              <span>
                <kbd className="px-2 py-1 bg-white rounded">Esc</kbd> Close
              </span>
            </div>
            <span>{results.length} results</span>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
