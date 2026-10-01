import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import { DocumentType, DocumentCategory, DOCUMENT_CATEGORIES, CareerDocument } from '@ai-resume/core';
import { TEMPLATE_CATALOG } from '@ai-resume/templates';
import {
  FileText,
  Plus,
  Copy,
  Trash2,
  Edit3,
  Download,
  History,
  Tag,
  Briefcase,
  GraduationCap,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';
import { apiClient } from '../../services/api';

interface DocumentDashboardProps {
  onOpenEditor: () => void;
  onOpenPreview: () => void;
  onBrowseTemplates: () => void;
  onOpenVersionModal: (docId: string) => void;
}

export const DocumentDashboard: React.FC<DocumentDashboardProps> = ({
  onOpenEditor,
  onOpenPreview,
  onBrowseTemplates,
  onOpenVersionModal
}) => {
  const { drafts, activeDocument, switchDraft, createDocument, duplicateCurrentDraft, deleteCurrentDraft } = useResume();

  const [typeFilter, setTypeFilter] = useState<'ALL' | DocumentType>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // New Document Modal Form State
  const [newType, setNewType] = useState<DocumentType>('RESUME');
  const [newCategory, setNewCategory] = useState<DocumentCategory>('STUDENT');
  const [newTitle, setNewTitle] = useState('');
  const [newTemplateId, setNewTemplateId] = useState('');

  const filteredDrafts = drafts.filter(doc => {
    const docType = doc.documentType || 'RESUME';
    const matchesType = typeFilter === 'ALL' || docType === typeFilter;
    const matchesCategory = categoryFilter === 'ALL' || doc.category === categoryFilter;
    const matchesSearch = !searchQuery || doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesCategory && matchesSearch;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const defaultTemplate = newType === 'COVER_LETTER' ? 'template_cl_modern' : newType === 'CV' ? 'template_cv_academic' : 'template_01';
    createDocument(newType, newCategory, newTemplateId || defaultTemplate, newTitle);
    setCreateModalOpen(false);
    setNewTitle('');
    onOpenEditor();
  };

  const handleExportDocx = async (doc: CareerDocument) => {
    try {
      const blob = await apiClient.exportDocx(doc);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const typeLabel = doc.documentType === 'COVER_LETTER' ? 'Cover_Letter' : doc.documentType === 'CV' ? 'CV' : 'Resume';
      a.download = `${(doc.title || 'Document').replace(/\s+/g, '_')}_${typeLabel}.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Export error:', err);
      alert('Failed to export DOCX. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl mb-8 border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-500/30 rounded-full px-3 py-1 text-xs font-semibold text-indigo-300 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Multi-Document Career Platform</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            My Career Documents
          </h1>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            Create, manage, and tailor ATS-optimized Resumes, Academic/Professional CVs, and targeted Cover Letters in one place.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Create Document</span>
          </button>
          <button
            onClick={onBrowseTemplates}
            className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2.5 rounded-xl font-medium transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>Browse Templates</span>
          </button>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Type Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg w-full md:w-auto overflow-x-auto">
          {[
            { id: 'ALL', label: 'All Documents', count: drafts.length },
            { id: 'RESUME', label: 'Resumes', count: drafts.filter(d => (d.documentType || 'RESUME') === 'RESUME').length },
            { id: 'CV', label: 'CVs', count: drafts.filter(d => d.documentType === 'CV').length },
            { id: 'COVER_LETTER', label: 'Cover Letters', count: drafts.filter(d => d.documentType === 'COVER_LETTER').length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setTypeFilter(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                typeFilter === tab.id
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${typeFilter === tab.id ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-200 text-slate-600'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Category & Search Filter */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-56">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="relative">
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              {DOCUMENT_CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Document Grid */}
      {filteredDrafts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No career documents found</h3>
          <p className="text-slate-500 text-xs mt-1 max-w-sm mx-auto">
            {searchQuery || categoryFilter !== 'ALL' || typeFilter !== 'ALL'
              ? 'Try adjusting your filters or search terms.'
              : 'Create your first Resume, CV, or Cover Letter to get started.'}
          </p>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="mt-4 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-4 py-2 rounded-lg font-semibold shadow transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Document</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDrafts.map(doc => {
            const docType = doc.documentType || 'RESUME';
            const isActive = doc.id === activeDocument.id;
            const meta = TEMPLATE_CATALOG.find(t => t.id === doc.templateId) || TEMPLATE_CATALOG[0];

            const typeColor =
              docType === 'COVER_LETTER'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : docType === 'CV'
                ? 'bg-purple-50 text-purple-700 border-purple-200'
                : 'bg-blue-50 text-blue-700 border-blue-200';

            return (
              <div
                key={doc.id}
                className={`bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md ${
                  isActive ? 'border-indigo-600 ring-2 ring-indigo-600/10' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="p-5">
                  {/* Top Bar: Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${typeColor}`}>
                        {docType === 'COVER_LETTER' ? 'Cover Letter' : docType}
                      </span>
                      {doc.category && (
                        <span className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200">
                          {doc.category}
                        </span>
                      )}
                    </div>
                    {isActive && (
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </div>

                  {/* Document Title */}
                  <h3 className="text-base font-bold text-slate-900 truncate mb-1" title={doc.title}>
                    {doc.title}
                  </h3>

                  {/* Candidate / Target Info */}
                  <p className="text-xs text-slate-500 truncate mb-3">
                    {doc.personalInfo.fullName || 'Unnamed Candidate'} {doc.personalInfo.professionalTitle ? `• ${doc.personalInfo.professionalTitle}` : ''}
                  </p>

                  {/* Template & Version Metadata */}
                  <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-600 space-y-1 border border-slate-100 mb-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Template:</span>
                      <span className="font-semibold text-slate-800">{meta?.name || doc.templateId}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Last Modified:</span>
                      <span className="text-slate-700">{new Date(doc.updatedAt).toLocaleDateString()}</span>
                    </div>
                    {doc.versions && doc.versions.length > 0 && (
                      <div className="flex justify-between items-center text-indigo-600">
                        <span className="text-slate-400">Snapshots:</span>
                        <span className="font-semibold">{doc.versions.length} saved version{doc.versions.length > 1 ? 's' : ''}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="bg-slate-50/80 px-5 py-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        switchDraft(doc.id);
                        onOpenEditor();
                      }}
                      className="inline-flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-1.5 rounded-lg font-semibold shadow-sm transition-all"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        switchDraft(doc.id);
                        onOpenPreview();
                      }}
                      className="inline-flex items-center gap-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all"
                      title="Live Preview"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onOpenVersionModal(doc.id)}
                      className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-md transition-all border border-transparent hover:border-slate-200"
                      title="Version Snapshots"
                    >
                      <History className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleExportDocx(doc)}
                      className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-white rounded-md transition-all border border-transparent hover:border-slate-200"
                      title="Export DOCX"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        switchDraft(doc.id);
                        duplicateCurrentDraft();
                      }}
                      className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-white rounded-md transition-all border border-transparent hover:border-slate-200"
                      title="Duplicate Document"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    {drafts.length > 1 && (
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${doc.title}"?`)) {
                            switchDraft(doc.id);
                            deleteCurrentDraft();
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                        title="Delete Document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Document Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-1">Create New Career Document</h2>
            <p className="text-xs text-slate-500 mb-5">
              Choose the document format and specialization category that best matches your objective.
            </p>

            <form onSubmit={handleCreate} className="space-y-4">
              {/* Document Type Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Document Format
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { type: 'RESUME', label: 'Resume', desc: '1-2 page standard format' },
                    { type: 'CV', label: 'Curriculum Vitae', desc: 'Detailed academic/exec' },
                    { type: 'COVER_LETTER', label: 'Cover Letter', desc: 'Targeted application letter' }
                  ].map(t => (
                    <button
                      type="button"
                      key={t.type}
                      onClick={() => setNewType(t.type as DocumentType)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        newType === t.type
                          ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-600/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <p className={`text-xs font-bold ${newType === t.type ? 'text-indigo-900' : 'text-slate-800'}`}>
                        {t.label}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  required
                  placeholder={newType === 'COVER_LETTER' ? 'e.g. Google SWE Cover Letter' : 'e.g. Senior Backend Engineer Resume'}
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Target Domain / Experience Category
                </label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value as DocumentCategory)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  {DOCUMENT_CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} ({cat.description.slice(0, 45)}...)
                    </option>
                  ))}
                </select>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-md transition-all"
                >
                  Create & Launch Editor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
