'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ExternalLink, ZoomIn, ZoomOut } from 'lucide-react';
import Image from 'next/image';

interface FilePreviewModalProps {
  file: {
    id: string;
    originalName: string;
    url: string;
    mimetype: string;
    size: number;
  };
  onClose: () => void;
  onDownload?: () => void;
}

export default function FilePreviewModal({ file, onClose, onDownload }: FilePreviewModalProps) {
  const [zoom, setZoom] = useState(100);
  const [loading, setLoading] = useState(true);

  const isImage = file.mimetype.startsWith('image/');
  const isPDF = file.mimetype.includes('pdf');
  const isVideo = file.mimetype.startsWith('video/');
  const isAudio = file.mimetype.startsWith('audio/');

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Format file size
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-ink/10 bg-milk-tea/30">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-ink truncate">{file.originalName}</h3>
              <p className="text-sm text-ink/60">
                {formatSize(file.size)} • {file.mimetype}
              </p>
            </div>

            <div className="flex items-center space-x-2 ml-4">
              {isImage && (
                <>
                  <button
                    onClick={handleZoomOut}
                    disabled={zoom <= 50}
                    className="p-2 hover:bg-ink/10 rounded-lg transition-colors disabled:opacity-50"
                    title="Zoom out"
                  >
                    <ZoomOut className="w-5 h-5" />
                  </button>
                  <span className="text-sm text-ink/70 min-w-[3rem] text-center">{zoom}%</span>
                  <button
                    onClick={handleZoomIn}
                    disabled={zoom >= 200}
                    className="p-2 hover:bg-ink/10 rounded-lg transition-colors disabled:opacity-50"
                    title="Zoom in"
                  >
                    <ZoomIn className="w-5 h-5" />
                  </button>
                </>
              )}

              {onDownload && (
                <button
                  onClick={onDownload}
                  className="p-2 hover:bg-ink/10 rounded-lg transition-colors"
                  title="Download"
                >
                  <Download className="w-5 h-5" />
                </button>
              )}

              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-ink/10 rounded-lg transition-colors"
                title="Open in new tab"
              >
                <ExternalLink className="w-5 h-5" />
              </a>

              <button
                onClick={onClose}
                className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Preview Content */}
          <div className="flex-1 overflow-auto bg-milk-tea/10 flex items-center justify-center p-6">
            {loading && (
              <div className="flex items-center space-x-3 text-ink/60">
                <div className="w-6 h-6 border-3 border-taro/30 border-t-taro rounded-full animate-spin" />
                <span>Loading preview...</span>
              </div>
            )}

            {isImage && (
              <div
                className="relative"
                style={{
                  width: `${zoom}%`,
                  maxWidth: '100%',
                  transition: 'width 0.2s ease',
                }}
              >
                <Image
                  src={file.url}
                  alt={file.originalName}
                  width={1200}
                  height={800}
                  className="w-full h-auto rounded-lg shadow-lg"
                  onLoadingComplete={() => setLoading(false)}
                />
              </div>
            )}

            {isPDF && (
              <iframe
                src={file.url}
                className="w-full h-full min-h-[600px] rounded-lg"
                title={file.originalName}
                onLoad={() => setLoading(false)}
              />
            )}

            {isVideo && (
              <video
                src={file.url}
                controls
                className="max-w-full max-h-full rounded-lg shadow-lg"
                onLoadedData={() => setLoading(false)}
              >
                Your browser does not support the video tag.
              </video>
            )}

            {isAudio && (
              <div className="w-full max-w-2xl">
                <audio
                  src={file.url}
                  controls
                  className="w-full"
                  onLoadedData={() => setLoading(false)}
                >
                  Your browser does not support the audio tag.
                </audio>
              </div>
            )}

            {!isImage && !isPDF && !isVideo && !isAudio && (
              <div className="text-center">
                <div className="text-6xl mb-4">📄</div>
                <p className="text-ink/70 mb-4">Preview not available for this file type</p>
                <button
                  onClick={onDownload || (() => window.open(file.url, '_blank'))}
                  className="px-6 py-3 bg-taro text-white rounded-lg hover:bg-taro/80 transition-colors inline-flex items-center space-x-2"
                >
                  <Download className="w-5 h-5" />
                  <span>Download File</span>
                </button>
              </div>
            )}
          </div>

          {/* Keyboard Hints */}
          <div className="border-t border-ink/10 px-4 py-2 bg-milk-tea/30">
            <div className="flex items-center justify-center space-x-6 text-xs text-ink/60">
              <span className="flex items-center space-x-1">
                <kbd className="px-2 py-1 bg-white/70 rounded border border-ink/20">ESC</kbd>
                <span>Close</span>
              </span>
              {isImage && (
                <>
                  <span className="flex items-center space-x-1">
                    <kbd className="px-2 py-1 bg-white/70 rounded border border-ink/20">+</kbd>
                    <span>Zoom In</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <kbd className="px-2 py-1 bg-white/70 rounded border border-ink/20">-</kbd>
                    <span>Zoom Out</span>
                  </span>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
