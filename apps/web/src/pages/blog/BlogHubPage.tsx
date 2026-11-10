import React, { useState } from 'react';
import { BookOpen, Clock, ArrowRight, Search, Tag, Sparkles } from 'lucide-react';
import { MetaTags } from '../../SEO/metadata/MetaTags';
import { BLOG_POSTS, BlogPost } from './BlogData';

interface BlogHubPageProps {
  onSelectPost: (slug: string) => void;
  onNavigateHome: () => void;
  onNavigateRoute: (route: string) => void;
}

export const BlogHubPage: React.FC<BlogHubPageProps> = ({
  onSelectPost,
  onNavigateHome,
  onNavigateRoute
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const posts = Object.values(BLOG_POSTS);
  const categories = ['All', ...Array.from(new Set(posts.map(p => p.category)))];

  const filteredPosts = posts.filter(post => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <MetaTags path="/blog" />

      {/* Hero */}
      <section className="bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-900 text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>CareerDoc AI Insights &amp; Guides</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Career &amp; Resume Strategy Blog
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Actionable, research-backed guides on applicant tracking systems (ATS), developer resumes, college fresher applications, and modern job search tactics.
          </p>

          {/* Search Bar */}
          <div className="pt-4 max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search guides (e.g. ATS score, fresher, developer)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>
      </section>

      {/* Category Pills */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Post Grid */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map(post => (
            <article
              key={post.slug}
              onClick={() => onSelectPost(post.slug)}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer flex flex-col justify-between p-6 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1 font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                    <Tag className="w-3 h-3" />
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                  {post.title}
                </h2>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {post.description}
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
                <span>Read Full Guide</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <p className="text-base font-semibold">No guides found matching &quot;{searchQuery}&quot;</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-3 text-xs text-indigo-600 hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </main>

      {/* Internal Link Hub for Fast Tool Access */}
      <section className="bg-slate-100/80 border-t border-slate-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">Explore Free CareerDoc AI Tools</h2>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onNavigateRoute('/ai-resume-builder')}
              className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-xs font-medium text-slate-700 hover:border-indigo-500 hover:text-indigo-600 transition-colors cursor-pointer"
            >
              AI Resume Builder
            </button>
            <button
              onClick={() => onNavigateRoute('/ats-resume-checker')}
              className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-xs font-medium text-slate-700 hover:border-indigo-500 hover:text-indigo-600 transition-colors cursor-pointer"
            >
              ATS Resume Checker
            </button>
            <button
              onClick={() => onNavigateRoute('/resume-templates')}
              className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-xs font-medium text-slate-700 hover:border-indigo-500 hover:text-indigo-600 transition-colors cursor-pointer"
            >
              38 Resume Templates
            </button>
            <button
              onClick={() => onNavigateRoute('/ai-cover-letter-generator')}
              className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-xs font-medium text-slate-700 hover:border-indigo-500 hover:text-indigo-600 transition-colors cursor-pointer"
            >
              AI Cover Letter Maker
            </button>
            <button
              onClick={() => onNavigateRoute('/resume-builder-for-freshers')}
              className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-xs font-medium text-slate-700 hover:border-indigo-500 hover:text-indigo-600 transition-colors cursor-pointer"
            >
              Fresher Resume Builder
            </button>
            <button
              onClick={() => onNavigateRoute('/developer-resume-builder')}
              className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-xs font-medium text-slate-700 hover:border-indigo-500 hover:text-indigo-600 transition-colors cursor-pointer"
            >
              Developer Resume Builder
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

