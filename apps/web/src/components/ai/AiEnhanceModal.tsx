import React, { useState, useEffect } from 'react';
import { apiClient } from '../../services/api';
import { useResume } from '../../context/ResumeContext';
import { Sparkles, Check, X, RefreshCw, AlertTriangle } from 'lucide-react';

interface AiEnhanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'summary' | 'bullet';
  currentText: string;
  context?: string;
  onApply: (newText: string) => void;
}

export const AiEnhanceModal: React.FC<AiEnhanceModalProps> = ({
  isOpen,
  onClose,
  type,
  currentText,
  context,
  onApply
}) => {
  const { resumeData } = useResume();
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestions = async () => {
    if (!currentText || currentText.trim().length < 3) return;
    setLoading(true);
    setError(null);
    try {
      if (type === 'summary') {
        const res = await apiClient.improveSummary(currentText, resumeData.targetRole);
        setSuggestions(res.suggestions || []);
        if (res.suggestions?.length > 0) setSelectedSuggestion(res.suggestions[0]);
      } else {
        const res = await apiClient.improveBullet(currentText, context);
        setSuggestions(res.suggestions || []);
        if (res.suggestions?.length > 0) setSelectedSuggestion(res.suggestions[0]);
      }
    } catch (e: any) {
      console.error(e);
      setError('Failed to generate AI enhancements. Please check your backend connection.');
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
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-xl w-full overflow-hidden animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-gray-200 bg-purple-50/50 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-purple-100 text-purple-700">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-gray-900 text-sm">
              AI {type === 'summary' ? 'Summary Enhancer' : 'Bullet Point Optimizer'}
            </h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Safeguard Notice */}
          <div className="flex items-start gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-md text-[11px] text-amber-800">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Truthfulness Safeguard:</strong> AI enhances impact, grammar, and ATS action verbs. Verify that all metrics and tools accurately reflect your real work before applying.
            </span>
          </div>

          {/* Original Text */}
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">
              Original Draft
            </span>
            <div className="p-2.5 bg-gray-50 border border-gray-200 rounded text-xs text-gray-700 leading-relaxed italic">
              "{currentText}"
            </div>
          </div>

          {/* AI Variations */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[11px] font-semibold text-gray-700 uppercase tracking-wider">
                AI Enhanced Variations
              </span>
              <button
                onClick={fetchSuggestions}
                disabled={loading}
                className="flex items-center gap-1 text-[11px] text-purple-700 hover:underline disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                <span>Regenerate</span>
              </button>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-gray-500 space-y-2">
                <RefreshCw className="w-5 h-5 text-purple-600 animate-spin mx-auto" />
                <p>Generating optimized professional variations with Gemini...</p>
              </div>
            ) : error ? (
              <div className="p-3 text-xs text-red-600 bg-red-50 rounded border border-red-200">
                {error}
              </div>
            ) : (
              <div className="space-y-2">
                {suggestions.map((sug, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedSuggestion(sug)}
                    className={`p-3 rounded-lg border text-xs leading-relaxed cursor-pointer transition-all ${
                      selectedSuggestion === sug
                        ? 'border-purple-600 bg-purple-50/70 text-gray-900 ring-1 ring-purple-500'
                        : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="flex-1">{sug}</span>
                      {selectedSuggestion === sug && (
                        <Check className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 rounded text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (selectedSuggestion) {
                onApply(selectedSuggestion);
                onClose();
              }
            }}
            disabled={!selectedSuggestion || loading}
            className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs font-semibold shadow-xs disabled:opacity-50 flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply Selected</span>
          </button>
        </div>
      </div>
    </div>
  );
};
