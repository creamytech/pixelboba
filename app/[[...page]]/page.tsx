import { builder } from '@builder.io/sdk';
import { RenderBuilderContent } from '@/components/builder/RenderBuilderContent';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Fetch Builder.io content server-side
async function getBuilderContent(path: string) {
  // Don't fetch Builder content for these routes - they should use their own pages
  const excludedRoutes = [
    '/portal',
    '/admin',
    '/api',
    '/start',
    '/work',
    '/services',
    '/boba-club',
    '/process',
    '/about',
    '/contact',
    '/_next',
  ];

  if (excludedRoutes.some((route) => path.startsWith(route))) {
    return null;
  }

  try {
    const content = await builder
      .get('page', {
        userAttributes: {
          urlPath: path,
        },
      })
      .toPromise();

    return content;
  } catch (error) {
    console.error('Error fetching Builder content:', error);
    return null;
  }
}

interface PageProps {
  params: Promise<{
    page?: string[];
  }>;
}

export default async function Page({ params }: PageProps) {
  const { page } = await params;
  const path = '/' + (page?.join('/') || '');

  const content = await getBuilderContent(path);

  // If no Builder content, return null and let Next.js show 404
  if (!content) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <RenderBuilderContent content={content} />
      </main>
      <Footer />
    </div>
  );
}

// Generate metadata for Builder pages
export async function generateMetadata({ params }: PageProps) {
  const { page } = await params;
  const path = '/' + (page?.join('/') || '');

  const content = await getBuilderContent(path);

  if (!content) {
    return {
      title: 'Page Not Found',
    };
  }

  return {
    title: content.data?.title || 'Pixel Boba',
    description: content.data?.description || 'Web design and development by Pixel Boba',
  };
}
