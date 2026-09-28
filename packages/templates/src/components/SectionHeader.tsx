import React from 'react';

interface SectionHeaderProps {
  title: string;
  variant?: 'underline' | 'bottom-border' | 'solid-line' | 'clean' | 'small-caps' | 'boxed' | 'colored-badge';
  accentColor?: string;
  fontStyle?: 'sans' | 'serif' | 'mono';
  uppercase?: boolean;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  variant = 'bottom-border',
  accentColor = '#1e293b',
  fontStyle = 'sans',
  uppercase = true,
  className = ''
}) => {
  const fontClass = fontStyle === 'serif' ? 'font-serif' : fontStyle === 'mono' ? 'font-mono' : 'font-sans';
  const textTransform = uppercase ? 'uppercase tracking-wider' : 'tracking-normal';

  if (variant === 'bottom-border') {
    return (
      <div className={`mt-3 mb-1.5 pb-0.5 border-b border-gray-300 ${className}`}>
        <h2
          className={`text-[13px] font-bold ${textTransform} ${fontClass}`}
          style={{ color: accentColor }}
        >
          {title}
        </h2>
      </div>
    );
  }

  if (variant === 'underline') {
    return (
      <div className={`mt-3 mb-1.5 ${className}`}>
        <h2
          className={`text-[13px] font-bold ${textTransform} ${fontClass} border-b-2 inline-block pr-6`}
          style={{ color: accentColor, borderColor: accentColor }}
        >
          {title}
        </h2>
      </div>
    );
  }

  if (variant === 'small-caps') {
    return (
      <div className={`mt-3 mb-1.5 pb-0.5 border-b border-gray-200 ${className}`}>
        <h2
          className={`text-[13.5px] font-bold uppercase tracking-widest ${fontClass}`}
          style={{ color: accentColor, fontVariant: 'small-caps' }}
        >
          {title}
        </h2>
      </div>
    );
  }

  if (variant === 'colored-badge') {
    return (
      <div className={`mt-3 mb-2 flex items-center gap-2 ${className}`}>
        <span className="w-1.5 h-3.5 rounded-sm" style={{ backgroundColor: accentColor }} />
        <h2
          className={`text-[13px] font-bold ${textTransform} ${fontClass}`}
          style={{ color: accentColor }}
        >
          {title}
        </h2>
        <div className="flex-1 border-b border-gray-200 ml-2" />
      </div>
    );
  }

  return (
    <div className={`mt-3 mb-1.5 ${className}`}>
      <h2
        className={`text-[13px] font-bold ${textTransform} ${fontClass}`}
        style={{ color: accentColor }}
      >
        {title}
      </h2>
    </div>
  );
};
