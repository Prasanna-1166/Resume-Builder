import React, { useState, useMemo, useEffect } from 'react';
import { TEMPLATE_CATALOG, TemplateMetadata, getTemplateComponent } from '@ai-resume/templates';
import { useResume } from '../../context/ResumeContext';
import { DocumentType } from '@ai-resume/core';
import { Search, Eye, Check, X, Sparkles, Filter, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { track } from '../../services/analytics';

interface TemplateGalleryProps {
  onSelectTemplate: (templateId: string) => void;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({ onSelectTemplate }) => {
  const { activeDocument, setTemplate, createDocument } = useResume();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocType, setSelectedDocType] = useState<'ALL' | DocumentType>('ALL');
  const [selectedExperience, setSelectedExperience] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedLayout, setSelectedLayout] = useState<string>('all');
  const [prioritizeOnly, setPrioritizeOnly] = useState<boolean>(false);
  const [previewTemplate, setPreviewTemplate] = useState<TemplateMetadata | null>(null);

  useEffect(() => {
    track('PAGE_VIEW', { metadata: { page: 'gallery' } });
  }, []);

  const resumeCount = TEMPLATE_CATALOG.filter(t => (t.documentType || 'RESUME') === 'RESUME').length;
  const cvCount = TEMPLATE_CATALOG.filter(t => t.documentType === 'CV').length;
  const clCount = TEMPLATE_CATALOG.filter(t => t.documentType === 'COVER_LETTER').length;

  const docTypeTabs = [
    { id: 'ALL', label: 'All Formats', count: TEMPLATE_CATALOG.length },
    { id: 'RESUME', label: `Resumes (${resumeCount})`, count: resumeCount },
    { id: 'CV', label: `Curriculum Vitae (${cvCount})`, count: cvCount },
    { id: 'COVER_LETTER', label: `Cover Letters (${clCount})`, count: clCount }
  ];

  const experienceLevels = [
    { id: 'all', label: 'All Experience Levels' },
    { id: 'fresher', label: 'Student / Fresher / Entry Level' },
    { id: 'mid', label: 'Mid-Level / Professional' },
    { id: 'executive', label: 'Senior / Executive / Leadership' },
    { id: 'academic', label: 'Academic / Postgrad / Research' }
  ];

  const roleIndustries = [
    { id: 'all', label: 'All Roles / Industries' },
    { id: 'tech', label: 'Software, IT & Engineering' },
    { id: 'business', label: 'Corporate, Ops & Finance' },
    { id: 'academic', label: 'Academic, Clinical & Scientific' },
    { id: 'creative', label: 'Creative, Design & Media' },
    { id: 'general', label: 'General / Multi-Disciplinary' }
  ];

  const layoutOptions = [
    { id: 'all', label: 'All Layout Styles' },
    { id: '1-col', label: 'Single Column (ATS Classic)' },
    { id: '2-col', label: 'Two Column (Sidebar / Modern)' },
    { id: 'letter', label: 'US Letter Page' },
    { id: 'a4', label: 'International A4' },
    { id: 'serif', label: 'Serif / Editorial' },
    { id: 'mono', label: 'Monospace / Code-style' }
  ];

  // Multi-dimensional matching and relevance scoring
  const { scoredTemplates, activeFilterCount } = useMemo(() => {
    let filterCount = 0;
    if (selectedDocType !== 'ALL') filterCount++;
    if (selectedExperience !== 'all') filterCount++;
    if (selectedRole !== 'all') filterCount++;
    if (selectedLayout !== 'all') filterCount++;
    if (searchQuery.trim() !== '') filterCount++;

    const scored = TEMPLATE_CATALOG.map(t => {
      const docType = t.documentType || 'RESUME';
      let score = 0;
      let matches = true;

      // 1. Document Type Check
      if (selectedDocType !== 'ALL') {
        if (docType === selectedDocType) {
          score += 40;
        } else {
          matches = false;
        }
      }

      // 2. Experience Level Check
      if (selectedExperience !== 'all') {
        let expMatch = false;
        if (selectedExperience === 'fresher' && (t.suitableFor.includes('student') || t.suitableFor.includes('fresher') || t.category === 'student')) {
          expMatch = true;
          score += 25;
        } else if (selectedExperience === 'executive' && (t.category === 'executive' || t.tags.some(tag => tag.toLowerCase().includes('executive') || tag.toLowerCase().includes('leadership')))) {
          expMatch = true;
          score += 25;
        } else if (selectedExperience === 'academic' && (t.category === 'academic' || t.documentType === 'CV')) {
          expMatch = true;
          score += 25;
        } else if (selectedExperience === 'mid' && (t.category === 'technical' || t.category === 'general' || t.suitableFor.includes('technical') || t.suitableFor.includes('general'))) {
          expMatch = true;
          score += 20;
        }

        if (!expMatch) {
          if (prioritizeOnly) score -= 10;
          else matches = false;
        }
      }

      // 3. Role / Industry Check
      if (selectedRole !== 'all') {
        let roleMatch = false;
        if (selectedRole === 'tech' && (t.category === 'technical' || t.tags.some(tag => ['tech', 'software', 'developer', 'engineering', 'cs'].some(k => tag.toLowerCase().includes(k))))) {
          roleMatch = true;
          score += 25;
        } else if (selectedRole === 'business' && (t.category === 'general' || t.category === 'executive' || t.tags.some(tag => ['business', 'management', 'corporate', 'finance'].some(k => tag.toLowerCase().includes(k))))) {
          roleMatch = true;
          score += 25;
        } else if (selectedRole === 'academic' && (t.category === 'academic' || t.tags.some(tag => ['academic', 'research', 'clinical', 'medical', 'phd'].some(k => tag.toLowerCase().includes(k))))) {
          roleMatch = true;
          score += 25;
        } else if (selectedRole === 'creative' && (t.category === 'creative' || t.tags.some(tag => ['creative', 'design', 'modern', 'portfolio'].some(k => tag.toLowerCase().includes(k))))) {
          roleMatch = true;
          score += 25;
        } else if (selectedRole === 'general' && (t.category === 'general' || t.suitableFor.includes('general'))) {
          roleMatch = true;
          score += 20;
        }

        if (!roleMatch) {
          if (prioritizeOnly) score -= 10;
          else matches = false;
        }
      }

      // 4. Layout Characteristics Check
      if (selectedLayout !== 'all') {
        let layoutMatch = false;
        if (selectedLayout === '1-col' && t.columns === 1) {
          layoutMatch = true;
          score += 15;
        } else if (selectedLayout === '2-col' && t.columns === 2) {
          layoutMatch = true;
          score += 15;
        } else if (selectedLayout === 'letter' && t.pageSize === 'letter') {
          layoutMatch = true;
          score += 10;
        } else if (selectedLayout === 'a4' && t.pageSize === 'a4') {
          layoutMatch = true;
          score += 10;
        } else if (selectedLayout === 'serif' && t.fontFamily === 'serif') {
          layoutMatch = true;
          score += 15;
        } else if (selectedLayout === 'mono' && t.fontFamily === 'mono') {
          layoutMatch = true;
          score += 15;
        }

        if (!layoutMatch) {
          if (prioritizeOnly) score -= 5;
          else matches = false;
        }
      }

      // Search Query Matching
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesQuery =
          t.name.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query) ||
          t.tags.some(tag => tag.toLowerCase().includes(query)) ||
          t.intendedUser.toLowerCase().includes(query) ||
          t.strengths.some(s => s.toLowerCase().includes(query));

        if (matchesQuery) {
          score += 30;
        } else {
          matches = false;
        }
      }

      if (t.isPopular) score += 5;

      return {
        template: t,
        score,
        matches: prioritizeOnly ? (selectedDocType === 'ALL' || docType === selectedDocType) : matches
      };
    });

    const filtered = scored.filter(item => item.matches);
    filtered.sort((a, b) => b.score - a.score);

    return { scoredTemplates: filtered, activeFilterCount: filterCount };
  }, [selectedDocType, selectedExperience, selectedRole, selectedLayout, searchQuery, prioritizeOnly]);

  const handleResetFilters = () => {
    setSelectedDocType('ALL');
    setSelectedExperience('all');
    setSelectedRole('all');
    setSelectedLayout('all');
    setSearchQuery('');
  };

  const handleApplyTemplate = (templateId: string) => {
    track('TEMPLATE_SELECTED', { templateId, metadata: { source: 'gallery_card' } });
    const targetMeta = TEMPLATE_CATALOG.find(t => t.id === templateId);
    const targetDocType = targetMeta?.documentType || 'RESUME';

    // If switching between different document types, automatically align active document
    if (activeDocument.documentType !== targetDocType) {
      createDocument(targetDocType, 'STUDENT', templateId, `${targetMeta?.name || 'New'} Document`);
    } else {
      setTemplate(templateId);
    }
    onSelectTemplate(templateId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 mb-3 border border-indigo-100">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Curated Template Library ({TEMPLATE_CATALOG.length} Complete Designs)</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          Find the Perfect Layout for Your Career Stage
        </h1>
        <p className="mt-2 text-sm sm:text-base text-gray-600">
          Every layout is engineered with clean section hierarchy, robust print styles, and tested ATS readability.
        </p>

        {/* Quick Discovery Presets */}
        <div className="flex flex-wrap justify-center gap-1.5 mt-4">
          <span className="text-xs text-gray-400 self-center mr-1">Curated Presets:</span>
          {[
            { label: '🎓 Fresher Placement', docType: 'RESUME', exp: 'fresher', role: 'tech' },
            { label: '💻 Software Engineer', docType: 'RESUME', exp: 'mid', role: 'tech' },
            { label: '🔬 Academic CV', docType: 'CV', exp: 'academic', role: 'academic' },
            { label: '💼 Executive & Leadership', docType: 'RESUME', exp: 'executive', role: 'business' },
            { label: '✉️ Tech Cover Letter', docType: 'COVER_LETTER', exp: 'all', role: 'tech' }
          ].map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedDocType(preset.docType as any);
                setSelectedExperience(preset.exp);
                setSelectedRole(preset.role);
                setSelectedLayout('all');
                setSearchQuery('');
              }}
              className="text-xs bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 px-2.5 py-1 rounded-full transition-all shadow-2xs font-medium"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Multi-Dimensional Discovery Filter Console */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-5 mb-8">
        {/* Level 1: Document Type Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100">
          <div className="inline-flex p-1 bg-slate-100 rounded-xl gap-1 overflow-x-auto max-w-full">
            {docTypeTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedDocType(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  selectedDocType === tab.id
                    ? 'bg-white text-indigo-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <label className="inline-flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={prioritizeOnly}
                onChange={e => setPrioritizeOnly(e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>Prioritize without hiding non-matches</span>
            </label>

            {activeFilterCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 hover:underline"
              >
                <X className="w-3.5 h-3.5" />
                Reset filters ({activeFilterCount})
              </button>
            )}
          </div>
        </div>

        {/* Level 2, 3, 4: Dimensional Filters & Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search keyword, tag, role..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Dimension 2: Experience Level */}
          <div>
            <select
              value={selectedExperience}
              onChange={e => setSelectedExperience(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800 font-medium"
            >
              {experienceLevels.map(exp => (
                <option key={exp.id} value={exp.id}>
                  {exp.label}
                </option>
              ))}
            </select>
          </div>

          {/* Dimension 3: Role / Industry */}
          <div>
            <select
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800 font-medium"
            >
              {roleIndustries.map(role => (
                <option key={role.id} value={role.id}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          {/* Dimension 4: Layout Characteristics */}
          <div>
            <select
              value={selectedLayout}
              onChange={e => setSelectedLayout(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800 font-medium"
            >
              {layoutOptions.map(l => (
                <option key={l.id} value={l.id}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between text-xs text-gray-500 font-medium gap-2">
        <div className="flex items-center gap-2">
          <span>
            Showing <strong className="text-slate-900">{scoredTemplates.length}</strong> of{' '}
            <strong>{TEMPLATE_CATALOG.length}</strong> templates
          </span>
          {activeFilterCount > 0 && (
            <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md font-semibold text-[11px]">
              Filtered by active criteria
            </span>
          )}
        </div>
        {activeDocument && (
          <span className="text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
            Active Template: <strong className="text-indigo-600">{activeDocument.templateId}</strong>
          </span>
        )}
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scoredTemplates.map(({ template, score }) => {
          const isCurrent = activeDocument.templateId === template.id;
          const docType = template.documentType || 'RESUME';

          return (
            <div
              key={template.id}
              className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between group shadow-sm hover:shadow-md ${
                isCurrent
                  ? 'border-indigo-600 ring-2 ring-indigo-600/20'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Card Header & Preview Box */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {docType === 'COVER_LETTER' ? 'Cover Letter' : docType}
                    </span>
                    <span className="text-[10px] font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-200">
                      {template.pageSize.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
                      {template.columns === 1 ? '1-Col' : '2-Col'}
                    </span>
                  </div>
                  {template.isPopular && (
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" /> Popular
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                  {template.name}
                </h3>
                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4">
                  {template.description}
                </p>

                {/* Micro Visual Card Preview */}
                <div
                  className="w-full h-44 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden relative cursor-pointer group-hover:border-indigo-300 transition-all flex items-center justify-center mb-4"
                  onClick={() => setPreviewTemplate(template)}
                >
                  <div className="transform scale-[0.26] origin-top pointer-events-none opacity-90 w-[800px] h-[1000px] bg-white p-4">
                    {React.createElement(getTemplateComponent(template.id), { data: activeDocument, isPreview: true })}
                  </div>
                  <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <span className="bg-white/95 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" /> Quick Preview
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-auto">
                  {template.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center gap-2">
                <button
                  onClick={() => setPreviewTemplate(template)}
                  className="flex-1 py-2 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5 text-gray-500" />
                  <span>Full Preview</span>
                </button>

                <button
                  onClick={() => handleApplyTemplate(template.id)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs ${
                    isCurrent
                      ? 'bg-emerald-600 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  {isCurrent ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Active</span>
                    </>
                  ) : (
                    <span>Use Template</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Screen Live Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full h-[90vh] flex flex-col overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <div>
                <h3 className="font-bold text-gray-900 text-base">{previewTemplate.name}</h3>
                <p className="text-xs text-gray-500">
                  {previewTemplate.description} • {previewTemplate.pageSize.toUpperCase()} format
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleApplyTemplate(previewTemplate.id);
                    setPreviewTemplate(null);
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                >
                  Apply Template
                </button>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body Canvas */}
            <div className="flex-1 bg-gray-200 p-6 overflow-auto flex justify-center items-start">
              <div className="shadow-2xl rounded-sm max-w-2xl w-full">
                {React.createElement(getTemplateComponent(previewTemplate.id), { data: activeDocument })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
