import React from 'react';
import { ArrowLeft, Clock, Calendar, User, ArrowRight, CheckCircle2, Share2, Sparkles } from 'lucide-react';
import { MetaTags } from '../../SEO/metadata/MetaTags';
import { BLOG_POSTS, BlogPost } from './BlogData';

interface BlogPostPageProps {
  slug: string;
  onBackToBlog: () => void;
  onNavigateRoute: (route: string) => void;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({
  slug,
  onBackToBlog,
  onNavigateRoute
}) => {
  const post: BlogPost | undefined = BLOG_POSTS[slug];

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Guide Not Found</h1>
        <p className="text-slate-600 mb-4 text-sm">The article you requested could not be located.</p>
        <button
          onClick={onBackToBlog}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold cursor-pointer"
        >
          Return to Blog Hub
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <MetaTags path={`/blog/${post.slug}`} />

      {/* Article Header */}
      <header className="bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-900 text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <button
            onClick={onBackToBlog}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Guides</span>
          </button>

          <div className="inline-block px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/20 text-xs font-semibold">
            {post.category}
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-400 pt-2 border-t border-slate-800">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Published: {post.datePublished}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {post.readTime}
            </span>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Intro */}
        <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-serif">
          {post.content.introduction}
        </p>

        {/* Dynamic Tool CTA Banner */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200/80 rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Free Practical Tool
            </span>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              {post.targetToolCta}
            </h3>
          </div>
          <button
            onClick={() => onNavigateRoute(post.targetToolUrl)}
            className="shrink-0 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-xs transition-all cursor-pointer"
          >
            <span>Launch Tool</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Main Sections */}
        {post.content.sections.map((section, idx) => (
          <section key={idx} className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight pt-4">
              {section.heading}
            </h2>
            {section.body.map((paragraph, pIdx) => (
              <p key={pIdx} className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {paragraph}
              </p>
            ))}

            {section.keyTakeaway && (
              <div className="bg-emerald-50/70 border-l-4 border-emerald-500 p-4 rounded-r-xl text-xs sm:text-sm text-emerald-900 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Key Takeaway: </span>
                  {section.keyTakeaway}
                </div>
              </div>
            )}
          </section>
        ))}

        {/* Conclusion */}
        <section className="pt-6 border-t border-slate-200 space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">Conclusion</h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {post.content.conclusion}
          </p>
        </section>

        {/* End of Post CTA */}
        <div className="mt-12 bg-slate-900 text-white rounded-2xl p-8 text-center space-y-4">
          <h3 className="text-xl font-bold text-white">Apply These Insights Directly</h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
            Use CareerDoc AI 100% free resume builder and ATS checker to optimize your document today.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => onNavigateRoute(post.targetToolUrl)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              <span>{post.targetToolCta}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onBackToBlog}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors cursor-pointer"
            >
              <span>Explore More Guides</span>
            </button>
          </div>
        </div>
      </article>
    </div>
  );
};

