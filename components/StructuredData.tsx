interface Organization {
  '@context': 'https://schema.org';
  '@type': 'Organization';
  name: string;
  url: string;
  logo: string;
  description: string;
  address?: {
    '@type': 'PostalAddress';
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
  contactPoint?: {
    '@type': 'ContactPoint';
    telephone?: string;
    contactType: string;
    email: string;
  };
  sameAs: string[];
}

interface WebSite {
  '@context': 'https://schema.org';
  '@type': 'WebSite';
  name: string;
  url: string;
  description: string;
  potentialAction: {
    '@type': 'SearchAction';
    target: string;
    'query-input': string;
  };
}

interface Service {
  '@context': 'https://schema.org';
  '@type': 'Service';
  name: string;
  description: string;
  provider: {
    '@type': 'Organization';
    name: string;
  };
  areaServed: string;
  serviceType: string;
}

interface StructuredDataProps {
  type: 'organization' | 'website' | 'service';
  data?: any;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  let structuredData: Organization | WebSite | Service;

  switch (type) {
    case 'organization':
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'pixel boba llc',
        url: 'https://pixelboba.com',
        logo: 'https://pixelboba.com/brand/Pixel_Boba_Logo_White.svg',
        description:
          'Professional Fort Lauderdale web design agency creating custom websites that convert visitors into customers. Specializing in Next.js, React, SaaS website design, and ecommerce development for South Florida businesses.',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Fort Lauderdale',
          addressRegion: 'FL',
          addressCountry: 'US',
        },
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          email: 'hello@pixelboba.com',
        },
        sameAs: [
          'https://twitter.com/pixelboba_',
          'https://instagram.com/pixel.boba',
          'https://github.com/creamytech/pixelboba',
        ],
      };
      break;

    case 'website':
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'pixel boba',
        url: 'https://pixelboba.com',
        description:
          'Fort Lauderdale web design company creating custom websites that convert visitors into customers. Local South Florida team specializing in Next.js, React, and modern web development.',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://pixelboba.com/work?search={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      };
      break;

    case 'service':
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'web design and development services',
        description:
          'Professional web design and development services including Next.js development, React websites, SaaS landing pages, ecommerce development, and conversion optimization. Based in Fort Lauderdale, Florida, serving South Florida businesses and clients globally.',
        provider: {
          '@type': 'Organization',
          name: 'pixel boba llc',
        },
        areaServed: [
          'Fort Lauderdale',
          'Broward County',
          'Miami',
          'Miami-Dade County',
          'Palm Beach County',
          'Boca Raton',
          'Pompano Beach',
          'Hollywood',
          'South Florida',
          'Florida',
          'United States',
          'Global',
        ],
        serviceType: 'web development',
        ...data,
      };
      break;

    default:
      return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}
