import React from 'react';
import { ProjectItem as ProjectType } from '@ai-resume/core';
import { ExternalLink, Github } from 'lucide-react';

interface ProjectItemProps {
  item: ProjectType;
  showLinks?: boolean;
  className?: string;
}

export const ProjectItem: React.FC<ProjectItemProps> = ({
  item,
  showLinks = true,
  className = ''
}) => {
  return (
    <div className={`mb-2.5 text-[12.5px] leading-relaxed text-gray-800 ${className}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-2">
        <div className="flex flex-wrap items-center gap-x-1.5">
          <span className="font-bold text-gray-900">{item.name}</span>
          {item.technologies && item.technologies.length > 0 && (
            <span className="text-gray-600 text-[11.5px] font-normal">
              | {item.technologies.join(', ')}
            </span>
          )}
        </div>

        {showLinks && (item.url || item.repoUrl) && (
          <div className="flex items-center gap-2 text-[11px] text-blue-600">
            {item.url && (
              <a
                href={item.url.startsWith('http') ? item.url : `https://${item.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 hover:underline"
              >
                <span>Live Demo</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
            {item.repoUrl && (
              <a
                href={item.repoUrl.startsWith('http') ? item.repoUrl : `https://${item.repoUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 hover:underline text-gray-700"
              >
                <Github className="w-2.5 h-2.5" />
                <span>Code</span>
              </a>
            )}
          </div>
        )}
      </div>

      {item.description && (
        <div className="text-[12px] text-gray-700 mt-0.5 mb-0.5">
          {item.description}
        </div>
      )}

      {item.bullets && item.bullets.length > 0 && (
        <ul className="mt-0.5 pl-4 list-disc space-y-0.5">
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
