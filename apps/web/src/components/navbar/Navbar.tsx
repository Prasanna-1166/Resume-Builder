import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  LayoutGrid,
  ShieldCheck,
  FolderGit2,
  Layers,
  Target,
  MessageSquare,
  User,
  LogOut,
  ChevronDown,
  UserCheck,
  Sparkles
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { useAuth } from '../../context/AuthContext';

export type AppTabType = 'landing' | 'dashboard' | 'gallery' | 'editor' | 'admin';

interface NavbarProps {
  currentTab: AppTabType;
  setCurrentTab: (tab: AppTabType) => void;
  openJobAnalyzer?: () => void;
  openAtsAuditor?: () => void;
  openTailorModal?: () => void;
  openAuthModal?: (mode?: 'login' | 'register') => void;
  openFeedbackModal?: () => void;
  openProfileModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  openJobAnalyzer,
  openAtsAuditor,
  openTailorModal,
  openAuthModal,
  openFeedbackModal,
  openProfileModal
}) => {
  const { activeDocument } = useResume();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const docType = activeDocument.documentType || 'RESUME';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

          {/* Right Action Area */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Support / Feedback Button */}
            {openFeedbackModal && (
              <button
                onClick={openFeedbackModal}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-lg transition-colors border border-transparent hover:border-indigo-100"
                title="Contact Support & Feedback"
              >
                <MessageSquare className="w-4 h-4 text-slate-500" />
                <span className="hidden md:inline">Support</span>
              </button>
            )}

            {/* User Account Button / Dropdown */}
            {isAuthenticated && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-indigo-300 bg-slate-50 text-slate-800 text-xs font-bold transition-all shadow-2xs"
                >
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[11px] font-bold">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[110px] truncate hidden sm:inline">{user.name || user.email}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-fade-in text-xs">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      {isAdmin && (
                        <span className="mt-1 inline-block text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.2 rounded-full">
                          Administrator
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        setCurrentTab('dashboard');
                      }}
                      className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                    >
                      <FolderGit2 className="w-4 h-4 text-slate-400" />
                      <span>My Documents</span>
                    </button>

                    {openProfileModal && (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          openProfileModal();
                        }}
                        className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        <span>Master Profile</span>
                      </button>
                    )}

                    {isAdmin && (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          setCurrentTab('admin');
                        }}
                        className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium text-purple-700"
                      >
                        <ShieldCheck className="w-4 h-4 text-purple-500" />
                        <span>Admin Console</span>
                      </button>
                    )}

                    {openFeedbackModal && (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          openFeedbackModal();
                        }}
                        className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                      >
                        <MessageSquare className="w-4 h-4 text-slate-400" />
                        <span>Help & Support</span>
                      </button>
                    )}

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2 font-semibold"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuthModal && openAuthModal('login')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-all"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Primary CTA */}
            <button
              onClick={() => setCurrentTab('dashboard')}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] flex items-center gap-1.5"
            >
              <Layers className="w-4 h-4" />
              <span>My Docs</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
