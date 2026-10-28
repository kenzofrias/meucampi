import React from 'react';
import {
  Folder,
  FileText,
  BookOpen,
  Briefcase,
  CreditCard,
  Star,
  Award,
  Layers,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { DocumentCategory, StudentProfile } from '../types/document';

interface SidebarProps {
  selectedCategory: DocumentCategory | 'all' | 'starred';
  onSelectCategory: (cat: DocumentCategory | 'all' | 'starred') => void;
  selectedSemester: string;
  onSelectSemester: (sem: string) => void;
  semesters: string[];
  counts: Record<string, number>;
  student: StudentProfile;
  onOpenHoursTracker: () => void;
  onOpenDossier: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedSemester,
  onSelectSemester,
  semesters,
  counts,
  student,
  onOpenHoursTracker,
  onOpenDossier,
}) => {
  const categoryItems: Array<{
    id: DocumentCategory | 'all' | 'starred';
    label: string;
    icon: React.ReactNode;
    countKey: string;
  }> = [
    {
      id: 'all',
      label: 'Todos os Documentos',
      icon: <Folder className="w-4 h-4" />,
      countKey: 'all',
    },
    {
      id: 'secretaria',
      label: 'Secretaria & Matrícula',
      icon: <FileText className="w-4 h-4" />,
      countKey: 'secretaria',
    },
    {
      id: 'aulas',
      label: 'Aulas & Materiais de Estudo',
      icon: <BookOpen className="w-4 h-4" />,
      countKey: 'aulas',
    },
    {
      id: 'estagio_horas',
      label: 'Estágio & Certificados',
      icon: <Briefcase className="w-4 h-4" />,
      countKey: 'estagio_horas',
    },
    {
      id: 'financeiro',
      label: 'Financeiro & Bolsas',
      icon: <CreditCard className="w-4 h-4" />,
      countKey: 'financeiro',
    },
    {
      id: 'starred',
      label: 'Fixados & Favoritos',
      icon: <Star className="w-4 h-4" />,
      countKey: 'starred',
    },
  ];

  const hoursPercent = Math.min(
    100,
    Math.round((student.complementaryHoursEarned / student.complementaryHoursRequired) * 100)
  );

  return (
    <aside className="w-64 md:w-72 shrink-0 bg-white border-r border-slate-200 flex flex-col justify-between h-[calc(100vh-61px)] sticky top-[61px] overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Categories Section */}
        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2 block">
            Categorias Acadêmicas
          </span>
          <nav className="space-y-1">
            {categoryItems.map((item) => {
              const active = selectedCategory === item.id;
              const count = counts[item.countKey] || 0;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectCategory(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left ${
                    active
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className={active ? 'text-white' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>
                  <span
                    className={`font-mono text-[11px] tabular-nums px-1.5 py-0.5 rounded ${
                      active ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Semesters Filter */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Semestre Letivo
            </span>
            <span className="text-[11px] text-slate-400 font-mono">Filtro</span>
          </div>
          <div className="space-y-1">
            {semesters.map((sem) => {
              const active = selectedSemester === sem;
              return (
                <button
                  key={sem}
                  onClick={() => onSelectSemester(sem)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 text-xs font-medium rounded-md transition-colors text-left ${
                    active
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span>{sem === 'all' ? 'Todos os Semestres' : sem}</span>
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-slate-900"></span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Callout: Dossiê Universitário */}
        <div className="p-3 bg-gradient-to-br from-indigo-50/70 to-blue-50/50 rounded-xl border border-indigo-100">
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-4 h-4 text-indigo-600" />
            <h4 className="text-xs font-bold text-indigo-950">Gerador de Dossiê</h4>
          </div>
          <p className="text-[11px] text-indigo-900/80 leading-relaxed mb-2.5">
            Junte histórico, matrícula e TCE em um pacote oficial para estágio ou rematrícula com 1 clique.
          </p>
          <button
            onClick={onOpenDossier}
            className="w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-semibold rounded-md transition-colors shadow-2xs"
          >
            <Sparkles className="w-3 h-3" />
            <span>Montar Pacote</span>
          </button>
        </div>
      </div>

      {/* Student Profile & Hours Badge */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/60 space-y-3">
        {/* Progress in Complementary Hours */}
        <div
          onClick={onOpenHoursTracker}
          className="cursor-pointer group p-2.5 bg-white hover:bg-slate-50 rounded-lg border border-slate-200 transition-all hover:border-slate-300 shadow-2xs"
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs font-semibold text-slate-700">Horas Complementares</span>
            </div>
            <span className="text-[11px] font-mono tabular-nums text-slate-500 group-hover:text-slate-900">
              {student.complementaryHoursEarned}/{student.complementaryHoursRequired}h
            </span>
          </div>

          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${hoursPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500">
            <span>{hoursPercent}% concluído</span>
            <span className="flex items-center gap-0.5 text-emerald-700 font-medium group-hover:underline">
              Detalhes <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Student Identity Card */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
            KF
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-900 truncate">{student.name}</p>
            <p className="text-[11px] text-slate-500 font-mono truncate">RA: {student.registrationNumber}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
