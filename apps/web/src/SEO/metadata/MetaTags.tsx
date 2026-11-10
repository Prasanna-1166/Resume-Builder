import React, { useEffect } from 'react';
import { getRouteMetadata, RouteMetadata } from './siteMetadata';

interface MetaTagsProps {
  path?: string;
  override?: Partial<RouteMetadata>;
}

export const MetaTags: React.FC<MetaTagsProps> = ({ path, override }) => {
  const currentPath =
    path || (typeof window !== 'undefined' ? window.location.pathname : '/');
  const metadata = { ...getRouteMetadata(currentPath), ...(override || {}) };

  useEffect(() => {
    if (typeof document === 'undefined') return;

    // 1. Title
    document.title = metadata.title;

    // 2. Helper to set or create meta tags
    const setMetaTag = (attribute: 'name' | 'property', key: string, value: string) => {
      let element = document.querySelector(`meta[${attribute}="${key}"]`) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', value);
    };

    // 3. Helper to set or create link tags (e.g. canonical)
    const setLinkTag = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // Standard SEO Tags
    setMetaTag('name', 'description', metadata.description);
    setMetaTag('name', 'robots', metadata.robots);
    setLinkTag('canonical', metadata.canonical);

    // Open Graph Tags
    setMetaTag('property', 'og:title', metadata.ogTitle || metadata.title);
    setMetaTag('property', 'og:description', metadata.ogDescription || metadata.description);
    setMetaTag('property', 'og:url', metadata.canonical);
    setMetaTag('property', 'og:type', metadata.ogType);
    setMetaTag('property', 'og:image', metadata.ogImage);
    setMetaTag('property', 'og:site_name', 'CareerDoc AI');

    // Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', metadata.ogTitle || metadata.title);
    setMetaTag('name', 'twitter:description', metadata.ogDescription || metadata.description);
    setMetaTag('name', 'twitter:image', metadata.ogImage);

    // Structured Data (JSON-LD)
    // Remove existing dynamically added schema scripts
    const existingScripts = document.querySelectorAll('script[data-seo-jsonld="true"]');
    existingScripts.forEach(script => script.remove());

    if (metadata.schemas && metadata.schemas.length > 0) {
      metadata.schemas.forEach(schema => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-seo-jsonld', 'true');
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
      });
    }
  }, [currentPath, metadata]);

  return null;
};

export default MetaTags;

