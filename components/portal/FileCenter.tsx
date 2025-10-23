'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import EnhancedFileUpload from './EnhancedFileUpload';
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
import Pagination from '@/components/common/Pagination';
import { usePagination } from '@/hooks/usePagination';

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
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const fetchFiles = useCallback(async () => {
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
  }, [selectedProject]);

  useEffect(() => {
    fetchFiles();
  }, [selectedProject, fetchFiles]);

  const handleUploadComplete = () => {
    fetchFiles();
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

  const filteredFiles = files.filter(
    (file) =>
      file.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.project?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Use pagination hook
  const {
    paginatedData: paginatedFiles,
    currentPage,
    totalPages,
    itemsPerPage,
    goToPage,
    setItemsPerPage,
    totalItems,
  } = usePagination({ data: filteredFiles, initialItemsPerPage: 24 });

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  return (
    <div className="space-y-6">
      {/* Enhanced Upload Area */}
      <EnhancedFileUpload
        projectId={selectedProject === 'all' ? '' : selectedProject}
        onUploadComplete={handleUploadComplete}
        maxFiles={10}
        maxSizeMB={50}
      />

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ink/60 text-sm font-bold uppercase">total files</p>
              <p className="text-2xl font-black text-ink">{files.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-taro to-deep-taro rounded-full border-3 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] flex items-center justify-center">
              <FileIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ink/60 text-sm font-bold uppercase">storage used</p>
              <p className="text-2xl font-black text-ink">{formatFileSize(totalSize)}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-taro to-deep-taro rounded-full border-3 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] flex items-center justify-center">
              <Upload className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ink/60 text-sm font-bold uppercase">projects</p>
              <p className="text-2xl font-black text-ink">{projects.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-taro to-deep-taro rounded-full border-3 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] flex items-center justify-center">
              <Filter className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl p-6 border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ink/40" />
              <input
                type="text"
                placeholder="search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-10 bg-white rounded-lg border-3 border-ink font-bold focus:outline-none focus:ring-4 focus:ring-taro/20 placeholder-ink/40"
              />
            </div>

            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="px-4 py-3 bg-white rounded-lg border-3 border-ink font-bold focus:outline-none focus:ring-4 focus:ring-taro/20 uppercase"
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
      <div className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-ink/50 font-bold uppercase">loading files...</div>
        ) : filteredFiles.length === 0 ? (
          <div className="p-12 text-center text-ink/50 font-bold uppercase">
            {searchQuery ? 'no files match your search' : 'no files uploaded yet'}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="p-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <AnimatePresence>
                {paginatedFiles.map((file) => (
                  <FileGridItem
                    key={file.id}
                    file={file}
                    onDownload={() => downloadFile(file)}
                    onDelete={() => deleteFile(file.id)}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination for grid view */}
            {filteredFiles.length > 0 && (
              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={goToPage}
                  itemsPerPage={itemsPerPage}
                  totalItems={totalItems}
                  onItemsPerPageChange={setItemsPerPage}
                />
              </div>
            )}
          </div>
        ) : (
          <div>
            <table className="w-full">
              <thead className="bg-gradient-to-r from-milk-tea to-cream border-b-4 border-ink">
                <tr>
                  <th className="px-4 py-4 text-left font-black text-ink uppercase text-sm">
                    name
                  </th>
                  <th className="px-4 py-4 text-left font-black text-ink uppercase text-sm">
                    project
                  </th>
                  <th className="px-4 py-4 text-left font-black text-ink uppercase text-sm">
                    size
                  </th>
                  <th className="px-4 py-4 text-left font-black text-ink uppercase text-sm">
                    uploaded
                  </th>
                  <th className="px-4 py-4 text-left font-black text-ink uppercase text-sm">
                    actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {paginatedFiles.map((file) => (
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

            {/* Pagination for list view */}
            {filteredFiles.length > 0 && (
              <div className="border-t-4 border-ink p-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={goToPage}
                  itemsPerPage={itemsPerPage}
                  totalItems={totalItems}
                  onItemsPerPageChange={setItemsPerPage}
                />
              </div>
            )}
          </div>
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
      className="group relative bg-white rounded-lg border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[5px_5px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] overflow-hidden transition-all"
    >
      {/* File Preview */}
      <div className="aspect-square bg-milk-tea/10 flex items-center justify-center relative overflow-hidden">
        {isImage ? (
          <Image
            src={file.url}
            alt={file.originalName}
            fill
            className="w-full h-full object-cover"
          />
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
        <div className="font-black text-ink text-sm line-clamp-1" title={file.originalName}>
          {file.originalName}
        </div>
        <div className="text-xs text-ink/60 mt-1 font-bold">{formatFileSize(file.size)}</div>
        {file.project && (
          <div className="text-xs text-taro mt-1 font-bold">{file.project.name}</div>
        )}
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
      className="border-b-2 border-ink/10 hover:bg-cream/30 transition-colors bg-white"
    >
      <td className="px-4 py-4 font-bold text-ink">
        <div className="flex items-center space-x-3">
          <FileIcon className="w-6 h-6 text-taro flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="font-black text-ink line-clamp-1">{file.originalName}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 font-bold text-ink">
        <div className="text-ink">{file.project?.name || 'General'}</div>
      </td>
      <td className="px-4 py-4 font-bold text-ink">
        <div className="text-ink">{formatFileSize(file.size)}</div>
      </td>
      <td className="px-4 py-4 font-bold text-ink">
        <div className="text-ink">{new Date(file.createdAt).toLocaleDateString()}</div>
      </td>
      <td className="px-4 py-4 font-bold text-ink">
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
            className="p-1 text-ink/60 hover:text-strawberry transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </motion.tr>
  );
}
