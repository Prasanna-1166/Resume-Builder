# AI Resume Builder

> Production-ready, ATS-optimized online Resume Builder for students and job seekers with 28 verified professional template designs, deterministic completeness audits, and Gemini AI assistance.

![Status](https://img.shields.io/badge/Status-Production%20Ready-emerald)
![Templates](https://img.shields.io/badge/Templates-28%20Unique%20Designs-blue)
![AI Provider](https://img.shields.io/badge/AI-Google%20Gemini%202.5-purple)
![License](https://img.shields.io/badge/License-MIT-gray)

---

## 1. Overview & Key Highlights

- **Zero Signup Barrier**: Students can immediately browse templates, enter resume information, and export high-resolution PDFs without registration.
- **28 Real ATS-Friendly Template Renderers**: Meticulously reverse-engineered and recreated from verified reference designs (including Deedy LaTeX 2-column, IIT/IIIT placement cell tables, Tier-1 Tech, Consulting, Finance, and Executive formats).
- **100% Loss-Free Template Switching**: Change templates dynamically at any time without re-typing or corrupting structured resume data.
- **Local-First Multi-Draft Storage**: Resumes are automatically saved in browser `localStorage` with debounced auto-sync (500ms), draft duplication, and multiple resume draft management.
- **Deterministic Completeness & ATS Auditing**: Strict, non-arbitrary checklist verifying contact info, section structure, strong action verbs, and keyword density.
- **Responsible Gemini AI Enhancements**:
  - Professional summary enhancer & bullet point optimizer using Google's `@google/genai` SDK.
  - Job description matcher comparing candidate skills with JD requirements (Matched vs Missing).
  - Strict anti-hallucination safeguards: AI cannot fabricate metrics, companies, tools, or achievements.
  - Explicit Accept / Reject diff workflows.
- **Dual Export Pipeline**:
  - **PDF**: Pixel-perfect vector export via browser print engine (`@media print` and `@page` rules).
  - **DOCX**: Clean, structured Microsoft Word export with native table and heading hierarchies.
- **Admin Management Portal**: Secure JWT-authenticated dashboard for administrators to monitor site health, toggle template statuses (DRAFT, PENDING, ACTIVE, INACTIVE), and upload new reference PDFs.

---

## 2. Monorepo Project Structure

```
/
├── apps/
│   ├── web/                     # React 19 + Vite + Tailwind CSS Frontend
│   │   ├── src/
│   │   │   ├── components/      # Editor, Live Preview, Gallery, AI & ATS Modals, Admin
│   │   │   ├── context/         # ResumeContext (auto-save, drafts) & AuthContext
│   │   │   └── services/        # ApiClient & StorageService
│   │   ├── index.html
│   │   └── vite.config.ts
│   │
│   └── api/                     # Node.js + Express + TypeScript Backend
│       ├── prisma/              # Prisma Schema & Database Seeder
│       └── src/
│           ├── controllers/     # Auth, Templates, AI, Export, Health
│           ├── config/          # Database & @google/genai setup
│           ├── middleware/      # AuthGuard, RateLimit, UploadValidator
│           └── routes/          # REST Endpoints
│
├── packages/
│   ├── resume-core/             # Shared Types, Zod Schemas, Fixtures, Completeness, DOCX
│   └── templates/               # 28 Dynamic Template Renderers & Metadata Catalog
│
├── reference-templates/         # READ-ONLY reference PDF source documents
├── docs/                        # Complete architecture & design documentation
│   ├── template-inventory.md    # Analysis of all 28 unique designs & deduplication
│   ├── architecture.md          # System architecture & data flow diagrams
│   ├── development-plan.md      # Step-by-step development roadmap
│   ├── templates.md             # Template contract & visual guidelines
│   ├── deployment.md            # Cloud deployment steps (Vercel, Render, Neon)
│   ├── security.md              # Security, rate limits, and AI truthfulness guards
│   └── future-roadmap.md        # V2 deferred capabilities roadmap
│
├── tests/                       # Automated unit and integration test suite
├── package.json                 # Monorepo root workspaces configuration
└── .env.example
```

---

## 3. Quickstart & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to root or `apps/api/.env`:
```bash
cp .env.example apps/api/.env
```

Set your Google Gemini API Key (obtain a free key at [Google AI Studio](https://aistudio.google.com/)):
```env
GEMINI_API_KEY=your_actual_gemini_api_key
```

### 3. Setup Database (Prisma)
Generate the Prisma client and seed the 28 templates and default admin account:
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

*Default Admin Credentials:*
- **Email:** `admin@resumebuilder.local`
- **Password:** `AdminSecurePassword2026!`

### 4. Run Development Servers
Start both the Express API and the Vite React application:
```bash
npm run dev:all
```
- **Frontend App:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5000/api](http://localhost:5000/api)
- **API Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 4. Template Inventory (28 Unique Designs)

| # | Template ID | Name | Target Profile | Page Size | Distinctive Feature |
|---|---|---|---|---|---|
| 1 | `template_01` | Minimal Tech Clean | Technical / Fresher | US Letter | Right-aligned contact bar with portfolio callout |
| 2 | `template_02` | Classic Academic Blue | Academic / Quant | A4 | Deep navy accents & serif headings |
| 3 | `template_03` | Enterprise Java Professional | Backend / SWE | A4 | Categorized competencies grid & company badges |
| 4 | `template_04` | People Operations Executive | Executive / HR | A4 | Warm teal accents & leadership summary |
| 5 | `template_05` | Strategy & Operations Compact | General / Operations | A4 | High-density all-caps headers with full lines |
| 6 | `template_06` | Harshibar Modern Developer | Technical / Student | US Letter | Icon contact ribbon & project tech tags |
| 7 | `template_07` | Supply Chain & Ops Specialist | Operations | A4 | 3-column expertise tag cloud & KPI bullets |
| 8 | `template_08` | Engineering Manager Diamond | Technical Leadership | A4 | Diamond `⋄` dividers & dual tech/mgmt skills |
| 9 | `template_09` | Bangalore SDE Tier-1 | SDE / Campus | A4 | Competitive coding profile handles & achievements |
| 10 | `template_10` | Career Returner / Hybrid Clean | Transition / Upskill | US Letter | Prominent certifications and upskilling block |
| 11 | `template_11` | Fintech / Quantitative Analyst | Finance / Quant | A4 | Education-first layout with GPA/Rank highlight box |
| 12 | `template_12` | Chartered Accountant / Finance | CA / Accounting | A4 | Formal articleship training section |
| 13 | `template_13` | Management Consultant Elite | Consulting / Strategy | A4 | McKinsey/BCG engagement impact format |
| 14 | `template_14` | MBA Strategic Leader | MBA / Student | US Letter | B-School dual degree & committee leadership |
| 15 | `template_15` | Deedy LaTeX Academic / SDE | Academic / Tech | US Letter | 2-column asymmetric Deedy LaTeX layout |
| 16 | `template_17` | Full Stack Dev Modern Blue | Full Stack / Web | A4 | Middle dot separators & inline repo links |
| 17 | `template_18` | Cloud DevOps & SRE Pro | DevOps / Cloud | A4 | Cloud certification badges & CI/CD toolchain |
| 18 | `template_19` | Embedded Systems & Hardware | Firmware / Hardware | US Letter | Micro-controller protocols & patent entries |
| 19 | `template_20` | IIT / IIIT Placement Format | Campus Placement | A4 | 4-column academic table & Roll Number |
| 20 | `template_21` | Engineering Fresher Modular | Fresher / Student | US Letter | Coding handles ribbon & coursework split tags |
| 21 | `template_23` | Content Strategist & Writer | Creative / Editorial | A4 | Editorial serif with portfolio showcase links |
| 22 | `template_24` | GitHub Actions CV / Open Source | Open Source / Git | A4 | CI/CD automated notice & DOI publications |
| 23 | `template_25` | Minimalist Classic Tech | Fresher / Student | US Letter | Projects-first layout with diamond dividers |
| 24 | `template_extra_06` | Staff SWE Infrastructure | Systems / Tech | US Letter | Infrastructure pod callouts with latency stats |
| 25 | `template_extra_07` | Mobile iOS / Client Engineer | Mobile / iOS | US Letter | Published App Store apps with client metrics |
| 26 | `template_extra_08` | Product Manager / Growth Lead | Product / Growth | US Letter | Search & Discovery pod format with A/B test KPIs |
| 27 | `template_extra_09` | SDET / QA Automation Architect | QA / Automation | A4 | Testing frameworks matrix below summary |
| 28 | `template_extra_12` | Technical Writer & Docs Engineer | Technical Writer | A4 | Docs-as-code toolchain & API reference links |

---

## 5. Testing & Validation

Run the automated test suite verifying schemas, completeness rules, ATS algorithms, and template registry:

```bash
# Run test suite
npm test
```

Build production bundles across all packages:
```bash
npm run build
```

---

## 6. Cloud Deployment

- **Frontend (Vercel)**: Connect repository, set Root Directory to `apps/web`, build command `npm run build`.
- **Backend (Render / Railway)**: Connect repository, set Root Directory to `apps/api`, build command `npm run build`, start command `npm start`.
- **Database (Neon PostgreSQL)**: Create a free PostgreSQL instance on [Neon](https://neon.tech), paste the connection string in `DATABASE_URL`, and execute `npx prisma db push && npx prisma db seed`.

---

## 7. License

MIT License — Free and open source for students, educational institutions, and job seekers worldwide.
