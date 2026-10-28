import React from 'react';
import { Search, X, Filter, Tag, BookOpen } from 'lucide-react';
import { AcademicScope, ACADEMIC_SCOPES } from '../types';

interface SearchAndChipsProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedScope: AcademicScope | 'all';
  onSelectScope: (scope: AcademicScope | 'all') => void;
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
  allAvailableTags: string[];
  totalResults: number;
  onClearAllFilters: () => void;
  selectedDisciplineId: string | null;
  onSelectDisciplineId: (id: string | null) => void;
  disciplinesList: Array<{ id: string; name: string }>;
}

export const SearchAndChips: React.FC<SearchAndChipsProps> = ({
  searchQuery,
  onSearchChange,
  selectedScope,
  onSelectScope,
  selectedTag,
  onSelectTag,
  allAvailableTags,
  totalResults,
  onClearAllFilters,
  selectedDisciplineId,
  onSelectDisciplineId,
  disciplinesList,
}) => {
  const isAnyFilterActive =
    searchQuery.trim() !== '' ||
    selectedScope !== 'all' ||
    selectedTag !== null ||
    selectedDisciplineId !== null;

  return (
    <div className="space-y-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
      
      {/* Top Row: Global Search Input & Discipline Selector */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por título, professor, disciplina, tag ou código de autenticação..."
            className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm bg-slate-50 hover:bg-slate-100/60 focus:bg-white text-slate-900 placeholder-slate-400 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter by Discipline Dropdown */}
        {disciplinesList.length > 0 && (
          <div className="sm:w-64 shrink-0">
            <select
              value={selectedDisciplineId || ''}
              onChange={(e) => onSelectDisciplineId(e.target.value || null)}
              className="w-full py-2 px-3 text-xs bg-slate-50 hover:bg-slate-100/60 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="">Todas as Disciplinas</option>
              {disciplinesList.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Scope Chips Filter Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
          <Filter className="w-3 h-3" />
          Âmbitos:
        </span>

        {/* All Scopes Chip */}
        <button
          onClick={() => onSelectScope('all')}
          className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all shrink-0 border ${
            selectedScope === 'all'
              ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          Todos os Âmbitos
        </button>

        {/* Scope-specific colored chips */}
        {(Object.keys(ACADEMIC_SCOPES) as AcademicScope[]).map((scopeKey) => {
          const scope = ACADEMIC_SCOPES[scopeKey];
          const isSelected = selectedScope === scopeKey;

          return (
            <button
              key={scopeKey}
              onClick={() => onSelectScope(scopeKey)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all shrink-0 border flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                  : `${scope.badgeBg} ${scope.badgeText} ${scope.badgeBorder} hover:brightness-95`
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isSelected ? 'bg-white' : scope.iconBg
                }`}
              />
              <span>{scope.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tag Chips and Clear Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
        {/* Available Tags list */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          <span className="text-[11px] text-slate-400 font-medium shrink-0 flex items-center gap-1">
            <Tag className="w-3 h-3" />
            Tags:
          </span>
          {allAvailableTags.slice(0, 8).map((tag) => {
            const isSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => onSelectTag(isSelected ? null : tag)}
                className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors shrink-0 ${
                  isSelected
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>

        {/* Active Filters Clear and Counter */}
        <div className="flex items-center gap-3 shrink-0 ml-auto">
          <span className="text-[11px] font-mono text-slate-500 tabular-nums">
            {totalResults} {totalResults === 1 ? 'documento' : 'documentos'}
          </span>

          {isAnyFilterActive && (
            <button
              onClick={onClearAllFilters}
              className="text-[11px] font-semibold text-rose-600 hover:text-rose-800 hover:underline flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Limpar Filtros
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
