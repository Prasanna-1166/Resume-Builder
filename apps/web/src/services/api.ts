import { ResumeData } from '@ai-resume/core';

const defaultApiUrl = import.meta.env.DEV ? '' : 'https://resume-builder-d18h.onrender.com';
const rawApiUrl = (import.meta.env.VITE_API_URL || defaultApiUrl).replace(/\/$/, '');
const API_BASE = rawApiUrl ? `${rawApiUrl}/api` : '/api';

export const apiClient = {
  // Templates
  async getTemplates(params?: { category?: string; status?: string; search?: string }) {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_BASE}/templates?${query}`, {
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to fetch templates');
    return res.json();
  },

  async getTemplateById(id: string) {
    const res = await fetch(`${API_BASE}/templates/${id}`, {
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to fetch template');
    return res.json();
  },

  // AI Services
  async improveSummary(summary: string, targetRole?: string) {
    const res = await fetch(`${API_BASE}/ai/improve-summary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ summary, targetRole }),
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to enhance summary');
    return res.json();
  },

  async improveBullet(bullet: string, context?: string) {
    const res = await fetch(`${API_BASE}/ai/improve-bullet`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bullet, context }),
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to enhance bullet point');
    return res.json();
  },

  async suggestSkills(currentSkills: string[], targetRole?: string, experienceSnippet?: string) {
    const res = await fetch(`${API_BASE}/ai/suggest-skills`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentSkills, targetRole, experienceSnippet }),
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to suggest skills');
    return res.json();
  },

  async analyzeJob(jobDescription: string, userSkills: string[]) {
    const res = await fetch(`${API_BASE}/ai/analyze-job`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobDescription, userSkills }),
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to analyze job description');
    return res.json();
  },

  async generateCoverLetter(payload: {
    fullName?: string;
    targetRole: string;
    targetCompany: string;
    jobDescription?: string;
    skills?: string[];
    experienceSnippet?: string;
  }) {
    const res = await fetch(`${API_BASE}/ai/generate-cover-letter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to generate cover letter');
    return res.json();
  },

  async improveCoverLetter(payload: {
    text: string;
    sectionType?: string;
    targetRole?: string;
    targetCompany?: string;
  }) {
    const res = await fetch(`${API_BASE}/ai/improve-cover-letter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to improve cover letter');
    return res.json();
  },

  async tailorDocument(payload: {
    documentType?: string;
    documentData: any;
    jobDescription: string;
    targetRole?: string;
    targetCompany?: string;
  }) {
    const res = await fetch(`${API_BASE}/ai/tailor-document`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to tailor document');
    return res.json();
  },

  async suggestCvSections(payload: { category?: string; targetField?: string }) {
    const res = await fetch(`${API_BASE}/ai/suggest-cv-sections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to fetch CV section suggestions');
    return res.json();
  },

  // Export
  async exportDocx(data: any) {
    const res = await fetch(`${API_BASE}/export/docx`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to export DOCX');
    return res.blob();
  },

  // Admin
  async adminLogin(credentials: { email: string; password: string }) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
      credentials: 'include'
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Login failed' }));
      throw new Error(err.error || 'Login failed');
    }
    return res.json();
  },

  async getAdminMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Not authenticated');
    return res.json();
  },

  async adminLogout() {
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
  },

  async updateTemplate(id: string, updates: any) {
    const res = await fetch(`${API_BASE}/templates/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to update template');
    return res.json();
  },

  async uploadTemplateReference(formData: FormData) {
    const res = await fetch(`${API_BASE}/templates/upload-reference`, {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to upload reference');
    return res.json();
  },

  async getHealth() {
    const res = await fetch(`${API_BASE}/health`, {
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Health check failed');
    return res.json();
  },

  // Analytics Telemetry & Admin Endpoints
  async trackEvent(payload: {
    eventType: string;
    visitorId: string;
    sessionId: string;
    templateId?: string | null;
    device?: string;
    status?: 'SUCCESS' | 'ERROR';
    metadata?: Record<string, any>;
  }) {
    try {
      const res = await fetch(`${API_BASE}/analytics/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include'
      });
      return res.json();
    } catch {
      // Non-blocking telemetry ingestion
      return { success: false };
    }
  },

  async getAnalyticsOverview(range: string = '30d') {
    const res = await fetch(`${API_BASE}/admin/analytics/overview?range=${range}`, {
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to fetch analytics overview');
    return res.json();
  },

  async getAnalyticsTimeseries(range: string = '30d') {
    const res = await fetch(`${API_BASE}/admin/analytics/timeseries?range=${range}`, {
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to fetch analytics timeseries');
    return res.json();
  },

  async getAnalyticsTemplates(range: string = '30d') {
    const res = await fetch(`${API_BASE}/admin/analytics/templates?range=${range}`, {
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to fetch template analytics');
    return res.json();
  },

  async getAnalyticsAi(range: string = '30d') {
    const res = await fetch(`${API_BASE}/admin/analytics/ai?range=${range}`, {
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to fetch AI analytics');
    return res.json();
  }
};

