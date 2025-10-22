import { SEOSettings } from '../types/content';

export const updateMetaTags = (seo: SEOSettings) => {
  document.title = seo.title || 'Підмотка спідометра - Професійні рішення';

  updateOrCreateMetaTag('name', 'description', seo.description || 'Три інноваційні рішення для точного коригування пробігу. CAN, аналоговий та OPS модулі для вашого автомобіля.');

  if (seo.keywords) {
    updateOrCreateMetaTag('name', 'keywords', seo.keywords);
  }

  updateOrCreateMetaTag('property', 'og:title', seo.ogTitle || seo.title);
  updateOrCreateMetaTag('property', 'og:description', seo.ogDescription || seo.description);
  updateOrCreateMetaTag('property', 'og:type', 'website');

  if (seo.ogImage) {
    updateOrCreateMetaTag('property', 'og:image', seo.ogImage);
    updateOrCreateMetaTag('property', 'og:image:width', '1200');
    updateOrCreateMetaTag('property', 'og:image:height', '630');
  }

  updateOrCreateMetaTag('name', 'twitter:card', seo.twitterCard || 'summary_large_image');
  updateOrCreateMetaTag('name', 'twitter:title', seo.ogTitle || seo.title);
  updateOrCreateMetaTag('name', 'twitter:description', seo.ogDescription || seo.description);

  if (seo.ogImage) {
    updateOrCreateMetaTag('name', 'twitter:image', seo.ogImage);
  }

  if (seo.canonicalUrl) {
    updateOrCreateLinkTag('canonical', seo.canonicalUrl);
  }
};

const updateOrCreateMetaTag = (attributeName: string, attributeValue: string, content: string) => {
  let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
};

const updateOrCreateLinkTag = (rel: string, href: string) => {
  let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;

  if (!element) {
    element = document.createElement('link');
    element.rel = rel;
    document.head.appendChild(element);
  }

  element.href = href;
};

export const generateStructuredData = (seo: SEOSettings) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: seo.title || 'Підмотка спідометра',
    description: seo.description || 'Професійні рішення для коригування пробігу автомобіля',
    telephone: '+380991604786',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'UA'
    },
    offers: [
      {
        '@type': 'Offer',
        name: 'CAN Підмотка',
        price: '2500',
        priceCurrency: 'UAH',
        description: 'CAN-модуль для корекції показань одометра через штатну CAN-шину автомобіля'
      },
      {
        '@type': 'Offer',
        name: 'Аналогова Підмотка',
        price: '1800',
        priceCurrency: 'UAH',
        description: 'Аналогова підмотка для автомобілів з датчиком швидкості або тахографом'
      },
      {
        '@type': 'Offer',
        name: 'OPS Емулятор',
        price: '3200',
        priceCurrency: 'UAH',
        description: 'Емулятор OPS для вирішення помилки B1150 в Toyota та Lexus'
      }
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+380991604786',
      contactType: 'Customer Service',
      availableLanguage: ['Ukrainian', 'Russian']
    }
  };

  let scriptElement = document.querySelector('script[type="application/ld+json"]');

  if (!scriptElement) {
    scriptElement = document.createElement('script');
    scriptElement.setAttribute('type', 'application/ld+json');
    document.head.appendChild(scriptElement);
  }

  scriptElement.textContent = JSON.stringify(structuredData, null, 2);
};

export const getDefaultSEO = (): SEOSettings => ({
  title: 'Підмотка спідометра - Професійні рішення',
  description: 'Три інноваційні рішення для точного коригування пробігу. CAN, аналоговий та OPS модулі для вашого автомобіля.',
  keywords: 'підмотка спідометра, can модуль, аналогова підмотка, ops емулятор, коригування пробігу, пробіг автомобіля, підмотка одометра',
  ogTitle: 'Підмотка спідометра - CAN, Аналоговий та OPS модулі',
  ogDescription: 'Професійні рішення для коригування пробігу автомобіля. Безпечні та надійні пристрої з гарантією.',
  ogImage: 'https://images.pexels.com/photos/3846511/pexels-photo-3846511.jpeg?auto=compress&cs=tinysrgb&w=1200',
  twitterCard: 'summary_large_image',
  canonicalUrl: 'https://yourdomain.com/'
});
