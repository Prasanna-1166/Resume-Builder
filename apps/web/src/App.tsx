import React, { useState, useEffect } from 'react';
import { ResumeProvider, useResume } from './context/ResumeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar, AppTabType } from './components/navbar/Navbar';
import { LandingPage } from './components/landing/LandingPage';
import { TemplateGallery } from './components/gallery/TemplateGallery';
import { ResumeEditor } from './components/editor/ResumeEditor';
import { CoverLetterEditor } from './components/editor/CoverLetterEditor';
import { DocumentDashboard } from './components/dashboard/DocumentDashboard';
import { LivePreview } from './components/preview/LivePreview';
import { AiEnhanceModal } from './components/ai/AiEnhanceModal';
import { SkillSuggestionsModal } from './components/ai/SkillSuggestionsModal';
import { JobAnalyzerModal } from './components/ai/JobAnalyzerModal';
import { AtsAuditorModal } from './components/ai/AtsAuditorModal';
import { TailorJobModal } from './components/ai/TailorJobModal';
import { DocumentVersioningModal } from './components/editor/DocumentVersioningModal';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { track } from './services/analytics';

function getTabFromPath(): AppTabType {
  if (typeof window === 'undefined') return 'landing';
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase().replace(/^#\/?/, '');
  const searchParams = new URLSearchParams(window.location.search);
  const tabParam = (searchParams.get('tab') || '').toLowerCase();

  if (
    path === '/admin' ||
    path.startsWith('/admin/') ||
    hash === 'admin' ||
    tabParam === 'admin' ||
    searchParams.has('admin')
  ) {
    return 'admin';
  }
  if (path === '/dashboard' || path.startsWith('/dashboard/') || hash === 'dashboard' || tabParam === 'dashboard') {
    return 'dashboard';
  }
  if (path === '/editor' || path.startsWith('/editor/') || hash === 'editor' || tabParam === 'editor') {
    return 'editor';
  }
  if (
    path === '/templates' ||
    path === '/gallery' ||
    hash === 'templates' ||
    hash === 'gallery' ||
    tabParam === 'templates' ||
    tabParam === 'gallery'
  ) {
    return 'gallery';
  }
  return 'landing';
}

function getPathFromTab(tab: AppTabType): string {
  switch (tab) {
    case 'admin':
      return '/admin';
    case 'dashboard':
      return '/dashboard';
    case 'editor':
      return '/editor';
    case 'gallery':
      return '/templates';
    case 'landing':
    default:
      return '/';
  }
}

const AppContent: React.FC = () => {
  const [currentTab, setCurrentTabState] = useState<AppTabType>(() => getTabFromPath());
  const { activeDocument, isCoverLetter, updateResumeData } = useResume();
  const { isAuthenticated } = useAuth();

  const navigateToTab = (tab: AppTabType, replaceState = false) => {
    setCurrentTabState(tab);
    const targetPath = getPathFromTab(tab);
    if (window.location.pathname !== targetPath) {
      if (replaceState) {
        window.history.replaceState({ tab }, '', targetPath);
      } else {
        window.history.pushState({ tab }, '', targetPath);
      }
    }
  };

  useEffect(() => {
    const handleUrlChange = () => {
      setCurrentTabState(getTabFromPath());
    };
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // AI & Modal State
  const [aiModal, setAiModal] = useState<{
    isOpen: boolean;
    type: 'summary' | 'bullet';
    currentText: string;
    context?: string;
    onApply?: (val: string) => void;
  }>({
    isOpen: false,
    type: 'summary',
    currentText: ''
  });

  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [jobAnalyzerOpen, setJobAnalyzerOpen] = useState(false);
  const [atsAuditorOpen, setAtsAuditorOpen] = useState(false);
  const [tailorModalOpen, setTailorModalOpen] = useState(false);
  const [versionModalDocId, setVersionModalDocId] = useState<string | null>(null);

  const handleOpenAiEnhance = (type: 'summary' | 'bullet', currentText: string, context?: string) => {
    setAiModal({
      isOpen: true,
      type,
      currentText,
      context,
      onApply: (newText: string) => {
        if (type === 'summary') {
          updateResumeData(prev => ({ ...prev, summary: newText }));
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col font-sans text-slate-900">
      {/* Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={navigateToTab}
        openJobAnalyzer={() => setJobAnalyzerOpen(true)}
        openAtsAuditor={() => setAtsAuditorOpen(true)}
        openTailorModal={() => setTailorModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentTab === 'landing' && (
          <LandingPage
            onSelectTemplate={(_id) => navigateToTab('editor')}
            onBrowseTemplates={() => navigateToTab('gallery')}
            onCreateResume={() => {
              track('RESUME_CREATED', { metadata: { source: 'landing_cta' } });
              navigateToTab('dashboard');
            }}
          />
        )}

        {currentTab === 'dashboard' && (
          <DocumentDashboard
            onOpenEditor={() => navigateToTab('editor')}
            onOpenPreview={() => navigateToTab('editor')}
            onBrowseTemplates={() => navigateToTab('gallery')}
            onOpenVersionModal={(docId) => setVersionModalDocId(docId)}
          />
        )}

        {currentTab === 'gallery' && (
          <TemplateGallery
            onSelectTemplate={(_id) => navigateToTab('editor')}
          />
        )}

        {currentTab === 'editor' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Editor (Resume or Cover Letter) */}
              <div className="lg:col-span-5 no-print">
                {isCoverLetter ? (
                  <CoverLetterEditor onOpenAiEnhance={handleOpenAiEnhance} />
                ) : (
                  <ResumeEditor
                    onOpenAiEnhance={handleOpenAiEnhance}
                    onOpenSkillSuggestions={() => setSkillModalOpen(true)}
                  />
                )}
              </div>

              {/* Right Column: Live Document Preview */}
              <div className="lg:col-span-7 sticky top-20">
                <LivePreview onOpenGallery={() => navigateToTab('gallery')} />
              </div>
            </div>
          </div>
        )}

        {currentTab === 'admin' && (
          <div className="py-6">
            {isAuthenticated ? <AdminDashboard /> : <AdminLogin />}
          </div>
        )}
      </main>

      {/* Modals */}
      <AiEnhanceModal
        isOpen={aiModal.isOpen}
        type={aiModal.type}
        currentText={aiModal.currentText}
        context={aiModal.context}
        onClose={() => setAiModal(prev => ({ ...prev, isOpen: false }))}
        onApply={(newText) => {
          if (aiModal.onApply) aiModal.onApply(newText);
        }}
      />

      <SkillSuggestionsModal
        isOpen={skillModalOpen}
        onClose={() => setSkillModalOpen(false)}
      />

      <JobAnalyzerModal
        isOpen={jobAnalyzerOpen}
        onClose={() => setJobAnalyzerOpen(false)}
      />

      <AtsAuditorModal
        isOpen={atsAuditorOpen}
        onClose={() => setAtsAuditorOpen(false)}
      />

      <TailorJobModal
        isOpen={tailorModalOpen}
        onClose={() => setTailorModalOpen(false)}
      />

      <DocumentVersioningModal
        isOpen={Boolean(versionModalDocId)}
        onClose={() => setVersionModalDocId(null)}
        targetDocId={versionModalDocId || undefined}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <ResumeProvider>
        <AppContent />
      </ResumeProvider>
    </AuthProvider>
  );
};

export default App;
