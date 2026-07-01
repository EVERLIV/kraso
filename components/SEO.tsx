import React, { useEffect } from 'react';

const SITE_URL = 'https://smartphotos.ru';

export interface SEOProps {
  title: string;
  description: string;
  path?: string;
  noIndex?: boolean;
}

/**
 * Обновляет document.title и meta-теги для SEO при смене страницы (SPA).
 */
const SEO: React.FC<SEOProps> = ({ title, description, path = '/', noIndex = false }) => {
  const fullUrl = path === '/' ? SITE_URL : `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;

  useEffect(() => {
    document.title = title;

    const setMetaContent = (nameOrProperty: string, value: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${nameOrProperty}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, nameOrProperty);
        document.head.appendChild(el);
      }
      el.setAttribute('content', value);
    };

    setMetaContent('description', description);
    setMetaContent('og:title', title, true);
    setMetaContent('og:description', description, true);
    setMetaContent('og:url', fullUrl, true);

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (canonical) canonical.href = fullUrl;
    else {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      canonical.href = fullUrl;
      document.head.appendChild(canonical);
    }

    let robots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (noIndex) {
      if (!robots) {
        robots = document.createElement('meta');
        robots.name = 'robots';
        document.head.appendChild(robots);
      }
      robots.content = 'noindex, nofollow';
    } else if (robots) {
      robots.content = 'index, follow';
    }
  }, [title, description, fullUrl, noIndex]);

  return null;
};

export default SEO;
