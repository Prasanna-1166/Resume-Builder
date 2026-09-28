import React from 'react';
import { EducationItem as EducationType } from '@ai-resume/core';

interface EducationItemProps {
  item: EducationType;
  showCoursework?: boolean;
  className?: string;
}

export const EducationItem: React.FC<EducationItemProps> = ({
  item,
  showCoursework = true,
  className = ''
}) => {
  return (
    <div className={`mb-2 text-[12.5px] leading-relaxed text-gray-800 ${className}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-2">
        <span className="font-bold text-gray-900">{item.institution}</span>
        <span className="text-gray-600 text-[12px] font-medium whitespace-nowrap">
          {item.startDate} – {item.endDate || (item.current ? 'Present' : '')}
        </span>
      </div>

      <div className="flex flex-wrap items-baseline justify-between text-[12px] text-gray-700">
        <div>
          <span className="italic">{item.degree}</span>
          {item.field && <span> in {item.field}</span>}
          {item.gpaOrGrade && (
            <span className="font-medium text-gray-900 ml-2 bg-gray-100 px-1.5 py-0.5 rounded text-[11px]">
              GPA: {item.gpaOrGrade}
            </span>
          )}
        </div>
        {item.location && <span className="text-gray-500 text-[11.5px]">{item.location}</span>}
      </div>

      {showCoursework && item.coursework && item.coursework.length > 0 && (
        <div className="text-[11.5px] text-gray-600 mt-0.5">
          <span className="font-semibold text-gray-700">Coursework: </span>
          <span>{item.coursework.join(', ')}</span>
        </div>
      )}

      {item.description && (
        <div className="text-[12px] text-gray-700 mt-0.5">
          {item.description}
        </div>
      )}
    </div>
  );
};
