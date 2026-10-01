import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import { PublicationItem, ResearchItem, ConferenceItem, ReferenceItem } from '@ai-resume/core';
import { BookOpen, Microscope, Users, PhoneCall, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

export const CvSectionsEditor: React.FC = () => {
  const { resumeData, updateResumeData } = useResume();
  const [activeSubSection, setActiveSubSection] = useState<'research' | 'publications' | 'conferences' | 'references'>('research');

  // 1. Research Experience Handlers
  const handleAddResearch = () => {
    const newItem: ResearchItem = {
      id: `res_${Date.now()}`,
      title: 'Research Fellow / Scholar',
      institution: 'University / Laboratory',
      startDate: '2023',
      endDate: 'Present',
      bullets: ['Conducted investigations and experimental data analysis.']
    };
    updateResumeData(prev => ({
      ...prev,
      research: [...(prev.research || []), newItem]
    }));
  };

  const handleUpdateResearch = (index: number, field: keyof ResearchItem, val: any) => {
    updateResumeData(prev => {
      const items = [...(prev.research || [])];
      items[index] = { ...items[index], [field]: val };
      return { ...prev, research: items };
    });
  };

  const handleRemoveResearch = (index: number) => {
    updateResumeData(prev => ({
      ...prev,
      research: (prev.research || []).filter((_, i) => i !== index)
    }));
  };

  // 2. Publications Handlers
  const handleAddPublication = () => {
    const newItem: PublicationItem = {
      id: `pub_${Date.now()}`,
      title: 'New Peer-Reviewed Paper Title',
      publisher: 'Journal or Conference Proceedings',
      date: '2024',
      url: 'https://doi.org/example'
    };
    updateResumeData(prev => ({
      ...prev,
      publications: [...(prev.publications || []), newItem]
    }));
  };

  const handleUpdatePublication = (index: number, field: keyof PublicationItem, val: any) => {
    updateResumeData(prev => {
      const items = [...(prev.publications || [])];
      items[index] = { ...items[index], [field]: val };
      return { ...prev, publications: items };
    });
  };

  const handleRemovePublication = (index: number) => {
    updateResumeData(prev => ({
      ...prev,
      publications: (prev.publications || []).filter((_, i) => i !== index)
    }));
  };

  // 3. Conferences Handlers
  const handleAddConference = () => {
    const newItem: ConferenceItem = {
      id: `conf_${Date.now()}`,
      title: 'Keynote or Poster Presentation Title',
      conferenceName: 'International Conference Name',
      date: '2024',
      location: 'City, Country',
      role: 'Presenter'
    };
    updateResumeData(prev => ({
      ...prev,
      conferences: [...(prev.conferences || []), newItem]
    }));
  };

  const handleUpdateConference = (index: number, field: keyof ConferenceItem, val: any) => {
    updateResumeData(prev => {
      const items = [...(prev.conferences || [])];
      items[index] = { ...items[index], [field]: val };
      return { ...prev, conferences: items };
    });
  };

  const handleRemoveConference = (index: number) => {
    updateResumeData(prev => ({
      ...prev,
      conferences: (prev.conferences || []).filter((_, i) => i !== index)
    }));
  };

  // 4. References Handlers
  const handleAddReference = () => {
    const newItem: ReferenceItem = {
      id: `ref_${Date.now()}`,
      name: 'Prof. / Dr. Full Name',
      title: 'Department Chair / Director',
      institutionOrCompany: 'University / Institute Name',
      email: 'ref.email@univ.edu',
      phone: '+1 (555) 019-2834'
    };
    updateResumeData(prev => ({
      ...prev,
      references: [...(prev.references || []), newItem]
    }));
  };

  const handleUpdateReference = (index: number, field: keyof ReferenceItem, val: any) => {
    updateResumeData(prev => {
      const items = [...(prev.references || [])];
      items[index] = { ...items[index], [field]: val };
      return { ...prev, references: items };
    });
  };

  const handleRemoveReference = (index: number) => {
    updateResumeData(prev => ({
      ...prev,
      references: (prev.references || []).filter((_, i) => i !== index)
    }));
  };

  const researchItems = resumeData.research || [];
  const publicationItems = resumeData.publications || [];
  const conferenceItems = resumeData.conferences || [];
  const referenceItems = resumeData.references || [];

  return (
    <div className="space-y-4">
      {/* Sub-Tabs for CV Sections */}
      <div className="flex border-b border-gray-200 gap-1 text-xs font-semibold">
        {[
          { id: 'research', label: `Research (${researchItems.length})`, icon: Microscope },
          { id: 'publications', label: `Publications (${publicationItems.length})`, icon: BookOpen },
          { id: 'conferences', label: `Conferences (${conferenceItems.length})`, icon: Users },
          { id: 'references', label: `References (${referenceItems.length})`, icon: PhoneCall }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubSection === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubSection(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-2 border-b-2 transition-colors ${
                isActive
                  ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Research Section */}
      {activeSubSection === 'research' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Document research appointments, thesis work, and academic projects.</span>
            <button
              type="button"
              onClick={handleAddResearch}
              className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Research Project</span>
            </button>
          </div>

          {researchItems.length === 0 ? (
            <div className="p-6 text-center border-2 border-dashed border-gray-200 rounded-lg text-xs text-gray-400">
              No research entries yet. Click "Add Research Project" above to include academic research.
            </div>
          ) : (
            researchItems.map((item, idx) => (
              <div key={item.id} className="p-3.5 bg-gray-50/80 rounded-lg border border-gray-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-800">#{idx + 1} Research Project</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveResearch(idx)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Project Title / Research Topic"
                    value={item.title || ''}
                    onChange={e => handleUpdateResearch(idx, 'title', e.target.value)}
                    className="px-2.5 py-1.5 text-xs bg-white border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    placeholder="Institution / Laboratory"
                    value={item.institution || ''}
                    onChange={e => handleUpdateResearch(idx, 'institution', e.target.value)}
                    className="px-2.5 py-1.5 text-xs bg-white border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Advisor / PI (Optional)"
                    value={item.advisor || ''}
                    onChange={e => handleUpdateResearch(idx, 'advisor', e.target.value)}
                    className="px-2.5 py-1.5 text-xs bg-white border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    placeholder="Start Date (e.g. 2022)"
                    value={item.startDate || ''}
                    onChange={e => handleUpdateResearch(idx, 'startDate', e.target.value)}
                    className="px-2.5 py-1.5 text-xs bg-white border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    placeholder="End Date (e.g. 2024 / Present)"
                    value={item.endDate || ''}
                    onChange={e => handleUpdateResearch(idx, 'endDate', e.target.value)}
                    className="px-2.5 py-1.5 text-xs bg-white border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Publications Section */}
      {activeSubSection === 'publications' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Add peer-reviewed papers, preprints, books, or conference proceedings.</span>
            <button
              type="button"
              onClick={handleAddPublication}
              className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Publication</span>
            </button>
          </div>

          {publicationItems.length === 0 ? (
            <div className="p-6 text-center border-2 border-dashed border-gray-200 rounded-lg text-xs text-gray-400">
              No publications added yet. Click "Add Publication" to include scholarly papers.
            </div>
          ) : (
            publicationItems.map((item, idx) => (
              <div key={item.id} className="p-3.5 bg-gray-50/80 rounded-lg border border-gray-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-800">#{idx + 1} Publication</span>
                  <button
                    type="button"
                    onClick={() => handleRemovePublication(idx)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="Paper Title (e.g. Deep Learning in Genomic Sequencing)"
                  value={item.title || ''}
                  onChange={e => handleUpdatePublication(idx, 'title', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500"
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Publisher / Journal / IEEE"
                    value={item.publisher || ''}
                    onChange={e => handleUpdatePublication(idx, 'publisher', e.target.value)}
                    className="px-2.5 py-1.5 text-xs bg-white border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    placeholder="Year / Date"
                    value={item.date || ''}
                    onChange={e => handleUpdatePublication(idx, 'date', e.target.value)}
                    className="px-2.5 py-1.5 text-xs bg-white border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    placeholder="DOI or Paper URL"
                    value={item.url || ''}
                    onChange={e => handleUpdatePublication(idx, 'url', e.target.value)}
                    className="px-2.5 py-1.5 text-xs bg-white border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Conferences Section */}
      {activeSubSection === 'conferences' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Record conference presentations, poster sessions, and workshop talks.</span>
            <button
              type="button"
              onClick={handleAddConference}
              className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Conference Presentation</span>
            </button>
          </div>

          {conferenceItems.length === 0 ? (
            <div className="p-6 text-center border-2 border-dashed border-gray-200 rounded-lg text-xs text-gray-400">
              No conference presentations listed yet.
            </div>
          ) : (
            conferenceItems.map((item, idx) => (
              <div key={item.id} className="p-3.5 bg-gray-50/80 rounded-lg border border-gray-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-800">#{idx + 1} Conference Presentation</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveConference(idx)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Talk or Presentation Title"
                    value={item.title || ''}
                    onChange={e => handleUpdateConference(idx, 'title', e.target.value)}
                    className="px-2.5 py-1.5 text-xs bg-white border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    placeholder="Conference Name (e.g. NeurIPS, QIP 2024)"
                    value={item.conferenceName || ''}
                    onChange={e => handleUpdateConference(idx, 'conferenceName', e.target.value)}
                    className="px-2.5 py-1.5 text-xs bg-white border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Date & Location (e.g. Dec 2024, New Orleans, LA)"
                    value={item.date || item.location || ''}
                    onChange={e => handleUpdateConference(idx, 'date', e.target.value)}
                    className="px-2.5 py-1.5 text-xs bg-white border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    placeholder="Role (e.g. Speaker, Presenter, Organizer)"
                    value={item.role || ''}
                    onChange={e => handleUpdateConference(idx, 'role', e.target.value as any)}
                    className="px-2.5 py-1.5 text-xs bg-white border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* References Section */}
      {activeSubSection === 'references' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Add scholarly or professional references and academic advisors.</span>
            <button
              type="button"
              onClick={handleAddReference}
              className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Reference</span>
            </button>
          </div>

          {referenceItems.length === 0 ? (
            <div className="p-6 text-center border-2 border-dashed border-gray-200 rounded-lg text-xs text-gray-400">
              No references added yet.
            </div>
          ) : (
            referenceItems.map((item, idx) => (
              <div key={item.id} className="p-3.5 bg-gray-50/80 rounded-lg border border-gray-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-800">#{idx + 1} Reference Contact</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveReference(idx)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Full Name & Title (e.g. Prof. Marcus Brody)"
                    value={item.name || ''}
                    onChange={e => handleUpdateReference(idx, 'name', e.target.value)}
                    className="px-2.5 py-1.5 text-xs bg-white border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    placeholder="Department / Institution"
                    value={item.institutionOrCompany || ''}
                    onChange={e => handleUpdateReference(idx, 'institutionOrCompany', e.target.value)}
                    className="px-2.5 py-1.5 text-xs bg-white border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="email"
                    placeholder="Contact Email"
                    value={item.email || ''}
                    onChange={e => handleUpdateReference(idx, 'email', e.target.value)}
                    className="px-2.5 py-1.5 text-xs bg-white border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    placeholder="Phone (Optional)"
                    value={item.phone || ''}
                    onChange={e => handleUpdateReference(idx, 'phone', e.target.value)}
                    className="px-2.5 py-1.5 text-xs bg-white border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
