import React from 'react';
import { PersonalInfo } from '@ai-resume/core';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, ExternalLink } from 'lucide-react';

interface ContactRowProps {
  personalInfo: PersonalInfo;
  separator?: 'pipe' | 'bullet' | 'diamond' | 'comma' | 'none';
  showIcons?: boolean;
  align?: 'left' | 'center' | 'right';
  className?: string;
  iconClassName?: string;
}

export const ContactRow: React.FC<ContactRowProps> = ({
  personalInfo,
  separator = 'pipe',
  showIcons = false,
  align = 'center',
  className = '',
  iconClassName = 'w-3 h-3 inline-block mr-1 text-gray-600'
}) => {
  const items: Array<{ id: string; icon?: React.ReactNode; label: string; href?: string }> = [];

  if (personalInfo.email) {
    items.push({
      id: 'email',
      icon: showIcons ? <Mail className={iconClassName} /> : undefined,
      label: personalInfo.email,
      href: `mailto:${personalInfo.email}`
    });
  }

  if (personalInfo.phone) {
    items.push({
      id: 'phone',
      icon: showIcons ? <Phone className={iconClassName} /> : undefined,
      label: personalInfo.phone,
      href: `tel:${personalInfo.phone}`
    });
  }

  if (personalInfo.location) {
    items.push({
      id: 'location',
      icon: showIcons ? <MapPin className={iconClassName} /> : undefined,
      label: personalInfo.location
    });
  }

  if (personalInfo.linkedin) {
    const clean = personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, 'linkedin.com/in/');
    items.push({
      id: 'linkedin',
      icon: showIcons ? <Linkedin className={iconClassName} /> : undefined,
      label: clean,
      href: personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`
    });
  }

  if (personalInfo.github) {
    const clean = personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, 'github.com/');
    items.push({
      id: 'github',
      icon: showIcons ? <Github className={iconClassName} /> : undefined,
      label: clean,
      href: personalInfo.github.startsWith('http') ? personalInfo.github : `https://${personalInfo.github}`
    });
  }

  if (personalInfo.portfolio || personalInfo.website) {
    const site = personalInfo.portfolio || personalInfo.website!;
    const clean = site.replace(/^https?:\/\//, '');
    items.push({
      id: 'website',
      icon: showIcons ? <Globe className={iconClassName} /> : undefined,
      label: clean,
      href: site.startsWith('http') ? site : `https://${site}`
    });
  }

  personalInfo.customLinks?.forEach((link, idx) => {
    items.push({
      id: `custom-${idx}`,
      icon: showIcons ? <ExternalLink className={iconClassName} /> : undefined,
      label: link.label,
      href: link.url.startsWith('http') ? link.url : `https://${link.url}`
    });
  });

  const sepChar = separator === 'bullet' ? ' • ' : separator === 'diamond' ? ' ⋄ ' : separator === 'comma' ? ', ' : separator === 'pipe' ? ' | ' : ' ';
  const alignmentClass = align === 'left' ? 'justify-start' : align === 'right' ? 'justify-end' : 'justify-center';

  return (
    <div className={`flex flex-wrap items-center ${alignmentClass} gap-y-1 text-[12.5px] text-gray-700 ${className}`}>
      {items.map((item, idx) => (
        <React.Fragment key={item.id}>
          <span className="inline-flex items-center">
            {item.icon}
            {item.href ? (
              <a href={item.href} target="_blank" rel="noopener noreferrer" className="hover:underline text-inherit">
                {item.label}
              </a>
            ) : (
              <span>{item.label}</span>
            )}
          </span>
          {idx < items.length - 1 && <span className="mx-1.5 text-gray-400 select-none">{sepChar}</span>}
        </React.Fragment>
      ))}
    </div>
  );
};
