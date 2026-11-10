import fs from 'fs';
import path from 'path';
import { SITE_METADATA_REGISTRY, BASE_URL } from '../apps/web/src/SEO/metadata/siteMetadata';

function generateSitemaps() {
  console.log('🔄 Generating sitemaps and robots.txt from Site Metadata Registry...');

  const routes = Object.values(SITE_METADATA_REGISTRY).filter(r => r.robots.includes('index'));

  // 1. Build sitemap.xml
  const xmlEntries = routes.map(r => `  <url>
    <loc>${r.canonical}</loc>
    <lastmod>${r.lastmod}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority.toFixed(1)}</priority>
  </url>`).join('\n');

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</urlset>
`;

  // 2. Build sitemap.txt
  const sitemapTxt = routes.map(r => r.canonical).join('\n') + '\n';

  // 3. Build robots.txt
  const robotsTxt = `# Robots.txt for CareerDoc AI Resume Builder
# Production Domain: https://dvlpr.dpdns.org/

User-agent: *
Allow: /
Allow: /ai-resume-builder
Allow: /ats-resume-checker
Allow: /resume-templates
Allow: /ai-cover-letter-generator
Allow: /resume-builder-for-freshers
Allow: /developer-resume-builder
Allow: /blog
Allow: /blog/
Allow: /assets/
Allow: /favicon.svg
Allow: /og-image.svg

# Protect Private User Application Areas and Dynamic State
Disallow: /dashboard
Disallow: /dashboard/
Disallow: /editor
Disallow: /editor/
Disallow: /admin
Disallow: /admin/
Disallow: /api/
Disallow: /api/*

# Explicit Sitemap References
Sitemap: https://dvlpr.dpdns.org/sitemap.xml
`;

  const targetDirs = [
    path.resolve(process.cwd(), 'public'),
    path.resolve(process.cwd(), 'apps/web/public')
  ];

  for (const dir of targetDirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(path.join(dir, 'sitemap.xml'), sitemapXml, 'utf-8');
    fs.writeFileSync(path.join(dir, 'sitemap.txt'), sitemapTxt, 'utf-8');
    fs.writeFileSync(path.join(dir, 'robots.txt'), robotsTxt, 'utf-8');
    console.log(`✅ Updated sitemaps and robots in: ${dir}`);
  }

  console.log(`🎉 Total indexable URLs in sitemap: ${routes.length}`);
}

generateSitemaps();

