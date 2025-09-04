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
        name: 'Pixel Boba LLC',
        url: 'https://pixelboba.com',
        logo: 'https://pixelboba.com/brand/logo.png',
        description:
          'Design-first websites with delightful details and boba-smooth interactions. Websites that Pop.',
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
        name: 'Pixel Boba',
        url: 'https://pixelboba.com',
        description:
          'Design-first websites with delightful details and boba-smooth interactions. Websites that Pop.',
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
        name: 'Web Design and Development Services',
        description:
          'Professional web design and development services including Next.js development, UI/UX design, and performance optimization.',
        provider: {
          '@type': 'Organization',
          name: 'Pixel Boba LLC',
        },
        areaServed: 'Global',
        serviceType: 'Web Development',
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
