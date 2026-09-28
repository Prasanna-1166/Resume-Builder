import React from 'react';
import { SkillCategory } from '@ai-resume/core';

interface SkillsBlockProps {
  skills: SkillCategory[];
  variant?: 'inline-colon' | 'grid-pills' | 'bullet-list' | 'compact-table';
  className?: string;
}

export const SkillsBlock: React.FC<SkillsBlockProps> = ({
  skills,
  variant = 'inline-colon',
  className = ''
}) => {
  if (!skills || skills.length === 0) return null;

  if (variant === 'grid-pills') {
    return (
      <div className={`space-y-1.5 text-[12px] ${className}`}>
        {skills.map(cat => (
          <div key={cat.id} className="flex flex-wrap items-center gap-1.5">
            <span className="font-bold text-gray-900 min-w-[120px]">{cat.category}:</span>
            <div className="flex flex-wrap gap-1">
              {cat.items.map((skill, i) => (
                <span
                  key={i}
                  className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-[11px] font-medium border border-gray-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-1 text-[12.5px] leading-snug text-gray-800 ${className}`}>
      {skills.map(cat => (
        <div key={cat.id} className="flex flex-wrap items-baseline gap-x-1">
          <span className="font-bold text-gray-900">{cat.category}:</span>
          <span className="text-gray-800">{cat.items.join(', ')}</span>
        </div>
      ))}
    </div>
  );
};
