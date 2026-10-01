import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import {
  ResumeData,
  CoverLetterData,
  CareerDocument,
  DocumentType,
  DocumentCategory,
  calculateResumeCompleteness,
  CompletenessReport,
  runAtsAudit,
  AtsCheckResult,
  studentFresherFixture
} from '@ai-resume/core';
import { storageService } from '../services/storage';
import { track } from '../services/analytics';

interface ResumeContextType {
  activeDocument: CareerDocument;
  resumeData: ResumeData;
  coverLetterData: CoverLetterData | null;
  isCoverLetter: boolean;
  isCv: boolean;
  drafts: CareerDocument[];
  completeness: CompletenessReport;
  atsResult: AtsCheckResult;
  isSaving: boolean;
  lastSavedAt: string | null;
  updateActiveDocument: (updater: (prev: CareerDocument) => CareerDocument) => void;
  updateResumeData: (updater: (prev: ResumeData) => ResumeData) => void;
  updateCoverLetterData: (updater: (prev: CoverLetterData) => CoverLetterData) => void;
  setTemplate: (templateId: string) => void;
  setDocumentCategory: (category: DocumentCategory) => void;
  switchDraft: (draftId: string) => void;
  createNewDraft: (templateId?: string) => void;
  createDocument: (type: DocumentType, category: DocumentCategory, templateId?: string, title?: string) => CareerDocument;
  duplicateCurrentDraft: () => void;
  deleteCurrentDraft: () => void;
  saveVersionSnapshot: (versionName: string, tag?: string, notes?: string) => void;
  restoreVersionSnapshot: (versionId: string) => void;
  manualSave: () => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [drafts, setDrafts] = useState<CareerDocument[]>(() => storageService.getDrafts());
  const [activeDocument, setActiveDocument] = useState<CareerDocument>(() => storageService.getActiveDraft());
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(new Date().toLocaleTimeString());
  const lastSaveTrackTime = useRef<number>(0);

  const isCoverLetter = activeDocument.documentType === 'COVER_LETTER';
  const isCv = activeDocument.documentType === 'CV';

  // Compatibility ResumeData: if active is a cover letter, provide a baseline ResumeData for completeness/ats calculations
  const resumeData: ResumeData = !isCoverLetter ? (activeDocument as ResumeData) : {
    ...studentFresherFixture,
    personalInfo: activeDocument.personalInfo,
    title: activeDocument.title,
    templateId: activeDocument.templateId,
    updatedAt: activeDocument.updatedAt
  };

  const coverLetterData: CoverLetterData | null = isCoverLetter ? (activeDocument as CoverLetterData) : null;

  // Completeness & ATS checks for resume/CV
  const completeness = calculateResumeCompleteness(resumeData);
  const atsResult = runAtsAudit(resumeData);

  // Debounced auto-save
  useEffect(() => {
    setIsSaving(true);
    const timer = setTimeout(() => {
      storageService.saveDraft(activeDocument);
      setDrafts(storageService.getDrafts());
      setIsSaving(false);
      setLastSavedAt(new Date().toLocaleTimeString());

      // Throttle save telemetry to max once per 60 seconds
      const now = Date.now();
      if (now - lastSaveTrackTime.current > 60000) {
        lastSaveTrackTime.current = now;
        track('RESUME_SAVED', { templateId: activeDocument.templateId, metadata: { type: 'autosave', documentType: activeDocument.documentType || 'RESUME' } });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [activeDocument]);

  const updateActiveDocument = useCallback((updater: (prev: CareerDocument) => CareerDocument) => {
    setActiveDocument(prev => updater(prev));
  }, []);

  const updateResumeData = useCallback((updater: (prev: ResumeData) => ResumeData) => {
    setActiveDocument(prev => {
      if (prev.documentType === 'COVER_LETTER') return prev;
      return updater(prev as ResumeData);
    });
  }, []);

  const updateCoverLetterData = useCallback((updater: (prev: CoverLetterData) => CoverLetterData) => {
    setActiveDocument(prev => {
      if (prev.documentType !== 'COVER_LETTER') return prev;
      return updater(prev as CoverLetterData);
    });
  }, []);

  const setTemplate = useCallback((templateId: string) => {
    setActiveDocument(prev => ({
      ...prev,
      templateId
    }));
  }, []);

  const setDocumentCategory = useCallback((category: DocumentCategory) => {
    setActiveDocument(prev => ({
      ...prev,
      category
    }));
  }, []);

  const switchDraft = useCallback((draftId: string) => {
    storageService.setActiveDraftId(draftId);
    const target = storageService.getActiveDraft();
    setActiveDocument(target);
    setDrafts(storageService.getDrafts());
  }, []);

  const createDocument = useCallback((type: DocumentType, category: DocumentCategory, templateId?: string, title?: string): CareerDocument => {
    const newDoc = storageService.createDocument(type, category, templateId, title);
    setActiveDocument(newDoc);
    setDrafts(storageService.getDrafts());
    track('RESUME_CREATED', { templateId: newDoc.templateId, metadata: { documentType: type, category } });
    return newDoc;
  }, []);

  const createNewDraft = useCallback((templateId: string = 'template_01') => {
    createDocument('RESUME', 'STUDENT', templateId);
  }, [createDocument]);

  const duplicateCurrentDraft = useCallback(() => {
    const copy = storageService.duplicateDraft(activeDocument.id);
    setActiveDocument(copy);
    setDrafts(storageService.getDrafts());
    track('RESUME_CREATED', { templateId: copy.templateId, metadata: { source: 'duplicate', documentType: copy.documentType || 'RESUME' } });
  }, [activeDocument.id, activeDocument.documentType]);

  const deleteCurrentDraft = useCallback(() => {
    const updatedDrafts = storageService.deleteDraft(activeDocument.id);
    setDrafts(updatedDrafts);
    setActiveDocument(updatedDrafts[0]);
  }, [activeDocument.id]);

  const saveVersionSnapshot = useCallback((versionName: string, tag?: string, notes?: string) => {
    const updated = storageService.saveVersionSnapshot(activeDocument.id, versionName, tag, notes);
    setActiveDocument(updated);
    setDrafts(storageService.getDrafts());
  }, [activeDocument.id]);

  const restoreVersionSnapshot = useCallback((versionId: string) => {
    const restored = storageService.restoreVersionSnapshot(activeDocument.id, versionId);
    setActiveDocument(restored);
    setDrafts(storageService.getDrafts());
  }, [activeDocument.id]);

  const manualSave = useCallback(() => {
    storageService.saveDraft(activeDocument);
    setDrafts(storageService.getDrafts());
    setLastSavedAt(new Date().toLocaleTimeString());
    track('RESUME_SAVED', { templateId: activeDocument.templateId, metadata: { type: 'manual', documentType: activeDocument.documentType || 'RESUME' } });
  }, [activeDocument]);

  return (
    <ResumeContext.Provider
      value={{
        activeDocument,
        resumeData,
        coverLetterData,
        isCoverLetter,
        isCv,
        drafts,
        completeness,
        atsResult,
        isSaving,
        lastSavedAt,
        updateActiveDocument,
        updateResumeData,
        updateCoverLetterData,
        setTemplate,
        setDocumentCategory,
        switchDraft,
        createNewDraft,
        createDocument,
        duplicateCurrentDraft,
        deleteCurrentDraft,
        saveVersionSnapshot,
        restoreVersionSnapshot,
        manualSave
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export function useResume(): ResumeContextType {
  const context = useContext(ResumeContext);
  if (!context) throw new Error('useResume must be used within a ResumeProvider');
  return context;
}
