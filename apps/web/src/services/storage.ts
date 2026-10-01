import {
  ResumeData,
  CoverLetterData,
  CareerDocument,
  DocumentType,
  DocumentCategory,
  DocumentVersionSnapshot,
  studentFresherFixture,
  sampleCoverLetterFixture
} from '@ai-resume/core';

const STORAGE_KEY = 'ai_resume_builder_drafts';
const ACTIVE_DRAFT_ID_KEY = 'ai_resume_builder_active_id';

export interface DraftSummary {
  id: string;
  title: string;
  documentType: DocumentType;
  category: DocumentCategory;
  templateId: string;
  updatedAt: string;
  targetRole?: string;
  targetCompany?: string;
}

export const storageService = {
  getDrafts(): CareerDocument[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const initialResume: ResumeData = {
          ...studentFresherFixture,
          documentType: 'RESUME',
          category: 'STUDENT',
          versions: []
        };
        const initialDocs: CareerDocument[] = [initialResume];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDocs));
        localStorage.setItem(ACTIVE_DRAFT_ID_KEY, initialDocs[0].id);
        return initialDocs;
      }
      const parsed: any[] = JSON.parse(raw);
      // Migrate / ensure documentType & category are present
      return parsed.map(item => {
        if (!item.documentType) {
          item.documentType = 'RESUME';
        }
        if (!item.category) {
          item.category = item.documentType === 'COVER_LETTER' ? 'SOFTWARE_IT' : 'STUDENT';
        }
        if (!item.versions) {
          item.versions = [];
        }
        return item;
      });
    } catch (e) {
      console.error('Failed to load documents from localStorage:', e);
      return [studentFresherFixture];
    }
  },

  getActiveDraftId(): string {
    const id = localStorage.getItem(ACTIVE_DRAFT_ID_KEY);
    if (id) return id;
    const drafts = this.getDrafts();
    return drafts[0]?.id || studentFresherFixture.id;
  },

  setActiveDraftId(id: string): void {
    localStorage.setItem(ACTIVE_DRAFT_ID_KEY, id);
  },

  getActiveDraft(): CareerDocument {
    const drafts = this.getDrafts();
    const activeId = this.getActiveDraftId();
    return drafts.find(d => d.id === activeId) || drafts[0] || studentFresherFixture;
  },

  saveDraft(draft: CareerDocument): void {
    const drafts = this.getDrafts();
    const index = drafts.findIndex(d => d.id === draft.id);
    const updated = { ...draft, updatedAt: new Date().toISOString() };

    if (index >= 0) {
      drafts[index] = updated;
    } else {
      drafts.unshift(updated);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
    localStorage.setItem(ACTIVE_DRAFT_ID_KEY, updated.id);
  },

  createDocument(
    type: DocumentType = 'RESUME',
    category: DocumentCategory = 'STUDENT',
    templateId?: string,
    title?: string
  ): CareerDocument {
    const drafts = this.getDrafts();
    const count = drafts.filter(d => (d.documentType || 'RESUME') === type).length + 1;
    const now = new Date().toISOString();

    if (type === 'COVER_LETTER') {
      const defaultTemplate = templateId || 'template_cl_modern';
      const newDoc: CoverLetterData = {
        ...sampleCoverLetterFixture,
        id: `cl_${Date.now()}`,
        title: title || `Cover Letter #${count}`,
        documentType: 'COVER_LETTER',
        category,
        templateId: defaultTemplate,
        updatedAt: now,
        versions: []
      };
      drafts.unshift(newDoc);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
      localStorage.setItem(ACTIVE_DRAFT_ID_KEY, newDoc.id);
      return newDoc;
    }

    if (type === 'CV') {
      const defaultTemplate = templateId || 'template_cv_academic';
      const newDoc: ResumeData = {
        ...studentFresherFixture,
        id: `cv_${Date.now()}`,
        title: title || `CV #${count}`,
        documentType: 'CV',
        category,
        templateId: defaultTemplate,
        updatedAt: now,
        research: [
          {
            id: 'res_1',
            title: 'Graduate Research Scholar',
            institution: 'University Lab',
            advisor: 'Dr. Evelyn Reed',
            startDate: '2024',
            endDate: 'Present',
            bullets: ['Investigating scalable distributed graph algorithms and memory efficiency.']
          }
        ],
        conferences: [
          {
            id: 'conf_1',
            title: 'Efficient Distributed Systems',
            conferenceName: 'IEEE International Conference on Cloud Computing',
            date: '2025',
            location: 'San Francisco, CA',
            role: 'Presenter'
          }
        ],
        references: [
          {
            id: 'ref_1',
            name: 'Dr. Evelyn Reed',
            title: 'Professor of Computer Science',
            institutionOrCompany: 'University of Technology',
            email: 'e.reed@univ.edu',
            phone: '+1 (555) 432-1098'
          }
        ],
        versions: []
      };
      drafts.unshift(newDoc);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
      localStorage.setItem(ACTIVE_DRAFT_ID_KEY, newDoc.id);
      return newDoc;
    }

    // Default Resume
    const defaultTemplate = templateId || 'template_01';
    const newDoc: ResumeData = {
      ...studentFresherFixture,
      id: `resume_${Date.now()}`,
      title: title || `Resume #${count}`,
      documentType: 'RESUME',
      category,
      templateId: defaultTemplate,
      updatedAt: now,
      versions: []
    };
    drafts.unshift(newDoc);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
    localStorage.setItem(ACTIVE_DRAFT_ID_KEY, newDoc.id);
    return newDoc;
  },

  createDraft(templateId: string = 'template_01', baseName?: string): CareerDocument {
    return this.createDocument('RESUME', 'STUDENT', templateId, baseName);
  },

  duplicateDraft(id: string): CareerDocument {
    const drafts = this.getDrafts();
    const source = drafts.find(d => d.id === id) || drafts[0] || studentFresherFixture;
    const type = source.documentType || 'RESUME';
    const copy: CareerDocument = {
      ...JSON.parse(JSON.stringify(source)),
      id: `${type.toLowerCase()}_${Date.now()}`,
      title: `${source.title} (Copy)`,
      updatedAt: new Date().toISOString()
    };

    drafts.unshift(copy);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
    localStorage.setItem(ACTIVE_DRAFT_ID_KEY, copy.id);
    return copy;
  },

  deleteDraft(id: string): CareerDocument[] {
    let drafts = this.getDrafts();
    drafts = drafts.filter(d => d.id !== id);

    if (drafts.length === 0) {
      const initial: ResumeData = {
        ...studentFresherFixture,
        documentType: 'RESUME',
        category: 'STUDENT',
        versions: []
      };
      drafts = [initial];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
    localStorage.setItem(ACTIVE_DRAFT_ID_KEY, drafts[0].id);
    return drafts;
  },

  saveVersionSnapshot(docId: string, versionName: string, tag?: string, notes?: string): CareerDocument {
    const drafts = this.getDrafts();
    const doc = drafts.find(d => d.id === docId);
    if (!doc) throw new Error('Document not found');

    const snapshot: DocumentVersionSnapshot = {
      id: `ver_${Date.now()}`,
      versionName: versionName || `Version ${new Date().toLocaleTimeString()}`,
      tag: tag || 'Snapshot',
      timestamp: new Date().toISOString(),
      notes,
      data: JSON.parse(JSON.stringify(doc))
    };

    if (!doc.versions) doc.versions = [];
    doc.versions.unshift(snapshot);
    this.saveDraft(doc);
    return doc;
  },

  restoreVersionSnapshot(docId: string, versionId: string): CareerDocument {
    const drafts = this.getDrafts();
    const doc = drafts.find(d => d.id === docId);
    if (!doc || !doc.versions) throw new Error('Document or versions not found');

    const version = doc.versions.find(v => v.id === versionId);
    if (!version) throw new Error('Version snapshot not found');

    // Auto-save current state as a snapshot before restoring
    this.saveVersionSnapshot(docId, `Pre-Restore Backup (${new Date().toLocaleTimeString()})`, 'Auto-Backup');

    const restoredData = JSON.parse(JSON.stringify(version.data));
    restoredData.id = doc.id; // Keep current ID
    restoredData.updatedAt = new Date().toISOString();
    restoredData.versions = doc.versions; // Preserve history

    this.saveDraft(restoredData);
    return restoredData;
  }
};
