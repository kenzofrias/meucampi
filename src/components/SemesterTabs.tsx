import React from 'react';
import { Calendar, Layers } from 'lucide-react';

interface SemesterTabsProps {
  semesters: string[];
  activeSemester: string;
  onSelectSemester: (semester: string) => void;
  semesterCounts: Record<string, number>;
  activePeriod: string;
}

export const SemesterTabs: React.FC<SemesterTabsProps> = ({
  semesters,
  activeSemester,
  onSelectSemester,
  semesterCounts,
  activePeriod,
}) => {
  return (
    <div className="w-full bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 overflow-x-auto py-2.5 scrollbar-none">
          
          {/* Label icon */}
          <div className="flex items-center gap-1.5 pr-3 text-xs font-semibold text-slate-400 uppercase tracking-wider shrink-0 border-r border-slate-200 my-1">
            <Calendar className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Períodos:</span>
          </div>

          {/* All Tab */}
          <button
            onClick={() => onSelectSemester('all')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all shrink-0 ${
              activeSemester === 'all'
                ? 'bg-slate-900 text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>Todos os Semestres</span>
            <span
              className={`text-[11px] font-mono tabular-nums px-1.5 py-0.2 rounded ${
                activeSemester === 'all'
                  ? 'bg-slate-800 text-slate-200'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {semesterCounts['all'] || 0}
            </span>
          </button>

          {/* Individual Semesters */}
          {semesters.map((sem) => {
            const isActive = activeSemester === sem;
            const isCurrent = sem === activePeriod;
            const count = semesterCounts[sem] || 0;

            return (
              <button
                key={sem}
                onClick={() => onSelectSemester(sem)}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs rounded-lg whitespace-nowrap transition-all shrink-0 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
                }`}
              >
                <div className="flex items-center gap-1">
                  <span>{sem}</span>
                  {isCurrent && (
                    <span
                      className={`text-[9px] uppercase px-1 py-0.2 rounded font-mono font-bold ${
                        isActive
                          ? 'bg-indigo-500 text-white'
                          : 'bg-indigo-100 text-indigo-700'
                      }`}
                    >
                      Atual
                    </span>
                  )}
                </div>
                <span
                  className={`text-[11px] font-mono tabular-nums px-1.5 py-0.2 rounded ${
                    isActive
                      ? 'bg-slate-800 text-slate-200'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
