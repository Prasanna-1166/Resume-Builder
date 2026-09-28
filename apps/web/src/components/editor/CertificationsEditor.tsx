import React from 'react';
import { useResume } from '../../context/ResumeContext';
import { CertificationItem } from '@ai-resume/core';
import { Plus, Trash2, Award } from 'lucide-react';

export const CertificationsEditor: React.FC = () => {
  const { resumeData, updateResumeData } = useResume();
  const certifications = resumeData.certifications || [];

  const handleAdd = () => {
    const newItem: CertificationItem = {
      id: `cert_${Date.now()}`,
      name: '',
      issuer: '',
      date: '',
      credentialUrl: ''
    };
    updateResumeData(prev => ({
      ...prev,
      certifications: [...prev.certifications, newItem]
    }));
  };

  const handleUpdate = (index: number, field: keyof CertificationItem, value: any) => {
    updateResumeData(prev => {
      const next = [...prev.certifications];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, certifications: next };
    });
  };

  const handleRemove = (index: number) => {
    updateResumeData(prev => {
      const next = [...prev.certifications];
      next.splice(index, 1);
      return { ...prev, certifications: next };
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide flex items-center gap-1.5">
          <Award className="w-4 h-4 text-sky-600" />
          <span>Certifications ({certifications.length})</span>
        </h3>
        <button
          onClick={handleAdd}
          className="flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 px-2.5 py-1 rounded transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Certification</span>
        </button>
      </div>

      {certifications.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg text-xs text-gray-500">
          No certifications listed yet. (e.g. AWS Certified Developer, CKA, Coursera Deep Learning)
        </div>
      ) : (
        certifications.map((cert, idx) => (
          <div key={cert.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
            <div className="flex justify-between items-center border-b border-gray-200 pb-1.5">
              <span className="font-semibold text-xs text-gray-700">#{idx + 1} {cert.name || 'New Certification'}</span>
              <button
                onClick={() => handleRemove(idx)}
                className="p-1 text-gray-400 hover:text-red-500"
                title="Delete Certification"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Certification Name *</label>
                <input
                  type="text"
                  value={cert.name}
                  onChange={e => handleUpdate(idx, 'name', e.target.value)}
                  placeholder="e.g. AWS Certified Solutions Architect"
                  className="w-full px-2.5 py-1 text-xs bg-white border border-gray-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Issuing Organization *</label>
                <input
                  type="text"
                  value={cert.issuer}
                  onChange={e => handleUpdate(idx, 'issuer', e.target.value)}
                  placeholder="e.g. Amazon Web Services"
                  className="w-full px-2.5 py-1 text-xs bg-white border border-gray-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Issue Date / Year</label>
                <input
                  type="text"
                  value={cert.date}
                  onChange={e => handleUpdate(idx, 'date', e.target.value)}
                  placeholder="e.g. 2023"
                  className="w-full px-2.5 py-1 text-xs bg-white border border-gray-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Credential Verification URL</label>
                <input
                  type="text"
                  value={cert.credentialUrl || ''}
                  onChange={e => handleUpdate(idx, 'credentialUrl', e.target.value)}
                  placeholder="e.g. https://aws.amazon.com/verify/..."
                  className="w-full px-2.5 py-1 text-xs bg-white border border-gray-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
