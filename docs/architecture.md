# System Architecture & Technical Specification

## 1. High-Level Architecture Overview

The AI Resume Builder is architected as a modular, high-performance web application designed for students and job seekers to build, customize, AI-enhance, and export ATS-optimized resumes with zero friction.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           Client (Browser)                              │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                     React + Vite Frontend                         │  │
│  │  ┌──────────────┐ ┌───────────────┐ ┌──────────────┐ ┌─────────┐  │  │
│  │  │ Landing Page │ │Template Gallery│ │Resume Editor │ │Live     │  │  │
│  │  │ & Navigation │ │& Filter Engine │ │& ATS Tools   │ │Preview  │  │  │
│  │  └──────────────┘ └───────────────┘ └──────────────┘ └─────────┘  │  │
│  │  ┌─────────────────────────────────────────────────────────────┐  │  │
│  │  │ Local Storage Manager (Multi-Draft Persistence, Auto-Save)  │  │  │
│  │  └─────────────────────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────────────────────┐  │  │
│  │  │ 28 Dynamic Resume Templates (Normalized ResumeData Engine)  │  │  │
│  │  └─────────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────┬───────────────────────────────┘  │
└──────────────────────────────────────┼──────────────────────────────────┘
                                       │ REST API (JSON / Multipart)
                                       ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    Backend Server (Node.js / Express)                   │
│  ┌───────────────────────────┐  ┌────────────────────────────────────┐  │
│  │ Admin Auth & Management   │  │ AI Service Provider (@google/genai)│  │
│  │ - JWT & Cookie Session    │  │ - Content Enhancer (Summary/Bullet)│  │
│  │ - Template Metadata & CRUD│  │ - Job Description Analyzer         │  │
│  │ - Secure Upload Pipeline  │  │ - Skill Recommender & ATS Checker  │  │
│  └─────────────┬─────────────┘  └────────────────────────────────────┘  │
│                │                                                        │
│  ┌─────────────▼─────────────┐  ┌────────────────────────────────────┐  │
│  │ Document Export Engine    │  │ Health & Status Monitor            │  │
│  │ - Chromium PDF Rendering  │  │ - DB, AI API, Storage, System Stats│  │
│  │ - DOCX Document Generator │  │                                    │  │
│  └───────────────────────────┘  └────────────────────────────────────┘  │
└────────────────┬────────────────────────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────┐
│   PostgreSQL / Neon via Prisma   │
│ - Admin Accounts                 │
│ - Template Registry & States     │
│ - Category & Ordering Config     │
│ - System Activity Logs           │
└──────────────────────────────────┘
```

---

## 2. Directory Structure

```
d:/Resume_Templates/
├── apps/
│   ├── web/                        # React + Vite Client Application
│   │   ├── src/
│   │   │   ├── components/         # UI & Editor Components
│   │   │   │   ├── editor/         # Section Editors (Personal, Exp, Edu, etc.)
│   │   │   │   ├── preview/        # Live Resume Renderer & Print Container
│   │   │   │   ├── ai/             # AI Assistant & Job Analyzer Modals
│   │   │   │   ├── gallery/        # Template Browser & Filter Controls
│   │   │   │   ├── admin/          # Admin Dashboard & Template Manager
│   │   │   │   └── common/         # Buttons, Modals, Inputs, Tabs, Alerts
│   │   │   ├── context/            # ResumeContext, AdminAuthContext
│   │   │   ├── hooks/              # useAutoSave, useResumeCompleteness, useAi
│   │   │   ├── pages/              # LandingPage, GalleryPage, EditorPage, AdminPage
│   │   │   ├── services/           # ApiClient, LocalStorageService, ExportService
│   │   │   ├── styles/             # Tailwind CSS tokens & Print CSS
│   │   │   ├── App.tsx
│   │   │   └── main.tsx
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   │
│   └── api/                        # Express Backend Service
│       ├── src/
│       │   ├── config/             # Environment, Database, AI Client
│       │   ├── controllers/        # Auth, Template, AI, Export, Health
│       │   ├── middleware/         # AuthGuard, RateLimiter, UploadValidator, ErrorHandler
│       │   ├── routes/             # /api/auth, /api/templates, /api/ai, /api/export, /api/health
│       │   ├── services/           # GeminiService, PdfExportService, DocxExportService
│       │   ├── utils/              # PromptSanitizer, TokenLimiter, Logger
│       │   ├── app.ts
│       │   └── server.ts
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   ├── resume-core/                # Shared Types, Schemas, Fixtures & Logic
│   │   ├── src/
│   │   │   ├── types/              # ResumeData, TemplateMeta, SectionTypes
│   │   │   ├── schemas/            # Zod validation schemas
│   │   │   ├── fixtures/           # 5 Realistic test fixtures (Student, SWE, PM, Sparse, Long)
│   │   │   ├── completeness/       # Deterministic completeness calculator
│   │   │   ├── ats/                # ATS parsing & keyword analysis heuristics
│   │   │   └── docx/               # DOCX document builder
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── templates/                  # 28 Dynamic Template Implementations
│       ├── src/
│       │   ├── catalog.ts          # Template registry with full metadata & categories
│       │   ├── registry.tsx        # Template loader & dynamic component resolver
│       │   ├── components/         # Reusable template building blocks
│       │   │   ├── ContactRow.tsx
│       │   │   ├── SectionHeader.tsx
│       │   │   ├── ExperienceItem.tsx
│       │   │   ├── EducationItem.tsx
│       │   │   ├── ProjectItem.tsx
│       │   │   ├── SkillsBlock.tsx
│       │   │   └── PlacementTable.tsx
│       │   ├── items/              # 28 unique template components
│       │   │   ├── Template01.tsx ... Template28.tsx
│       │   │   └── styles/         # Scoped styles for each template design
│       │   ├── index.ts
│       │   └── types.ts
│
├── prisma/
│   ├── schema.prisma               # Prisma DB Schema for Admin, Templates, Audit
│   └── seed.ts                     # Database seeder with 28 default templates & admin user
│
├── reference-templates/            # READ-ONLY source PDF references
├── docs/                           # Documentation
│   ├── template-inventory.md
│   ├── architecture.md
│   ├── development-plan.md
│   ├── templates.md
│   ├── deployment.md
│   ├── security.md
│   └── future-roadmap.md
│
├── package.json                    # Monorepo root workspace config
├── tsconfig.base.json
├── .env.example
└── README.md
```

---

## 3. Core Data Model (`ResumeData`)

The normalized `ResumeData` structure is the single source of truth across all 28 templates, the editor, export engines, and AI services.

```typescript
export interface ResumeData {
  id: string;
  title: string;
  targetRole?: string;
  updatedAt: string;
  templateId: string;
  
  personalInfo: {
    fullName: string;
    professionalTitle?: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
    customLinks?: Array<{ label: string; url: string }>;
  };

  summary?: string;

  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    location?: string;
    startDate: string;
    endDate: string;
    current?: boolean;
    gpaOrGrade?: string;
    coursework?: string[];
    description?: string;
  }>;

  experience: Array<{
    id: string;
    company: string;
    role: string;
    location?: string;
    startDate: string;
    endDate: string;
    current?: boolean;
    bullets: string[];
    departmentOrTeam?: string;
  }>;

  projects: Array<{
    id: string;
    name: string;
    description?: string;
    technologies: string[];
    url?: string;
    repoUrl?: string;
    bullets: string[];
  }>;

  skills: Array<{
    id: string;
    category: string;
    items: string[];
    level?: 'beginner' | 'intermediate' | 'expert';
  }>;

  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    credentialUrl?: string;
    credentialId?: string;
  }>;

  achievements?: Array<{
    id: string;
    title: string;
    date?: string;
    description: string;
  }>;

  publications?: Array<{
    id: string;
    title: string;
    publisher?: string;
    date?: string;
    url?: string;
    description?: string;
  }>;

  activities?: Array<{
    id: string;
    role: string;
    organization: string;
    startDate?: string;
    endDate?: string;
    bullets: string[];
  }>;

  languages?: Array<{
    id: string;
    name: string;
    proficiency: 'Native' | 'Fluent' | 'Professional' | 'Conversational' | 'Basic';
  }>;

  customSections?: Array<{
    id: string;
    heading: string;
    bullets: string[];
  }>;

  sectionVisibility: Record<string, boolean>;
  sectionOrder: string[];
}
```

---

## 4. Key Design Patterns & Guarantees

1. **Loss-Free Template Switching**: Changing `templateId` dynamically rerenders the same `ResumeData` without mutating any state or dropping fields.
2. **Local First Multi-Draft Architecture**: Drafts are stored under `localStorage.getItem('ai_resume_drafts')` and active draft is synced automatically with debounce (500ms).
3. **AI Safeguards**: All AI suggestions are presented as diffs / choices with explicit "Accept / Reject" modals. User achievements and numbers are protected against fabrication.
4. **Deterministic Completeness**: Calculators run purely client-side without arbitrary AI "scores".
5. **High-Fidelity Document Generation**:
   - PDF: Chromium headless print styling with precise `@page` dimensions, standard margins, orphan/widow protection, and print-color-adjust.
   - DOCX: Native `docx` library building clean hierarchical headings, bullet runs, and tabular structures.
