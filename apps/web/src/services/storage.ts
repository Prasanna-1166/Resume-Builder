import { ResumeData, studentFresherFixture } from '@ai-resume/core';

const STORAGE_KEY = 'ai_resume_builder_drafts';
const ACTIVE_DRAFT_ID_KEY = 'ai_resume_builder_active_id';

export interface DraftSummary {
  id: string;
  title: string;
  templateId: string;
  updatedAt: string;
}

export const storageService = {
  getDrafts(): ResumeData[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const initial = [studentFresherFixture];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
        localStorage.setItem(ACTIVE_DRAFT_ID_KEY, initial[0].id);
        return initial;
      }
      return JSON.parse(raw);
    } catch (e) {
      console.error('Failed to load drafts from localStorage:', e);
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

  getActiveDraft(): ResumeData {
    const drafts = this.getDrafts();
    const activeId = this.getActiveDraftId();
    return drafts.find(d => d.id === activeId) || drafts[0] || studentFresherFixture;
  },

  saveDraft(draft: ResumeData): void {
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

  createDraft(templateId: string = 'template_01', baseName?: string): ResumeData {
    const drafts = this.getDrafts();
    const count = drafts.length + 1;
    const newDraft: ResumeData = {
      ...studentFresherFixture,
      id: `draft_${Date.now()}`,
      title: baseName || `Resume Draft #${count}`,
      templateId,
      updatedAt: new Date().toISOString()
    };

    drafts.unshift(newDraft);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
    localStorage.setItem(ACTIVE_DRAFT_ID_KEY, newDraft.id);
    return newDraft;
  },

  duplicateDraft(id: string): ResumeData {
    const drafts = this.getDrafts();
    const source = drafts.find(d => d.id === id) || studentFresherFixture;
    const copy: ResumeData = {
      ...JSON.parse(JSON.stringify(source)),
      id: `draft_${Date.now()}`,
      title: `${source.title} (Copy)`,
      updatedAt: new Date().toISOString()
    };

    drafts.unshift(copy);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
    localStorage.setItem(ACTIVE_DRAFT_ID_KEY, copy.id);
    return copy;
  },

  deleteDraft(id: string): ResumeData[] {
    let drafts = this.getDrafts();
    drafts = drafts.filter(d => d.id !== id);

    if (drafts.length === 0) {
      drafts = [studentFresherFixture];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
    localStorage.setItem(ACTIVE_DRAFT_ID_KEY, drafts[0].id);
    return drafts;
  }
};
