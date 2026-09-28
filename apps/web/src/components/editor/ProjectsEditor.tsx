import React from 'react';
import { useResume } from '../../context/ResumeContext';
import { ProjectItem } from '@ai-resume/core';
import { Plus, Trash2, FolderGit2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface ProjectsEditorProps {
  onOpenAiEnhance?: (type: 'bullet', currentText: string, context?: string) => void;
}

export const ProjectsEditor: React.FC<ProjectsEditorProps> = ({ onOpenAiEnhance }) => {
  const { resumeData, updateResumeData } = useResume();
  const projects = resumeData.projects || [];

  const handleAdd = () => {
    const newItem: ProjectItem = {
      id: `proj_${Date.now()}`,
      name: '',
      description: '',
      technologies: [],
      url: '',
      repoUrl: '',
      bullets: ['']
    };
    updateResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, newItem]
    }));
  };

  const handleUpdate = (index: number, field: keyof ProjectItem, value: any) => {
    updateResumeData(prev => {
      const next = [...prev.projects];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, projects: next };
    });
  };

  const handleRemove = (index: number) => {
    updateResumeData(prev => {
      const next = [...prev.projects];
      next.splice(index, 1);
      return { ...prev, projects: next };
    });
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    updateResumeData(prev => {
      const next = [...prev.projects];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= next.length) return prev;
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;
      return { ...prev, projects: next };
    });
  };

  const handleBulletChange = (projIndex: number, bulletIndex: number, text: string) => {
    updateResumeData(prev => {
      const next = [...prev.projects];
      const bullets = [...next[projIndex].bullets];
      bullets[bulletIndex] = text;
      next[projIndex] = { ...next[projIndex], bullets };
      return { ...prev, projects: next };
    });
  };

  const handleAddBullet = (projIndex: number) => {
    updateResumeData(prev => {
      const next = [...prev.projects];
      const bullets = [...next[projIndex].bullets, ''];
      next[projIndex] = { ...next[projIndex], bullets };
      return { ...prev, projects: next };
    });
  };

  const handleRemoveBullet = (projIndex: number, bulletIndex: number) => {
    updateResumeData(prev => {
      const next = [...prev.projects];
      const bullets = [...next[projIndex].bullets];
      bullets.splice(bulletIndex, 1);
      next[projIndex] = { ...next[projIndex], bullets: bullets.length ? bullets : [''] };
      return { ...prev, projects: next };
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide flex items-center gap-1.5">
          <FolderGit2 className="w-4 h-4 text-sky-600" />
          <span>Projects ({projects.length})</span>
        </h3>
        <button
          onClick={handleAdd}
          className="flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 px-2.5 py-1 rounded transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Project</span>
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg text-xs text-gray-500">
          No projects added yet. Click "Add Project" to highlight key academic, personal, or open-source software.
        </div>
      ) : (
        projects.map((proj, idx) => (
          <div key={proj.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-3 relative group">
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="font-semibold text-xs text-gray-700">
                #{idx + 1} {proj.name || 'New Project'}
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
                  disabled={idx === projects.length - 1}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  title="Move Down"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleRemove(idx)}
                  className="p-1 text-gray-400 hover:text-red-500 ml-1"
                  title="Delete Project"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Project Name *</label>
                <input
                  type="text"
                  value={proj.name}
                  onChange={e => handleUpdate(idx, 'name', e.target.value)}
                  placeholder="e.g. Algolens Visualizer"
                  className="w-full px-2.5 py-1 text-xs bg-white border border-gray-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">
                  Technologies (comma-separated) *
                </label>
                <input
                  type="text"
                  value={proj.technologies?.join(', ') || ''}
                  onChange={e => handleUpdate(idx, 'technologies', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  placeholder="e.g. React, TypeScript, Go, Docker"
                  className="w-full px-2.5 py-1 text-xs bg-white border border-gray-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Live Demo URL</label>
                <input
                  type="text"
                  value={proj.url || ''}
                  onChange={e => handleUpdate(idx, 'url', e.target.value)}
                  placeholder="e.g. https://algolens.dev"
                  className="w-full px-2.5 py-1 text-xs bg-white border border-gray-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">GitHub / Repo URL</label>
                <input
                  type="text"
                  value={proj.repoUrl || ''}
                  onChange={e => handleUpdate(idx, 'repoUrl', e.target.value)}
                  placeholder="e.g. github.com/user/algolens"
                  className="w-full px-2.5 py-1 text-xs bg-white border border-gray-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Bullets */}
            <div className="pt-2 border-t border-gray-200">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[11px] font-semibold text-gray-700">Project Highlights</span>
                <button
                  type="button"
                  onClick={() => handleAddBullet(idx)}
                  className="text-[10.5px] font-semibold text-sky-600 hover:text-sky-700"
                >
                  + Add Bullet
                </button>
              </div>

              <div className="space-y-1.5">
                {proj.bullets.map((b, bi) => (
                  <div key={bi} className="flex items-start gap-1.5">
                    <textarea
                      rows={2}
                      value={b}
                      onChange={e => handleBulletChange(idx, bi, e.target.value)}
                      placeholder="Describe what you engineered, algorithms used, user traction, or performance outcomes..."
                      className="flex-1 p-1.5 text-xs bg-white border border-gray-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none leading-normal"
                    />

                    <div className="flex flex-col gap-1 shrink-0 pt-0.5">
                      {onOpenAiEnhance && (
                        <button
                          type="button"
                          onClick={() => onOpenAiEnhance('bullet', b, `Project ${proj.name}`)}
                          className="p-1 text-purple-600 hover:bg-purple-50 rounded"
                          title="AI Improve Bullet"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveBullet(idx, bi)}
                        className="p-1 text-gray-400 hover:text-red-500 rounded"
                        title="Remove Bullet"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
