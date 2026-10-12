import React from 'react';
import { ShieldCheck, Lock, Sparkles, ExternalLink, Mail, CheckCircle2, AlertCircle, X, Database, EyeOff } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-policy-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 border border-slate-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 id="privacy-policy-title" className="font-bold text-slate-900 text-base sm:text-lg">
                Privacy Policy & AI Transparency Disclosure
              </h2>
              <p className="text-xs text-slate-500">
                CareerDoc AI • Last Updated: October 2026 • Contact: support.dvlpr@gmail.com
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
            aria-label="Close Privacy Policy"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs text-slate-700 leading-relaxed">
          {/* Quick Summary Callout */}
          <div className="p-4 bg-indigo-50/80 border border-indigo-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2 font-bold text-indigo-950 text-sm">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Core Privacy & AI Guarantees at a Glance</span>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11.5px] text-indigo-900 pt-1">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>No Full Resume Broadcasts:</strong> Only the specific snippet you choose to improve is sent to the AI.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Zero Prompt Logging:</strong> This app never persists your prompts or AI outputs in our database.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Human-in-the-Loop:</strong> AI suggestions are never applied automatically; you must explicitly accept them.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Private Contact Data:</strong> Name, phone, email, and address are never sent for bullet or summary AI tools.</span>
              </li>
            </ul>
          </div>

          {/* Section 1: Overview */}
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              1. Overview & Scope
            </h3>
            <p>
              CareerDoc AI (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) provides open productivity tools for students and job seekers to build ATS-compatible resumes, CVs, and cover letters. We believe in complete transparency regarding how user data is handled, where it travels, and which features utilize third-party Artificial Intelligence (AI).
            </p>
          </section>

          {/* Section 2: AI Features vs Deterministic Local Features */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              2. AI-Assisted Features vs. Deterministic Local Features
            </h3>
            <p>
              We explicitly distinguish between operations that communicate with an external AI provider and those that run deterministically or strictly on your device:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {/* External AI Features */}
              <div className="p-3.5 bg-purple-50/60 rounded-xl border border-purple-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-purple-950 text-xs">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>Features That Use External AI (Google Gemini API)</span>
                </div>
                <ul className="space-y-1.5 text-[11px] text-purple-900 list-disc pl-4">
                  <li><strong>Improve Summary with AI:</strong> Transmits your draft summary text and target role.</li>
                  <li><strong>Improve Bullet with AI:</strong> Transmits the individual bullet point text and position context.</li>
                  <li><strong>AI Skill Recommendations:</strong> Transmits your existing skill names, target role, and experience snippet.</li>
                  <li><strong>Job Description Keyword Analyzer:</strong> Transmits the pasted job description (up to 4,000 characters) and your skill list.</li>
                  <li><strong>Cover Letter Drafting & Improvement:</strong> Transmits candidate name, target role, company, skills, and pasted job description.</li>
                  <li><strong>Document Tailoring:</strong> Transmits target role, company, job description, summary, and up to 4 selected bullet points.</li>
                </ul>
              </div>

              {/* Deterministic / Local Features */}
              <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-950 text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Purely Deterministic / Local Features (No AI Call)</span>
                </div>
                <ul className="space-y-1.5 text-[11px] text-emerald-900 list-disc pl-4">
                  <li><strong>ATS Parser Health Check:</strong> Runs 100% locally in your web browser using deterministic heuristic algorithms. No content is sent to any server or AI provider.</li>
                  <li><strong>Template Rendering & Switching:</strong> 100% local React code renders templates without data alteration.</li>
                  <li><strong>Resume Completeness Bar:</strong> Local client-side calculation.</li>
                  <li><strong>CV Section Suggestions:</strong> Hardcoded rules based on academic vs. professional category.</li>
                  <li><strong>PDF & DOCX Export:</strong> Document formatting engines render directly without external AI calls.</li>
                  <li><strong>Manual Editing:</strong> All direct typing and form editing is purely manual.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3: Third-Party AI Provider Details & Terms */}
          <section className="space-y-2.5">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              3. AI Provider, Model Configuration & Data-Processing Terms
            </h3>
            <p>
              When you choose to invoke an AI feature, the required snippet is transmitted via our server backend to:
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
              <div><strong>AI Provider:</strong> Google LLC (Google Gemini API via official <code>@google/genai</code> SDK).</div>
              <div><strong>Default Model Configuration:</strong> <code>gemini-1.5-flash</code> (configurable via environment variable <code>GEMINI_MODEL</code>).</div>
              <div><strong>Provider Endpoint:</strong> Google Generative Language API. API keys are strictly maintained server-side and never exposed to the frontend.</div>
            </div>

            <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl space-y-2 text-xs text-amber-900">
              <div className="flex items-center gap-2 font-bold">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Google Gemini API Data-Handling Terms Notice</span>
              </div>
              <p className="text-[11.5px] leading-relaxed">
                By using AI-assisted features, you acknowledge that Google&apos;s applicable terms and policies govern their processing of your prompts. Under Google AI Studio terms:
              </p>
              <ul className="text-[11px] space-y-1 list-disc pl-4">
                <li><strong>Unpaid / Free-Tier API Configurations:</strong> When operated with Google AI Studio free-tier API keys, Google may use prompt inputs and generated outputs to train and develop Google products and models, and data may be reviewed by human reviewers (subject to Google privacy controls).</li>
                <li><strong>Paid / Google Cloud Configurations:</strong> If the hosting administrator configures a paid Google Cloud Vertex AI / AI Studio billing account, customer prompt data is not used for model training.</li>
                <li>Deployments should refer to Google&apos;s current Terms of Service (<a href="https://ai.google.dev/gemini-api/terms" target="_blank" rel="noopener noreferrer" className="underline font-bold text-indigo-700">ai.google.dev/gemini-api/terms</a>).</li>
              </ul>
            </div>
          </section>

          {/* Section 4: What We Store & Retention */}
          <section className="space-y-2.5">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              4. Application Storage, Logging & Retention
            </h3>
            <div className="space-y-2">
              <p>
                <strong>AI Prompts & Responses:</strong> We do NOT log, store, or sell any AI prompts or model responses in our application database. Once the AI response is delivered to your browser session, it exists only in your client memory until you choose to accept or discard it.
              </p>
              <p>
                <strong>Guest Users:</strong> For guests who use the app without logging in, your resume drafts, versions, and edits are stored exclusively in your browser&apos;s <code>localStorage</code>. We do not store guest resume contents on our backend database.
              </p>
              <p>
                <strong>Registered Users:</strong> If you register an account, your user profile, saved documents, and document version snapshots are stored in our PostgreSQL database to enable multi-device sync. Data remains stored until you delete the document or delete your account.
              </p>
              <p>
                <strong>Operational Analytics:</strong> Aggregate operational counts (e.g., number of PDFs exported or AI actions requested) are tracked with zero PII. All personal names, email addresses, phone numbers, resume text, and prompt contents are strictly stripped prior to recording.
              </p>
            </div>
          </section>

          {/* Section 5: User Rights & Data Deletion */}
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              5. Human Control, Rights & Data Deletion Requests
            </h3>
            <ul className="space-y-1.5 list-disc pl-4 text-xs">
              <li><strong>Right to Review & Reject:</strong> You maintain full human control over your resume. AI suggestions are never automatically committed to your master resume. You can review, edit, accept, or reject any suggestion.</li>
              <li><strong>Document Deletion:</strong> You can delete any document, tailored copy, or version snapshot at any time directly through the Document Dashboard.</li>
              <li><strong>Account Deletion:</strong> Registered users can request complete deletion of their account, master profile, and all saved documents by emailing our support desk.</li>
            </ul>
          </section>

          {/* Section 6: Security & Credentials */}
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              6. Security & Credential Protection
            </h3>
            <p>
              Passwords for registered accounts are cryptographically hashed using salted bcrypt before database persistence. Server-side AI credentials (<code>GEMINI_API_KEY</code>) and database secrets are strictly guarded on the backend environment and are never transmitted to frontend clients, logged to diagnostics, or rendered in UI markup.
            </p>
          </section>

          {/* Section 7: Support & Contact */}
          <section className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
              <Mail className="w-4 h-4 text-indigo-600" />
              <span>Contact Support & Privacy Inquiries</span>
            </div>
            <p className="text-xs text-slate-600">
              If you have any questions about this Privacy Policy, our AI transparency commitments, or wish to request data deletion, please contact our team at:
            </p>
            <div className="font-mono font-bold text-indigo-700 text-xs">
              <a href="mailto:support.dvlpr@gmail.com" className="hover:underline">
                support.dvlpr@gmail.com
              </a>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-400">
            CareerDoc AI • Transparency & Privacy Policy
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            Understood & Close
          </button>
        </div>
      </div>
    </div>
  );
};
