import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogType?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
}

export function useSEO({
  title,
  description,
  keywords,
  canonical,
  ogType = 'website',
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl
}: SEOProps) {
  useEffect(() => {
    // 1. Update document title
    if (title) {
      document.title = title;
    }

    // Helper function to update meta tags
    const updateMetaTag = (name: string, content?: string, isProperty = false) => {
      if (content === undefined) return;
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let element = document.querySelector(selector);
      if (element) {
        element.setAttribute('content', content);
      } else {
        element = document.createElement('meta');
        if (isProperty) {
          element.setAttribute('property', name);
        } else {
          element.setAttribute('name', name);
        }
        element.setAttribute('content', content);
        document.head.appendChild(element);
      }
    };

    // 2. Update standard meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);

    // 3. Update Open Graph tags
    updateMetaTag('og:type', ogType, true);
    updateMetaTag('og:title', ogTitle || title, true);
    updateMetaTag('og:description', ogDescription || description, true);
    updateMetaTag('og:url', ogUrl || window.location.href, true);
    if (ogImage) {
      updateMetaTag('og:image', ogImage, true);
    }

    // 4. Update Twitter tags
    updateMetaTag('twitter:card', 'summary_large_image', false);
    updateMetaTag('twitter:url', ogUrl || window.location.href, false);
    updateMetaTag('twitter:title', ogTitle || title, false);
    updateMetaTag('twitter:description', ogDescription || description, false);
    if (ogImage) {
      updateMetaTag('twitter:image', ogImage, false);
    }

    // 5. Update Canonical link
    const canonicalUrl = canonical || window.location.href;
    let canonicalElement = document.querySelector('link[rel="canonical"]');
    if (canonicalElement) {
      canonicalElement.setAttribute('href', canonicalUrl);
    } else {
      canonicalElement = document.createElement('link');
      canonicalElement.setAttribute('rel', 'canonical');
      canonicalElement.setAttribute('href', canonicalUrl);
      document.head.appendChild(canonicalElement);
    }
  }, [title, description, keywords, canonical, ogType, ogTitle, ogDescription, ogImage, ogUrl]);
}
