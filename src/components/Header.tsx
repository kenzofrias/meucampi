import React from 'react';
import { GraduationCap, Edit3, BookOpen, Trash2, Plus, Sparkles } from 'lucide-react';
import { UniversityProfile, DocumentItem } from '../types';
import { RemindersPopover } from './RemindersPopover';

interface HeaderProps {
  profile: UniversityProfile;
  trashCount: number;
  documents: DocumentItem[];
  onOpenProfileModal: () => void;
  onOpenDisciplinesModal: () => void;
  onOpenTrashModal: () => void;
  onOpenNewDocumentModal: () => void;
  onOpenDocument: (doc: DocumentItem) => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  trashCount,
  documents,
  onOpenProfileModal,
  onOpenDisciplinesModal,
  onOpenTrashModal,
  onOpenNewDocumentModal,
  onOpenDocument,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand & Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <GraduationCap className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                MeuCampi
                <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                  v1.0
                </span>
              </span>
              <p className="text-[11px] text-slate-500 font-medium truncate max-w-[200px] sm:max-w-xs">
                {profile.universityName || 'Minha Universidade'}
              </p>
            </div>
          </div>

          {/* Realidade Universitária Summary Badge */}
          <div
            onClick={onOpenProfileModal}
            className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 cursor-pointer transition-colors group"
            title="Clique para editar sua realidade universitária"
          >
            <div className="text-left">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                <span className="truncate max-w-[180px]">{profile.courseName}</span>
                <span className="text-slate-300">·</span>
                <span className="font-mono text-indigo-600 font-bold">{profile.activePeriod}</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">
                {profile.currentSemesterOrdinal} · Toque para editar
              </p>
            </div>
            <Edit3 className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-colors" />
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Reminders / Prazos Acadêmicos Popover */}
            <RemindersPopover
              documents={documents}
              onOpenDocument={onOpenDocument}
            />

            {/* Disciplines Management button */}
            <button
              onClick={onOpenDisciplinesModal}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
              title="Gerenciar Disciplinas e Professores"
            >
              <BookOpen className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Disciplinas</span>
            </button>

            {/* Trash button */}
            <button
              onClick={onOpenTrashModal}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
              title="Ver Lixeira (retenção de 30 dias)"
            >
              <Trash2 className="w-4 h-4" />
              {trashCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-mono text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {trashCount}
                </span>
              )}
            </button>

            {/* Profile on mobile */}
            <button
              onClick={onOpenProfileModal}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
              title="Perfil Universitário"
            >
              <GraduationCap className="w-4 h-4" />
            </button>

            {/* Primary Action Button */}
            <button
              onClick={onOpenNewDocumentModal}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs hover:shadow-sm active:scale-[0.99] transition-all"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Novo Documento</span>
              <span className="sm:hidden">Upload</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
