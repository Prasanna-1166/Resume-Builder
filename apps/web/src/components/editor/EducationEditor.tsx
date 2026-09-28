import React from 'react';
import { useResume } from '../../context/ResumeContext';
import { EducationItem } from '@ai-resume/core';
import { Plus, Trash2, GraduationCap, ChevronDown, ChevronUp } from 'lucide-react';

export const EducationEditor: React.FC = () => {
  const { resumeData, updateResumeData } = useResume();
  const education = resumeData.education || [];

  const handleAdd = () => {
    const newItem: EducationItem = {
      id: `edu_${Date.now()}`,
      institution: '',
      degree: '',
      field: '',
      location: '',
      startDate: '',
      endDate: '',
      gpaOrGrade: '',
      coursework: []
    };
    updateResumeData(prev => ({
      ...prev,
      education: [...prev.education, newItem]
    }));
  };

  const handleUpdate = (index: number, field: keyof EducationItem, value: any) => {
    updateResumeData(prev => {
      const next = [...prev.education];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, education: next };
    });
  };

  const handleRemove = (index: number) => {
    updateResumeData(prev => {
      const next = [...prev.education];
      next.splice(index, 1);
      return { ...prev, education: next };
    });
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    updateResumeData(prev => {
      const next = [...prev.education];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= next.length) return prev;
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;
      return { ...prev, education: next };
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide flex items-center gap-1.5">
          <GraduationCap className="w-4 h-4 text-sky-600" />
          <span>Education Entries ({education.length})</span>
        </h3>
        <button
          onClick={handleAdd}
          className="flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 px-2.5 py-1 rounded transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Degree</span>
        </button>
      </div>

      {education.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg text-xs text-gray-500">
          No education history added yet. Click "Add Degree" to add one.
        </div>
      ) : (
        education.map((edu, idx) => (
          <div key={edu.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-3 relative group">
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="font-semibold text-xs text-gray-700">
                #{idx + 1} {edu.institution || 'New Institution'}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleMove(idx, 'up')}
                  disabled={idx === 0}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  title="Move Up"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleMove(idx, 'down')}
                  disabled={idx === education.length - 1}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  title="Move Down"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleRemove(idx)}
                  className="p-1 text-gray-400 hover:text-red-500 ml-1"
                  title="Delete Entry"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Institution / College *</label>
                <input
                  type="text"
                  value={edu.institution}
                  onChange={e => handleUpdate(idx, 'institution', e.target.value)}
                  placeholder="e.g. Stanford University"
                  className="w-full px-2.5 py-1 text-xs bg-white border border-gray-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Degree *</label>
                <input
                  type="text"
                  value={edu.degree}
                  onChange={e => handleUpdate(idx, 'degree', e.target.value)}
                  placeholder="e.g. Bachelor of Science"
                  className="w-full px-2.5 py-1 text-xs bg-white border border-gray-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Field of Study *</label>
                <input
                  type="text"
                  value={edu.field}
                  onChange={e => handleUpdate(idx, 'field', e.target.value)}
                  placeholder="e.g. Computer Science"
                  className="w-full px-2.5 py-1 text-xs bg-white border border-gray-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">GPA / Percentage / Grade</label>
                <input
                  type="text"
                  value={edu.gpaOrGrade || ''}
                  onChange={e => handleUpdate(idx, 'gpaOrGrade', e.target.value)}
                  placeholder="e.g. 3.8 / 4.0 or 8.9 CGPA"
                  className="w-full px-2.5 py-1 text-xs bg-white border border-gray-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Start Date *</label>
                <input
                  type="text"
                  value={edu.startDate}
                  onChange={e => handleUpdate(idx, 'startDate', e.target.value)}
                  placeholder="e.g. Aug 2020"
                  className="w-full px-2.5 py-1 text-xs bg-white border border-gray-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">End Date *</label>
                <input
                  type="text"
                  value={edu.endDate}
                  onChange={e => handleUpdate(idx, 'endDate', e.target.value)}
                  placeholder="e.g. May 2024 or Present"
                  className="w-full px-2.5 py-1 text-xs bg-white border border-gray-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">
                  Relevant Coursework (comma-separated)
                </label>
                <input
                  type="text"
                  value={edu.coursework?.join(', ') || ''}
                  onChange={e => handleUpdate(idx, 'coursework', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  placeholder="e.g. Data Structures, Cloud Computing, Database Systems"
                  className="w-full px-2.5 py-1 text-xs bg-white border border-gray-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
