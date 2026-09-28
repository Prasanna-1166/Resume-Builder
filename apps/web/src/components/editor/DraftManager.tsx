import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import { Plus, Copy, Trash2, Save, FileCheck, ChevronDown } from 'lucide-react';

export const DraftManager: React.FC = () => {
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

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(resumeData.title);

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (titleInput.trim()) {
      updateResumeData(prev => ({ ...prev, title: titleInput.trim() }));
    } else {
      setTitleInput(resumeData.title);
    }
  };

  return (
    <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-2xs flex flex-wrap items-center justify-between gap-2.5">
      {/* Draft selector & Title */}
      <div className="flex items-center gap-2 flex-1 min-w-[240px]">
        <select
          value={resumeData.id}
          onChange={e => switchDraft(e.target.value)}
          className="px-2.5 py-1 text-xs bg-gray-50 border border-gray-300 rounded font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
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
            className="px-2 py-0.5 text-xs border border-sky-500 rounded font-semibold text-gray-900 focus:outline-none"
          />
        ) : (
          <span
            onClick={() => {
              setTitleInput(resumeData.title);
              setIsEditingTitle(true);
            }}
            className="text-xs font-semibold text-gray-700 hover:text-sky-600 cursor-pointer truncate max-w-[150px]"
            title="Click to rename draft"
          >
            {resumeData.title}
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => createNewDraft(resumeData.templateId)}
          className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-gray-700 hover:bg-gray-100 rounded border border-gray-300 transition-colors"
          title="Create New Blank Draft"
        >
          <Plus className="w-3 h-3 text-gray-600" />
          <span className="hidden sm:inline">New Draft</span>
        </button>

        <button
          onClick={duplicateCurrentDraft}
          className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-gray-700 hover:bg-gray-100 rounded border border-gray-300 transition-colors"
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
            className="p-1 text-gray-400 hover:text-red-500 rounded hover:bg-red-50 transition-colors"
            title="Delete Draft"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}

        <div className="h-4 w-px bg-gray-200 mx-1" />

        {/* Auto-save & manual save status */}
        <button
          onClick={manualSave}
          className="flex items-center gap-1 px-3 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded text-[11px] font-semibold transition-colors"
        >
          <Save className="w-3 h-3 text-sky-600" />
          <span>{isSaving ? 'Saving...' : 'Saved'}</span>
        </button>

        {lastSavedAt && (
          <span className="text-[10px] text-gray-400 hidden md:inline">
            at {lastSavedAt}
          </span>
        )}
      </div>
    </div>
  );
};
