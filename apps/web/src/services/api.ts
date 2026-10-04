import { ResumeData } from '@ai-resume/core';

const defaultApiUrl = import.meta.env.DEV ? '' : 'https://resume-builder-d18h.onrender.com';
const rawApiUrl = (import.meta.env.VITE_API_URL || defaultApiUrl).replace(/\/$/, '');
const API_BASE = rawApiUrl ? `${rawApiUrl}/api` : '/api';

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('admin_token') || localStorage.getItem('user_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
}

async function request(endpoint: string, options: RequestInit = {}): Promise<Response> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, options);
    return res;
  } catch (err: any) {
    const targetUrl = `${API_BASE}${endpoint}`;
    console.error(`[API Network Error] Target: ${targetUrl}`, err);
    throw new Error(`Unable to connect to backend at ${API_BASE}. Please verify your Render service is active.`);
  }
}

export const apiClient = {
  // Templates
  async getTemplates(params?: { category?: string; status?: string; search?: string }) {
    const query = new URLSearchParams(params as any).toString();
    const res = await request(`/templates?${query}`, {
      credentials: 'include',
      headers: {
        ...getAuthHeaders()
      }
    });
    if (!res.ok) throw new Error('Failed to fetch templates');
    return res.json();
  },

  async getTemplateById(id: string) {
    const res = await request(`/templates/${id}`, {
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
    const res = await request(`/ai/improve-summary`, {
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
    const res = await request(`/ai/improve-bullet`, {
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
    const res = await request(`/ai/suggest-skills`, {
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
    const res = await request(`/ai/analyze-job`, {
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
    const res = await request(`/ai/generate-cover-letter`, {
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
    const res = await request(`/ai/improve-cover-letter`, {
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
    const res = await request(`/ai/tailor-document`, {
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
    const res = await request(`/ai/suggest-cv-sections`, {
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

  // User & Admin Authentication
  async register(data: { name: string; email: string; password: string }) {
    const res = await request('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include'
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: `Registration failed (HTTP ${res.status})` }));
      throw new Error(err.error || `Registration failed (HTTP ${res.status})`);
    }
    const resData = await res.json();
    if (resData?.token && typeof window !== 'undefined') {
      localStorage.setItem('auth_token', resData.token);
      localStorage.setItem('user_token', resData.token);
    }
    return resData;
  },

  async login(credentials: { email: string; password: string }) {
    const res = await request('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
      credentials: 'include'
    });
    if (!res.ok) {
      if (res.status === 404) {
        throw new Error(`Backend route /api/auth/login not found (HTTP 404). Please ensure your Render Web Service is active.`);
      }
      const err = await res.json().catch(() => ({ error: `Login failed (HTTP ${res.status})` }));
      throw new Error(err.error || `Login failed (HTTP ${res.status})`);
    }
    const data = await res.json();
    if (data?.token && typeof window !== 'undefined') {
      localStorage.setItem('auth_token', data.token);
      if (data.user?.role === 'ADMIN' || data.user?.role === 'SUPER_ADMIN') {
        localStorage.setItem('admin_token', data.token);
      } else {
        localStorage.setItem('user_token', data.token);
      }
    }
    return data;
  },

  async adminLogin(credentials: { email: string; password: string }) {
    return this.login(credentials);
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      credentials: 'include',
      headers: {
        ...getAuthHeaders()
      }
    });
    if (!res.ok) throw new Error('Not authenticated');
    return res.json();
  },

  async getAdminMe() {
    return this.getMe();
  },

  async logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('admin_token');
      localStorage.removeItem('user_token');
    }
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        ...getAuthHeaders()
      }
    }).catch(() => {});
  },

  async adminLogout() {
    return this.logout();
  },

  // User Profile
  async getProfile() {
    const res = await fetch(`${API_BASE}/profile`, {
      credentials: 'include',
      headers: {
        ...getAuthHeaders()
      }
    });
    if (!res.ok) throw new Error('Failed to retrieve user profile');
    return res.json();
  },

  async updateProfile(profileData: any) {
    const res = await fetch(`${API_BASE}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(profileData),
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to update user profile');
    return res.json();
  },

  // User Cloud Documents
  async getUserDocuments() {
    const res = await fetch(`${API_BASE}/documents`, {
      credentials: 'include',
      headers: {
        ...getAuthHeaders()
      }
    });
    if (!res.ok) throw new Error('Failed to fetch user documents');
    return res.json();
  },

  async getDocumentById(id: string) {
    const res = await fetch(`${API_BASE}/documents/${id}`, {
      credentials: 'include',
      headers: {
        ...getAuthHeaders()
      }
    });
    if (!res.ok) throw new Error('Failed to fetch document');
    return res.json();
  },

  async createCloudDocument(doc: any) {
    const res = await fetch(`${API_BASE}/documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(doc),
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to create cloud document');
    return res.json();
  },

  async updateCloudDocument(id: string, doc: any) {
    const res = await fetch(`${API_BASE}/documents/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(doc),
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to update cloud document');
    return res.json();
  },

  async deleteCloudDocument(id: string) {
    const res = await fetch(`${API_BASE}/documents/${id}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders()
      },
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to delete cloud document');
    return res.json();
  },

  async syncDocuments(documents: any[]) {
    const res = await fetch(`${API_BASE}/documents/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ documents }),
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to synchronize documents');
    return res.json();
  },

  // Feedback & Support
  async submitFeedback(payload: { name: string; email: string; category: string; message: string }) {
    const res = await request('/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(payload),
      credentials: 'include'
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to submit feedback' }));
      throw new Error(err.error || 'Failed to submit feedback');
    }
    return res.json();
  },

  async getAdminFeedback() {
    const res = await fetch(`${API_BASE}/admin/feedback`, {
      credentials: 'include',
      headers: {
        ...getAuthHeaders()
      }
    });
    if (!res.ok) throw new Error('Failed to fetch feedback tickets');
    return res.json();
  },

  async updateFeedbackStatus(id: string, status: string) {
    const res = await fetch(`${API_BASE}/admin/feedback/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ status }),
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to update feedback status');
    return res.json();
  },

  // Admin Users
  async getAdminUsers() {
    const res = await fetch(`${API_BASE}/admin/users`, {
      credentials: 'include',
      headers: {
        ...getAuthHeaders()
      }
    });
    if (!res.ok) throw new Error('Failed to fetch admin users');
    return res.json();
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
