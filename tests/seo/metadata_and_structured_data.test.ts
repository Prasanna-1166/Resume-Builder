import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  SITE_METADATA_REGISTRY,
  PRIVATE_ROUTES_METADATA,
  getRouteMetadata,
  BASE_URL
} from '../../apps/web/src/SEO/metadata/siteMetadata';
import { BLOG_POSTS } from '../../apps/web/src/pages/blog/BlogData';
import {
  getOrganizationSchema,
  getWebSiteSchema,
  getSoftwareApplicationSchema,
  getBreadcrumbSchema,
  getFAQSchema,
  getArticleSchema
} from '../../apps/web/src/SEO/structured-data/schemas';

describe('Advanced On-Page SEO & Structured Data Validation', () => {
  const routes = Object.values(SITE_METADATA_REGISTRY);

  it('should ensure every public indexable route has a unique, non-empty SEO title and description', () => {
    const titles = new Set<string>();
    const descriptions = new Set<string>();

    for (const route of routes) {
      assert.ok(route.title && route.title.trim().length > 15, `Route ${route.path} has title too short: ${route.title}`);
      assert.ok(route.description && route.description.trim().length > 50, `Route ${route.path} has description too short`);

      assert.ok(!titles.has(route.title), `Duplicate title detected: "${route.title}" on route ${route.path}`);
      assert.ok(!descriptions.has(route.description), `Duplicate description detected on route ${route.path}`);

      titles.add(route.title);
      descriptions.add(route.description);
    }
  });

  it('should ensure every canonical URL uses HTTPS and targets the production domain with self-referencing accuracy', () => {
    for (const route of routes) {
      assert.ok(
        route.canonical.startsWith('https://dvlpr.dpdns.org'),
        `Canonical must point to https://dvlpr.dpdns.org: ${route.canonical}`
      );
      const expectedPath = route.path === '/' ? `${BASE_URL}/` : `${BASE_URL}${route.path}`;
      assert.strictEqual(route.canonical, expectedPath, `Canonical URL mismatch on route ${route.path}`);
    }
  });

  it('should ensure Open Graph and Twitter Card metadata are populated across all public routes', () => {
    for (const route of routes) {
      assert.ok(route.ogType === 'website' || route.ogType === 'article', `Invalid og:type on ${route.path}: ${route.ogType}`);
      assert.ok(route.ogImage.startsWith('https://'), `og:image must be an absolute HTTPS URL on ${route.path}`);
      assert.ok(route.breadcrumbs && route.breadcrumbs.length > 0, `Route ${route.path} must have breadcrumbs`);
    }
  });

  it('should verify Schema.org JSON-LD structured data generators produce valid specifications', () => {
    const org = getOrganizationSchema();
    assert.strictEqual(org['@context'], 'https://schema.org');
    assert.strictEqual(org['@type'], 'Organization');
    assert.strictEqual(org.name, 'CareerDoc AI');
    assert.strictEqual(org.url, 'https://dvlpr.dpdns.org');

    const website = getWebSiteSchema();
    assert.strictEqual(website['@type'], 'WebSite');
    assert.strictEqual(website.name, 'CareerDoc AI');

    const app = getSoftwareApplicationSchema('AI Resume Maker');
    assert.strictEqual(app['@type'], 'SoftwareApplication');
    assert.strictEqual(app.applicationCategory, 'BusinessApplication');
    assert.strictEqual(app.offers.price, '0');

    const breadcrumbs = getBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Templates', url: '/resume-templates' }
    ]);
    assert.strictEqual(breadcrumbs['@type'], 'BreadcrumbList');
    assert.strictEqual(breadcrumbs.itemListElement.length, 2);
    assert.strictEqual(breadcrumbs.itemListElement[0].position, 1);

    const faq = getFAQSchema([
      { question: 'Is it free?', answer: 'Yes, 100% free.' }
    ]);
    assert.strictEqual(faq['@type'], 'FAQPage');
    assert.strictEqual(faq.mainEntity[0].name, 'Is it free?');
    assert.strictEqual(faq.mainEntity[0].acceptedAnswer.text, 'Yes, 100% free.');

    const article = getArticleSchema({
      title: 'Guide Title',
      description: 'Guide Description',
      url: '/blog/guide-1',
      datePublished: '2026-10-15',
      dateModified: '2026-11-10'
    });
    assert.strictEqual(article['@type'], 'BlogPosting');
    assert.strictEqual(article.headline, 'Guide Title');
  });

  it('should enforce strict noindex, nofollow directives on private routes', () => {
    const privatePaths = ['/dashboard', '/editor', '/admin'];

    for (const p of privatePaths) {
      const meta = getRouteMetadata(p);
      assert.strictEqual(
        meta.robots,
        'noindex, nofollow',
        `Private route ${p} must have robots="noindex, nofollow"`
      );
    }
  });

  it('should ensure all 5 blog guides exist, contain comprehensive sections, and link back to product tools', () => {
    const expectedSlugs = [
      'ats-friendly-resume-guide',
      'resume-for-freshers',
      'software-developer-resume-guide',
      'how-to-improve-ats-score',
      'how-to-write-cover-letter'
    ];

    for (const slug of expectedSlugs) {
      const post = BLOG_POSTS[slug];
      assert.ok(post, `Blog post ${slug} must be registered`);
      assert.ok(post.title.length > 20, `Title must be descriptive for ${slug}`);
      assert.ok(post.content.sections.length >= 3, `Post ${slug} must contain at least 3 deep sections`);
      assert.ok(post.targetToolUrl.startsWith('/'), `Post ${slug} must link to internal tool`);
      assert.ok(post.targetToolCta.length > 10, `Post ${slug} must have clear conversion CTA`);
    }
  });
});

