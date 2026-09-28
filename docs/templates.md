# Template Engine & Implementation Guide

## 1. Overview

The AI Resume Builder features 28 production-grade resume templates, meticulously recreated from real ATS-friendly reference designs.

Every template complies with the **Template Contract**:
- Takes a normalized `ResumeData` object as its sole data input
- Automatically formats dates, links, bullets, and section headers
- Gracefully handles missing sections, empty arrays, and varying text lengths
- Renders consistently in both standard screen sizes and high-resolution print/PDF views (US Letter 8.5"x11" or A4 210x297mm)

---

## 2. Template Architecture & Registry

```typescript
export interface TemplateDefinition {
  id: string;
  name: string;
  category: 'technical' | 'student' | 'executive' | 'academic' | 'creative' | 'general';
  pageSize: 'letter' | 'a4';
  columns: 1 | 2;
  description: string;
  suitableFor: string[];
  tags: string[];
  thumbnailUrl: string;
  component: React.ComponentType<{ data: ResumeData; isPreview?: boolean }>;
}
```

### Shared Design Tokens

- **Fonts**:
  - Sans-Serif: `font-sans` (`Inter`, `system-ui`, `Arial`)
  - Serif: `font-serif` (`Georgia`, `Merriweather`, `Times New Roman`)
  - Monospace: `font-mono` (`Fira Code`, `JetBrains Mono`, `monospace`)
- **Spacing Units**:
  - High Density: `gap-1`, `mb-1`, `text-[12px]`, `leading-relaxed`
  - Standard Density: `gap-2`, `mb-2`, `text-[13px]`, `leading-normal`
- **Page Dimensions for Print/PDF**:
  - US Letter: `width: 8.5in; min-height: 11in;`
  - A4: `width: 210mm; min-height: 297mm;`

---

## 3. Template Catalog Summary

| # | ID | Name | Category | Columns | Page Size | Distinctive Feature |
|---|---|---|---|---|---|---|
| 1 | `template_01` | Minimal Tech Clean | Technical | 1 | Letter | Right-aligned contact info with portfolio callout |
| 2 | `template_02` | Classic Academic Blue | Academic | 1 | A4 | Navy blue border accents with classic serif header |
| 3 | `template_03` | Enterprise Java Professional | Technical | 1 | A4 | Categorized competencies grid & bold company badges |
| 4 | `template_04` | People Operations Executive | Executive | 1 | A4 | Teal heading accents & metric-driven leadership summary |
| 5 | `template_05` | Strategy & Operations Compact | General | 1 | A4 | High-density all-caps headers with underline rules |
| 6 | `template_06` | Harshibar Modern Developer | Technical | 1 | Letter | Multi-icon contact bar with project tech pills |
| 7 | `template_07` | Supply Chain & Ops Specialist | General | 1 | A4 | 3-column expertise grid with KPI metric highlights |
| 8 | `template_08` | Engineering Manager Diamond | Technical | 1 | A4 | Diamond `⋄` separators with dual tech/management skill blocks |
| 9 | `template_09` | Bangalore SDE Tier-1 | Technical | 1 | A4 | Coding platform links (LeetCode, GitHub) & tech stack lines |
| 10 | `template_10` | Career Returner / Hybrid Clean | General | 1 | Letter | Transition focus with prominent upskilling/certifications |
| 11 | `template_11` | Fintech / Quantitative Analyst | Academic | 1 | A4 | Education-first layout with GPA/Rank highlight box |
| 12 | `template_12` | Chartered Accountant / Finance | General | 1 | A4 | Formal audit/articleship training section |
| 13 | `template_13` | Management Consultant Elite | Executive | 1 | A4 | McKinsey/BCG format with client engagement impact |
| 14 | `template_14` | MBA Strategic Leader | Student | 1 | Letter | B-School dual degree structure and POR highlights |
| 15 | `template_15` | Deedy LaTeX Academic / SDE | Technical | 2 | Letter | Iconic two-column Deedy LaTeX sidebar layout |
| 16 | `template_17` | Full Stack Dev Modern Blue | Technical | 1 | A4 | Middle dot separators with inline repo styling |
| 17 | `template_18` | Cloud DevOps & SRE Pro | Technical | 1 | A4 | Cloud certification badges & CI/CD toolchain breakdown |
| 18 | `template_19` | Embedded Systems & Hardware | Technical | 1 | Letter | Hardware MCU/protocols matrix and patent section |
| 19 | `template_20` | IIT / IIIT Placement Format | Student | 1 | A4 | Formal 4-column academic placement table & Roll No |
| 20 | `template_21` | Engineering Fresher Modular | Student | 1 | Letter | Competitive coding profile ribbon & coursework chips |
| 21 | `template_23` | Content Strategist & Writer | Creative | 1 | A4 | Editorial layout with portfolio links & publishing stats |
| 22 | `template_24` | GitHub Actions CV / Open Source | Technical | 1 | A4 | CI/CD automated notice & publication DOI links |
| 23 | `template_25` | Minimalist Classic Tech | Student | 1 | Letter | Projects-first layout with diamond dividers |
| 24 | `template_extra_06` | Staff SWE Infrastructure | Technical | 1 | Letter | Infrastructure sub-team callout with latency metrics |
| 25 | `template_extra_07` | Mobile iOS / Client Engineer | Technical | 1 | Letter | Published apps section with App Store links |
| 26 | `template_extra_08` | Product Manager / Growth Lead | Executive | 1 | Letter | Search & Discovery pod format with A/B test outcomes |
| 27 | `template_extra_09` | SDET / QA Automation Architect | Technical | 1 | A4 | Testing frameworks matrix right below summary |
| 28 | `template_extra_12` | Technical Writer & Docs Engineer | Technical | 1 | A4 | Docs-as-code toolchain & published documentation links |

---

## 4. Visual Fidelity & ATS Compatibility Guidelines

1. **Hierarchy**: Standard `h1` for candidate name, `h2` for section titles, `h3` for job title / company.
2. **Text Selectability**: All rendered text is real DOM text, guaranteeing flawless ATS parsing.
3. **No Hidden Tricks**: White text, hidden keywords, canvas rendering, or image-only content are strictly prohibited.
4. **Standard Bullet Points**: Bullets use unicode `•` or standard list styling for screen readers and ATS scrapers.
