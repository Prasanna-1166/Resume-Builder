import React, { useState, useEffect, useMemo } from 'react';
import {
  SKILLS_CATALOG,
  FlatSkillItem,
  SkillCatalogCategory,
  filterSkillsCatalog
} from '@ai-resume/core';
import {
  Search,
  Check,
  Plus,
  X,
  Layers,
  Sparkles,
  CheckCheck
} from 'lucide-react';

interface SkillDropdownPickerProps {
  isOpen: boolean;
  onClose: () => void;
  categoryName: string;
  currentSkills: string[];
  onToggleSkill: (skill: string) => void;
  onAddMultipleSkills: (skills: string[]) => void;
  onAddCustomSkill?: (skill: string) => void;
}

export const SkillDropdownPicker: React.FC<SkillDropdownPickerProps> = ({
  isOpen,
  onClose,
  categoryName,
  currentSkills,
  onToggleSkill,
  onAddMultipleSkills,
  onAddCustomSkill
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [stagedSelection, setStagedSelection] = useState<Set<string>>(new Set());

  // Match initial tab based on categoryName
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setStagedSelection(new Set());
      const lower = (categoryName || '').toLowerCase();
      const matched = SKILLS_CATALOG.find(
        (c: SkillCatalogCategory) => lower.includes(c.name.toLowerCase()) || lower.includes(c.id.toLowerCase())
      );
      if (matched) {
        setSelectedTab(matched.id);
      } else if (lower.includes('lang') || lower.includes('code')) {
        setSelectedTab('languages');
      } else if (lower.includes('frame') || lower.includes('lib') || lower.includes('tech')) {
        setSelectedTab('frameworks');
      } else if (lower.includes('data') || lower.includes('db') || lower.includes('sql')) {
        setSelectedTab('databases');
      } else if (lower.includes('cloud') || lower.includes('devops')) {
        setSelectedTab('cloud_devops');
      } else if (lower.includes('tool') || lower.includes('platform')) {
        setSelectedTab('tools');
      } else if (lower.includes('ai') || lower.includes('ml')) {
        setSelectedTab('ai_data');
      } else if (lower.includes('soft') || lower.includes('lead')) {
        setSelectedTab('soft_skills');
      } else if (lower.includes('sec') || lower.includes('cyber')) {
        setSelectedTab('cybersecurity');
      } else {
        setSelectedTab('all');
      }
    }
  }, [isOpen, categoryName]);

  const existingSkillsSet = useMemo(() => {
    return new Set(currentSkills.map(s => s.trim().toLowerCase()));
  }, [currentSkills]);

  const filteredSkills: FlatSkillItem[] = useMemo(() => {
    return filterSkillsCatalog(searchQuery, selectedTab);
  }, [searchQuery, selectedTab]);

  if (!isOpen) return null;

  const handleToggleStaged = (skillName: string) => {
    setStagedSelection(prev => {
      const next = new Set(prev);
      if (next.has(skillName)) {
        next.delete(skillName);
      } else {
        next.add(skillName);
      }
      return next;
    });
  };

  const handleApplyStaged = () => {
    if (stagedSelection.size > 0) {
      onAddMultipleSkills(Array.from(stagedSelection));
      setStagedSelection(new Set());
    }
    onClose();
  };

  const handleAddCustomFromSearch = () => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    if (onAddCustomSkill) {
      onAddCustomSkill(trimmed);
    } else {
      onToggleSkill(trimmed);
    }
    setSearchQuery('');
  };

  const isCustomCandidate =
    searchQuery.trim().length > 0 &&
    !filteredSkills.some(s => s.name.toLowerCase() === searchQuery.trim().toLowerCase());

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-2xl w-full flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-sky-50/70 via-indigo-50/50 to-purple-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-600 text-white shadow-xs">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">
                Skills Catalog & Dropdown Selector
              </h3>
              <p className="text-[11px] text-gray-500">
                Adding skills to group: <span className="font-semibold text-sky-700">{categoryName || 'Skills'}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-white rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Tabs */}
        <div className="p-4 border-b border-gray-100 space-y-3 bg-gray-50/60">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search 150+ predefined languages, frameworks, tools, databases, or enter custom skill..."
              className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-800 shadow-2xs placeholder:text-gray-400"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
            <button
              type="button"
              onClick={() => setSelectedTab('all')}
              className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-all ${
                selectedTab === 'all'
                  ? 'bg-sky-600 text-white shadow-2xs'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              All Skills ({SKILLS_CATALOG.reduce((a: number, c: SkillCatalogCategory) => a + c.skills.length, 0)})
            </button>
            {SKILLS_CATALOG.map((cat: SkillCatalogCategory) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedTab(cat.id)}
                className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-all ${
                  selectedTab === cat.id
                    ? 'bg-sky-600 text-white shadow-2xs'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                {cat.name} ({cat.skills.length})
              </button>
            ))}
          </div>
        </div>

        {/* Quick Custom Skill Prompt if search query not in list */}
        {isCustomCandidate && (
          <div className="mx-4 mt-3 p-2.5 bg-sky-50 border border-sky-200 rounded-xl flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-sky-900 truncate">
              <Sparkles className="w-4 h-4 text-sky-600 shrink-0" />
              <span className="truncate">
                Add custom skill: <strong className="font-semibold">"{searchQuery.trim()}"</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={handleAddCustomFromSearch}
              className="px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg shrink-0 flex items-center gap-1 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom</span>
            </button>
          </div>
        )}

        {/* Skills Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredSkills.length === 0 && !isCustomCandidate ? (
            <div className="text-center py-12 text-xs text-gray-500 space-y-2">
              <p>No matching skills found in catalog.</p>
              <p className="text-gray-400">You can type any custom skill name in the search box to add it directly.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {filteredSkills.map(item => {
                const isAlreadyInResume = existingSkillsSet.has(item.name.toLowerCase());
                const isStaged = stagedSelection.has(item.name);
                const isSelected = isAlreadyInResume || isStaged;

                return (
                  <button
                    key={`${item.categoryId}-${item.name}`}
                    type="button"
                    onClick={() => {
                      if (isAlreadyInResume) {
                        onToggleSkill(item.name);
                      } else {
                        handleToggleStaged(item.name);
                      }
                    }}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs border text-left transition-all group ${
                      isAlreadyInResume
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-2xs'
                        : isStaged
                        ? 'bg-sky-50 border-sky-400 text-sky-900 ring-1 ring-sky-400 shadow-2xs'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-sky-300 hover:bg-sky-50/50'
                    }`}
                  >
                    <div className="min-w-0 pr-1">
                      <p className="font-semibold truncate">{item.name}</p>
                      <p className="text-[10px] text-gray-400 truncate group-hover:text-gray-500">
                        {item.category}
                      </p>
                    </div>
                    <div className="shrink-0 ml-1">
                      {isAlreadyInResume ? (
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                          <Check className="w-3 h-3" />
                        </span>
                      ) : isStaged ? (
                        <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px]">
                          <Check className="w-3 h-3" />
                        </span>
                      ) : (
                        <span className="w-5 h-5 rounded-full border border-gray-300 text-gray-400 group-hover:border-sky-500 group-hover:text-sky-600 flex items-center justify-center text-[10px]">
                          <Plus className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {stagedSelection.size > 0 ? (
              <span className="font-semibold text-sky-700">
                {stagedSelection.size} new skill{stagedSelection.size !== 1 ? 's' : ''} ready to add
              </span>
            ) : (
              <span>
                {currentSkills.length} skill{currentSkills.length !== 1 ? 's' : ''} currently in group
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold"
            >
              Done / Close
            </button>
            {stagedSelection.size > 0 && (
              <button
                type="button"
                onClick={handleApplyStaged}
                className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Add Selected ({stagedSelection.size})</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
