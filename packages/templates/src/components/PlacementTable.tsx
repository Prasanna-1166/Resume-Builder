import React from 'react';
import { EducationItem } from '@ai-resume/core';

interface PlacementTableProps {
  education: EducationItem[];
  className?: string;
}

export const PlacementTable: React.FC<PlacementTableProps> = ({ education, className = '' }) => {
  if (!education || education.length === 0) return null;

  return (
    <div className={`overflow-x-auto my-2 ${className}`}>
      <table className="w-full text-left text-[11.5px] border-collapse border border-gray-400">
        <thead>
          <tr className="bg-gray-100 text-gray-900 border-b border-gray-400">
            <th className="border border-gray-400 px-2 py-1 font-bold">Degree / Certificate</th>
            <th className="border border-gray-400 px-2 py-1 font-bold">Institute / School</th>
            <th className="border border-gray-400 px-2 py-1 font-bold text-center">Year</th>
            <th className="border border-gray-400 px-2 py-1 font-bold text-center">CGPA / %</th>
          </tr>
        </thead>
        <tbody>
          {education.map((edu) => (
            <tr key={edu.id} className="border-b border-gray-300">
              <td className="border border-gray-400 px-2 py-1 font-medium">
                {edu.degree} {edu.field ? `(${edu.field})` : ''}
              </td>
              <td className="border border-gray-400 px-2 py-1 text-gray-800">
                {edu.institution}
                {edu.location ? `, ${edu.location}` : ''}
              </td>
              <td className="border border-gray-400 px-2 py-1 text-center whitespace-nowrap">
                {edu.endDate || edu.startDate}
              </td>
              <td className="border border-gray-400 px-2 py-1 text-center font-semibold">
                {edu.gpaOrGrade || '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
