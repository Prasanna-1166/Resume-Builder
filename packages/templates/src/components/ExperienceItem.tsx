import React from 'react';
import { ExperienceItem as ExperienceType } from '@ai-resume/core';

interface ExperienceItemProps {
  item: ExperienceType;
  layout?: 'standard' | 'stacked' | 'italic-role' | 'bold-company';
  dateStyle?: 'right-aligned' | 'subtext' | 'inline';
  bulletStyle?: 'disc' | 'circle' | 'dash' | 'arrow';
  className?: string;
}

export const ExperienceItem: React.FC<ExperienceItemProps> = ({
  item,
  layout = 'standard',
  dateStyle = 'right-aligned',
  bulletStyle = 'disc',
  className = ''
}) => {
  const bulletClass = bulletStyle === 'dash' ? 'list-[none] before:content-["–_"]' : 'list-disc';

  return (
    <div className={`mb-2.5 text-[12.5px] leading-relaxed text-gray-800 ${className}`}>
      {/* Header Row */}
      <div className="flex flex-wrap items-baseline justify-between gap-x-2">
        <div>
          <span className="font-bold text-gray-900">{item.role}</span>
          {item.company && <span className="font-medium text-gray-700"> — {item.company}</span>}
          {item.location && <span className="text-gray-500 text-[12px]">, {item.location}</span>}
        </div>
        {dateStyle === 'right-aligned' && (
          <span className="text-gray-600 text-[12px] font-medium whitespace-nowrap">
            {item.startDate} – {item.endDate || (item.current ? 'Present' : '')}
          </span>
        )}
      </div>

      {item.departmentOrTeam && (
        <div className="text-[11.5px] text-gray-600 italic -mt-0.5 mb-1">
          {item.departmentOrTeam}
        </div>
      )}

      {/* Bullets */}
      {item.bullets && item.bullets.length > 0 && (
        <ul className={`mt-1 pl-4 space-y-0.5 ${bulletClass}`}>
          {item.bullets.map((bullet, idx) => (
            <li key={idx} className="text-gray-800 pl-0.5 text-[12px]">
              {bullet}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
