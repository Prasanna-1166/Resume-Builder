import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';
import { SITE_METADATA_REGISTRY, BASE_URL } from '../../apps/web/src/SEO/metadata/siteMetadata';

describe('Technical SEO: Sitemap & Robots.txt Verification', () => {
  const publicDir = path.resolve(process.cwd(), 'public');
  const webPublicDir = path.resolve(process.cwd(), 'apps/web/public');
  const sitemapXmlPath = path.join(publicDir, 'sitemap.xml');
  const sitemapTxtPath = path.join(publicDir, 'sitemap.txt');
  const robotsTxtPath = path.join(publicDir, 'robots.txt');

  it('should ensure sitemap.xml exists and contains valid XML syntax', () => {
    assert.ok(fs.existsSync(sitemapXmlPath), 'public/sitemap.xml must exist');
    const content = fs.readFileSync(sitemapXmlPath, 'utf-8');

    assert.ok(content.startsWith('<?xml version="1.0" encoding="UTF-8"?>'), 'Must start with XML declaration');
    assert.ok(content.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'), 'Must include sitemaps.org 0.9 namespace');
    assert.ok(content.endsWith('</urlset>\n') || content.endsWith('</urlset>'), 'Must terminate with closing urlset tag');
  });

  it('should ensure sitemap.txt contains one absolute HTTPS canonical URL per line with zero extra markup', () => {
    assert.ok(fs.existsSync(sitemapTxtPath), 'public/sitemap.txt must exist');
    const content = fs.readFileSync(sitemapTxtPath, 'utf-8');
    const lines = content.split('\n').map(l => l.trim()).filter(Boolean);

    assert.ok(lines.length >= 10, 'Must contain at least 10 indexable public URLs');
    for (const line of lines) {
      assert.ok(line.startsWith('https://dvlpr.dpdns.org/'), `Every line must be an absolute HTTPS URL on production domain: ${line}`);
      assert.ok(!line.includes('<'), `No HTML/XML tags permitted in sitemap.txt: ${line}`);
      assert.ok(!line.includes(' '), `No spaces permitted in URL line: ${line}`);
    }
  });

  it('should ensure sitemap.xml and sitemap.txt are 100% synchronized and have zero duplicate URLs', () => {
    const xmlContent = fs.readFileSync(sitemapXmlPath, 'utf-8');
    const txtContent = fs.readFileSync(sitemapTxtPath, 'utf-8');

    const txtUrls = txtContent.split('\n').map(l => l.trim()).filter(Boolean);
    const xmlLocMatches = Array.from(xmlContent.matchAll(/<loc>(.*?)<\/loc>/g)).map(m => m[1]);

    assert.strictEqual(txtUrls.length, xmlLocMatches.length, 'Count of URLs in sitemap.txt must match sitemap.xml');

    // Uniqueness check
    const uniqueTxtUrls = new Set(txtUrls);
    const uniqueXmlUrls = new Set(xmlLocMatches);
    assert.strictEqual(uniqueTxtUrls.size, txtUrls.length, 'Sitemap.txt must not contain duplicate URLs');
    assert.strictEqual(uniqueXmlUrls.size, xmlLocMatches.length, 'Sitemap.xml must not contain duplicate URLs');

    // Exact match check
    for (let i = 0; i < txtUrls.length; i++) {
      assert.strictEqual(txtUrls[i], xmlLocMatches[i], `URL mismatch at index ${i}`);
    }
  });

  it('should strictly exclude private application routes, editors, dashboards, and APIs from all sitemaps', () => {
    const xmlContent = fs.readFileSync(sitemapXmlPath, 'utf-8');
    const forbiddenPatterns = [
      '/dashboard',
      '/editor',
      '/admin',
      '/api',
      '/uploads',
      'user_id',
      'resume_id',
      'token',
      'secret'
    ];

    for (const pattern of forbiddenPatterns) {
      assert.ok(
        !xmlContent.includes(`<loc>${BASE_URL}${pattern}`),
        `Sitemap must never expose private application path: ${pattern}`
      );
    }
  });

  it('should ensure robots.txt permits public crawlers and explicitly protects private user areas', () => {
    assert.ok(fs.existsSync(robotsTxtPath), 'public/robots.txt must exist');
    const content = fs.readFileSync(robotsTxtPath, 'utf-8');

    assert.ok(content.includes('User-agent: *'), 'Must specify User-agent: *');
    assert.ok(content.includes('Allow: /'), 'Must allow root path');
    assert.ok(content.includes('Allow: /assets/'), 'Must permit CSS and JS assets');
    assert.ok(content.includes('Disallow: /dashboard'), 'Must disallow /dashboard');
    assert.ok(content.includes('Disallow: /editor'), 'Must disallow /editor');
    assert.ok(content.includes('Disallow: /admin'), 'Must disallow /admin');
    assert.ok(content.includes('Disallow: /api/'), 'Must disallow /api/');
    assert.ok(content.includes('Sitemap: https://dvlpr.dpdns.org/sitemap.xml'), 'Must declare sitemap location');
  });

  it('should ensure apps/web/public contains identical synchronized copies of SEO files', () => {
    const rootXml = fs.readFileSync(sitemapXmlPath, 'utf-8');
    const webXml = fs.readFileSync(path.join(webPublicDir, 'sitemap.xml'), 'utf-8');
    assert.strictEqual(rootXml, webXml, 'apps/web/public/sitemap.xml must match root public/sitemap.xml');

    const rootTxt = fs.readFileSync(sitemapTxtPath, 'utf-8');
    const webTxt = fs.readFileSync(path.join(webPublicDir, 'sitemap.txt'), 'utf-8');
    assert.strictEqual(rootTxt, webTxt, 'apps/web/public/sitemap.txt must match root public/sitemap.txt');

    const rootRobots = fs.readFileSync(robotsTxtPath, 'utf-8');
    const webRobots = fs.readFileSync(path.join(webPublicDir, 'robots.txt'), 'utf-8');
    assert.strictEqual(rootRobots, webRobots, 'apps/web/public/robots.txt must match root public/robots.txt');
  });
});

