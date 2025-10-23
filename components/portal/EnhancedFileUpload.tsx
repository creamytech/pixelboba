'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { Upload, X, File, Check, AlertCircle, Loader2 } from 'lucide-react';

interface FileWithProgress {
  file: File;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  errorMessage?: string;
  url?: string;
}

interface EnhancedFileUploadProps {
  projectId: string;
  onUploadComplete?: (files: { url: string; name: string }[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  acceptedTypes?: string[];
}

export default function EnhancedFileUpload({
  projectId,
  onUploadComplete,
  maxFiles = 10,
  maxSizeMB = 50,
  acceptedTypes = [
    'image/*',
    'video/*',
    'application/pdf',
    '.zip',
    '.doc',
    '.docx',
    '.xls',
    '.xlsx',
    '.ppt',
    '.pptx',
  ],
}: EnhancedFileUploadProps) {
  const [files, setFiles] = useState<FileWithProgress[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  };

  const handleFiles = (newFiles: File[]) => {
    // Validate file count
    if (files.length + newFiles.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} files at once.`);
      return;
    }

    // Validate file sizes
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    const invalidFiles = newFiles.filter((file) => file.size > maxSizeBytes);
    if (invalidFiles.length > 0) {
      alert(
        `Some files exceed the ${maxSizeMB}MB size limit: ${invalidFiles.map((f) => f.name).join(', ')}`
      );
      return;
    }

    // Create file objects with metadata
    const filesWithProgress: FileWithProgress[] = newFiles.map((file) => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      progress: 0,
      status: 'pending' as const,
    }));

    setFiles((prev) => [...prev, ...filesWithProgress]);

    // Start uploading
    filesWithProgress.forEach((fileObj) => uploadFile(fileObj));
  };

  const uploadFile = async (fileObj: FileWithProgress) => {
    try {
      // Update status to uploading
      setFiles((prev) =>
        prev.map((f) => (f.id === fileObj.id ? { ...f, status: 'uploading' as const } : f))
      );

      // Create form data
      const formData = new FormData();
      formData.append('file', fileObj.file);
      formData.append('projectId', projectId);

      // Simulate upload progress (you would replace this with actual progress tracking)
      const progressInterval = setInterval(() => {
        setFiles((prev) =>
          prev.map((f) => {
            if (f.id === fileObj.id && f.progress < 90) {
              return { ...f, progress: f.progress + 10 };
            }
            return f;
          })
        );
      }, 200);

      // Upload file
      const response = await fetch('/api/portal/files/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();

      // Update to success
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileObj.id
            ? { ...f, status: 'success' as const, progress: 100, url: data.url }
            : f
        )
      );

      // Check if all uploads complete
      setTimeout(() => {
        const allFiles = files.filter((f) => f.status === 'success');
        if (allFiles.length === files.length && onUploadComplete) {
          onUploadComplete(allFiles.map((f) => ({ url: f.url!, name: f.file.name })));
        }
      }, 500);
    } catch (error) {
      console.error('Upload error:', error);
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileObj.id
            ? {
                ...f,
                status: 'error' as const,
                progress: 0,
                errorMessage: error instanceof Error ? error.message : 'Upload failed',
              }
            : f
        )
      );
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const retryUpload = (fileObj: FileWithProgress) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === fileObj.id ? { ...f, status: 'pending' as const, progress: 0 } : f))
    );
    uploadFile(fileObj);
  };

  const clearCompleted = () => {
    setFiles((prev) => prev.filter((f) => f.status !== 'success'));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (file: File): string => {
    if (file.type.startsWith('image/')) return 'ph:image-duotone';
    if (file.type.startsWith('video/')) return 'ph:video-duotone';
    if (file.type.includes('pdf')) return 'ph:file-pdf-duotone';
    if (file.type.includes('zip') || file.type.includes('compressed')) return 'ph:file-zip-duotone';
    if (file.type.includes('word') || file.type.includes('document')) return 'ph:file-doc-duotone';
    if (file.type.includes('excel') || file.type.includes('spreadsheet'))
      return 'ph:file-xls-duotone';
    if (file.type.includes('powerpoint') || file.type.includes('presentation'))
      return 'ph:file-ppt-duotone';
    return 'ph:file-duotone';
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-4 border-dashed rounded-xl p-12 transition-all cursor-pointer ${
          isDragging
            ? 'border-taro bg-taro/10 scale-[1.02]'
            : 'border-ink/30 bg-white hover:border-matcha hover:bg-matcha/5'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="text-center">
          <motion.div
            animate={{ y: isDragging ? -10 : 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="inline-block mb-4"
          >
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center border-4 border-ink ${
                isDragging ? 'bg-taro' : 'bg-matcha'
              }`}
            >
              <Upload className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>
          </motion.div>

          <h3 className="font-black text-xl uppercase text-ink mb-2">
            {isDragging ? 'Drop files here!' : 'Drop files to upload'}
          </h3>
          <p className="text-ink/60 font-bold mb-4">or click to browse from your computer</p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-ink/50">
            <span>Max {maxFiles} files</span>
            <span>•</span>
            <span>Up to {maxSizeMB}MB each</span>
            <span>•</span>
            <span>Images, Videos, PDFs, Documents</span>
          </div>
        </div>
      </div>

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <h4 className="font-black text-sm uppercase text-ink/70">
                Uploading {files.length} file{files.length !== 1 ? 's' : ''}
              </h4>
              {files.some((f) => f.status === 'success') && (
                <button
                  onClick={clearCompleted}
                  className="text-xs font-bold text-ink/60 hover:text-ink transition-colors uppercase"
                >
                  Clear Completed
                </button>
              )}
            </div>

            {/* Files */}
            {files.map((fileObj) => (
              <motion.div
                key={fileObj.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="bg-white rounded-lg border-3 border-ink p-4"
              >
                <div className="flex items-start gap-4">
                  {/* File Icon */}
                  <div
                    className={`w-12 h-12 rounded-lg border-2 border-ink flex items-center justify-center flex-shrink-0 ${
                      fileObj.status === 'success'
                        ? 'bg-matcha/20'
                        : fileObj.status === 'error'
                          ? 'bg-strawberry/20'
                          : 'bg-taro/20'
                    }`}
                  >
                    <Icon icon={getFileIcon(fileObj.file)} className="w-6 h-6 text-ink" />
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <h5 className="font-black text-ink truncate">{fileObj.file.name}</h5>
                        <p className="text-xs text-ink/60 font-bold">
                          {formatFileSize(fileObj.file.size)}
                        </p>
                      </div>

                      {/* Status Icon */}
                      <div className="flex-shrink-0">
                        {fileObj.status === 'uploading' && (
                          <Loader2 className="w-5 h-5 text-taro animate-spin" />
                        )}
                        {fileObj.status === 'success' && (
                          <div className="w-6 h-6 bg-matcha rounded-full border-2 border-ink flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" strokeWidth={3} />
                          </div>
                        )}
                        {fileObj.status === 'error' && (
                          <div className="w-6 h-6 bg-strawberry rounded-full border-2 border-ink flex items-center justify-center">
                            <AlertCircle className="w-4 h-4 text-white" strokeWidth={3} />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {(fileObj.status === 'uploading' || fileObj.status === 'pending') && (
                      <div className="h-2 bg-ink/10 rounded-full border-2 border-ink overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${fileObj.progress}%` }}
                          transition={{ duration: 0.3 }}
                          className="h-full bg-gradient-to-r from-taro to-matcha"
                        />
                      </div>
                    )}

                    {/* Error Message */}
                    {fileObj.status === 'error' && fileObj.errorMessage && (
                      <div className="flex items-center gap-2 mt-2">
                        <p className="text-xs text-strawberry font-bold flex-1">
                          {fileObj.errorMessage}
                        </p>
                        <button
                          onClick={() => retryUpload(fileObj)}
                          className="text-xs font-black uppercase text-taro hover:text-deep-taro transition-colors"
                        >
                          Retry
                        </button>
                      </div>
                    )}

                    {/* Success Message */}
                    {fileObj.status === 'success' && (
                      <p className="text-xs text-matcha font-bold mt-2">Upload complete!</p>
                    )}
                  </div>

                  {/* Remove Button */}
                  {(fileObj.status === 'pending' ||
                    fileObj.status === 'error' ||
                    fileObj.status === 'success') && (
                    <button
                      onClick={() => removeFile(fileObj.id)}
                      className="flex-shrink-0 w-8 h-8 rounded-lg border-2 border-ink hover:bg-strawberry/20 flex items-center justify-center transition-colors"
                    >
                      <X className="w-4 h-4 text-ink" strokeWidth={2.5} />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
