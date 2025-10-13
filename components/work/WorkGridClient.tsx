'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Calendar, Star } from 'lucide-react';
import WorkFilter from './WorkFilter';

interface Work {
  slug: string;
  frontmatter: {
    title: string;
    summary: string;
    cover?: string;
    services?: string[];
    impact?: string;
    timeline?: string;
    website?: string;
    category?: string;
  };
}

interface WorkGridClientProps {
  works: Work[];
}

export default function WorkGridClient({ works }: WorkGridClientProps) {
  const [activeFilter, setActiveFilter] = useState('all');

  // Extract unique categories from works
  const categories = useMemo(() => {
    const cats = new Set<string>();
    works.forEach((work) => {
      if (work.frontmatter.category) {
        cats.add(work.frontmatter.category);
      }
      // Also add services as categories
      work.frontmatter.services?.forEach((service) => {
        cats.add(service);
      });
    });
    return Array.from(cats).sort();
  }, [works]);

  // Filter works based on active filter
  const filteredWorks = useMemo(() => {
    if (activeFilter === 'all') return works;
    return works.filter((work) => {
      return (
        work.frontmatter.category === activeFilter ||
        work.frontmatter.services?.includes(activeFilter)
      );
    });
  }, [works, activeFilter]);

  return (
    <>
      <WorkFilter
        categories={categories}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredWorks.map((work) => (
            <motion.div
              key={work.slug}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                href={`/work/${work.slug}`}
                className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:shadow-taro/10 transition-all duration-500 transform hover:-translate-y-4 hover:scale-[1.02] min-h-[400px] flex flex-col border border-ink/10 hover:border-taro/30"
              >
                {/* Project Thumbnail */}
                <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-taro/10 to-deep-taro/20">
                  {work.frontmatter.cover ? (
                    <div className="relative h-full">
                      <Image
                        src={work.frontmatter.cover}
                        alt={work.frontmatter.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.15]"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      {/* Overlay with project info */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* Key metrics on hover */}
                      <div className="absolute top-4 left-4 text-white transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-500 opacity-0 group-hover:opacity-100">
                        <div className="space-y-2">
                          {work.frontmatter.impact && (
                            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
                              <div className="flex items-center gap-2 text-sm">
                                <Star className="w-3 h-3 fill-current" />
                                <span className="font-medium">{work.frontmatter.impact}</span>
                              </div>
                            </div>
                          )}
                          {work.frontmatter.timeline && (
                            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="w-3 h-3" />
                                <span>{work.frontmatter.timeline}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Bottom overlay with CTA */}
                      <div className="absolute bottom-4 left-4 right-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 opacity-0 group-hover:opacity-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm">
                            {work.frontmatter.website && <ExternalLink className="w-4 h-4" />}
                            <span>Live Site</span>
                          </div>
                          <div className="bg-taro backdrop-blur-sm rounded-lg px-4 py-2 group-hover:bg-deep-taro transition-colors duration-300">
                            <span className="text-sm font-semibold">View Case Study →</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full bg-gradient-to-br from-taro to-deep-taro p-8 flex items-center justify-center">
                      <div className="text-white text-center">
                        <h3 className="font-display text-2xl font-bold mb-2 opacity-80">
                          {work.frontmatter.title}
                        </h3>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {work.frontmatter.services?.slice(0, 2).map((service: string) => (
                      <span
                        key={service}
                        className="px-3 py-1 bg-gradient-to-r from-taro/10 to-matcha/10 text-taro text-xs font-medium rounded-full border border-taro/20 transition-colors group-hover:border-taro/40"
                      >
                        {service}
                      </span>
                    ))}
                    {work.frontmatter.services && work.frontmatter.services.length > 2 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded-full">
                        +{work.frontmatter.services.length - 2} more
                      </span>
                    )}
                  </div>

                  <h3 className="font-display text-xl md:text-2xl font-bold text-ink mb-3 group-hover:text-taro transition-colors duration-300 lowercase">
                    {work.frontmatter.title}
                  </h3>

                  <p className="text-gray-600 mb-4 flex-1 line-clamp-2 leading-relaxed lowercase">
                    {work.frontmatter.summary}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Placeholder message if no work items */}
      {filteredWorks.length === 0 && (
        <div className="text-center py-20">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-taro/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-6 h-6 bg-taro rounded-full animate-bounce" />
            </div>
            <h3 className="font-display text-2xl font-bold text-ink mb-2">
              no projects in this category yet
            </h3>
            <p className="text-gray-600">try selecting a different filter to see more work!</p>
          </div>
        </div>
      )}
    </>
  );
}
