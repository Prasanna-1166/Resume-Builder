import React from 'react';
import { FileText, LayoutGrid, Sparkles, Wand2, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  currentTab: 'landing' | 'gallery' | 'editor' | 'admin';
  setCurrentTab: (tab: 'landing' | 'gallery' | 'editor' | 'admin') => void;
  openJobAnalyzer?: () => void;
  openAtsAuditor?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  openJobAnalyzer,
  openAtsAuditor
}) => {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-15 items-center">
          {/* Logo */}
          <div
            className="flex items-center gap-2.5 cursor-pointer select-none"
            onClick={() => setCurrentTab('landing')}
          >
            <div className="w-9 h-9 rounded-lg bg-sky-600 flex items-center justify-center text-white shadow-sm">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-gray-900 text-lg tracking-tight">AI Resume</span>
              <span className="font-semibold text-sky-600 text-lg">Builder</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setCurrentTab('gallery')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentTab === 'gallery'
                  ? 'bg-sky-50 text-sky-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Templates</span>
            </button>

            <button
              onClick={() => setCurrentTab('editor')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentTab === 'editor'
                  ? 'bg-sky-50 text-sky-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Resume Editor</span>
            </button>

            {/* In-Editor AI & ATS Shortcuts */}
            {currentTab === 'editor' && openJobAnalyzer && (
              <button
                onClick={openJobAnalyzer}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors"
                title="Match with Job Description"
              >
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Job Matcher</span>
              </button>
            )}

            {currentTab === 'editor' && openAtsAuditor && (
              <button
                onClick={openAtsAuditor}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                title="Run ATS Check"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>ATS Check</span>
              </button>
            )}
          </div>

          {/* Primary CTA */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentTab('editor')}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-md text-sm font-semibold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>Build Resume</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
