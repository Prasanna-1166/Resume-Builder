# Production Analytics & Admin Monitoring Architecture (Phase 11)

## 1. Overview & Core Philosophy
The analytics system in **AI Resume Builder** provides aggregate usage insights and system observability for administrators without invading student privacy or requiring student user accounts.

### Privacy Boundaries & Non-PII Guarantees
- **Zero Student Accounts Required**: Operates transparently for anonymous student & job-seeker sessions.
- **Strictly No Resume Content Stored**: Names, phone numbers, emails, addresses, education/work history, project descriptions, skills, and summary text are **never** captured in telemetry.
- **No Raw AI Prompts or LLM Responses Stored**: AI optimization events record only aggregate counts and success/error status flags.
- **No IP Address or Fingerprinting Storage**: Devices are categorized into coarse categories (`desktop`, `mobile`, `tablet`) client-side.

---

## 2. Anonymous Visitor & Session Identifier Strategy
- **Unique Visitor ID (`visitorId`)**: An anonymous random UUID (`v_<uuid>`) generated client-side and saved to `localStorage`. It persists across browser visits to count true unique visitor reach without user tracking.
- **Session ID (`sessionId`)**: An ephemeral UUID (`s_<uuid>`) saved in `sessionStorage` with an active timestamp.
- **Inactivity Timeout**: If inactivity exceeds 30 minutes (1,800,000 ms), a new session ID is automatically generated.

---

## 3. Database Schema

### Table: `AnalyticsEvent` (PostgreSQL / Neon)
```prisma
model AnalyticsEvent {
  id          String   @id @default(uuid())
  visitorId   String
  sessionId   String
  eventType   String   // PAGE_VIEW, TEMPLATE_VIEW, TEMPLATE_SELECTED, TEMPLATE_SWITCHED, RESUME_CREATED, RESUME_SAVED, PDF_EXPORTED, DOCX_EXPORTED, AI_SUMMARY, AI_BULLET, AI_SKILLS, JOB_ANALYSIS
  templateId  String?  // e.g. "template_01"
  device      String?  // "desktop", "mobile", "tablet"
  status      String   @default("SUCCESS") // "SUCCESS" or "ERROR"
  metadata    String?  // Sanitized non-PII metadata JSON (e.g. source, action)
  createdAt   DateTime @default(now())

  @@index([eventType])
  @@index([createdAt])
  @@index([visitorId])
  @@index([sessionId])
  @@index([templateId])
}
```

---

## 4. Telemetry Events Collected

| Event Type | Trigger Point | Metadata Captured (Non-PII only) |
| :--- | :--- | :--- |
| `PAGE_VIEW` | Public view mounted (`/`, `/templates`, `/editor`) | `{ page: 'landing' \| 'gallery' }` |
| `TEMPLATE_VIEW` | Template previewed in gallery modal | `templateId` |
| `TEMPLATE_SELECTED` | Template chosen from gallery or landing page | `templateId`, `{ source: 'gallery_card' \| 'landing_featured' }` |
| `TEMPLATE_SWITCHED` | Template switched inside resume editor | `templateId` |
| `RESUME_CREATED` | New resume draft created or duplicated | `templateId` |
| `RESUME_SAVED` | Manual save or throttled auto-save (max 1/min) | `templateId`, `{ type: 'manual' \| 'autosave' }` |
| `PDF_EXPORTED` | User initiates browser print / PDF download | `templateId`, `status: 'SUCCESS'` |
| `DOCX_EXPORTED` | User generates and downloads DOCX file | `templateId`, `status: 'SUCCESS' \| 'ERROR'` |
| `AI_SUMMARY` | Gemini summary enhancement invoked | `status: 'SUCCESS' \| 'ERROR'` |
| `AI_BULLET` | Gemini bullet point polish invoked | `status: 'SUCCESS' \| 'ERROR'` |
| `AI_SKILLS` | Gemini skill suggestion invoked | `status: 'SUCCESS' \| 'ERROR'` |
| `JOB_ANALYSIS` | ATS job description matcher invoked | `status: 'SUCCESS' \| 'ERROR'` |

---

## 5. API Endpoints

### Public Telemetry Ingestion
- `POST /api/analytics/track`
  - Accepts JSON: `{ eventType, visitorId, sessionId, templateId, device, status, metadata }`
  - Validates event types and sanitizes metadata.
  - **Non-blocking**: Fails safely without throwing errors to frontend users if database connection drops.

### Admin-Protected Analytics (Requires HTTP-only Cookie / Bearer JWT)
- `GET /api/admin/analytics/overview?range=30d`
  - Returns total unique visitors, sessions, creations, saves, PDF exports, DOCX exports, AI calls.
  - Supports ranges: `today`, `7d`, `30d`, `90d`.
- `GET /api/admin/analytics/timeseries?range=30d`
  - Returns daily timeseries buckets with visitor counts, sessions, creations, exports, and AI requests.
- `GET /api/admin/analytics/templates?range=30d`
  - Returns per-template breakdown of views, selections, switches, and PDF exports.
- `GET /api/admin/analytics/ai?range=30d`
  - Returns reliability stats, total requests, success/error distribution for summary, bullet, skills, and JD matcher tools.

---

## 6. Private Admin Route Architecture
- Dedicated frontend route at `/admin`.
- Public landing page, navbar, and footer contain **no** admin links or entry points.
- Direct navigation to `/admin` loads `AdminLogin` if unauthenticated and `AdminDashboard` once authenticated.
- Authentication utilizes secure HTTP-only cookies and bcrypt-hashed credentials stored in PostgreSQL.

---

## 7. Migration & Deployment Steps
1. **Schema Migration**:
   ```bash
   npm run db:push --workspace=apps/api
   # or prisma migrate deploy in CI/CD pipeline
   ```
2. **Build Verification**:
   ```bash
   npm run build
   ```
3. **Automated Test Run**:
   ```bash
   npm test
   ```
