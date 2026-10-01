import { ResumeData } from '@ai-resume/core';

const defaultApiUrl = import.meta.env.DEV ? '' : 'https://resume-builder-d18h.onrender.com';
const rawApiUrl = (import.meta.env.VITE_API_URL || defaultApiUrl).replace(/\/$/, '');
const API_BASE = rawApiUrl ? `${rawApiUrl}/api` : '/api';

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
}

export const apiClient = {
  // Templates
  async getTemplates(params?: { category?: string; status?: string; search?: string }) {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_BASE}/templates?${query}`, {
      credentials: 'include',
      headers: {
        ...getAuthHeaders()
      }
    });
    if (!res.ok) throw new Error('Failed to fetch templates');
    return res.json();
  },

  async getTemplateById(id: string) {
    const res = await fetch(`${API_BASE}/templates/${id}`, {
      credentials: 'include',
      headers: {
        ...getAuthHeaders()
      }
    });
    if (!res.ok) throw new Error('Failed to fetch template');
    return res.json();
  },

  // AI Services
  async improveSummary(summary: string, targetRole?: string) {
    const res = await fetch(`${API_BASE}/ai/improve-summary`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ summary, targetRole }),
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to enhance summary');
    return res.json();
  },

  async improveBullet(bullet: string, context?: string) {
    const res = await fetch(`${API_BASE}/ai/improve-bullet`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ bullet, context }),
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to enhance bullet point');
    return res.json();
  },

  async suggestSkills(currentSkills: string[], targetRole?: string, experienceSnippet?: string) {
    const res = await fetch(`${API_BASE}/ai/suggest-skills`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ currentSkills, targetRole, experienceSnippet }),
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to suggest skills');
    return res.json();
  },

  async analyzeJob(jobDescription: string, userSkills: string[]) {
    const res = await fetch(`${API_BASE}/ai/analyze-job`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
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
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
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
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(payload),
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to improve cover letter');
    return res.json();
  },

  async tailorDocument(payload: {
    documentType: string;
    documentData: any;
    jobDescription: string;
    targetRole?: string;
    targetCompany?: string;
  }) {
    const res = await fetch(`${API_BASE}/ai/tailor-document`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(payload),
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to tailor document');
    return res.json();
  },

  async suggestCvSections(payload: {
    domain: string;
    currentCv: any;
  }) {
    const res = await fetch(`${API_BASE}/ai/suggest-cv-sections`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(payload),
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to suggest CV sections');
    return res.json();
  },

  // Export
  async exportDocx(documentData: any, templateId?: string, customStyles?: any) {
    const tId = templateId || documentData.templateId || 'template_01';
    const isCv = documentData.documentType === 'CV';
    const isCoverLetter = documentData.documentType === 'COVER_LETTER';

    const endpoint = isCoverLetter
      ? `${API_BASE}/export/cover-letter-docx`
      : isCv
      ? `${API_BASE}/export/cv-docx`
      : `${API_BASE}/export/docx`;

    const bodyPayload = isCoverLetter
      ? { coverLetterData: documentData, templateId: tId, customStyles }
      : isCv
      ? { cvData: documentData, templateId: tId, customStyles }
      : { resumeData: documentData, templateId: tId, customStyles };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(bodyPayload),
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to export DOCX');
    return res.blob();
  },

  async exportCvDocx(cvData: any, templateId: string, customStyles?: any) {
    const res = await fetch(`${API_BASE}/export/cv-docx`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({
        cvData,
        templateId,
        customStyles
      }),
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to export CV DOCX');
    return res.blob();
  },

  async exportCoverLetterDocx(coverLetterData: any, templateId: string, customStyles?: any) {
    const res = await fetch(`${API_BASE}/export/cover-letter-docx`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({
        coverLetterData,
        templateId,
        customStyles
      }),
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to export Cover Letter DOCX');
    return res.blob();
  },

  async exportResumeDocx(resumeData: ResumeData, templateId: string, customStyles?: any) {
    const res = await fetch(`${API_BASE}/export/docx`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({
        resumeData,
        templateId,
        customStyles
      }),
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to export DOCX');
    return res.blob();
  },

  // Admin Authentication & Profile
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
    const data = await res.json();
    if (data?.token && typeof window !== 'undefined') {
      localStorage.setItem('admin_token', data.token);
    }
    return data;
  },

  async getAdminMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      credentials: 'include',
      headers: {
        ...getAuthHeaders()
      }
    });
    if (!res.ok) throw new Error('Not authenticated');
    return res.json();
  },

  async adminLogout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
    }
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        ...getAuthHeaders()
      }
    }).catch(() => {});
  },

  async updateTemplate(id: string, updates: any) {
    const res = await fetch(`${API_BASE}/templates/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(updates),
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to update template');
    return res.json();
  },

  async uploadTemplateReference(formData: FormData) {
    const res = await fetch(`${API_BASE}/templates/upload-reference`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders()
      },
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
      credentials: 'include',
      headers: {
        ...getAuthHeaders()
      }
    });
    if (!res.ok) throw new Error('Failed to fetch analytics overview');
    return res.json();
  },

  async getAnalyticsTimeseries(range: string = '30d') {
    const res = await fetch(`${API_BASE}/admin/analytics/timeseries?range=${range}`, {
      credentials: 'include',
      headers: {
        ...getAuthHeaders()
      }
    });
    if (!res.ok) throw new Error('Failed to fetch analytics timeseries');
    return res.json();
  },

  async getAnalyticsTemplates(range: string = '30d') {
    const res = await fetch(`${API_BASE}/admin/analytics/templates?range=${range}`, {
      credentials: 'include',
      headers: {
        ...getAuthHeaders()
      }
    });
    if (!res.ok) throw new Error('Failed to fetch template analytics');
    return res.json();
  },

  async getAnalyticsAi(range: string = '30d') {
    const res = await fetch(`${API_BASE}/admin/analytics/ai?range=${range}`, {
      credentials: 'include',
      headers: {
        ...getAuthHeaders()
      }
    });
    if (!res.ok) throw new Error('Failed to fetch AI analytics');
    return res.json();
  }
};
