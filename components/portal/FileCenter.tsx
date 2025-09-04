'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import {
  Upload,
  Download,
  Eye,
  FileText,
  Image as ImageIcon,
  Video,
  File as FileIcon,
  Trash2,
  Search,
  Filter,
} from 'lucide-react';
import { File as PortalFile, Project } from '@/types/portal';

interface FileCenterProps {
  projects: Project[];
}

const getFileIcon = (mimetype: string) => {
  if (mimetype.startsWith('image/')) return ImageIcon;
  if (mimetype.startsWith('video/')) return Video;
  if (mimetype.includes('pdf') || mimetype.includes('document')) return FileText;
  return FileIcon;
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default function FileCenter({ projects }: FileCenterProps) {
  const [files, setFiles] = useState<PortalFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchFiles();
  }, [selectedProject]);

  const fetchFiles = async () => {
    try {
      const url =
        selectedProject === 'all'
          ? '/api/portal/files'
          : `/api/portal/files?projectId=${selectedProject}`;

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setFiles(data.files);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadFiles = async (newFiles: File[]) => {
    setUploading(true);
    const formData = new FormData();

    newFiles.forEach((file) => formData.append('files', file));
    if (selectedProject !== 'all') {
      formData.append('projectId', selectedProject);
    }

    try {
      const response = await fetch('/api/portal/files/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        fetchFiles();
      }
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (fileId: string) => {
    try {
      const response = await fetch(`/api/portal/files/${fileId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setFiles(files.filter((f) => f.id !== fileId));
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const downloadFile = async (file: PortalFile) => {
    try {
      const response = await fetch(file.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.originalName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: uploadFiles,
    multiple: true,
    maxSize: 50 * 1024 * 1024, // 50MB per file
  });

  const filteredFiles = files.filter(
    (file) =>
      file.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.project?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
          isDragActive ? 'border-taro bg-taro/5' : 'border-ink/20 bg-white/50 hover:bg-white/70'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <input {...getInputProps()} />

        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-taro/10 rounded-full flex items-center justify-center">
            <Upload className="w-8 h-8 text-taro" />
          </div>

          <div>
            <p className="text-lg font-medium text-ink">
              {uploading ? 'uploading files...' : 'drop files here or click to upload'}
            </p>
            <p className="text-sm text-ink/60 mt-1">
              supports images, documents, videos up to 50mb each
            </p>
          </div>

          {uploading && (
            <div className="w-8 h-8 border-4 border-taro/30 border-t-taro rounded-full animate-spin mx-auto" />
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-6">
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-ink/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ink/60 text-sm font-medium">total files</p>
              <p className="text-2xl font-bold text-ink">{files.length}</p>
            </div>
            <FileIcon className="w-8 h-8 text-taro/60" />
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-ink/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ink/60 text-sm font-medium">storage used</p>
              <p className="text-2xl font-bold text-ink">{formatFileSize(totalSize)}</p>
            </div>
            <Upload className="w-8 h-8 text-taro/60" />
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-ink/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ink/60 text-sm font-medium">projects</p>
              <p className="text-2xl font-bold text-ink">{projects.length}</p>
            </div>
            <Filter className="w-8 h-8 text-taro/60" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-ink/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ink/40" />
              <input
                type="text"
                placeholder="search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-ink/20 rounded-lg bg-white/70 text-ink placeholder-ink/40 focus:outline-none focus:ring-2 focus:ring-taro/20"
              />
            </div>

            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="px-4 py-2 border border-ink/20 rounded-lg bg-white/70 text-ink focus:outline-none focus:ring-2 focus:ring-taro/20"
            >
              <option value="all">all projects</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-taro text-white'
                  : 'text-ink/60 hover:text-ink hover:bg-white/70'
              }`}
            >
              <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
              </div>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-taro text-white'
                  : 'text-ink/60 hover:text-ink hover:bg-white/70'
              }`}
            >
              <div className="w-4 h-4 flex flex-col space-y-0.5">
                <div className="bg-current h-0.5 rounded"></div>
                <div className="bg-current h-0.5 rounded"></div>
                <div className="bg-current h-0.5 rounded"></div>
                <div className="bg-current h-0.5 rounded"></div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Files */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-ink/10 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-ink/50">loading files...</div>
        ) : filteredFiles.length === 0 ? (
          <div className="p-12 text-center text-ink/50">
            {searchQuery ? 'no files match your search' : 'no files uploaded yet'}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="p-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <AnimatePresence>
                {filteredFiles.map((file) => (
                  <FileGridItem
                    key={file.id}
                    file={file}
                    onDownload={() => downloadFile(file)}
                    onDelete={() => deleteFile(file.id)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-milk-tea/20">
              <tr>
                <th className="text-left p-4 font-medium text-ink">name</th>
                <th className="text-left p-4 font-medium text-ink">project</th>
                <th className="text-left p-4 font-medium text-ink">size</th>
                <th className="text-left p-4 font-medium text-ink">uploaded</th>
                <th className="text-left p-4 font-medium text-ink">actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredFiles.map((file) => (
                  <FileListItem
                    key={file.id}
                    file={file}
                    onDownload={() => downloadFile(file)}
                    onDelete={() => deleteFile(file.id)}
                  />
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function FileGridItem({
  file,
  onDownload,
  onDelete,
}: {
  file: PortalFile;
  onDownload: () => void;
  onDelete: () => void;
}) {
  const FileIcon = getFileIcon(file.mimetype);
  const isImage = file.mimetype.startsWith('image/');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group relative bg-white/70 rounded-lg border border-ink/10 overflow-hidden hover:shadow-lg transition-all"
    >
      {/* File Preview */}
      <div className="aspect-square bg-milk-tea/10 flex items-center justify-center relative overflow-hidden">
        {isImage ? (
          <img src={file.url} alt={file.originalName} className="w-full h-full object-cover" />
        ) : (
          <FileIcon className="w-12 h-12 text-taro/60" />
        )}

        {/* Hover Actions */}
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex space-x-2">
            <button
              onClick={onDownload}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* File Info */}
      <div className="p-3">
        <div className="font-medium text-ink text-sm line-clamp-1" title={file.originalName}>
          {file.originalName}
        </div>
        <div className="text-xs text-ink/60 mt-1">{formatFileSize(file.size)}</div>
        {file.project && <div className="text-xs text-taro/70 mt-1">{file.project.name}</div>}
      </div>
    </motion.div>
  );
}

function FileListItem({
  file,
  onDownload,
  onDelete,
}: {
  file: PortalFile;
  onDownload: () => void;
  onDelete: () => void;
}) {
  const FileIcon = getFileIcon(file.mimetype);

  return (
    <motion.tr
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="border-b border-ink/5 hover:bg-milk-tea/10 transition-colors"
    >
      <td className="p-4">
        <div className="flex items-center space-x-3">
          <FileIcon className="w-6 h-6 text-taro/60 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="font-medium text-ink line-clamp-1">{file.originalName}</div>
          </div>
        </div>
      </td>
      <td className="p-4">
        <div className="text-ink">{file.project?.name || 'General'}</div>
      </td>
      <td className="p-4">
        <div className="text-ink">{formatFileSize(file.size)}</div>
      </td>
      <td className="p-4">
        <div className="text-ink">{new Date(file.createdAt).toLocaleDateString()}</div>
      </td>
      <td className="p-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={onDownload}
            className="p-1 text-ink/60 hover:text-ink transition-colors"
            title="Download"
          >
            <Download size={16} />
          </button>
          <button
            onClick={onDelete}
            className="p-1 text-ink/60 hover:text-red-500 transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </motion.tr>
  );
}
