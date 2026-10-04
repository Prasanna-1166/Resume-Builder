import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useResume } from '../../context/ResumeContext';
import { apiClient } from '../../services/api';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
  Briefcase,
  GraduationCap,
  Sparkles,
  Code,
  Award,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  X,
  FileDown
} from 'lucide-react';

interface MasterProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MasterProfileModal: React.FC<MasterProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, isAuthenticated } = useAuth();
  const { activeDocument } = useResume();
  const [activeTab, setActiveTab] = useState<'personal' | 'skills' | 'experience' | 'education' | 'projects' | 'certifications'>('personal');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Profile Form State
  const [profile, setProfile] = useState<any>({
    personalInfo: {
      fullName: '',
      professionalTitle: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      linkedin: '',
      github: '',
      portfolio: ''
    },
    summary: '',
    skills: [],
    experience: [],
    education: [],
    projects: [],
    certifications: []
  });

  const fetchProfile = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const res = await apiClient.getProfile();
      if (res?.profile) {
        setProfile({
          personalInfo: {
            fullName: res.profile.personalInfo?.fullName || user?.name || '',
            professionalTitle: res.profile.personalInfo?.professionalTitle || '',
            email: res.profile.personalInfo?.email || user?.email || '',
            phone: res.profile.personalInfo?.phone || '',
            location: res.profile.personalInfo?.location || '',
            website: res.profile.personalInfo?.website || '',
            linkedin: res.profile.personalInfo?.linkedin || '',
            github: res.profile.personalInfo?.github || '',
            portfolio: res.profile.personalInfo?.portfolio || ''
          },
          summary: res.profile.summary || '',
          skills: Array.isArray(res.profile.skills) ? res.profile.skills : [],
          experience: Array.isArray(res.profile.experience) ? res.profile.experience : [],
          education: Array.isArray(res.profile.education) ? res.profile.education : [],
          projects: Array.isArray(res.profile.projects) ? res.profile.projects : [],
          certifications: Array.isArray(res.profile.certifications) ? res.profile.certifications : []
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load master profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchProfile();
    }
  }, [isOpen, isAuthenticated]);

  if (!isOpen) return null;

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await apiClient.updateProfile(profile);
      setSuccess('Master Profile saved successfully! You can reuse this across all documents.');
      setTimeout(() => setSuccess(null), 2500);
    } catch (err: any) {
      setError(err.message || 'Failed to save master profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleImportFromActiveDocument = () => {
    if (!activeDocument) return;
    if (confirm('Import information from your currently open document into your Master Profile?')) {
      const doc = activeDocument as any;
      setProfile((prev: any) => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          ...(doc.personalInfo || {})
        },
        summary: doc.summary || prev.summary,
        skills: doc.skills && doc.skills.length > 0 ? doc.skills : prev.skills,
        experience: doc.experience && doc.experience.length > 0 ? doc.experience : prev.experience,
        education: doc.education && doc.education.length > 0 ? doc.education : prev.education,
        projects: doc.projects && doc.projects.length > 0 ? doc.projects : prev.projects,
        certifications: doc.certifications && doc.certifications.length > 0 ? doc.certifications : prev.certifications
      }));
      setSuccess('Loaded details from current document into profile form. Click "Save Master Profile" to confirm.');
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in no-print">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-6 sm:p-8 border border-slate-100 relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Reusable Master Career Profile</h2>
              <p className="text-xs text-slate-500">
                Single master record for auto-populating resumes, CVs, and tailored applications.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleImportFromActiveDocument}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
              title="Populate from active document"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Import from Open Doc</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications */}
        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 border-b border-slate-200 py-3 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'personal', label: 'Personal & Contact' },
            { id: 'skills', label: 'Skills & Tech' },
            { id: 'experience', label: 'Work Experience' },
            { id: 'education', label: 'Education' },
            { id: 'projects', label: 'Key Projects' },
            { id: 'certifications', label: 'Certifications' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs">
          {activeTab === 'personal' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profile.personalInfo?.fullName || ''}
                    onChange={e =>
                      setProfile({
                        ...profile,
                        personalInfo: { ...profile.personalInfo, fullName: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Professional Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Full Stack Engineer"
                    value={profile.personalInfo?.professionalTitle || ''}
                    onChange={e =>
                      setProfile({
                        ...profile,
                        personalInfo: { ...profile.personalInfo, professionalTitle: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={profile.personalInfo?.email || ''}
                    onChange={e =>
                      setProfile({
                        ...profile,
                        personalInfo: { ...profile.personalInfo, email: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+1 (555) 000-0000"
                    value={profile.personalInfo?.phone || ''}
                    onChange={e =>
                      setProfile({
                        ...profile,
                        personalInfo: { ...profile.personalInfo, phone: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="San Francisco, CA"
                    value={profile.personalInfo?.location || ''}
                    onChange={e =>
                      setProfile({
                        ...profile,
                        personalInfo: { ...profile.personalInfo, location: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Website / Portfolio URL</label>
                  <input
                    type="text"
                    placeholder="https://myportfolio.com"
                    value={profile.personalInfo?.website || ''}
                    onChange={e =>
                      setProfile({
                        ...profile,
                        personalInfo: { ...profile.personalInfo, website: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">LinkedIn Profile</label>
                  <input
                    type="text"
                    placeholder="linkedin.com/in/username"
                    value={profile.personalInfo?.linkedin || ''}
                    onChange={e =>
                      setProfile({
                        ...profile,
                        personalInfo: { ...profile.personalInfo, linkedin: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">GitHub Profile</label>
                  <input
                    type="text"
                    placeholder="github.com/username"
                    value={profile.personalInfo?.github || ''}
                    onChange={e =>
                      setProfile({
                        ...profile,
                        personalInfo: { ...profile.personalInfo, github: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Master Career Summary</label>
                <textarea
                  rows={3}
                  placeholder="Master executive / career summary overview..."
                  value={profile.summary || ''}
                  onChange={e => setProfile({ ...profile, summary: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Master Skill Categories</span>
                <button
                  type="button"
                  onClick={() =>
                    setProfile({
                      ...profile,
                      skills: [
                        ...(profile.skills || []),
                        { id: `sk_${Date.now()}`, category: 'Technical Skills', items: [] }
                      ]
                    })
                  }
                  className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Skill Category</span>
                </button>
              </div>

              {(!profile.skills || profile.skills.length === 0) && (
                <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-xl">
                  No skills in master profile yet. Add skills to quickly auto-populate new documents.
                </div>
              )}

              {profile.skills?.map((sk: any, idx: number) => (
                <div key={sk.id || idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      placeholder="Category (e.g. Languages & Frameworks)"
                      value={sk.category || ''}
                      onChange={e => {
                        const next = [...profile.skills];
                        next[idx].category = e.target.value;
                        setProfile({ ...profile, skills: next });
                      }}
                      className="font-bold bg-white px-2.5 py-1 rounded border border-slate-200 text-slate-800 flex-1"
                    />
                    <button
                      onClick={() => {
                        const next = profile.skills.filter((_: any, i: number) => i !== idx);
                        setProfile({ ...profile, skills: next });
                      }}
                      className="text-slate-400 hover:text-red-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Comma-separated skills (e.g. React, TypeScript, Node.js, PostgreSQL)"
                      value={Array.isArray(sk.items) ? sk.items.join(', ') : ''}
                      onChange={e => {
                        const next = [...profile.skills];
                        next[idx].items = e.target.value
                          .split(',')
                          .map((s: string) => s.trim())
                          .filter(Boolean);
                        setProfile({ ...profile, skills: next });
                      }}
                      className="w-full bg-white px-2.5 py-1 rounded border border-slate-200 text-slate-700"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Master Work Experience History</span>
                <button
                  type="button"
                  onClick={() =>
                    setProfile({
                      ...profile,
                      experience: [
                        {
                          id: `exp_${Date.now()}`,
                          company: 'Company Name',
                          role: 'Role Title',
                          startDate: '2023',
                          endDate: 'Present',
                          bullets: ['Achieved measurable outcome utilizing relevant technologies.']
                        },
                        ...(profile.experience || [])
                      ]
                    })
                  }
                  className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Experience</span>
                </button>
              </div>

              {profile.experience?.map((exp: any, idx: number) => (
                <div key={exp.id || idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 flex-1">
                      <input
                        type="text"
                        placeholder="Company"
                        value={exp.company || ''}
                        onChange={e => {
                          const next = [...profile.experience];
                          next[idx].company = e.target.value;
                          setProfile({ ...profile, experience: next });
                        }}
                        className="bg-white px-2 py-1 rounded border border-slate-200 font-bold"
                      />
                      <input
                        type="text"
                        placeholder="Role Title"
                        value={exp.role || ''}
                        onChange={e => {
                          const next = [...profile.experience];
                          next[idx].role = e.target.value;
                          setProfile({ ...profile, experience: next });
                        }}
                        className="bg-white px-2 py-1 rounded border border-slate-200"
                      />
                      <input
                        type="text"
                        placeholder="Start Date"
                        value={exp.startDate || ''}
                        onChange={e => {
                          const next = [...profile.experience];
                          next[idx].startDate = e.target.value;
                          setProfile({ ...profile, experience: next });
                        }}
                        className="bg-white px-2 py-1 rounded border border-slate-200"
                      />
                      <input
                        type="text"
                        placeholder="End Date"
                        value={exp.endDate || ''}
                        onChange={e => {
                          const next = [...profile.experience];
                          next[idx].endDate = e.target.value;
                          setProfile({ ...profile, experience: next });
                        }}
                        className="bg-white px-2 py-1 rounded border border-slate-200"
                      />
                    </div>
                    <button
                      onClick={() => {
                        const next = profile.experience.filter((_: any, i: number) => i !== idx);
                        setProfile({ ...profile, experience: next });
                      }}
                      className="text-slate-400 hover:text-red-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-0.5">Bullet Points (One per line)</label>
                    <textarea
                      rows={2}
                      value={Array.isArray(exp.bullets) ? exp.bullets.join('\n') : ''}
                      onChange={e => {
                        const next = [...profile.experience];
                        next[idx].bullets = e.target.value.split('\n').filter(Boolean);
                        setProfile({ ...profile, experience: next });
                      }}
                      className="w-full bg-white px-2 py-1 rounded border border-slate-200 resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'education' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Master Education Records</span>
                <button
                  type="button"
                  onClick={() =>
                    setProfile({
                      ...profile,
                      education: [
                        {
                          id: `edu_${Date.now()}`,
                          institution: 'University Name',
                          degree: 'Bachelor of Science',
                          field: 'Computer Science',
                          startDate: '2020',
                          endDate: '2024'
                        },
                        ...(profile.education || [])
                      ]
                    })
                  }
                  className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Education</span>
                </button>
              </div>

              {profile.education?.map((edu: any, idx: number) => (
                <div key={edu.id || idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 flex-1">
                      <input
                        type="text"
                        placeholder="Institution"
                        value={edu.institution || ''}
                        onChange={e => {
                          const next = [...profile.education];
                          next[idx].institution = e.target.value;
                          setProfile({ ...profile, education: next });
                        }}
                        className="bg-white px-2 py-1 rounded border border-slate-200 font-bold"
                      />
                      <input
                        type="text"
                        placeholder="Degree & Field"
                        value={edu.degree ? `${edu.degree} in ${edu.field || ''}` : ''}
                        onChange={e => {
                          const next = [...profile.education];
                          next[idx].degree = e.target.value;
                          setProfile({ ...profile, education: next });
                        }}
                        className="bg-white px-2 py-1 rounded border border-slate-200"
                      />
                      <input
                        type="text"
                        placeholder="Start Date"
                        value={edu.startDate || ''}
                        onChange={e => {
                          const next = [...profile.education];
                          next[idx].startDate = e.target.value;
                          setProfile({ ...profile, education: next });
                        }}
                        className="bg-white px-2 py-1 rounded border border-slate-200"
                      />
                      <input
                        type="text"
                        placeholder="End Date"
                        value={edu.endDate || ''}
                        onChange={e => {
                          const next = [...profile.education];
                          next[idx].endDate = e.target.value;
                          setProfile({ ...profile, education: next });
                        }}
                        className="bg-white px-2 py-1 rounded border border-slate-200"
                      />
                    </div>
                    <button
                      onClick={() => {
                        const next = profile.education.filter((_: any, i: number) => i !== idx);
                        setProfile({ ...profile, education: next });
                      }}
                      className="text-slate-400 hover:text-red-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Master Project Portfolio</span>
                <button
                  type="button"
                  onClick={() =>
                    setProfile({
                      ...profile,
                      projects: [
                        {
                          id: `proj_${Date.now()}`,
                          name: 'Project Name',
                          technologies: ['React', 'Node.js'],
                          bullets: ['Key deliverable and impact metrics.']
                        },
                        ...(profile.projects || [])
                      ]
                    })
                  }
                  className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Project</span>
                </button>
              </div>

              {profile.projects?.map((proj: any, idx: number) => (
                <div key={proj.id || idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      placeholder="Project Name"
                      value={proj.name || ''}
                      onChange={e => {
                        const next = [...profile.projects];
                        next[idx].name = e.target.value;
                        setProfile({ ...profile, projects: next });
                      }}
                      className="font-bold bg-white px-2.5 py-1 rounded border border-slate-200 text-slate-800 flex-1"
                    />
                    <button
                      onClick={() => {
                        const next = profile.projects.filter((_: any, i: number) => i !== idx);
                        setProfile({ ...profile, projects: next });
                      }}
                      className="text-slate-400 hover:text-red-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Technologies used (comma separated, e.g. Next.js, Python, AWS)"
                      value={Array.isArray(proj.technologies) ? proj.technologies.join(', ') : ''}
                      onChange={e => {
                        const next = [...profile.projects];
                        next[idx].technologies = e.target.value
                          .split(',')
                          .map((s: string) => s.trim())
                          .filter(Boolean);
                        setProfile({ ...profile, projects: next });
                      }}
                      className="w-full bg-white px-2 py-1 rounded border border-slate-200 text-slate-700"
                    />
                  </div>
                  <div>
                    <textarea
                      rows={2}
                      placeholder="Project description / achievements (one bullet per line)"
                      value={Array.isArray(proj.bullets) ? proj.bullets.join('\n') : ''}
                      onChange={e => {
                        const next = [...profile.projects];
                        next[idx].bullets = e.target.value.split('\n').filter(Boolean);
                        setProfile({ ...profile, projects: next });
                      }}
                      className="w-full bg-white px-2 py-1 rounded border border-slate-200 resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'certifications' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Master Certifications & Credentials</span>
                <button
                  type="button"
                  onClick={() =>
                    setProfile({
                      ...profile,
                      certifications: [
                        {
                          id: `cert_${Date.now()}`,
                          name: 'Certificate Name',
                          issuer: 'Issuing Organization',
                          date: '2024'
                        },
                        ...(profile.certifications || [])
                      ]
                    })
                  }
                  className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Certification</span>
                </button>
              </div>

              {profile.certifications?.map((cert: any, idx: number) => (
                <div key={cert.id || idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
                      <input
                        type="text"
                        placeholder="Certificate Name"
                        value={cert.name || ''}
                        onChange={e => {
                          const next = [...profile.certifications];
                          next[idx].name = e.target.value;
                          setProfile({ ...profile, certifications: next });
                        }}
                        className="bg-white px-2 py-1 rounded border border-slate-200 font-bold"
                      />
                      <input
                        type="text"
                        placeholder="Issuer (e.g. AWS, Google)"
                        value={cert.issuer || ''}
                        onChange={e => {
                          const next = [...profile.certifications];
                          next[idx].issuer = e.target.value;
                          setProfile({ ...profile, certifications: next });
                        }}
                        className="bg-white px-2 py-1 rounded border border-slate-200"
                      />
                      <input
                        type="text"
                        placeholder="Date"
                        value={cert.date || ''}
                        onChange={e => {
                          const next = [...profile.certifications];
                          next[idx].date = e.target.value;
                          setProfile({ ...profile, certifications: next });
                        }}
                        className="bg-white px-2 py-1 rounded border border-slate-200"
                      />
                    </div>
                    <button
                      onClick={() => {
                        const next = profile.certifications.filter((_: any, i: number) => i !== idx);
                        setProfile({ ...profile, certifications: next });
                      }}
                      className="text-slate-400 hover:text-red-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Changes here update your reusable master profile without mutating existing documents.
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] disabled:opacity-50 flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving Profile...' : 'Save Master Profile'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
