import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import { History, Plus, RotateCcw, Check, Clock, Tag } from 'lucide-react';

interface DocumentVersioningModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetDocId?: string;
}

export const DocumentVersioningModal: React.FC<DocumentVersioningModalProps> = ({
  isOpen,
  onClose,
  targetDocId
}) => {
  const { activeDocument, drafts, saveVersionSnapshot, restoreVersionSnapshot } = useResume();
  const doc = (targetDocId ? drafts.find(d => d.id === targetDocId) : activeDocument) || activeDocument;

  const [versionName, setVersionName] = useState('');
  const [versionTag, setVersionTag] = useState('Original');
  const [versionNotes, setVersionNotes] = useState('');
  const [justRestored, setJustRestored] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreateSnapshot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!versionName.trim()) return;
    saveVersionSnapshot(versionName.trim(), versionTag, versionNotes.trim());
    setVersionName('');
    setVersionNotes('');
  };

  const handleRestore = (versionId: string) => {
    if (confirm('Restore this version snapshot? Your current draft will be automatically backed up.')) {
      restoreVersionSnapshot(versionId);
      setJustRestored(versionId);
      setTimeout(() => {
        setJustRestored(null);
        onClose();
      }, 800);
    }
  };

  const versions = doc.versions || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 border border-slate-100 max-h-[85vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">Document Versions & Snapshots</h3>
              <p className="text-[11px] text-slate-500">Document: {doc.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 text-sm font-bold">
            ✕
          </button>
        </div>

        {/* Snapshot Creation Form */}
        <form onSubmit={handleCreateSnapshot} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 my-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-indigo-600" />
              <span>Save Current Version Snapshot</span>
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              required
              placeholder="Version name (e.g. Pre-AI Optimization)"
              value={versionName}
              onChange={e => setVersionName(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            <select
              value={versionTag}
              onChange={e => setVersionTag(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Original">Original Baseline</option>
              <option value="ATS Optimized">ATS Optimized</option>
              <option value="Company Tailored">Company Tailored</option>
              <option value="Major Revision">Major Revision</option>
            </select>
          </div>
          <input
            type="text"
            placeholder="Optional notes or context..."
            value={versionNotes}
            onChange={e => setVersionNotes(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow-sm transition-all"
          >
            Save Snapshot
          </button>
        </form>

        {/* Version List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Saved History ({versions.length})
          </h4>

          {versions.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs">
              No version snapshots saved yet for this document. Save a snapshot before making major edits.
            </div>
          ) : (
            versions.map(v => (
              <div
                key={v.id}
                className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-3 hover:border-indigo-300 transition-all"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{v.versionName}</span>
                    {v.tag && (
                      <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.2 rounded font-medium border border-indigo-100">
                        {v.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(v.timestamp).toLocaleString()}</span>
                  </p>
                  {v.notes && <p className="text-[11px] text-slate-600 mt-1 italic">{v.notes}</p>}
                </div>

                <button
                  onClick={() => handleRestore(v.id)}
                  disabled={justRestored === v.id}
                  className="inline-flex items-center gap-1 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-indigo-200 transition-all whitespace-nowrap"
                >
                  {justRestored === v.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Restored!</span>
                    </>
                  ) : (
                    <>
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restore</span>
                    </>
                  )}
                </button>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 mt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
