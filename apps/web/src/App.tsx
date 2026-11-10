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
import { AuthModal } from './components/auth/AuthModal';
import { FeedbackModal } from './components/feedback/FeedbackModal';
import { MasterProfileModal } from './components/profile/MasterProfileModal';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AppFooter } from './components/common/AppFooter';
import { PrivacyPolicyModal } from './components/common/PrivacyPolicyModal';
import { TermsModal } from './components/common/TermsModal';
import { track } from './services/analytics';

// SEO Modules & Landing Pages
import { MetaTags } from './SEO/metadata/MetaTags';
import { AiResumeBuilderPage } from './pages/ai-resume-builder/AiResumeBuilderPage';
import { AtsResumeCheckerPage } from './pages/ats-resume-checker/AtsResumeCheckerPage';
import { ResumeTemplatesPage } from './pages/resume-templates/ResumeTemplatesPage';
import { AiCoverLetterGeneratorPage } from './pages/ai-cover-letter-generator/AiCoverLetterGeneratorPage';
import { FresherResumeBuilderPage } from './pages/resume-builder-for-freshers/FresherResumeBuilderPage';
import { DeveloperResumeBuilderPage } from './pages/developer-resume-builder/DeveloperResumeBuilderPage';
import { BlogHubPage } from './pages/blog/BlogHubPage';
import { BlogPostPage } from './pages/blog/BlogPostPage';

function getSlugFromPath(): string {
  if (typeof window === 'undefined') return '';
  const path = window.location.pathname;
  if (path.startsWith('/blog/')) {
    return path.replace(/^\/blog\//, '').replace(/\/$/, '');
  }
  return '';
}

function getTabFromPath(): AppTabType {
  if (typeof window === 'undefined') return 'landing';
  const path = window.location.pathname.toLowerCase().replace(/\/$/, '') || '/';
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
  if (path === '/ai-resume-builder' || hash === 'ai-resume-builder' || tabParam === 'ai-resume-builder') {
    return 'ai-resume-builder';
  }
  if (path === '/ats-resume-checker' || hash === 'ats-resume-checker' || tabParam === 'ats-resume-checker') {
    return 'ats-resume-checker';
  }
  if (
    path === '/resume-templates' ||
    path === '/templates' ||
    path === '/gallery' ||
    hash === 'templates' ||
    hash === 'gallery' ||
    tabParam === 'templates' ||
    tabParam === 'gallery'
  ) {
    return 'resume-templates';
  }
  if (
    path === '/ai-cover-letter-generator' ||
    hash === 'ai-cover-letter-generator' ||
    tabParam === 'ai-cover-letter-generator'
  ) {
    return 'ai-cover-letter-generator';
  }
  if (
    path === '/resume-builder-for-freshers' ||
    hash === 'resume-builder-for-freshers' ||
    tabParam === 'resume-builder-for-freshers'
  ) {
    return 'resume-builder-for-freshers';
  }
  if (
    path === '/developer-resume-builder' ||
    hash === 'developer-resume-builder' ||
    tabParam === 'developer-resume-builder'
  ) {
    return 'developer-resume-builder';
  }
  if (path.startsWith('/blog/')) {
    return 'blog-post';
  }
  if (path === '/blog' || hash === 'blog' || tabParam === 'blog') {
    return 'blog';
  }

  return 'landing';
}

function getPathFromTab(tab: AppTabType, slug?: string): string {
  switch (tab) {
    case 'admin':
      return '/admin';
    case 'dashboard':
      return '/dashboard';
    case 'editor':
      return '/editor';
    case 'resume-templates':
    case 'gallery':
      return '/resume-templates';
    case 'ai-resume-builder':
      return '/ai-resume-builder';
    case 'ats-resume-checker':
      return '/ats-resume-checker';
    case 'ai-cover-letter-generator':
      return '/ai-cover-letter-generator';
    case 'resume-builder-for-freshers':
      return '/resume-builder-for-freshers';
    case 'developer-resume-builder':
      return '/developer-resume-builder';
    case 'blog':
      return '/blog';
    case 'blog-post':
      return slug ? `/blog/${slug}` : '/blog';
    case 'landing':
    default:
      return '/';
  }
}

const AppContent: React.FC = () => {
  const [currentTab, setCurrentTabState] = useState<AppTabType>(() => getTabFromPath());
  const [blogSlug, setBlogSlug] = useState<string>(() => getSlugFromPath());
  const { activeDocument, isCoverLetter, updateResumeData, createDocument } = useResume();
  const { isAuthenticated, isAdmin } = useAuth();

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToRoute = (route: string) => {
    const cleanRoute = route.split('?')[0].replace(/\/$/, '') || '/';
    if (window.location.pathname !== cleanRoute) {
      window.history.pushState({}, '', cleanRoute);
    }
    setCurrentTabState(getTabFromPath());
    setBlogSlug(getSlugFromPath());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Modal States
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);

  useEffect(() => {
    const handleUrlChange = () => {
      setCurrentTabState(getTabFromPath());
      setBlogSlug(getSlugFromPath());
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (path === '/privacy' || hash === '#privacy' || search.includes('privacy')) {
        setPrivacyModalOpen(true);
      } else if (path === '/terms' || hash === '#terms' || search.includes('terms')) {
        setTermsModalOpen(true);
      }
    };
    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // Modal States
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

  // Auth, Feedback, Profile Modals
  const [authModalState, setAuthModalState] = useState<{ isOpen: boolean; mode: 'login' | 'register' }>({
    isOpen: false,
    mode: 'login'
  });
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const handleOpenAiEnhance = (
    type: 'summary' | 'bullet',
    currentText: string,
    context?: string,
    onApply?: (newText: string) => void
  ) => {
    setAiModal({
      isOpen: true,
      type,
      currentText,
      context,
      onApply: (newText: string) => {
        if (onApply) {
          onApply(newText);
        } else if (type === 'summary') {
          updateResumeData(prev => ({ ...prev, summary: newText }));
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col font-sans text-slate-900">
      {/* Global Dynamic Head & Structured Data Management */}
      <MetaTags path={getPathFromTab(currentTab, blogSlug)} />

      {/* Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={navigateToTab}
        openJobAnalyzer={() => setJobAnalyzerOpen(true)}
        openAtsAuditor={() => setAtsAuditorOpen(true)}
        openTailorModal={() => setTailorModalOpen(true)}
        openAuthModal={(mode = 'login') => setAuthModalState({ isOpen: true, mode })}
        openFeedbackModal={() => setFeedbackModalOpen(true)}
        openProfileModal={() => {
          if (!isAuthenticated) {
            setAuthModalState({ isOpen: true, mode: 'login' });
          } else {
            setProfileModalOpen(true);
          }
        }}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentTab === 'landing' && (
          <LandingPage
            onSelectTemplate={(_id) => navigateToTab('editor')}
            onBrowseTemplates={() => navigateToTab('resume-templates')}
            onCreateResume={() => {
              track('RESUME_CREATED', { metadata: { source: 'landing_cta' } });
              navigateToTab('dashboard');
            }}
          />
        )}

        {currentTab === 'ai-resume-builder' && (
          <AiResumeBuilderPage
            onStartBuilding={() => navigateToTab('editor')}
            onBrowseTemplates={() => navigateToTab('resume-templates')}
          />
        )}

        {currentTab === 'ats-resume-checker' && (
          <AtsResumeCheckerPage
            onStartBuilding={() => navigateToTab('editor')}
            onOpenAtsAuditor={() => setAtsAuditorOpen(true)}
          />
        )}

        {(currentTab === 'resume-templates' || currentTab === 'gallery') && (
          <ResumeTemplatesPage
            onSelectTemplate={(_id) => navigateToTab('editor')}
            onStartBuilding={() => navigateToTab('editor')}
          />
        )}

        {currentTab === 'ai-cover-letter-generator' && (
          <AiCoverLetterGeneratorPage
            onStartCoverLetter={() => {
              createDocument('COVER_LETTER', 'EXPERIENCED', 'template_cl_modern', 'My Cover Letter');
              navigateToTab('editor');
            }}
            onBrowseTemplates={() => navigateToTab('resume-templates')}
          />
        )}

        {currentTab === 'resume-builder-for-freshers' && (
          <FresherResumeBuilderPage
            onStartBuilding={() => navigateToTab('editor')}
            onBrowseTemplates={() => navigateToTab('resume-templates')}
          />
        )}

        {currentTab === 'developer-resume-builder' && (
          <DeveloperResumeBuilderPage
            onStartBuilding={() => navigateToTab('editor')}
            onBrowseTemplates={() => navigateToTab('resume-templates')}
          />
        )}

        {currentTab === 'blog' && (
          <BlogHubPage
            onSelectPost={(slug) => navigateToRoute(`/blog/${slug}`)}
            onNavigateHome={() => navigateToTab('landing')}
            onNavigateRoute={navigateToRoute}
          />
        )}

        {currentTab === 'blog-post' && (
          <BlogPostPage
            slug={blogSlug}
            onBackToBlog={() => navigateToRoute('/blog')}
            onNavigateRoute={navigateToRoute}
          />
        )}

        {currentTab === 'dashboard' && (
          <DocumentDashboard
            onOpenEditor={() => navigateToTab('editor')}
            onOpenPreview={() => navigateToTab('editor')}
            onBrowseTemplates={() => navigateToTab('resume-templates')}
            onOpenVersionModal={(docId) => setVersionModalDocId(docId)}
            onOpenProfileModal={() => {
              if (!isAuthenticated) {
                setAuthModalState({ isOpen: true, mode: 'login' });
              } else {
                setProfileModalOpen(true);
              }
            }}
            onOpenAuthModal={(mode = 'register') => setAuthModalState({ isOpen: true, mode })}
            onOpenFeedbackModal={() => setFeedbackModalOpen(true)}
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
                    onOpenAtsAuditor={() => setAtsAuditorOpen(true)}
                    onOpenAuthModal={(mode = 'login') => setAuthModalState({ isOpen: true, mode })}
                    onOpenProfileModal={() => {
                      if (!isAuthenticated) {
                        setAuthModalState({ isOpen: true, mode: 'login' });
                      } else {
                        setProfileModalOpen(true);
                      }
                    }}
                  />
                )}
              </div>

              {/* Right Column: Live Document Preview */}
              <div className="lg:col-span-7 sticky top-20">
                <LivePreview onOpenGallery={() => navigateToTab('resume-templates')} />
              </div>
            </div>
          </div>
        )}

        {currentTab === 'admin' && (
          <div className="py-6">
            {isAuthenticated && isAdmin ? <AdminDashboard /> : <AdminLogin />}
          </div>
        )}
      </main>

      {/* Footer with Comprehensive Internal Link Hub */}
      <AppFooter
        onOpenPrivacyPolicy={() => setPrivacyModalOpen(true)}
        onOpenTerms={() => setTermsModalOpen(true)}
        onOpenFeedback={() => setFeedbackModalOpen(true)}
        onNavigateAdmin={() => navigateToTab('admin')}
        onNavigateRoute={navigateToRoute}
      />

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
        onOpenPrivacyPolicy={() => setPrivacyModalOpen(true)}
      />

      <SkillSuggestionsModal
        isOpen={skillModalOpen}
        onClose={() => setSkillModalOpen(false)}
        onOpenPrivacyPolicy={() => setPrivacyModalOpen(true)}
      />

      <JobAnalyzerModal
        isOpen={jobAnalyzerOpen}
        onClose={() => setJobAnalyzerOpen(false)}
        onOpenPrivacyPolicy={() => setPrivacyModalOpen(true)}
      />

      <AtsAuditorModal
        isOpen={atsAuditorOpen}
        onClose={() => setAtsAuditorOpen(false)}
      />

      <TailorJobModal
        isOpen={tailorModalOpen}
        onClose={() => setTailorModalOpen(false)}
        onOpenPrivacyPolicy={() => setPrivacyModalOpen(true)}
      />

      <DocumentVersioningModal
        isOpen={Boolean(versionModalDocId)}
        onClose={() => setVersionModalDocId(null)}
        targetDocId={versionModalDocId || undefined}
      />

      {/* User Account Auth Modal */}
      <AuthModal
        isOpen={authModalState.isOpen}
        initialMode={authModalState.mode}
        onClose={() => setAuthModalState(prev => ({ ...prev, isOpen: false }))}
      />

      {/* Contact & Support Feedback Modal */}
      <FeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
      />

      {/* Master Profile Management Modal */}
      <MasterProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />

      {/* Privacy Policy and Terms Modals */}
      <PrivacyPolicyModal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
      />

      <TermsModal
        isOpen={termsModalOpen}
        onClose={() => setTermsModalOpen(false)}
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
