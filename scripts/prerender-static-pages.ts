import fs from 'fs';
import path from 'path';
import { SITE_METADATA_REGISTRY, BASE_URL } from '../apps/web/src/SEO/metadata/siteMetadata';
import { BLOG_POSTS } from '../apps/web/src/pages/blog/BlogData';

function prerenderPages() {
  console.log('🚀 Running Post-Build Static Prerendering for SEO & Search Engine Crawlability...');

  const distDir = path.resolve(process.cwd(), 'apps/web/dist');
  const baseHtmlPath = path.join(distDir, 'index.html');

  if (!fs.existsSync(baseHtmlPath)) {
    console.error('❌ apps/web/dist/index.html not found! Run npm run build first.');
    process.exit(1);
  }

  const baseHtml = fs.readFileSync(baseHtmlPath, 'utf-8');

  // Copy sitemaps and robots to dist
  const publicDir = path.resolve(process.cwd(), 'apps/web/public');
  const filesToCopy = ['sitemap.xml', 'sitemap.txt', 'robots.txt', 'og-image.svg', 'favicon.svg'];
  for (const file of filesToCopy) {
    const src = path.join(publicDir, file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(distDir, file));
    }
  }

  const routes = Object.values(SITE_METADATA_REGISTRY);

  for (const route of routes) {
    let customHtml = baseHtml;

    // 1. Title replacement
    customHtml = customHtml.replace(
      /<title>.*?<\/title>/i,
      `<title>${route.title}</title>`
    );

    // 2. Meta description replacement
    customHtml = customHtml.replace(
      /<meta name="description" content=".*?" \/>/i,
      `<meta name="description" content="${route.description.replace(/"/g, '&quot;')}" />`
    );

    // 3. Canonical replacement
    customHtml = customHtml.replace(
      /<link rel="canonical" href=".*?" \/>/i,
      `<link rel="canonical" href="${route.canonical}" />`
    );

    // 4. Open Graph replacements
    customHtml = customHtml.replace(
      /<meta property="og:title" content=".*?" \/>/i,
      `<meta property="og:title" content="${(route.ogTitle || route.title).replace(/"/g, '&quot;')}" />`
    );
    customHtml = customHtml.replace(
      /<meta property="og:description" content=".*?" \/>/i,
      `<meta property="og:description" content="${(route.ogDescription || route.description).replace(/"/g, '&quot;')}" />`
    );
    customHtml = customHtml.replace(
      /<meta property="og:url" content=".*?" \/>/i,
      `<meta property="og:url" content="${route.canonical}" />`
    );
    customHtml = customHtml.replace(
      /<meta property="og:type" content=".*?" \/>/i,
      `<meta property="og:type" content="${route.ogType}" />`
    );

    // 5. Twitter Card replacements
    customHtml = customHtml.replace(
      /<meta name="twitter:title" content=".*?" \/>/i,
      `<meta name="twitter:title" content="${(route.ogTitle || route.title).replace(/"/g, '&quot;')}" />`
    );
    customHtml = customHtml.replace(
      /<meta name="twitter:description" content=".*?" \/>/i,
      `<meta name="twitter:description" content="${(route.ogDescription || route.description).replace(/"/g, '&quot;')}" />`
    );

    // 6. Structured Data (JSON-LD) injection
    const jsonLdBlocks = (route.schemas || [])
      .map(s => `<script type="application/ld+json" data-seo-jsonld="true">${JSON.stringify(s)}</script>`)
      .join('\n    ');

    // Replace initial JSON-LD scripts with route-specific schemas
    customHtml = customHtml.replace(
      /(<script type="application\/ld\+json">[\s\S]*?<\/script>\s*)+/i,
      `${jsonLdBlocks}\n    `
    );

    // 7. Inject Semantic Static Snapshot inside <div id="root">
    // This allows web crawlers without JavaScript execution to index headers, paragraphs, and links immediately.
    let semanticBody = '';
    if (route.path === '/') {
      semanticBody = `
        <header>
          <h1>Free AI Resume Builder | ATS-Friendly Resume Maker</h1>
          <p>${route.description}</p>
        </header>
        <nav aria-label="Quick Links">
          <a href="/ai-resume-builder">AI Resume Builder</a>
          <a href="/ats-resume-checker">ATS Resume Checker</a>
          <a href="/resume-templates">38 Resume Templates</a>
          <a href="/ai-cover-letter-generator">AI Cover Letter Generator</a>
          <a href="/resume-builder-for-freshers">Resume Builder for Freshers</a>
          <a href="/developer-resume-builder">Developer Resume Builder</a>
          <a href="/blog">Career &amp; Resume Blog</a>
        </nav>
      `;
    } else if (route.path.startsWith('/blog/')) {
      const slug = route.path.replace(/^\/blog\//, '');
      const post = BLOG_POSTS[slug];
      if (post) {
        semanticBody = `
          <article>
            <header>
              <nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/blog">Blog</a> / ${post.title}</nav>
              <h1>${post.title}</h1>
              <p>Published on ${post.datePublished} by ${post.author} • ${post.readTime}</p>
            </header>
            <p>${post.content.introduction}</p>
            ${post.content.sections.map(s => `
              <section>
                <h2>${s.heading}</h2>
                ${s.body.map(b => `<p>${b}</p>`).join('')}
              </section>
            `).join('')}
            <footer>
              <p>${post.content.conclusion}</p>
              <p><a href="${post.targetToolUrl}">${post.targetToolCta}</a></p>
            </footer>
          </article>
        `;
      }
    } else {
      semanticBody = `
        <article>
          <header>
            <nav aria-label="Breadcrumb"><a href="/">Home</a> / ${route.title}</nav>
            <h1>${route.title}</h1>
            <p>${route.description}</p>
          </header>
          ${(route.faqs || []).map(f => `
            <section>
              <h2>${f.question}</h2>
              <p>${f.answer}</p>
            </section>
          `).join('')}
          <nav aria-label="Related Pages">
            <a href="/">Home</a>
            <a href="/resume-templates">Browse 38 Resume Templates</a>
            <a href="/ats-resume-checker">Test Your ATS Score</a>
            <a href="/blog">Read Career Strategy Guides</a>
          </nav>
        </article>
      `;
    }

    customHtml = customHtml.replace(
      '<div id="root"></div>',
      `<div id="root">${semanticBody}</div>`
    );

    // 8. Determine target output file
    if (route.path === '/') {
      fs.writeFileSync(baseHtmlPath, customHtml, 'utf-8');
      console.log(`✅ Prerendered root index.html`);
    } else {
      const targetSubdir = path.join(distDir, route.path.replace(/^\//, ''));
      if (!fs.existsSync(targetSubdir)) {
        fs.mkdirSync(targetSubdir, { recursive: true });
      }
      fs.writeFileSync(path.join(targetSubdir, 'index.html'), customHtml, 'utf-8');
      console.log(`✅ Prerendered: ${route.path}/index.html`);
    }
  }

  console.log('🎉 Prerendering complete! All indexable routes have static HTML snapshots.');
}

prerenderPages();

