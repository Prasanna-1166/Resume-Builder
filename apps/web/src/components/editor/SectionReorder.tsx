import React from 'react';
import { useResume } from '../../context/ResumeContext';
import { Eye, EyeOff, GripVertical } from 'lucide-react';

export const SectionReorder: React.FC = () => {
  const { resumeData, updateResumeData } = useResume();
  const visibility = resumeData.sectionVisibility || {};

  const toggleVisibility = (secKey: string) => {
    updateResumeData(prev => ({
      ...prev,
      sectionVisibility: {
        ...prev.sectionVisibility,
        [secKey]: prev.sectionVisibility?.[secKey] === false ? true : false
      }
    }));
  };

  const sectionsList = [
    { id: 'summary', label: 'Professional Summary' },
    { id: 'education', label: 'Education' },
    { id: 'experience', label: 'Work Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'achievements', label: 'Honors & Achievements' },
    { id: 'publications', label: 'Publications' },
    { id: 'languages', label: 'Languages' },
  ];

  return (
    <div className="space-y-2">
      <div className="text-xs font-semibold text-gray-700 mb-2">
        Section Visibility & Controls
      </div>

      <div className="space-y-1.5">
        {sectionsList.map((sec) => {
          const isShown = visibility[sec.id] !== false;
          return (
            <div
              key={sec.id}
              className={`flex items-center justify-between px-3 py-2 rounded-md border text-xs font-medium transition-all ${
                isShown ? 'bg-white border-gray-200 text-gray-800' : 'bg-gray-100 border-gray-200 text-gray-400'
              }`}
            >
              <div className="flex items-center gap-2">
                <GripVertical className="w-3.5 h-3.5 text-gray-400" />
                <span>{sec.label}</span>
              </div>

              <button
                type="button"
                onClick={() => toggleVisibility(sec.id)}
                className={`p-1 rounded hover:bg-gray-200 transition-colors ${
                  isShown ? 'text-sky-600' : 'text-gray-400'
                }`}
                title={isShown ? 'Hide Section' : 'Show Section'}
              >
                {isShown ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
