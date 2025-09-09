'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  const pathname = usePathname();

  // Auto-generate breadcrumbs if none provided
  const breadcrumbItems = items || generateBreadcrumbs(pathname);

  if (breadcrumbItems.length <= 1) {
    return null; // Don't show breadcrumbs for home page or single-level pages
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: `https://pixelboba.com${item.href}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <nav aria-label="Breadcrumb" className={`py-4 text-sm text-gray-600 ${className}`}>
        <ol className="flex items-center space-x-2">
          {breadcrumbItems.map((item, index) => (
            <li key={item.href} className="flex items-center">
              {index === 0 && <Home className="w-4 h-4 mr-1" aria-hidden="true" />}

              {index < breadcrumbItems.length - 1 ? (
                <>
                  <Link
                    href={item.href}
                    className="hover:text-taro transition-colors duration-200 lowercase"
                  >
                    {item.label}
                  </Link>
                  <ChevronRight className="w-4 h-4 mx-2 text-gray-400" aria-hidden="true" />
                </>
              ) : (
                <span className="text-gray-900 lowercase font-medium" aria-current="page">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const pathSegments = pathname.split('/').filter(Boolean);

  const breadcrumbs: BreadcrumbItem[] = [{ label: 'home', href: '/' }];

  let currentPath = '';

  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;

    // Convert slug to readable label
    let label = segment.replace(/-/g, ' ');

    // Special cases for better labels
    const labelMap: Record<string, string> = {
      'nextjs-development': 'next.js development',
      'ecommerce-development': 'e-commerce development',
      'saas-website-design': 'saas website design',
      work: 'portfolio',
      services: 'services',
      process: 'our process',
      about: 'about us',
      contact: 'contact',
    };

    if (labelMap[segment]) {
      label = labelMap[segment];
    }

    breadcrumbs.push({
      label,
      href: currentPath,
    });
  });

  return breadcrumbs;
}
