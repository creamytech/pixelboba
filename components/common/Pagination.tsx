'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
  showItemsPerPage?: boolean;
  onItemsPerPageChange?: (items: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
  showItemsPerPage = true,
  onItemsPerPageChange,
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 5; // Show max 5 page numbers

    if (totalPages <= showPages) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate range around current page
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push('...');
      }

      // Add pages around current page
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
      {/* Items count */}
      <div className="text-sm text-ink font-display font-bold uppercase">
        Showing <span className="text-taro">{startItem}</span> to{' '}
        <span className="text-taro">{endItem}</span> of{' '}
        <span className="text-taro">{totalItems}</span> items
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-2">
        {/* First page button */}
        <motion.button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-full border-3 border-ink font-black transition-all ${
            currentPage === 1
              ? 'bg-cream opacity-50 cursor-not-allowed shadow-[2px_2px_0px_0px_rgba(58,0,29,1)]'
              : 'bg-white text-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] hover:shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]'
          }`}
          whileHover={currentPage !== 1 ? {} : {}}
          whileTap={currentPage !== 1 ? {} : {}}
          title="First page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </motion.button>

        {/* Previous page button */}
        <motion.button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-full border-3 border-ink font-black transition-all ${
            currentPage === 1
              ? 'bg-cream opacity-50 cursor-not-allowed shadow-[2px_2px_0px_0px_rgba(58,0,29,1)]'
              : 'bg-white text-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] hover:shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]'
          }`}
          whileHover={currentPage !== 1 ? {} : {}}
          whileTap={currentPage !== 1 ? {} : {}}
          title="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </motion.button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((page, index) => {
            if (page === '...') {
              return (
                <span key={`ellipsis-${index}`} className="px-3 py-2 text-ink font-black">
                  ...
                </span>
              );
            }

            const pageNum = page as number;
            const isActive = pageNum === currentPage;

            return (
              <motion.button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`
                  min-w-[40px] h-10 px-3 rounded-full font-display font-black text-sm uppercase
                  transition-all border-2 border-ink
                  ${
                    isActive
                      ? 'bg-taro text-white shadow-[2px_2px_0px_0px_rgba(58,0,29,1)]'
                      : 'bg-white text-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] hover:shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]'
                  }
                `}
                whileHover={!isActive ? {} : {}}
                whileTap={!isActive ? {} : {}}
              >
                {pageNum}
              </motion.button>
            );
          })}
        </div>

        {/* Next page button */}
        <motion.button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-full border-3 border-ink font-black transition-all ${
            currentPage === totalPages
              ? 'bg-cream opacity-50 cursor-not-allowed shadow-[2px_2px_0px_0px_rgba(58,0,29,1)]'
              : 'bg-white text-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] hover:shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]'
          }`}
          whileHover={currentPage !== totalPages ? {} : {}}
          whileTap={currentPage !== totalPages ? {} : {}}
          title="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </motion.button>

        {/* Last page button */}
        <motion.button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-full border-3 border-ink font-black transition-all ${
            currentPage === totalPages
              ? 'bg-cream opacity-50 cursor-not-allowed shadow-[2px_2px_0px_0px_rgba(58,0,29,1)]'
              : 'bg-white text-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] hover:shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]'
          }`}
          whileHover={currentPage !== totalPages ? {} : {}}
          whileTap={currentPage !== totalPages ? {} : {}}
          title="Last page"
        >
          <ChevronsRight className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Items per page selector */}
      {showItemsPerPage && onItemsPerPageChange && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-ink font-display font-bold uppercase">Items per page:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="px-3 py-2 bg-white border-3 border-ink rounded-full text-sm font-display font-black text-ink uppercase shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] focus:translate-x-[-2px] focus:translate-y-[-2px] transition-all"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      )}
    </div>
  );
}
