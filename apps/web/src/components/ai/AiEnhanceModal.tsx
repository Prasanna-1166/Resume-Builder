import React, { useState, useEffect } from 'react';
import { apiClient } from '../../services/api';
import { useResume } from '../../context/ResumeContext';
import { Sparkles, Check, X, RefreshCw, AlertTriangle, ShieldCheck, Edit3 } from 'lucide-react';
import { track } from '../../services/analytics';

interface AiEnhanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'summary' | 'bullet';
  currentText: string;
  context?: string;
  onApply: (newText: string) => void;
  onOpenPrivacyPolicy?: () => void;
}

export const AiEnhanceModal: React.FC<AiEnhanceModalProps> = ({
  isOpen,
  onClose,
  type,
  currentText,
  context,
  onApply,
  onOpenPrivacyPolicy
}) => {
  const { resumeData } = useResume();
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);
  const [editableSuggestion, setEditableSuggestion] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestions = async () => {
    if (!currentText || currentText.trim().length < 3) return;
    setLoading(true);
    setError(null);
    try {
      if (type === 'summary') {
        const res = await apiClient.improveSummary(currentText, resumeData.targetRole);
        const list = res.suggestions || [];
        setSuggestions(list);
        if (list.length > 0) {
          setSelectedSuggestion(list[0]);
          setEditableSuggestion(list[0]);
        }
        track('AI_SUMMARY', { status: 'SUCCESS' });
      } else {
        const res = await apiClient.improveBullet(currentText, context);
        const list = res.suggestions || [];
        setSuggestions(list);
        if (list.length > 0) {
          setSelectedSuggestion(list[0]);
          setEditableSuggestion(list[0]);
        }
        track('AI_BULLET', { status: 'SUCCESS' });
      }
    } catch (e: any) {
      console.warn('AI enhancement failure (handled gracefully):', e?.message || e);
      if (type === 'summary') {
        track('AI_SUMMARY', { status: 'ERROR' });
      } else {
        track('AI_BULLET', { status: 'ERROR' });
      }
      setError('Unable to reach AI service right now. Your original content is preserved.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSuggestions();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-modal-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh] border border-slate-200">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 bg-purple-50/70 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-600 text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 id="ai-modal-title" className="font-bold text-slate-900 text-sm">
                {type === 'summary' ? 'Improve Summary with AI' : 'Improve Bullet Point with AI'}
              </h3>
              <p className="text-[11px] text-slate-500">
                AI suggestion tool • Human review required
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 overflow-y-auto text-xs">
          {/* AI Disclosure & Privacy Notice */}
          <div className="p-3 bg-purple-50/50 border border-purple-200 rounded-xl space-y-1 text-[11px] text-purple-950">
            <div className="flex items-start gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong>AI-assisted feature:</strong> When you use this feature, the draft text below is sent to our AI provider (Google Gemini) to generate phrasing suggestions. Review our{' '}
                {onOpenPrivacyPolicy ? (
                  <button
                    type="button"
                    onClick={onOpenPrivacyPolicy}
                    className="font-bold underline hover:text-purple-700 cursor-pointer"
                  >
                    Privacy Policy
                  </button>
                ) : (
                  <span className="font-bold">Privacy Policy</span>
                )}{' '}
                for details. AI suggestions may contain errors and require review. Your original document remains unchanged until you click &quot;Apply Suggestion&quot;.
              </div>
            </div>
          </div>

          {/* Original Content */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Original Content
              </span>
              <span className="text-[10px] text-slate-400">Your genuine draft</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 leading-relaxed italic">
              &quot;{currentText}&quot;
            </div>
          </div>

          {/* AI Variations */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                AI Suggestions
              </span>
              <button
                type="button"
                onClick={fetchSuggestions}
                disabled={loading}
                className="flex items-center gap-1 text-[11px] font-semibold text-purple-700 hover:text-purple-800 hover:underline disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                <span>Regenerate</span>
              </button>
            </div>

            {loading ? (
              <div className="py-8 text-center text-slate-500 space-y-2">
                <RefreshCw className="w-5 h-5 text-purple-600 animate-spin mx-auto" />
                <p className="text-xs">Generating professional suggestions without inventing facts...</p>
              </div>
            ) : error ? (
              <div className="p-3 text-xs text-amber-800 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            ) : (
              <div className="space-y-2">
                {suggestions.map((sug, i) => {
                  const isSelected = selectedSuggestion === sug;
                  return (
                    <div
                      key={i}
                      onClick={() => {
                        setSelectedSuggestion(sug);
                        setEditableSuggestion(sug);
                      }}
                      className={`p-3 rounded-xl border text-xs leading-relaxed cursor-pointer transition-all ${
                        isSelected
                          ? 'border-purple-600 bg-purple-50/70 text-slate-900 ring-2 ring-purple-600/20'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                              Variation {i + 1}
                            </span>
                            {isSelected && (
                              <span className="text-[10px] text-purple-600 font-semibold">
                                Selected
                              </span>
                            )}
                          </div>
                          <p>{sug}</p>
                        </div>
                        {isSelected && (
                          <Check className="w-4 h-4 text-purple-600 shrink-0 mt-1" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Edit Accepted Suggestion Manually */}
          {selectedSuggestion && !loading && (
            <div className="pt-2 border-t border-slate-100 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1">
                  <Edit3 className="w-3 h-3 text-indigo-600" />
                  <span>Edit Suggested Version Before Applying</span>
                </label>
                <span className="text-[10px] text-slate-400">Manual review &amp; refinement</span>
              </div>
              <textarea
                rows={3}
                value={editableSuggestion}
                onChange={e => setEditableSuggestion(e.target.value)}
                className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none leading-relaxed"
                placeholder="You can edit the AI suggestion here to ensure 100% factual accuracy before applying..."
              />
              <div className="text-[10.5px] text-slate-500 italic">
                Tip: Feel free to adjust numbers, technologies, or phrasing to reflect your genuine work.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            Keep Original / Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              const textToApply = editableSuggestion.trim() || selectedSuggestion;
              if (textToApply) {
                onApply(textToApply);
                onClose();
              }
            }}
            disabled={(!editableSuggestion && !selectedSuggestion) || loading}
            className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs disabled:opacity-50 flex items-center gap-1.5 transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply Suggestion</span>
          </button>
        </div>
      </div>
    </div>
  );
};
