import React, { useState, useEffect } from 'react';
import { ResumeProvider, useResume } from './context/ResumeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/navbar/Navbar';
import { LandingPage } from './components/landing/LandingPage';
import { TemplateGallery } from './components/gallery/TemplateGallery';
import { ResumeEditor } from './components/editor/ResumeEditor';
import { LivePreview } from './components/preview/LivePreview';
import { AiEnhanceModal } from './components/ai/AiEnhanceModal';
import { SkillSuggestionsModal } from './components/ai/SkillSuggestionsModal';
import { JobAnalyzerModal } from './components/ai/JobAnalyzerModal';
import { AtsAuditorModal } from './components/ai/AtsAuditorModal';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { track } from './services/analytics';

type TabType = 'landing' | 'gallery' | 'editor' | 'admin';

function getTabFromPath(): TabType {
  if (typeof window === 'undefined') return 'landing';
  const path = window.location.pathname.toLowerCase();
  if (path === '/admin' || path.startsWith('/admin/')) return 'admin';
  if (path === '/editor' || path.startsWith('/editor/')) return 'editor';
  if (path === '/templates' || path === '/gallery') return 'gallery';
  return 'landing';
}

function getPathFromTab(tab: TabType): string {
  switch (tab) {
    case 'admin':
      return '/admin';
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
  const [currentTab, setCurrentTabState] = useState<TabType>(() => getTabFromPath());

  const navigateToTab = (tab: TabType, replaceState = false) => {
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
    const handlePopState = () => {
      setCurrentTabState(getTabFromPath());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // AI & ATS Modals State
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

  const { updateResumeData } = useResume();
  const { isAuthenticated } = useAuth();

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
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      {/* Navigation - public tabs only */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={navigateToTab}
        openJobAnalyzer={() => setJobAnalyzerOpen(true)}
        openAtsAuditor={() => setAtsAuditorOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentTab === 'landing' && (
          <LandingPage
            onSelectTemplate={(_id) => navigateToTab('editor')}
            onBrowseTemplates={() => navigateToTab('gallery')}
            onCreateResume={() => {
              track('RESUME_CREATED', { metadata: { source: 'landing_cta' } });
              navigateToTab('editor');
            }}
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
              {/* Left Column: Structured Editor (45%) */}
              <div className="lg:col-span-5 no-print">
                <ResumeEditor
                  onOpenAiEnhance={handleOpenAiEnhance}
                  onOpenSkillSuggestions={() => setSkillModalOpen(true)}
                />
              </div>

              {/* Right Column: Live Resume Preview (55%) */}
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
