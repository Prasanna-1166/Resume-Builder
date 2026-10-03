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
  Filter,
  GitBranch,
  Check,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Building,
  Target,
  Clock
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
  const {
    drafts,
    activeDocument,
    switchDraft,
    createDocument,
    createTailoredCopy,
    renameDraft,
    duplicateCurrentDraft,
    deleteCurrentDraft
  } = useResume();

  const [typeFilter, setTypeFilter] = useState<'ALL' | DocumentType>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tailorModalTarget, setTailorModalTarget] = useState<CareerDocument | null>(null);
  const [renameTarget, setRenameTarget] = useState<{ id: string; currentTitle: string } | null>(null);
  const [newRenameTitle, setNewRenameTitle] = useState('');
  const [expandedMasters, setExpandedMasters] = useState<Record<string, boolean>>({});

  // New Document Modal Form State
  const [newType, setNewType] = useState<DocumentType>('RESUME');
  const [newCategory, setNewCategory] = useState<DocumentCategory>('STUDENT');
  const [newTitle, setNewTitle] = useState('');
  const [newTemplateId, setNewTemplateId] = useState('');

  // Tailor Copy Form State
  const [tailorCompany, setTailorCompany] = useState('');
  const [tailorRole, setTailorRole] = useState('');

  const toggleMasterExpand = (id: string) => {
    setExpandedMasters(prev => ({
      ...prev,
      [id]: prev[id] === undefined ? false : !prev[id]
    }));
  };

  const filteredDrafts = drafts.filter(doc => {
    const docType = doc.documentType || 'RESUME';
    const matchesType = typeFilter === 'ALL' || docType === typeFilter;
    const matchesCategory = categoryFilter === 'ALL' || doc.category === categoryFilter;
    const matchesSearch =
      !searchQuery ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.targetCompany && doc.targetCompany.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (doc.targetRole && doc.targetRole.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesCategory && matchesSearch;
  });

  // Group into Master Documents and their Tailored Versions
  const masterDocs = filteredDrafts.filter(d => !d.parentId || d.isMaster);
  const orphanTailoredDocs = filteredDrafts.filter(d => d.parentId && !drafts.some(m => m.id === d.parentId));

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const defaultTemplate =
      newType === 'COVER_LETTER'
        ? 'template_cl_modern'
        : newType === 'CV'
        ? 'template_cv_academic'
        : 'template_01';
    createDocument(newType, newCategory, newTemplateId || defaultTemplate, newTitle);
    setCreateModalOpen(false);
    setNewTitle('');
    onOpenEditor();
  };

  const handleCreateTailoredCopySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tailorModalTarget) return;
    const copy = createTailoredCopy(tailorModalTarget.id, tailorCompany, tailorRole);
    setTailorModalTarget(null);
    setTailorCompany('');
    setTailorRole('');
    onOpenEditor();
  };

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!renameTarget || !newRenameTitle.trim()) return;
    renameDraft(renameTarget.id, newRenameTitle.trim());
    setRenameTarget(null);
    setNewRenameTitle('');
  };

  const handleExportDocx = async (doc: CareerDocument) => {
    try {
      const blob = await apiClient.exportDocx(doc);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const typeLabel =
        doc.documentType === 'COVER_LETTER'
          ? 'Cover_Letter'
          : doc.documentType === 'CV'
          ? 'CV'
          : 'Resume';
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
            <span>Multi-Document Career Platform & Version Hierarchy</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            My Career Documents & Versions
          </h1>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            Maintain Master Resumes while creating non-destructive company-specific tailored versions. Master documents remain protected.
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
              placeholder="Search documents & roles..."
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

      {/* Document Version List & Hierarchy */}
      {masterDocs.length === 0 && orphanTailoredDocs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No career documents found</h3>
          <p className="text-slate-500 text-xs mt-1 max-w-sm mx-auto">
            {searchQuery || categoryFilter !== 'ALL' || typeFilter !== 'ALL'
              ? 'Try adjusting your filters or search terms.'
              : 'Create your first Master Resume, CV, or Cover Letter to get started.'}
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
        <div className="space-y-6">
          {masterDocs.map(doc => {
            const docType = doc.documentType || 'RESUME';
            const isActive = doc.id === activeDocument.id;
            const meta = TEMPLATE_CATALOG.find(t => t.id === doc.templateId) || TEMPLATE_CATALOG[0];
            const tailoredCopies = drafts.filter(d => d.parentId === doc.id);
            const isExpanded = expandedMasters[doc.id] !== false;

            const typeColor =
              docType === 'COVER_LETTER'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : docType === 'CV'
                ? 'bg-purple-50 text-purple-700 border-purple-200'
                : 'bg-blue-50 text-blue-700 border-blue-200';

            return (
              <div
                key={doc.id}
                className={`bg-white rounded-2xl border transition-all duration-200 shadow-xs overflow-hidden ${
                  isActive ? 'border-indigo-600 ring-2 ring-indigo-600/10' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Master Card Main Block */}
                <div className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${typeColor}`}>
                        {docType === 'COVER_LETTER' ? 'Cover Letter' : docType}
                      </span>
                      <span className="text-[10px] font-extrabold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full border border-indigo-200 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-indigo-600" />
                        <span>Master Document</span>
                      </span>
                      {doc.category && (
                        <span className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200">
                          {doc.category}
                        </span>
                      )}
                    </div>
                    {isActive && (
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                        Currently Active
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-slate-900" title={doc.title}>
                          {doc.title}
                        </h3>
                        <button
                          onClick={() => {
                            setRenameTarget({ id: doc.id, currentTitle: doc.title });
                            setNewRenameTitle(doc.title);
                          }}
                          className="p-1 text-slate-400 hover:text-slate-600 rounded"
                          title="Rename document"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {doc.personalInfo.fullName || 'Candidate'} {doc.personalInfo.professionalTitle ? `• ${doc.personalInfo.professionalTitle}` : ''}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-slate-400">Template:</span>{' '}
                        <strong className="text-slate-700">{meta?.name || doc.templateId}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">Updated:</span>{' '}
                        <strong className="text-slate-700">{new Date(doc.updatedAt).toLocaleDateString()}</strong>
                      </div>
                      {tailoredCopies.length > 0 && (
                        <div className="text-indigo-600 font-bold">
                          {tailoredCopies.length} Tailored Version{tailoredCopies.length > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Master Action Bar */}
                <div className="bg-slate-50/90 px-5 py-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        switchDraft(doc.id);
                        onOpenEditor();
                      }}
                      className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3.5 py-1.5 rounded-lg font-bold shadow-sm transition-all"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Master</span>
                    </button>

                    <button
                      onClick={() => {
                        setTailorModalTarget(doc);
                        setTailorRole(doc.targetRole || '');
                        setTailorCompany('');
                      }}
                      className="inline-flex items-center gap-1.5 bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs px-3 py-1.5 rounded-lg font-semibold transition-all shadow-2xs"
                    >
                      <GitBranch className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Create Tailored Copy</span>
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
                      <span>Preview</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onOpenVersionModal(doc.id)}
                      className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-md transition-all border border-transparent hover:border-slate-200"
                      title="Version Snapshots & History"
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
                          if (confirm(`Are you sure you want to delete Master Resume "${doc.title}"?`)) {
                            switchDraft(doc.id);
                            deleteCurrentDraft();
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                        title="Delete Master Document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Nested Tailored Copies (Master-Branch Structure) */}
                {tailoredCopies.length > 0 && (
                  <div className="border-t border-slate-100 bg-slate-50/40 p-4">
                    <div
                      className="flex items-center justify-between cursor-pointer select-none mb-3"
                      onClick={() => toggleMasterExpand(doc.id)}
                    >
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        <GitBranch className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Tailored Versions for Applications ({tailoredCopies.length})</span>
                      </span>
                      <div className="text-xs text-slate-400 flex items-center gap-1">
                        <span>{isExpanded ? 'Collapse' : 'Expand'}</span>
                        {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="space-y-2 pl-2 border-l-2 border-indigo-200">
                        {tailoredCopies.map(copy => {
                          const isCopyActive = copy.id === activeDocument.id;
                          return (
                            <div
                              key={copy.id}
                              className={`bg-white rounded-xl p-3 border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-2xs hover:border-indigo-300 transition-all ${
                                isCopyActive ? 'border-indigo-500 ring-1 ring-indigo-500/20' : 'border-slate-200'
                              }`}
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.2 rounded-full uppercase">
                                    {copy.versionLabel || 'Tailored Copy'}
                                  </span>
                                  {isCopyActive && (
                                    <span className="text-[9.5px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.2 rounded-full">
                                      Active
                                    </span>
                                  )}
                                </div>
                                <h4 className="text-sm font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                                  <span>{copy.title}</span>
                                  <button
                                    onClick={() => {
                                      setRenameTarget({ id: copy.id, currentTitle: copy.title });
                                      setNewRenameTitle(copy.title);
                                    }}
                                    className="p-0.5 text-slate-400 hover:text-slate-600"
                                    title="Rename"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                  </button>
                                </h4>
                                <p className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                                  {copy.targetCompany && (
                                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                                      <Building className="w-3 h-3 text-slate-400" />
                                      <span>{copy.targetCompany}</span>
                                    </span>
                                  )}
                                  <span>Modified: {new Date(copy.updatedAt).toLocaleDateString()}</span>
                                </p>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    switchDraft(copy.id);
                                    onOpenEditor();
                                  }}
                                  className="inline-flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs px-3 py-1.5 rounded-lg font-bold transition-all border border-indigo-100"
                                >
                                  <Edit3 className="w-3 h-3" />
                                  <span>Edit Copy</span>
                                </button>
                                <button
                                  onClick={() => handleExportDocx(copy)}
                                  className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-slate-50 rounded-md transition-all border border-slate-200"
                                  title="Export DOCX"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Delete tailored copy "${copy.title}"? Your master resume will remain untouched.`)) {
                                      switchDraft(copy.id);
                                      deleteCurrentDraft();
                                    }
                                  }}
                                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                                  title="Delete Tailored Copy (Master remains safe)"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Rename Document Modal */}
      {renameTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-5 border border-slate-100">
            <h3 className="text-base font-bold text-slate-900 mb-1">Rename Document</h3>
            <p className="text-xs text-slate-500 mb-4">Enter a descriptive title for this resume or version.</p>

            <form onSubmit={handleRenameSubmit} className="space-y-4">
              <input
                type="text"
                required
                value={newRenameTitle}
                onChange={e => setNewRenameTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRenameTarget(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm"
                >
                  Save Title
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Tailored Copy Modal */}
      {tailorModalTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <GitBranch className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900">Create Tailored Copy</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Creates a separate copy branched from <strong>{tailorModalTarget.title}</strong>. Your master resume will remain protected.
            </p>

            <form onSubmit={handleCreateTailoredCopySubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Company (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Google, Stripe, Meta"
                  value={tailorCompany}
                  onChange={e => setTailorCompany(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Role Title (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Backend Engineer"
                  value={tailorRole}
                  onChange={e => setTailorRole(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setTailorModalTarget(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-md flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Create Copy & Edit</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Document Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 border border-slate-100 max-h-[92vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-slate-900 mb-1">Create Career Document</h2>
            <p className="text-xs text-slate-500 mb-4">
              Follow the guided workflow: select format, purpose, and a tailored ATS-friendly template.
            </p>

            <form onSubmit={handleCreate} className="space-y-4">
              {/* 1. Document Format */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  1. Choose Document Format
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { type: 'RESUME', label: 'Resume', desc: '1–2 page industry standard' },
                    { type: 'CV', label: 'Curriculum Vitae', desc: 'Detailed academic/career CV' },
                    { type: 'COVER_LETTER', label: 'Cover Letter', desc: 'Targeted application letter' }
                  ].map(t => (
                    <button
                      type="button"
                      key={t.type}
                      onClick={() => {
                        const newDocType = t.type as DocumentType;
                        setNewType(newDocType);
                        if (newDocType === 'CV') {
                          setNewCategory('ACADEMIC_RESEARCH');
                          setNewTemplateId('template_cv_academic');
                        } else if (newDocType === 'COVER_LETTER') {
                          setNewCategory('SOFTWARE_IT');
                          setNewTemplateId('template_cl_modern');
                        } else {
                          setNewCategory('STUDENT');
                          setNewTemplateId('template_01');
                        }
                      }}
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

              {/* 2. Purpose / Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  2. Select Purpose / Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(newType === 'RESUME'
                    ? [
                        { id: 'FRESHER', label: 'Fresher' },
                        { id: 'STUDENT', label: 'Student / College' },
                        { id: 'INTERNSHIP', label: 'Internship' },
                        { id: 'ENTRY_LEVEL', label: 'Entry Level' },
                        { id: 'EXPERIENCED', label: 'Experienced' },
                        { id: 'CAREER_CHANGE', label: 'Career Change' },
                        { id: 'SOFTWARE_IT', label: 'Software / IT' },
                        { id: 'BUSINESS_MANAGEMENT', label: 'Business / Mgmt' }
                      ]
                    : newType === 'CV'
                    ? [
                        { id: 'ACADEMIC_RESEARCH', label: 'Academic & Research' },
                        { id: 'EXPERIENCED', label: 'Professional / Clinical' },
                        { id: 'SOFTWARE_IT', label: 'Tech Specialist' },
                        { id: 'CUSTOM', label: 'General Scholar' }
                      ]
                    : [
                        { id: 'SOFTWARE_IT', label: 'Job Application' },
                        { id: 'INTERNSHIP', label: 'Internship Letter' },
                        { id: 'CAREER_CHANGE', label: 'Career Change' },
                        { id: 'CUSTOM', label: 'General Application' }
                      ]
                  ).map(cat => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setNewCategory(cat.id as DocumentCategory)}
                      className={`px-3 py-2 rounded-lg border text-left text-xs font-medium transition-all ${
                        newCategory === cat.id
                          ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-bold'
                          : 'border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Suitable Recommended Templates */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  3. Choose Tailored Template
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {TEMPLATE_CATALOG.filter(t => (t.documentType || 'RESUME') === newType).map(tpl => {
                    const isSelected =
                      (newTemplateId ||
                        (newType === 'COVER_LETTER'
                          ? 'template_cl_modern'
                          : newType === 'CV'
                          ? 'template_cv_academic'
                          : 'template_01')) === tpl.id;
                    return (
                      <div
                        key={tpl.id}
                        onClick={() => setNewTemplateId(tpl.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-600/20'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">{tpl.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                            {tpl.fontFamily} · {tpl.pageSize.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {tpl.description}
                        </p>
                        {tpl.strengths && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {tpl.strengths.slice(0, 2).map((st, i) => (
                              <span key={i} className="text-[9.5px] px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-600">
                                ✓ {st}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 4. Document Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  4. Document Name
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    newType === 'COVER_LETTER'
                      ? 'e.g. Software Engineer Application Letter'
                      : newType === 'CV'
                      ? 'e.g. Academic Research CV'
                      : 'e.g. Software Engineer Resume'
                  }
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
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
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-md transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create & Open Editor</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

