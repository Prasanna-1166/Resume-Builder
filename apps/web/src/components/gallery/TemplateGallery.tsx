import React, { useState, useMemo } from 'react';
import { TEMPLATE_CATALOG, TemplateMetadata } from '@ai-resume/templates';
import { useResume } from '../../context/ResumeContext';
import { Search, Filter, Eye, Check, X, Sparkles, Layers } from 'lucide-react';
import { getTemplateComponent } from '@ai-resume/templates';

interface TemplateGalleryProps {
  onSelectTemplate: (templateId: string) => void;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({ onSelectTemplate }) => {
  const { resumeData, setTemplate } = useResume();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPageSize, setSelectedPageSize] = useState<string>('all');
  const [selectedArchetype, setSelectedArchetype] = useState<string>('all');
  const [previewTemplate, setPreviewTemplate] = useState<TemplateMetadata | null>(null);

  const categories = [
    { id: 'all', label: 'All Templates' },
    { id: 'technical', label: 'Technical / SWE' },
    { id: 'student', label: 'Student / Campus' },
    { id: 'executive', label: 'Executive & PM' },
    { id: 'academic', label: 'Academic & Quant' },
    { id: 'creative', label: 'Creative & Docs' },
    { id: 'general', label: 'General & Operations' },
  ];

  const filteredTemplates = useMemo(() => {
    return TEMPLATE_CATALOG.filter(t => {
      // Search
      const matchesSearch =
        searchQuery === '' ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      // Category
      const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;

      // Page size
      const matchesPageSize = selectedPageSize === 'all' || t.pageSize === selectedPageSize;

      // Archetype
      const matchesArchetype =
        selectedArchetype === 'all' || t.suitableFor.includes(selectedArchetype as any);

      return matchesSearch && matchesCategory && matchesPageSize && matchesArchetype;
    });
  }, [searchQuery, selectedCategory, selectedPageSize, selectedArchetype]);

  const handleApplyTemplate = (templateId: string) => {
    setTemplate(templateId);
    onSelectTemplate(templateId);
  };

  const PreviewComponent = previewTemplate ? getTemplateComponent(previewTemplate.id) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Resume Template Gallery</h1>
        <p className="text-sm text-gray-600 mt-1">
          Explore all {TEMPLATE_CATALOG.length} verified ATS-compliant designs. All templates automatically format your existing resume data with 100% fidelity.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs mb-8 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search templates by name, skill, or style (e.g., Deedy, IIT, Minimalist, Java)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
            />
          </div>

          {/* Page Size Filter */}
          <select
            value={selectedPageSize}
            onChange={e => setSelectedPageSize(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="all">Page Size: All</option>
            <option value="letter">US Letter (8.5 x 11 in)</option>
            <option value="a4">A4 (210 x 297 mm)</option>
          </select>

          {/* Archetype Filter */}
          <select
            value={selectedArchetype}
            onChange={e => setSelectedArchetype(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="all">Target: All Profiles</option>
            <option value="student">Student</option>
            <option value="fresher">Fresher</option>
            <option value="technical">Technical / Engineering</option>
            <option value="non-technical">Non-Technical / PM</option>
          </select>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-100">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <Layers className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-gray-800">No matching templates found</h3>
          <p className="text-xs text-gray-500 mt-1">Try broadening your search query or reset filters.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedPageSize('all');
              setSelectedArchetype('all');
            }}
            className="mt-4 px-4 py-2 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-md text-xs font-semibold"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(template => {
            const isCurrent = resumeData.templateId === template.id;
            return (
              <div
                key={template.id}
                className={`bg-white rounded-xl border overflow-hidden transition-all flex flex-col justify-between ${
                  isCurrent ? 'border-sky-500 ring-2 ring-sky-200 shadow-sm' : 'border-gray-200 hover:shadow-md'
                }`}
              >
                {/* Card Top */}
                <div className="p-5 border-b border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 text-gray-700 uppercase">
                      {template.category}
                    </span>
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-gray-500 uppercase">
                      <span>{template.pageSize}</span>
                      <span>•</span>
                      <span>{template.columns} Col</span>
                    </div>
                  </div>

                  <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                    <span>{template.name}</span>
                    {template.isPopular && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-semibold">
                        <Sparkles className="w-2.5 h-2.5" />
                        Popular
                      </span>
                    )}
                  </h3>

                  <p className="text-xs text-gray-600 mt-1.5 line-clamp-2 leading-relaxed">
                    {template.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {template.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-gray-50 text-gray-600 text-[10px] font-medium border border-gray-100">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Bottom Actions */}
                <div className="p-4 bg-gray-50/50 flex items-center justify-between gap-2 border-t border-gray-100">
                  <button
                    onClick={() => setPreviewTemplate(template)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-gray-700 hover:bg-gray-200 bg-gray-100 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-gray-500" />
                    <span>Quick Preview</span>
                  </button>

                  <button
                    onClick={() => handleApplyTemplate(template.id)}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-semibold shadow-xs transition-colors ${
                      isCurrent
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-sky-600 hover:bg-sky-700 text-white'
                    }`}
                  >
                    {isCurrent && <Check className="w-3.5 h-3.5" />}
                    <span>{isCurrent ? 'Active Template' : 'Use Template'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Preview Modal */}
      {previewTemplate && PreviewComponent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-150">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{previewTemplate.name}</h3>
                <p className="text-xs text-gray-500">
                  {previewTemplate.category.toUpperCase()} • {previewTemplate.pageSize.toUpperCase()} • {previewTemplate.columns} Column
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    handleApplyTemplate(previewTemplate.id);
                    setPreviewTemplate(null);
                  }}
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-md text-xs font-semibold shadow-xs"
                >
                  Apply & Open Editor
                </button>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="p-1.5 rounded-md text-gray-500 hover:bg-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Preview Body */}
            <div className="p-6 overflow-y-auto bg-gray-100 flex justify-center">
              <div className="transform scale-90 origin-top shadow-md rounded overflow-hidden">
                <PreviewComponent data={resumeData} isPreview={true} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
