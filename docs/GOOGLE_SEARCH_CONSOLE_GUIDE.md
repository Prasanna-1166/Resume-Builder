# Google Search Console (GSC) Readiness & Operations Guide

**Domain:** `https://dvlpr.dpdns.org/`  
**Product:** CareerDoc AI  
**Target Search Engine:** Google (and Bing Webmaster Tools)  
**Status:** Ready for Submission & Verification  

---

## 1. Verified Asset Endpoints for Search Engines

The following endpoints are generated, validated, and publicly available on the production domain:

| Asset | Production URL | Format / Protocol | Purpose |
| :--- | :--- | :--- | :--- |
| **Primary XML Sitemap** | `https://dvlpr.dpdns.org/sitemap.xml` | XML (sitemaps.org 0.9) | Comprehensive URL catalog with `lastmod`, `changefreq`, and `priority` |
| **Plain Text Sitemap** | `https://dvlpr.dpdns.org/sitemap.txt` | UTF-8 Plain Text | Raw list of canonical URLs for alternative search engines and simple bots |
| **Robots Directive** | `https://dvlpr.dpdns.org/robots.txt` | Plain Text | Crawl instructions allowing public assets and blocking private workspaces |
| **Open Graph Card** | `https://dvlpr.dpdns.org/og-image.svg` | SVG (1200x630) | Rich preview card for Google Discover, LinkedIn, X, and Facebook |
| **Favicon** | `https://dvlpr.dpdns.org/favicon.svg` | SVG | Brand icon in Google search snippet results |

---

## 2. Priority URL Inventory for Inspection & Indexing

Submit the XML sitemap first. For high-priority ranking, use the **URL Inspection Tool** in Google Search Console to request indexing for the following URLs in priority order:

### Tier 1: Core Transactional Landing Pages (Request Indexing Immediately)
1. `https://dvlpr.dpdns.org/` — Homepage & Free AI Resume Builder
2. `https://dvlpr.dpdns.org/ai-resume-builder` — AI Bullet & Summary Optimization Tool
3. `https://dvlpr.dpdns.org/ats-resume-checker` — Local ATS Score Calculator & Auditor
4. `https://dvlpr.dpdns.org/resume-templates` — 38 ATS-Friendly Templates Matrix

### Tier 2: Demographic & Specialty Builders
5. `https://dvlpr.dpdns.org/resume-builder-for-freshers` — College Fresher & Student Placement Resume Maker
6. `https://dvlpr.dpdns.org/developer-resume-builder` — Software Engineer & Tech-Stack Resume Maker
7. `https://dvlpr.dpdns.org/ai-cover-letter-generator` — AI Cover Letter Generator

### Tier 3: Informational Guides & Resource Hub
8. `https://dvlpr.dpdns.org/blog` — Career & Resume Blog Hub
9. `https://dvlpr.dpdns.org/blog/ats-friendly-resume-guide` — Complete ATS Resume Guide 2026
10. `https://dvlpr.dpdns.org/blog/resume-for-freshers` — How to Write a Resume as a Fresher
11. `https://dvlpr.dpdns.org/blog/software-developer-resume-guide` — Developer Resume Blueprint
12. `https://dvlpr.dpdns.org/blog/how-to-improve-ats-score` — 9 Ways to Improve ATS Score
13. `https://dvlpr.dpdns.org/blog/how-to-write-cover-letter` — Modern Cover Letter Guide

---

## 3. Step-by-Step Google Search Console Setup

> [!IMPORTANT]
> The site administrator must perform domain verification through DNS or HTML tag. We do not claim to have submitted sitemaps without actual Search Console credentials.

### Step 3.1: Property Verification
1. Navigate to [Google Search Console](https://search.google.com/search-console).
2. Choose **Domain** property type and enter `dvlpr.dpdns.org` (or URL-prefix `https://dvlpr.dpdns.org/`).
3. Verification options:
   - **DNS TXT Record (Recommended):** Add the TXT verification record provided by Google to your DNS provider for `dpdns.org`.
   - **HTML Tag Method:** Copy the verification code (e.g. `<meta name="google-site-verification" content="..." />`) and add it to `apps/web/index.html`.

### Step 3.2: Submit XML Sitemap
1. In the left navigation menu, click **Sitemaps** under the "Indexing" section.
2. In the "Add a new sitemap" input box, enter `sitemap.xml`.
3. Click **Submit**.
4. Confirm the status turns green (**Success**) and the count of discovered URLs displays `13`.

### Step 3.3: Manual URL Inspection & Indexing Request
1. Click the search bar at the very top of Google Search Console (**"Inspect any URL in https://dvlpr.dpdns.org/"**).
2. Enter `https://dvlpr.dpdns.org/`.
3. Click **Test Live URL** to confirm Googlebot can fetch the HTML, execute resources, and detect the `<title>` and structured data schemas.
4. Click **Request Indexing**.
5. Repeat for the Tier 1 URLs listed in Section 2.

---

## 4. Structured Data & Rich Results Validation

Before submitting, validate the JSON-LD schemas using Google official testing tools:

1. **Google Rich Results Test:**  
   [https://search.google.com/test/rich-results](https://search.google.com/test/rich-results)  
   - Enter `https://dvlpr.dpdns.org/` or test code snippet.
   - Verify that **SoftwareApplication**, **WebSite**, **Organization**, and **BreadcrumbList** are detected without errors.
2. **Schema Markup Validator:**  
   [https://validator.schema.org/](https://validator.schema.org/)  
   - Confirm zero syntax errors on FAQPage and Article schemas.

---

## 5. Monitoring & Troubleshooting Crawl Errors

### 5.1 Monitoring Impressions, Clicks, and Ranking
- Open the **Performance** report in GSC.
- Track metrics across:
  - **Total Clicks:** Real visitors entering from Google search results.
  - **Total Impressions:** How often your URLs appear in search results.
  - **Average CTR (Click-Through Rate):** Optimize meta titles and descriptions if CTR drops below 3%.
  - **Average Position:** Track keyword movements for queries like "ATS resume checker" and "free AI resume builder".

### 5.2 Identifying & Resolving Crawl Errors
In the **Pages** report under "Indexing":
- **"Crawled - currently not indexed":** Means Google visited the URL but chose not to index it yet. Ensure the page has pre-rendered static content and strong internal links from the homepage and blog.
- **"Discovered - currently not indexed":** Google knows the URL exists from the sitemap but has not crawled it due to crawl budget. Request indexing via URL Inspection.
- **"Excluded by 'noindex' tag":** Confirm that ONLY private routes (`/dashboard`, `/editor`, `/admin`) appear in this list. If any public landing page or blog article appears here, investigate `MetaTags.tsx` immediately.
- **"Soft 404":** Ensure that invalid or non-existent URLs return true HTTP 404 responses or clear user error messages.

### 5.3 Core Web Vitals Monitoring
- In GSC, check the **Core Web Vitals** tab under "Experience".
- Ensure mobile URLs stay in the green (**Good**) tier:
  - **LCP (Largest Contentful Paint):** < 2.5s (facilitated by preconnected Google fonts and lightweight SVG icons).
  - **INP (Interaction to Next Paint):** < 200ms (ensured by React 19 fast event loop and modular state).
  - **CLS (Cumulative Layout Shift):** < 0.1 (ensured by explicit aspect ratios and responsive containers).

