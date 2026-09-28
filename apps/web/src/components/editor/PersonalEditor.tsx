import React from 'react';
import { useResume } from '../../context/ResumeContext';
import { User, Mail, Phone, MapPin, Globe, Linkedin, Github, Hash, Plus, Trash2 } from 'lucide-react';

export const PersonalEditor: React.FC = () => {
  const { resumeData, updateResumeData } = useResume();
  const info = resumeData.personalInfo;

  const handleChange = (field: string, value: any) => {
    updateResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const handleAddCustomLink = () => {
    const current = info.customLinks || [];
    handleChange('customLinks', [...current, { label: 'Portfolio', url: '' }]);
  };

  const handleUpdateCustomLink = (index: number, key: 'label' | 'url', val: string) => {
    const current = [...(info.customLinks || [])];
    current[index][key] = val;
    handleChange('customLinks', current);
  };

  const handleRemoveCustomLink = (index: number) => {
    const current = [...(info.customLinks || [])];
    current.splice(index, 1);
    handleChange('customLinks', current);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-400" />
            <input
              type="text"
              value={info.fullName || ''}
              onChange={e => handleChange('fullName', e.target.value)}
              placeholder="e.g. Aarav Sharma"
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Professional Title */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Professional Title / Role
          </label>
          <input
            type="text"
            value={info.professionalTitle || ''}
            onChange={e => handleChange('professionalTitle', e.target.value)}
            placeholder="e.g. Software Engineer / Fresher"
            className="w-full px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-400" />
            <input
              type="email"
              value={info.email || ''}
              onChange={e => handleChange('email', e.target.value)}
              placeholder="e.g. aarav@example.edu"
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-400" />
            <input
              type="text"
              value={info.phone || ''}
              onChange={e => handleChange('phone', e.target.value)}
              placeholder="e.g. +91 98765 43210"
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Location (City, Country) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <MapPin className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-400" />
            <input
              type="text"
              value={info.location || ''}
              onChange={e => handleChange('location', e.target.value)}
              placeholder="e.g. Bangalore, India"
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>
        </div>

        {/* LinkedIn */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            LinkedIn Profile
          </label>
          <div className="relative">
            <Linkedin className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-400" />
            <input
              type="text"
              value={info.linkedin || ''}
              onChange={e => handleChange('linkedin', e.target.value)}
              placeholder="e.g. linkedin.com/in/aaravsharma"
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>
        </div>

        {/* GitHub */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            GitHub Profile
          </label>
          <div className="relative">
            <Github className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-400" />
            <input
              type="text"
              value={info.github || ''}
              onChange={e => handleChange('github', e.target.value)}
              placeholder="e.g. github.com/aaravsharma"
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Portfolio / Website */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Portfolio / Website
          </label>
          <div className="relative">
            <Globe className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-400" />
            <input
              type="text"
              value={info.portfolio || info.website || ''}
              onChange={e => handleChange('portfolio', e.target.value)}
              placeholder="e.g. aaravsharma.dev"
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Roll Number (for placement format) */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Roll / Student ID (Optional)
          </label>
          <div className="relative">
            <Hash className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-400" />
            <input
              type="text"
              value={info.rollNumber || ''}
              onChange={e => handleChange('rollNumber', e.target.value)}
              placeholder="e.g. 2020BCS0042"
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Custom Links Section */}
      <div className="pt-2 border-t border-gray-100">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold text-gray-700">Custom Links & Handles</span>
          <button
            onClick={handleAddCustomLink}
            className="flex items-center gap-1 text-[11px] font-semibold text-sky-600 hover:text-sky-700"
          >
            <Plus className="w-3 h-3" />
            <span>Add Link</span>
          </button>
        </div>

        {info.customLinks?.map((link, idx) => (
          <div key={idx} className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={link.label}
              onChange={e => handleUpdateCustomLink(idx, 'label', e.target.value)}
              placeholder="Label (e.g. LeetCode)"
              className="w-1/3 px-2.5 py-1 text-xs bg-white border border-gray-300 rounded-md"
            />
            <input
              type="text"
              value={link.url}
              onChange={e => handleUpdateCustomLink(idx, 'url', e.target.value)}
              placeholder="URL or handle"
              className="flex-1 px-2.5 py-1 text-xs bg-white border border-gray-300 rounded-md"
            />
            <button
              onClick={() => handleRemoveCustomLink(idx)}
              className="p-1 text-gray-400 hover:text-red-500"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
