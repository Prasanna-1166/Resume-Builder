import React, { useState, useMemo, useEffect } from 'react';
import { TEMPLATE_CATALOG, TemplateMetadata, getTemplateComponent } from '@ai-resume/templates';
import { useResume } from '../../context/ResumeContext';
import { DocumentType } from '@ai-resume/core';
import { Search, Filter, Eye, Check, X, Sparkles, Layers, FileText, CheckCircle2 } from 'lucide-react';
import { track } from '../../services/analytics';

interface TemplateGalleryProps {
  onSelectTemplate: (templateId: string) => void;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({ onSelectTemplate }) => {
  const { activeDocument, setTemplate, createDocument } = useResume();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocType, setSelectedDocType] = useState<'ALL' | DocumentType>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPageSize, setSelectedPageSize] = useState<string>('all');
  const [previewTemplate, setPreviewTemplate] = useState<TemplateMetadata | null>(null);

  useEffect(() => {
    track('PAGE_VIEW', { metadata: { page: 'gallery' } });
  }, []);

  const docTypeTabs = [
    { id: 'ALL', label: 'All Templates', count: TEMPLATE_CATALOG.length },
    { id: 'RESUME', label: 'Resumes (28)', count: TEMPLATE_CATALOG.filter(t => (t.documentType || 'RESUME') === 'RESUME').length },
    { id: 'CV', label: 'Curriculum Vitae (2)', count: TEMPLATE_CATALOG.filter(t => t.documentType === 'CV').length },
    { id: 'COVER_LETTER', label: 'Cover Letters (2)', count: TEMPLATE_CATALOG.filter(t => t.documentType === 'COVER_LETTER').length }
  ];

  const categories = [
    { id: 'all', label: 'All Domains' },
    { id: 'technical', label: 'Software / Engineering' },
    { id: 'student', label: 'Student / Fresher' },
    { id: 'executive', label: 'Leadership & PM' },
    { id: 'academic', label: 'Academic & Research' },
    { id: 'creative', label: 'Creative & Writing' },
    { id: 'general', label: 'Corporate & Ops' }
  ];

  const filteredTemplates = useMemo(() => {
    return TEMPLATE_CATALOG.filter(t => {
      const docType = t.documentType || 'RESUME';
      const matchesDocType = selectedDocType === 'ALL' || docType === selectedDocType;

      const matchesSearch =
        searchQuery === '' ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
      const matchesPageSize = selectedPageSize === 'all' || t.pageSize === selectedPageSize;

      return matchesDocType && matchesSearch && matchesCategory && matchesPageSize;
    });
  }, [searchQuery, selectedDocType, selectedCategory, selectedPageSize]);

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
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 mb-3 border border-indigo-100">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Professional Template Library ({TEMPLATE_CATALOG.length} Standard Designs)</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          Find the Perfect Layout for Your Career Stage
        </h1>
        <p className="mt-2 text-sm sm:text-base text-gray-600">
          Every layout is engineered with strict ATS-parsing typography, clean section hierarchy, and zero-column truncation.
        </p>

        {/* Quick Discovery Tags */}
        <div className="flex flex-wrap justify-center gap-1.5 mt-4">
          <span className="text-xs text-gray-400 self-center mr-1">Quick Search:</span>
          {[
            { label: 'Fresher Placement', type: 'RESUME', query: 'Fresher' },
            { label: 'Academic CV', type: 'CV', query: 'Academic' },
            { label: 'Software Engineer', type: 'RESUME', query: 'Developer' },
            { label: 'Tech Cover Letter', type: 'COVER_LETTER', query: 'Cover Letter' }
          ].map((tag, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedDocType(tag.type as any);
                setSearchQuery(tag.query);
              }}
              className="text-xs bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 px-2.5 py-1 rounded-full transition-all"
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      {/* Document Type Selector Tabs */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex p-1 bg-slate-100 rounded-xl gap-1 overflow-x-auto max-w-full">
          {docTypeTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedDocType(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                selectedDocType === tab.id
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by keywords, tags, style..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 flex items-center justify-between text-xs text-gray-500 font-medium">
        <span>Showing {filteredTemplates.length} matching templates</span>
        {activeDocument && (
          <span className="text-indigo-600">
            Current Document Template: <strong>{activeDocument.templateId}</strong>
          </span>
        )}
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map(template => {
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
              {/* Card Header & Preview Placeholder Box */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {docType === 'COVER_LETTER' ? 'Cover Letter' : docType}
                    </span>
                    <span className="text-[10px] font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-200">
                      {template.pageSize.toUpperCase()}
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
