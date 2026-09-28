import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { ResumeData, calculateResumeCompleteness, CompletenessReport, runAtsAudit, AtsCheckResult } from '@ai-resume/core';
import { storageService } from '../services/storage';
import { track } from '../services/analytics';

interface ResumeContextType {
  resumeData: ResumeData;
  drafts: ResumeData[];
  completeness: CompletenessReport;
  atsResult: AtsCheckResult;
  isSaving: boolean;
  lastSavedAt: string | null;
  updateResumeData: (updater: (prev: ResumeData) => ResumeData) => void;
  setTemplate: (templateId: string) => void;
  switchDraft: (draftId: string) => void;
  createNewDraft: (templateId?: string) => void;
  duplicateCurrentDraft: () => void;
  deleteCurrentDraft: () => void;
  manualSave: () => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [drafts, setDrafts] = useState<ResumeData[]>(() => storageService.getDrafts());
  const [resumeData, setResumeData] = useState<ResumeData>(() => storageService.getActiveDraft());
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(new Date().toLocaleTimeString());
  const lastSaveTrackTime = useRef<number>(0);

  // Completeness & ATS checks
  const completeness = calculateResumeCompleteness(resumeData);
  const atsResult = runAtsAudit(resumeData);

  // Debounced auto-save
  useEffect(() => {
    setIsSaving(true);
    const timer = setTimeout(() => {
      storageService.saveDraft(resumeData);
      setDrafts(storageService.getDrafts());
      setIsSaving(false);
      setLastSavedAt(new Date().toLocaleTimeString());

      // Throttle save telemetry to max once per 60 seconds
      const now = Date.now();
      if (now - lastSaveTrackTime.current > 60000) {
        lastSaveTrackTime.current = now;
        track('RESUME_SAVED', { templateId: resumeData.templateId, metadata: { type: 'autosave' } });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [resumeData]);

  const updateResumeData = useCallback((updater: (prev: ResumeData) => ResumeData) => {
    setResumeData(prev => updater(prev));
  }, []);

  const setTemplate = useCallback((templateId: string) => {
    setResumeData(prev => ({
      ...prev,
      templateId
    }));
  }, []);

  const switchDraft = useCallback((draftId: string) => {
    storageService.setActiveDraftId(draftId);
    const target = storageService.getActiveDraft();
    setResumeData(target);
    setDrafts(storageService.getDrafts());
  }, []);

  const createNewDraft = useCallback((templateId: string = 'template_01') => {
    const newDraft = storageService.createDraft(templateId);
    setResumeData(newDraft);
    setDrafts(storageService.getDrafts());
    track('RESUME_CREATED', { templateId });
  }, []);

  const duplicateCurrentDraft = useCallback(() => {
    const copy = storageService.duplicateDraft(resumeData.id);
    setResumeData(copy);
    setDrafts(storageService.getDrafts());
    track('RESUME_CREATED', { templateId: copy.templateId, metadata: { source: 'duplicate' } });
  }, [resumeData.id]);

  const deleteCurrentDraft = useCallback(() => {
    const updatedDrafts = storageService.deleteDraft(resumeData.id);
    setDrafts(updatedDrafts);
    setResumeData(updatedDrafts[0]);
  }, [resumeData.id]);

  const manualSave = useCallback(() => {
    storageService.saveDraft(resumeData);
    setDrafts(storageService.getDrafts());
    setLastSavedAt(new Date().toLocaleTimeString());
    track('RESUME_SAVED', { templateId: resumeData.templateId, metadata: { type: 'manual' } });
  }, [resumeData]);

  return (
    <ResumeContext.Provider
      value={{
        resumeData,
        drafts,
        completeness,
        atsResult,
        isSaving,
        lastSavedAt,
        updateResumeData,
        setTemplate,
        switchDraft,
        createNewDraft,
        duplicateCurrentDraft,
        deleteCurrentDraft,
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
