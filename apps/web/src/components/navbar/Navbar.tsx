import React from 'react';
import { FileText, LayoutGrid, Sparkles, ShieldCheck, FolderGit2, Layers, Target } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';

export type AppTabType = 'landing' | 'dashboard' | 'gallery' | 'editor' | 'admin';

interface NavbarProps {
  currentTab: AppTabType;
  setCurrentTab: (tab: AppTabType) => void;
  openJobAnalyzer?: () => void;
  openAtsAuditor?: () => void;
  openTailorModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  openJobAnalyzer,
  openAtsAuditor,
  openTailorModal
}) => {
  const { activeDocument } = useResume();
  const docType = activeDocument.documentType || 'RESUME';

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div
            className="flex items-center gap-2.5 cursor-pointer select-none"
            onClick={() => setCurrentTab('landing')}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-gray-900 text-lg tracking-tight">CareerDoc</span>
              <span className="font-semibold text-indigo-600 text-lg">AI</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                currentTab === 'dashboard'
                  ? 'bg-indigo-50 text-indigo-700 font-bold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <FolderGit2 className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setCurrentTab('gallery')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                currentTab === 'gallery'
                  ? 'bg-indigo-50 text-indigo-700 font-bold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Templates</span>
            </button>

            <button
              onClick={() => setCurrentTab('editor')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                currentTab === 'editor'
                  ? 'bg-indigo-50 text-indigo-700 font-bold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>
                {docType === 'COVER_LETTER' ? 'Cover Letter Editor' : docType === 'CV' ? 'CV Editor' : 'Resume Editor'}
              </span>
            </button>

            {/* In-Editor AI & ATS Shortcuts */}
            {currentTab === 'editor' && openTailorModal && (
              <button
                onClick={openTailorModal}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors shadow-xs"
                title="Tailor Document to Job Description"
              >
                <Target className="w-3.5 h-3.5 text-indigo-600" />
                <span>Job Tailor</span>
              </button>
            )}

            {currentTab === 'editor' && openAtsAuditor && docType !== 'COVER_LETTER' && (
              <button
                onClick={openAtsAuditor}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors shadow-xs"
                title="Run ATS Check"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>ATS Check</span>
              </button>
            )}
          </div>

          {/* Primary CTA */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] flex items-center gap-1.5"
            >
              <Layers className="w-4 h-4" />
              <span>My Documents</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
