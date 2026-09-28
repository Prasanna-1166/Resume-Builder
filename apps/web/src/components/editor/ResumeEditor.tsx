import React, { useState } from 'react';
import { DraftManager } from './DraftManager';
import { CompletenessBar } from './CompletenessBar';
import { PersonalEditor } from './PersonalEditor';
import { SummaryEditor } from './SummaryEditor';
import { EducationEditor } from './EducationEditor';
import { ExperienceEditor } from './ExperienceEditor';
import { ProjectsEditor } from './ProjectsEditor';
import { SkillsEditor } from './SkillsEditor';
import { CertificationsEditor } from './CertificationsEditor';
import { AchievementsEditor } from './AchievementsEditor';
import { SectionReorder } from './SectionReorder';
import {
  User,
  FileText,
  GraduationCap,
  Briefcase,
  FolderGit2,
  Wrench,
  Award,
  Trophy,
  Sliders
} from 'lucide-react';

interface ResumeEditorProps {
  onOpenAiEnhance?: (type: 'summary' | 'bullet', currentText: string, context?: string) => void;
  onOpenSkillSuggestions?: () => void;
}

export const ResumeEditor: React.FC<ResumeEditorProps> = ({
  onOpenAiEnhance,
  onOpenSkillSuggestions
}) => {
  const [activeTab, setActiveTab] = useState<string>('personal');

  const tabs = [
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'summary', label: 'Summary', icon: FileText },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'skills', label: 'Skills', icon: Wrench },
    { id: 'certifications', label: 'Certs', icon: Award },
    { id: 'achievements', label: 'Honors', icon: Trophy },
    { id: 'sections', label: 'Sections', icon: Sliders },
  ];

  return (
    <div className="space-y-4 max-w-3xl">
      {/* Top Controls: Draft Manager & Completeness Bar */}
      <DraftManager />
      <CompletenessBar />

      {/* Editor Main Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-200 bg-gray-50/70 scrollbar-none px-2 pt-2 gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-sky-600 border-t-2 border-sky-600 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Section Body */}
        <div className="p-5">
          {activeTab === 'personal' && <PersonalEditor />}
          {activeTab === 'summary' && <SummaryEditor onOpenAiEnhance={onOpenAiEnhance} />}
          {activeTab === 'education' && <EducationEditor />}
          {activeTab === 'experience' && <ExperienceEditor onOpenAiEnhance={onOpenAiEnhance} />}
          {activeTab === 'projects' && <ProjectsEditor onOpenAiEnhance={onOpenAiEnhance} />}
          {activeTab === 'skills' && <SkillsEditor onOpenSkillSuggestions={onOpenSkillSuggestions} />}
          {activeTab === 'certifications' && <CertificationsEditor />}
          {activeTab === 'achievements' && <AchievementsEditor />}
          {activeTab === 'sections' && <SectionReorder />}
        </div>
      </div>
    </div>
  );
};
