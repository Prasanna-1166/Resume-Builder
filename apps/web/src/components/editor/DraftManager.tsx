import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../services/api';
import {
  Plus,
  Copy,
  Trash2,
  Save,
  UserCheck,
  UserPlus,
  UploadCloud,
  CheckCircle2
} from 'lucide-react';

interface DraftManagerProps {
  onOpenAuthModal?: (mode?: 'login' | 'register') => void;
  onOpenProfileModal?: () => void;
}

export const DraftManager: React.FC<DraftManagerProps> = ({
  onOpenAuthModal,
  onOpenProfileModal
}) => {
  const {
    resumeData,
    drafts,
    isSaving,
    lastSavedAt,
    switchDraft,
    createNewDraft,
    duplicateCurrentDraft,
    deleteCurrentDraft,
    manualSave,
    updateResumeData
  } = useResume();

  const { isAuthenticated } = useAuth();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(resumeData.title);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (titleInput.trim()) {
      updateResumeData(prev => ({ ...prev, title: titleInput.trim() }));
    } else {
      setTitleInput(resumeData.title);
    }
  };

  const handleUseProfileData = async () => {
    if (!isAuthenticated) {
      if (onOpenAuthModal) onOpenAuthModal('login');
      return;
    }

    if (
      confirm(
        'Import your Master Profile information into this document? This will populate personal details, summary, experience, education, and skills without removing custom sections.'
      )
    ) {
      try {
        const res = await apiClient.getProfile();
        if (res?.profile) {
          const p = res.profile;
          updateResumeData(prev => {
            const updated: any = { ...prev };
            if (p.personalInfo) {
              updated.personalInfo = {
                ...updated.personalInfo,
                ...(p.personalInfo.fullName ? { fullName: p.personalInfo.fullName } : {}),
                ...(p.personalInfo.email ? { email: p.personalInfo.email } : {}),
                ...(p.personalInfo.phone ? { phone: p.personalInfo.phone } : {}),
                ...(p.personalInfo.location ? { location: p.personalInfo.location } : {}),
                ...(p.personalInfo.professionalTitle ? { professionalTitle: p.personalInfo.professionalTitle } : {}),
                ...(p.personalInfo.website ? { website: p.personalInfo.website } : {}),
                ...(p.personalInfo.linkedin ? { linkedin: p.personalInfo.linkedin } : {}),
                ...(p.personalInfo.github ? { github: p.personalInfo.github } : {}),
                ...(p.personalInfo.portfolio ? { portfolio: p.personalInfo.portfolio } : {})
              };
            }
            if (p.summary) updated.summary = p.summary;
            if (Array.isArray(p.skills) && p.skills.length > 0) updated.skills = p.skills;
            if (Array.isArray(p.experience) && p.experience.length > 0) updated.experience = p.experience;
            if (Array.isArray(p.education) && p.education.length > 0) updated.education = p.education;
            if (Array.isArray(p.projects) && p.projects.length > 0) updated.projects = p.projects;
            if (Array.isArray(p.certifications) && p.certifications.length > 0) updated.certifications = p.certifications;
            return updated;
          });
          setSyncStatus('Applied profile data!');
          setTimeout(() => setSyncStatus(null), 2500);
        }
      } catch {
        alert('Failed to load profile data.');
      }
    }
  };

  const handleSaveToProfile = async () => {
    if (!isAuthenticated) {
      if (onOpenAuthModal) onOpenAuthModal('login');
      return;
    }

    if (
      confirm(
        'Save this document’s personal info, summary, experience, education, projects, and skills to your Master Profile for future reuse?'
      )
    ) {
      try {
        await apiClient.updateProfile({
          personalInfo: resumeData.personalInfo,
          summary: resumeData.summary,
          skills: resumeData.skills,
          experience: resumeData.experience,
          education: resumeData.education,
          projects: resumeData.projects,
          certifications: resumeData.certifications
        });
        setSyncStatus('Saved to Master Profile!');
        setTimeout(() => setSyncStatus(null), 2500);
      } catch {
        alert('Failed to save to profile.');
      }
    }
  };

  return (
    <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-2xs flex flex-wrap items-center justify-between gap-2.5">
      {/* Draft selector & Title */}
      <div className="flex items-center gap-2 flex-1 min-w-[240px]">
        <select
          value={resumeData.id}
          onChange={e => switchDraft(e.target.value)}
          className="px-2.5 py-1 text-xs bg-gray-50 border border-gray-300 rounded-lg font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          {drafts.map(d => (
            <option key={d.id} value={d.id}>
              {d.title} ({d.templateId})
            </option>
          ))}
        </select>

        {isEditingTitle ? (
          <input
            type="text"
            value={titleInput}
            onChange={e => setTitleInput(e.target.value)}
            onBlur={handleTitleBlur}
            onKeyDown={e => e.key === 'Enter' && handleTitleBlur()}
            autoFocus
            className="px-2 py-0.5 text-xs border border-indigo-500 rounded-lg font-semibold text-gray-900 focus:outline-none"
          />
        ) : (
          <span
            onClick={() => {
              setTitleInput(resumeData.title);
              setIsEditingTitle(true);
            }}
            className="text-xs font-semibold text-gray-700 hover:text-indigo-600 cursor-pointer truncate max-w-[150px]"
            title="Click to rename draft"
          >
            {resumeData.title}
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {/* Profile Sync Actions */}
        <button
          onClick={handleUseProfileData}
          className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50/60 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors"
          title="Import information from Master Profile into this document"
        >
          <UserCheck className="w-3 h-3 text-indigo-600" />
          <span className="hidden sm:inline">Use Profile Data</span>
        </button>

        <button
          onClick={handleSaveToProfile}
          className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
          title="Save this document's details to your reusable Master Profile"
        >
          <UploadCloud className="w-3 h-3 text-slate-500" />
          <span className="hidden md:inline">Save to Profile</span>
        </button>

        {syncStatus && (
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>{syncStatus}</span>
          </span>
        )}

        <div className="h-4 w-px bg-gray-200 mx-0.5 hidden sm:block" />

        <button
          onClick={() => createNewDraft(resumeData.templateId)}
          className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-300 transition-colors"
          title="Create New Blank Draft"
        >
          <Plus className="w-3 h-3 text-gray-600" />
          <span className="hidden sm:inline">New</span>
        </button>

        <button
          onClick={duplicateCurrentDraft}
          className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-300 transition-colors"
          title="Duplicate Current Resume"
        >
          <Copy className="w-3 h-3 text-gray-600" />
          <span className="hidden sm:inline">Duplicate</span>
        </button>

        {drafts.length > 1 && (
          <button
            onClick={() => {
              if (window.confirm(`Delete draft "${resumeData.title}"?`)) {
                deleteCurrentDraft();
              }
            }}
            className="p-1 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
            title="Delete Draft"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}

        <div className="h-4 w-px bg-gray-200 mx-0.5" />

        {/* Auto-save status */}
        <button
          onClick={manualSave}
          className="flex items-center gap-1 px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-[11px] font-semibold transition-colors"
        >
          <Save className="w-3 h-3 text-indigo-600" />
          <span>{isSaving ? 'Saving...' : 'Saved'}</span>
        </button>

        {lastSavedAt && (
          <span className="text-[10px] text-gray-400 hidden lg:inline">
            at {lastSavedAt}
          </span>
        )}
      </div>
    </div>
  );
};
