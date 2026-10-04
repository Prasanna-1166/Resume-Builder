import React, { useState, useRef } from 'react';
import { useResume } from '../../context/ResumeContext';
import {
  SkillCategory,
  SKILL_CATEGORIES_PRESETS,
  getRecommendedSkillsForCategory,
  filterSkillsCatalog,
  FlatSkillItem
} from '@ai-resume/core';
import {
  Plus,
  Trash2,
  Wrench,
  Sparkles,
  X,
  ChevronDown,
  ChevronUp,
  Layers,
  BookOpen,
  Check,
  ListPlus
} from 'lucide-react';
import { SkillDropdownPicker } from './SkillDropdownPicker';

interface SkillsEditorProps {
  onOpenSkillSuggestions?: () => void;
}

export const SkillsEditor: React.FC<SkillsEditorProps> = ({ onOpenSkillSuggestions }) => {
  const { resumeData, updateResumeData } = useResume();
  const skills = resumeData.skills || [];

  // State for custom skill text input per category index
  const [customInputValues, setCustomInputValues] = useState<{ [key: number]: string }>({});
  // State for active category dropdown picker modal
  const [activePickerCatIndex, setActivePickerCatIndex] = useState<number | null>(null);
  // State for category preset menu open
  const [presetDropdownOpenIndex, setPresetDropdownOpenIndex] = useState<number | null>(null);
  // State for quick preset adder menu
  const [quickAddMenuOpen, setQuickAddMenuOpen] = useState(false);

  const handleAddCategory = (initialCategoryName: string = 'Languages & Tools') => {
    const newCat: SkillCategory = {
      id: `sk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      category: initialCategoryName,
      items: []
    };
    updateResumeData(prev => ({
      ...prev,
      skills: [...prev.skills, newCat]
    }));
  };

  const handleAddStandardPresetGroups = () => {
    const presetsToAdd = ['Languages', 'Frameworks & Libraries', 'Developer Tools & Platforms'];
    const currentCats = skills.map(s => s.category.toLowerCase());
    const newCats: SkillCategory[] = [];

    presetsToAdd.forEach(name => {
      if (!currentCats.some(c => c.includes(name.toLowerCase()) || name.toLowerCase().includes(c))) {
        newCats.push({
          id: `sk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          category: name,
          items: []
        });
      }
    });

    if (newCats.length > 0) {
      updateResumeData(prev => ({
        ...prev,
        skills: [...prev.skills, ...newCats]
      }));
    }
    setQuickAddMenuOpen(false);
  };

  const handleUpdateCategory = (index: number, name: string) => {
    updateResumeData(prev => {
      const next = [...prev.skills];
      next[index] = { ...next[index], category: name };
      return { ...prev, skills: next };
    });
  };

  const handleRemoveCategory = (index: number) => {
    updateResumeData(prev => {
      const next = [...prev.skills];
      next.splice(index, 1);
      return { ...prev, skills: next };
    });
  };

  const handleMoveCategory = (index: number, direction: 'up' | 'down') => {
    updateResumeData(prev => {
      const next = [...prev.skills];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= next.length) return prev;
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;
      return { ...prev, skills: next };
    });
  };

  // Add a single custom skill or comma-separated skills to a category
  const handleAddCustomSkill = (catIndex: number, text?: string) => {
    const rawText = (text !== undefined ? text : customInputValues[catIndex]) || '';
    if (!rawText.trim()) return;

    // Support comma-separated pasting/typing
    const newSkills = rawText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (newSkills.length === 0) return;

    updateResumeData(prev => {
      const next = [...prev.skills];
      const currentItems = next[catIndex].items || [];
      const currentSet = new Set(currentItems.map(i => i.toLowerCase()));

      const uniqueToAdd = newSkills.filter(s => !currentSet.has(s.toLowerCase()));
      next[catIndex] = {
        ...next[catIndex],
        items: [...currentItems, ...uniqueToAdd]
      };
      return { ...prev, skills: next };
    });

    // Clear input
    setCustomInputValues(prev => ({ ...prev, [catIndex]: '' }));
  };

  // Toggle or add multiple skills from catalog
  const handleToggleSkill = (catIndex: number, skillName: string) => {
    const trimmed = skillName.trim();
    if (!trimmed) return;

    updateResumeData(prev => {
      const next = [...prev.skills];
      const currentItems = next[catIndex].items || [];
      const exists = currentItems.some(i => i.toLowerCase() === trimmed.toLowerCase());

      if (exists) {
        next[catIndex] = {
          ...next[catIndex],
          items: currentItems.filter(i => i.toLowerCase() !== trimmed.toLowerCase())
        };
      } else {
        next[catIndex] = {
          ...next[catIndex],
          items: [...currentItems, trimmed]
        };
      }
      return { ...prev, skills: next };
    });
  };

  const handleAddMultipleSkills = (catIndex: number, skillsToAdd: string[]) => {
    if (skillsToAdd.length === 0) return;

    updateResumeData(prev => {
      const next = [...prev.skills];
      const currentItems = next[catIndex].items || [];
      const currentSet = new Set(currentItems.map(i => i.toLowerCase()));

      const uniqueToAdd = skillsToAdd.filter(s => s.trim() && !currentSet.has(s.trim().toLowerCase()));
      next[catIndex] = {
        ...next[catIndex],
        items: [...currentItems, ...uniqueToAdd]
      };
      return { ...prev, skills: next };
    });
  };

  const handleRemoveSkillItem = (catIndex: number, itemIndex: number) => {
    updateResumeData(prev => {
      const next = [...prev.skills];
      const items = [...next[catIndex].items];
      items.splice(itemIndex, 1);
      next[catIndex] = { ...next[catIndex], items };
      return { ...prev, skills: next };
    });
  };

  const totalSkillsCount = skills.reduce((a, b) => a + (b.items?.length || 0), 0);

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-wrap justify-between items-center gap-2 pb-1 border-b border-gray-100">
        <div>
          <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide flex items-center gap-1.5">
            <Wrench className="w-4 h-4 text-sky-600" />
            <span>Skills & Tech Stack</span>
            <span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800">
              {totalSkillsCount} total skill{totalSkillsCount !== 1 ? 's' : ''}
            </span>
          </h3>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Select languages, frameworks & tools from dropdown menus or type your own custom skills.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onOpenSkillSuggestions && (
            <button
              type="button"
              onClick={onOpenSkillSuggestions}
              className="flex items-center gap-1 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 px-2.5 py-1.5 rounded-lg border border-purple-200 transition-colors shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>AI Suggest</span>
            </button>
          )}

          <div className="relative">
            <button
              type="button"
              onClick={() => handleAddCategory('Languages')}
              className="flex items-center gap-1 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-lg border border-sky-200 transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Skill Group</span>
            </button>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setQuickAddMenuOpen(!quickAddMenuOpen)}
              className="p-1.5 text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
              title="Add Preset Groups"
            >
              <ListPlus className="w-3.5 h-3.5" />
            </button>

            {quickAddMenuOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Quick Add Categories
                </div>
                {SKILL_CATEGORIES_PRESETS.map((preset: string) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      handleAddCategory(preset);
                      setQuickAddMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-sky-50 hover:text-sky-700 font-medium flex items-center gap-1.5"
                  >
                    <Plus className="w-3 h-3 text-sky-600" />
                    <span>{preset}</span>
                  </button>
                ))}
                <div className="border-t border-gray-100 mt-1 pt-1">
                  <button
                    type="button"
                    onClick={handleAddStandardPresetGroups}
                    className="w-full text-left px-3 py-1.5 text-xs text-indigo-700 hover:bg-indigo-50 font-semibold flex items-center gap-1.5"
                  >
                    <Layers className="w-3 h-3 text-indigo-600" />
                    <span>Add Standard 3 Groups</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Categories List */}
      {skills.length === 0 ? (
        <div className="text-center py-8 px-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 space-y-3">
          <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-600 mx-auto flex items-center justify-center">
            <Wrench className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-800">No skill categories added yet</p>
            <p className="text-[11px] text-gray-500 max-w-sm mx-auto">
              Organize your technical competencies by group (e.g. Languages, Frameworks, Databases, Tools).
            </p>
          </div>
          <div className="flex justify-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleAddCategory('Languages')}
              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add First Group</span>
            </button>
            <button
              type="button"
              onClick={handleAddStandardPresetGroups}
              className="px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold"
            >
              Add Standard Tech Groups
            </button>
          </div>
        </div>
      ) : (
        skills.map((cat, idx) => {
          const catInputValue = customInputValues[idx] || '';
          const recommendedSuggestions = getRecommendedSkillsForCategory(cat.category, cat.items || []);
          const isPickerOpen = activePickerCatIndex === idx;

          // Autocomplete suggestions for inline typing
          const inlineAutoSuggestions = catInputValue.trim()
            ? filterSkillsCatalog(catInputValue.trim())
                .filter((item: FlatSkillItem) => !cat.items.some(existing => existing.toLowerCase() === item.name.toLowerCase()))
                .slice(0, 5)
            : [];

          return (
            <div
              key={cat.id || idx}
              className="p-4 bg-white rounded-xl border border-gray-200 shadow-2xs space-y-3 relative transition-all hover:border-gray-300"
            >
              {/* Category Header Row */}
              <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
                <div className="flex items-center gap-2 flex-1 relative">
                  {/* Category Name Input */}
                  <input
                    type="text"
                    value={cat.category}
                    onChange={e => handleUpdateCategory(idx, e.target.value)}
                    placeholder="e.g. Languages, Frameworks, Cloud, Databases"
                    className="font-bold text-xs bg-gray-50 hover:bg-white focus:bg-white px-2.5 py-1.5 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-500 w-full max-w-xs transition-colors"
                  />

                  {/* Preset Dropdown Trigger */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setPresetDropdownOpenIndex(presetDropdownOpenIndex === idx ? null : idx)
                      }
                      className="px-2 py-1.5 text-[11px] font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-200 flex items-center gap-1 transition-colors"
                      title="Select standard group name"
                    >
                      <Layers className="w-3 h-3 text-sky-600" />
                      <span className="hidden sm:inline">Presets</span>
                      <ChevronDown className="w-3 h-3" />
                    </button>

                    {presetDropdownOpenIndex === idx && (
                      <div className="absolute left-0 top-full mt-1 w-52 bg-white rounded-xl shadow-xl border border-gray-200 py-1 z-20 animate-in fade-in zoom-in-95 duration-100 max-h-60 overflow-y-auto">
                        <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          Standard Groups
                        </div>
                        {SKILL_CATEGORIES_PRESETS.map((presetName: string) => (
                          <button
                            key={presetName}
                            type="button"
                            onClick={() => {
                              handleUpdateCategory(idx, presetName);
                              setPresetDropdownOpenIndex(null);
                            }}
                            className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between ${
                              cat.category === presetName
                                ? 'bg-sky-50 text-sky-700 font-bold'
                                : 'text-gray-700 hover:bg-gray-100 font-medium'
                            }`}
                          >
                            <span>{presetName}</span>
                            {cat.category === presetName && <Check className="w-3 h-3 text-sky-600" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right controls: skill count badge, move up/down, delete */}
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full mr-1">
                    {cat.items?.length || 0} skills
                  </span>

                  <button
                    type="button"
                    onClick={() => handleMoveCategory(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 rounded hover:bg-gray-100"
                    title="Move Group Up"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveCategory(idx, 'down')}
                    disabled={idx === skills.length - 1}
                    className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 rounded hover:bg-gray-100"
                    title="Move Group Down"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveCategory(idx)}
                    className="p-1 text-gray-400 hover:text-red-500 rounded hover:bg-red-50 transition-colors ml-1"
                    title="Delete Group"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Skill Tag Badges (Active Skills in Group) */}
              <div className="min-h-[38px] p-2 bg-gray-50/70 rounded-xl border border-dashed border-gray-200">
                {(!cat.items || cat.items.length === 0) ? (
                  <p className="text-[11px] text-gray-400 text-center py-1 italic">
                    No skills in this group yet. Type a custom skill below or browse the dropdown menu.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {cat.items.map((skill, si) => (
                      <span
                        key={`${si}-${skill}`}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white text-gray-800 text-xs font-medium border border-gray-200 shadow-2xs hover:border-sky-300 transition-all group"
                      >
                        <span className="font-semibold text-gray-800">{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkillItem(idx, si)}
                          className="text-gray-400 hover:text-red-500 p-0.5 rounded-full hover:bg-gray-100 transition-colors"
                          title={`Remove ${skill}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Interactive Input Row: Custom Skill Input + Dropdown Catalog Trigger */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 relative">
                  {/* Custom Skill Text Input */}
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={catInputValue}
                      onChange={e =>
                        setCustomInputValues(prev => ({ ...prev, [idx]: e.target.value }))
                      }
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomSkill(idx);
                        } else if (e.key === ',') {
                          e.preventDefault();
                          handleAddCustomSkill(idx);
                        }
                      }}
                      placeholder={`Type custom skill (e.g. ${
                        cat.category.toLowerCase().includes('lang')
                          ? 'Python, Go, C++'
                          : cat.category.toLowerCase().includes('frame')
                          ? 'React, Next.js, FastAPI'
                          : 'Docker, AWS, PostgreSQL'
                      }) and press Enter...`}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:outline-none text-gray-900 placeholder:text-gray-400 shadow-2xs"
                    />

                    {/* Autocomplete suggestions dropdown when typing */}
                    {inlineAutoSuggestions.length > 0 && (
                      <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-gray-200 py-1 z-20 animate-in fade-in duration-75">
                        <div className="px-2.5 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          Catalog Suggestions
                        </div>
                        {inlineAutoSuggestions.map((item: FlatSkillItem) => (
                          <button
                            key={item.name}
                            type="button"
                            onClick={() => {
                              handleAddCustomSkill(idx, item.name);
                            }}
                            className="w-full text-left px-3 py-1.5 text-xs hover:bg-sky-50 flex items-center justify-between text-gray-800"
                          >
                            <span className="font-semibold">{item.name}</span>
                            <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                              {item.category}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Add Custom Skill Button */}
                  <button
                    type="button"
                    onClick={() => handleAddCustomSkill(idx)}
                    disabled={!catInputValue.trim()}
                    className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-40 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-2xs transition-colors shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>

                  {/* Dropdown Menu / Browse Catalog Button */}
                  <button
                    type="button"
                    onClick={() => setActivePickerCatIndex(idx)}
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors shrink-0"
                    title="Open searchable skills catalog with predefined languages & frameworks"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Select from Dropdown</span>
                  </button>
                </div>

                {/* Quick 1-Click Suggestions Bar */}
                {recommendedSuggestions.length > 0 && (
                  <div className="pt-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10.5px] font-semibold text-gray-500 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>Quick Add:</span>
                      </span>
                      {recommendedSuggestions.slice(0, 8).map((suggestedSkill: string) => (
                        <button
                          key={suggestedSkill}
                          type="button"
                          onClick={() => handleToggleSkill(idx, suggestedSkill)}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 hover:bg-sky-100 text-gray-700 hover:text-sky-800 text-[11px] font-medium border border-gray-200 hover:border-sky-300 transition-all shadow-2xs"
                        >
                          <Plus className="w-2.5 h-2.5 text-gray-400 group-hover:text-sky-600" />
                          <span>{suggestedSkill}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Dropdown Modal for this category */}
              {isPickerOpen && (
                <SkillDropdownPicker
                  isOpen={isPickerOpen}
                  onClose={() => setActivePickerCatIndex(null)}
                  categoryName={cat.category}
                  currentSkills={cat.items || []}
                  onToggleSkill={skill => handleToggleSkill(idx, skill)}
                  onAddMultipleSkills={skillsToAdd => handleAddMultipleSkills(idx, skillsToAdd)}
                  onAddCustomSkill={customSkill => handleAddCustomSkill(idx, customSkill)}
                />
              )}
            </div>
          );
        })
      )}
    </div>
  );
};
