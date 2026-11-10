/**
 * Structured Data (JSON-LD) Generator
 * Conforms to schema.org specifications for maximum search engine rich result eligibility.
 * All data strictly describes actual product features without fabricated ratings or reviews.
 */

export const BASE_URL = 'https://dvlpr.dpdns.org';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ArticleData {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
  authorName?: string;
}

/**
 * Organization Schema for CareerDoc AI
 */
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BASE_URL}/#organization`,
    name: 'CareerDoc AI',
    url: BASE_URL,
    logo: `${BASE_URL}/favicon.svg`,
    description: 'Free, privacy-focused AI resume builder, ATS auditor, and career document platform.',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'support.dvlpr@gmail.com',
      contactType: 'customer support'
    }
  };
}

/**
 * WebSite Schema with Potential Search Action
 */
export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    name: 'CareerDoc AI',
    url: BASE_URL,
    publisher: {
      '@id': `${BASE_URL}/#organization`
    },
    inLanguage: 'en-US'
  };
}

/**
 * SoftwareApplication Schema for the Core Application & Landing Pages
 */
export function getSoftwareApplicationSchema(featureName = 'Free AI Resume Builder') {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${BASE_URL}/#software`,
    name: `CareerDoc AI - ${featureName}`,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All (Web-based)',
    url: BASE_URL,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      description: 'Free to create, format, ATS-audit, and download resumes in PDF and Word formats.'
    },
    description:
      'Web-based AI resume maker with real-time ATS scoring, 38 customizable templates, and local data privacy.',
    softwareVersion: '1.2.0',
    screenshot: `${BASE_URL}/og-image.svg`
  };
}

/**
 * BreadcrumbList Schema for Navigation Hierarchy
 */
export function getBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`
    }))
  };
}

/**
 * FAQPage Schema for High-Intent Q&A
 */
export function getFAQSchema(faqs: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

/**
 * BlogPosting / Article Schema for Educational Resource Content
 */
export function getArticleSchema(article: ArticleData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url.startsWith('http') ? article.url : `${BASE_URL}${article.url}`
    },
    headline: article.title,
    description: article.description,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    author: {
      '@type': 'Organization',
      name: article.authorName || 'CareerDoc Editorial Team',
      url: BASE_URL
    },
    publisher: {
      '@id': `${BASE_URL}/#organization`
    },
    image: `${BASE_URL}/og-image.svg`
  };
}

