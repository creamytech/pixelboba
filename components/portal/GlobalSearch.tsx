'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { Search, X, Loader2, File, MessageCircle, CheckSquare, Folder } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SearchResult {
  id: string;
  type: 'project' | 'task' | 'file' | 'message';
  [key: string]: any;
}

interface SearchResults {
  projects: SearchResult[];
  tasks: SearchResult[];
  files: SearchResult[];
  messages: SearchResult[];
  totalResults: number;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<
    'all' | 'projects' | 'tasks' | 'files' | 'messages'
  >('all');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Search on query change (debounced)
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults(null);
      return;
    }

    const timer = setTimeout(async () => {
      await performSearch();
    }, 300);

    return () => clearTimeout(timer);
  }, [query, selectedType]);

  const performSearch = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        q: query,
        type: selectedType,
      });
      const response = await fetch(`/api/search?${params}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    // Navigate based on type
    if (result.type === 'project') {
      router.push(`/portal?tab=projects&project=${result.id}`);
    } else if (result.type === 'task') {
      router.push(`/portal?tab=tasks&task=${result.id}`);
    } else if (result.type === 'file') {
      router.push(`/portal?tab=files&file=${result.id}`);
    } else if (result.type === 'message') {
      router.push(`/portal?tab=messages&message=${result.id}`);
    }
    onClose();
  };

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
      />

      {/* Search Modal */}
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-3xl bg-white rounded-xl border-4 border-ink shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] overflow-hidden"
      >
        {/* Search Input */}
        <div className="p-6 border-b-4 border-ink">
          <div className="flex items-center gap-4">
            <Search className="w-6 h-6 text-ink/60 flex-shrink-0" strokeWidth={2.5} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects, tasks, files, messages..."
              className="flex-1 text-lg font-bold text-ink placeholder:text-ink/40 outline-none"
            />
            {loading && <Loader2 className="w-5 h-5 text-taro animate-spin" />}
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg border-2 border-ink hover:bg-ink/5 transition-colors"
            >
              <X className="w-5 h-5 text-ink" strokeWidth={2.5} />
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            {[
              { value: 'all', label: 'All', icon: 'ph:squares-four-duotone' },
              { value: 'projects', label: 'Projects', icon: 'ph:folder-duotone' },
              { value: 'tasks', label: 'Tasks', icon: 'ph:check-square-duotone' },
              { value: 'files', label: 'Files', icon: 'ph:file-duotone' },
              { value: 'messages', label: 'Messages', icon: 'ph:chat-duotone' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setSelectedType(tab.value as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 border-ink font-bold text-sm uppercase transition-all ${
                  selectedType === tab.value
                    ? 'bg-taro text-white'
                    : 'bg-white text-ink hover:bg-ink/5'
                }`}
              >
                <Icon icon={tab.icon} className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="max-h-[500px] overflow-y-auto">
          {!results && !loading && query.length >= 2 && (
            <div className="p-12 text-center">
              <Icon
                icon="ph:magnifying-glass-duotone"
                className="w-16 h-16 text-ink/20 mx-auto mb-4"
              />
              <p className="text-ink/60 font-bold">Start typing to search...</p>
            </div>
          )}

          {!results && query.length < 2 && (
            <div className="p-12 text-center">
              <Icon icon="ph:keyboard-duotone" className="w-16 h-16 text-ink/20 mx-auto mb-4" />
              <p className="text-ink/60 font-bold">Type at least 2 characters</p>
            </div>
          )}

          {results && results.totalResults === 0 && (
            <div className="p-12 text-center">
              <Icon icon="ph:ghost-duotone" className="w-16 h-16 text-ink/20 mx-auto mb-4" />
              <p className="text-ink/60 font-bold">No results found for &ldquo;{query}&rdquo;</p>
            </div>
          )}

          {results && results.totalResults > 0 && (
            <div className="p-6 space-y-6">
              {/* Projects */}
              {results.projects.length > 0 && (
                <div>
                  <h3 className="font-black text-sm uppercase text-ink/60 mb-3 flex items-center gap-2">
                    <Folder className="w-4 h-4" />
                    Projects ({results.projects.length})
                  </h3>
                  <div className="space-y-2">
                    {results.projects.map((project) => (
                      <button
                        key={project.id}
                        onClick={() => handleResultClick(project)}
                        className="w-full text-left p-4 rounded-lg border-3 border-ink bg-white hover:bg-cream transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-black text-ink mb-1 truncate">{project.name}</h4>
                            {project.description && (
                              <p className="text-sm text-ink/60 font-bold line-clamp-2">
                                {project.description}
                              </p>
                            )}
                          </div>
                          <span className="px-3 py-1 bg-matcha/20 text-matcha text-xs font-black uppercase rounded-full border-2 border-matcha flex-shrink-0">
                            {project.status}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tasks */}
              {results.tasks.length > 0 && (
                <div>
                  <h3 className="font-black text-sm uppercase text-ink/60 mb-3 flex items-center gap-2">
                    <CheckSquare className="w-4 h-4" />
                    Tasks ({results.tasks.length})
                  </h3>
                  <div className="space-y-2">
                    {results.tasks.map((task) => (
                      <button
                        key={task.id}
                        onClick={() => handleResultClick(task)}
                        className="w-full text-left p-4 rounded-lg border-3 border-ink bg-white hover:bg-cream transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-black text-ink mb-1 truncate">{task.title}</h4>
                            <p className="text-xs text-ink/60 font-bold mb-2">
                              {task.project?.name}
                            </p>
                            {task.description && (
                              <p className="text-sm text-ink/60 font-bold line-clamp-1">
                                {task.description}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-2 flex-shrink-0">
                            <span className="px-3 py-1 bg-taro/20 text-taro text-xs font-black uppercase rounded-full border-2 border-taro">
                              {task.priority}
                            </span>
                            <span className="px-3 py-1 bg-matcha/20 text-matcha text-xs font-black uppercase rounded-full border-2 border-matcha">
                              {task.status}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Files */}
              {results.files.length > 0 && (
                <div>
                  <h3 className="font-black text-sm uppercase text-ink/60 mb-3 flex items-center gap-2">
                    <File className="w-4 h-4" />
                    Files ({results.files.length})
                  </h3>
                  <div className="space-y-2">
                    {results.files.map((file) => (
                      <button
                        key={file.id}
                        onClick={() => handleResultClick(file)}
                        className="w-full text-left p-4 rounded-lg border-3 border-ink bg-white hover:bg-cream transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <Icon
                            icon="ph:file-duotone"
                            className="w-8 h-8 text-taro flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-black text-ink mb-1 truncate">
                              {file.originalName || file.filename}
                            </h4>
                            <p className="text-xs text-ink/60 font-bold">
                              {file.project?.name} • {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages */}
              {results.messages.length > 0 && (
                <div>
                  <h3 className="font-black text-sm uppercase text-ink/60 mb-3 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Messages ({results.messages.length})
                  </h3>
                  <div className="space-y-2">
                    {results.messages.map((message) => (
                      <button
                        key={message.id}
                        onClick={() => handleResultClick(message)}
                        className="w-full text-left p-4 rounded-lg border-3 border-ink bg-white hover:bg-cream transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-taro rounded-full border-2 border-ink flex items-center justify-center text-white font-black flex-shrink-0">
                            {message.sender?.name?.[0] || '?'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-black text-ink mb-1">{message.sender?.name}</h4>
                            <p className="text-sm text-ink/60 font-bold line-clamp-2">
                              {message.content}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {results && results.totalResults > 0 && (
          <div className="p-4 border-t-4 border-ink bg-ink/5">
            <p className="text-center text-sm font-bold text-ink/60">
              Found {results.totalResults} result{results.totalResults !== 1 ? 's' : ''} for &ldquo;
              {query}&rdquo;
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
