# Master Development Plan

This document outlines the step-by-step execution roadmap for developing the complete AI Resume Builder.

## Phase Execution Checklist

### Phase 1: Workspace & Template Inspection (COMPLETED)
- [x] Analyze all 19 reference PDF files in the workspace
- [x] Deduplicate templates by SHA256 & extracted text content
- [x] Identify exact count of 28 unique resume template designs
- [x] Generate `docs/template-inventory.md` with specifications for all 28 templates

### Phase 2: Architecture & Design System (COMPLETED)
- [x] Establish Monorepo structure (`apps/web`, `apps/api`, `packages/resume-core`, `packages/templates`)
- [x] Design normalized `ResumeData` data contract & Zod schemas
- [x] Define Prisma schema for Admin, Template Registry & Audit logs
- [x] Establish Clean UI/UX Design System with Tailwind CSS

### Phase 3: Monorepo Foundation & Core Packages
- [ ] Initialize `package.json` workspaces with TypeScript, Tailwind, and build tooling
- [ ] Implement `packages/resume-core`:
  - `ResumeData` types & Zod validation
  - Deterministic Resume Completeness calculator
  - ATS Keyword & Section heuristic checker
  - DOCX generation engine using `docx` library
  - 5 Fictional test fixtures (Fresher, SWE, PM, Sparse, Long)
- [ ] Setup Prisma ORM with SQLite (local) / PostgreSQL (Neon) and seeding script

### Phase 4: Template Engine & Shared Components
- [ ] Implement `packages/templates`:
  - Template catalog metadata with categories, tags, paper sizes (US Letter & A4)
  - Shared visual primitives (`ContactRow`, `SectionHeading`, `ExperienceItem`, `EducationItem`, `PlacementTable`, etc.)
  - Scoped CSS rules for print styling, fonts, and borders

### Phase 5: Implement All 28 Reference Templates
- [ ] `template_01`: Minimal Tech Clean (US Letter)
- [ ] `template_02`: Classic Academic Blue (A4)
- [ ] `template_03`: Enterprise Java Professional (A4)
- [ ] `template_04`: People Operations Executive (A4)
- [ ] `template_05`: Strategy & Operations Compact (A4)
- [ ] `template_06`: Harshibar Modern Developer (US Letter)
- [ ] `template_07`: Supply Chain & Ops Specialist (A4)
- [ ] `template_08`: Engineering Manager Diamond (A4)
- [ ] `template_09`: Bangalore SDE Tier-1 (A4)
- [ ] `template_10`: Career Returner / Hybrid Clean (US Letter)
- [ ] `template_11`: Fintech / Quantitative Analyst (A4)
- [ ] `template_12`: Chartered Accountant / Finance (A4)
- [ ] `template_13`: Management Consultant Elite (A4)
- [ ] `template_14`: MBA Strategic Leader (US Letter)
- [ ] `template_15`: Deedy LaTeX Academic / SDE Two-Column (US Letter)
- [ ] `template_17`: Full Stack Dev Modern Blue (A4)
- [ ] `template_18`: Cloud DevOps & SRE Pro (A4)
- [ ] `template_19`: Embedded Systems & Hardware (US Letter)
- [ ] `template_20`: IIT / IIIT College Placement Format with Table (A4)
- [ ] `template_21`: Engineering Fresher Modular (US Letter)
- [ ] `template_23`: Content Strategist & Copywriter (A4)
- [ ] `template_24`: GitHub Actions CV / Open Source (A4)
- [ ] `template_25`: Minimalist Classic Tech Projects-First (US Letter)
- [ ] `template_extra_06`: Staff SWE Infrastructure (US Letter)
- [ ] `template_extra_07`: Mobile iOS / Client Engineer (US Letter)
- [ ] `template_extra_08`: Product Manager / Growth Lead (US Letter)
- [ ] `template_extra_09`: SDET / QA Automation Architect (A4)
- [ ] `template_extra_12`: Technical Writer & Docs Engineer (A4)

### Phase 6: Resume Editor & UI
- [ ] Implement Landing Page (Clean Hero, Feature Highlights, Template Previews)
- [ ] Implement Template Gallery (Search, Filter by Category/Archetype, Paper Size, Preview Modal)
- [ ] Implement Structured Editor (Split View: Left Editor, Right Live Preview):
  - Personal Info & Social Links
  - Summary / Objective
  - Education & Coursework
  - Experience & Bullets
  - Projects & Tech Stack
  - Skills & Categorization
  - Certifications, Achievements, Publications, Languages
  - Section Reordering & Visibility Toggle
  - Real-time Deterministic Completeness Bar

### Phase 7: Local Persistence & Multi-Drafts
- [ ] Implement LocalStorage draft management:
  - Create, rename, duplicate, delete drafts
  - Debounced auto-save (500ms) with manual Save button indicator
  - Seamless template switching without data loss

### Phase 8: Export Pipeline (PDF & DOCX)
- [ ] Implement high-fidelity browser print & server PDF export
- [ ] Implement DOCX export with complete sections & bullet formatting

### Phase 9: AI Services with Gemini (@google/genai)
- [ ] Setup backend Gemini client using `@google/genai`
- [ ] Implement AI endpoints:
  - `/api/ai/improve-summary`: Tone, clarity, impact enhancement
  - `/api/ai/improve-bullet`: Action verbs, metric phrasing without fabricating facts
  - `/api/ai/suggest-skills`: Context-aware skill recommendations
  - `/api/ai/analyze-job`: Structured JD parsing (skills, requirements, responsibilities)
- [ ] Prompt-injection defenses and structured output validation

### Phase 10: Job Analyzer & ATS Checker
- [ ] Interactive Job Description Analyzer modal
- [ ] Match vs Missing skill comparison
- [ ] ATS Heuristics Auditor (formatting alerts, missing contact info, keyword coverage)

### Phase 11: Admin Dashboard & Template Management
- [ ] Admin authentication (JWT in HTTP-only cookies, bcrypt hashing)
- [ ] Protected admin routes & dashboard
- [ ] Template status management (DRAFT, PENDING, ACTIVE, INACTIVE)
- [ ] Template file upload pipeline with MIME/size validation
- [ ] System health monitor (DB, Gemini API, memory, version)

### Phase 12: Testing, Quality Assurance & Build
- [ ] Unit & integration tests for schemas, completeness, ATS rules, and DOCX generator
- [ ] Template render tests across all 5 test fixtures
- [ ] Production build verification for Web & API apps

### Phase 13: Documentation & Deployment Prep
- [ ] Finalize `README.md`, `docs/templates.md`, `docs/deployment.md`, `docs/security.md`, `docs/future-roadmap.md`
- [ ] Prepare `.env.example` and production startup configurations
