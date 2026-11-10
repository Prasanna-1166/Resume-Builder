# Strategic SEO Keyword Map & Content Architecture

**Target Domain:** `https://dvlpr.dpdns.org/`  
**Product:** CareerDoc AI  
**Scope:** Organic Search Mapping, Search Intent Analysis, URL Mapping & Cannibalization Prevention  

---

## 1. Strategy & Mapping Principles

CareerDoc AI operates in the competitive career document and HR tech category. To achieve sustainable organic search ranking against established incumbent tools without resorting to black-hat tactics or false volume claims, we apply a 3-pillar content strategy:

1. **Transactional Product Landing Pages:** Target high-intent queries where users want to perform an immediate task (e.g., "ATS resume checker", "AI cover letter generator").
2. **Audience-Specific Hubs:** Target specific demographic segments whose resume needs differ significantly (e.g., college freshers needing academic placement formats, software developers needing GitHub/tech-stack sections).
3. **Comprehensive Informational Guides:** Target long-tail informational search queries (e.g., "how to improve ATS score", "resume format for software developers") with high-value, step-by-step editorial content that funnel readers into the free tools.

---

## 2. Keyword Map Matrix

### 2.1 Primary Core Keywords (High Intent & Product Core)

| Keyword | Primary Search Intent | Target Canonical URL | Primary H1 Heading | Target Feature / Product Asset | Priority |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Free AI resume builder** | Transactional | `https://dvlpr.dpdns.org/ai-resume-builder` | Free AI Resume Builder: Craft ATS-Optimized Resumes | AI summary, bullet generation, 38 templates, free export | P0 |
| **ATS-friendly resume builder** | Transactional / Commercial | `https://dvlpr.dpdns.org/` | Free AI Resume Builder & ATS Resume Checker | 100% compliant single/multi-column layouts, clean parsing | P0 |
| **AI resume maker** | Transactional | `https://dvlpr.dpdns.org/ai-resume-builder` | Free AI Resume Builder: Craft ATS-Optimized Resumes | Real-time preview, AI assistance, instant PDF/DOCX | P0 |
| **Online resume builder** | Transactional | `https://dvlpr.dpdns.org/` | Free AI Resume Builder & ATS Resume Checker | Browser-based, no-install, local privacy, free export | P1 |
| **Free resume creator** | Transactional | `https://dvlpr.dpdns.org/` | Free AI Resume Builder & ATS Resume Checker | 100% free core tool, no paywalls, instant download | P1 |

### 2.2 Secondary Product & Feature Keywords

| Keyword | Primary Search Intent | Target Canonical URL | Primary H1 Heading | Target Feature / Product Asset | Priority |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **ATS resume checker** | Transactional / Tool | `https://dvlpr.dpdns.org/ats-resume-checker` | Free ATS Resume Checker: Score & Audit Your Resume | Local deterministic ATS heuristics, keyword gap analysis | P0 |
| **Resume templates** | Commercial Investigation | `https://dvlpr.dpdns.org/resume-templates` | 38 Free ATS-Friendly Resume Templates | 38 curated templates with live filter and tag gallery | P0 |
| **AI cover letter generator** | Transactional | `https://dvlpr.dpdns.org/ai-cover-letter-generator` | AI Cover Letter Generator: Create Matching Cover Letters | Dedicated Cover Letter editor, job description tailoring | P0 |
| **Resume builder for freshers** | Transactional / Niche | `https://dvlpr.dpdns.org/resume-builder-for-freshers` | Resume Builder for Freshers: Launch Your Career | Projects-first layout, GPA/coursework, campus placement | P0 |
| **Developer resume builder** | Transactional / Niche | `https://dvlpr.dpdns.org/developer-resume-builder` | Software Developer Resume Builder: Tech-Stack Ready | Tech stack categorization, GitHub/portfolio links, metrics | P0 |
| **Professional resume format** | Informational / Commercial | `https://dvlpr.dpdns.org/resume-templates` | 38 Free ATS-Friendly Resume Templates | Standard reverse-chronological and hybrid layouts | P1 |

### 2.3 Long-Tail & Informational Content Keywords

| Keyword | Search Intent | Target Canonical URL | Article Title | Conversion Funnel Action |
| :--- | :--- | :--- | :--- | :--- |
| **How to create an ATS-friendly resume** | Informational | `https://dvlpr.dpdns.org/blog/ats-friendly-resume-guide` | The Complete Guide to Creating an ATS-Friendly Resume in 2026 | CTA: Run free ATS audit on `/ats-resume-checker` |
| **How to make a resume as a fresher** | Informational | `https://dvlpr.dpdns.org/blog/resume-for-freshers` | How to Build a Standout Resume as a Fresher with Zero Experience | CTA: Use fresher template on `/resume-builder-for-freshers` |
| **Best resume format for software developers** | Informational | `https://dvlpr.dpdns.org/blog/software-developer-resume-guide` | Software Engineer Resume Blueprint: Tech Stacks, Impact & GitHub | CTA: Build dev resume on `/developer-resume-builder` |
| **How to improve resume ATS score** | Informational | `https://dvlpr.dpdns.org/blog/how-to-improve-ats-score` | 9 Proven Strategies to Improve Your Resume ATS Score | CTA: Audit document on `/ats-resume-checker` |
| **How to write a cover letter** | Informational | `https://dvlpr.dpdns.org/blog/how-to-write-cover-letter` | How to Write a Modern Cover Letter That Actually Gets Read | CTA: Generate letter on `/ai-cover-letter-generator` |

---

## 3. Cannibalization Prevention & URL Disambiguation

Keyword cannibalization occurs when multiple URLs on the same website compete for the same query, dividing domain authority and confusing search engines. The following mapping rules prevent cannibalization:

1. **Homepage vs. Tool Landing Pages:**
   - The homepage (`/`) targets broad branded terms ("CareerDoc AI", "Free AI Resume Builder") and general multi-tool queries.
   - Specific deep feature terms ("ATS checker", "Cover letter generator", "Fresher resume") are strictly assigned to their dedicated landing pages and NOT optimized on the homepage.
2. **Templates Catalog vs. Individual Resume Editor:**
   - The `/resume-templates` page owns all queries containing "resume templates", "CV formats", "resume layouts".
   - The editor (`/editor`) is marked `noindex` and never enters the search index.
3. **Blog Guides vs. Product Landing Pages:**
   - Informational "How-to" queries belong strictly to `/blog/*` articles.
   - Transactional "Builder", "Maker", "Checker" queries belong strictly to `/ai-resume-builder`, `/ats-resume-checker`, etc.

---

## 4. Internal Link Architecture (The Hub-and-Spoke Model)

```
                       [ Homepage: / ]
                              │
       ┌───────────────┬──────┴────────┬───────────────┐
       ▼               ▼               ▼               ▼
 [/ai-resume-   [/ats-resume-    [/resume-      [/ai-cover-letter-
   builder]       checker]       templates]        generator]
       │               │               │               │
       └───────────────┼───────────────┘               │
                       ▼                               ▼
       [/resume-builder-for-freshers]    [/developer-resume-builder]
                       │                               │
                       └───────────────┬───────────────┘
                                       ▼
                              [ Blog Hub: /blog ]
                                       │
        ┌───────────────────┬──────────┴──────────┬───────────────────┐
        ▼                   ▼                     ▼                   ▼
 [ats-friendly-     [resume-for-          [software-developer-  [how-to-write-
  resume-guide]       freshers]            resume-guide]         cover-letter]
```

Every blog article includes contextual hyperlinks back to the matching tool landing page, creating natural internal link equity and directing engaged users into the product.

