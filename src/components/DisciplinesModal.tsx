import React, { useState } from 'react';
import { X, BookOpen, Plus, User, FileText, Trash2, ArrowRight } from 'lucide-react';
import { Discipline, DocumentItem } from '../types';

interface DisciplinesModalProps {
  isOpen: boolean;
  onClose: () => void;
  disciplines: Discipline[];
  onAddDiscipline: (name: string, professor: string, semester: string) => void;
  onDeleteDiscipline: (id: string) => void;
  documents: DocumentItem[];
  onSelectDisciplineFilter: (disciplineId: string) => void;
  currentSemester: string;
}

export const DisciplinesModal: React.FC<DisciplinesModalProps> = ({
  isOpen,
  onClose,
  disciplines,
  onAddDiscipline,
  onDeleteDiscipline,
  documents,
  onSelectDisciplineFilter,
  currentSemester,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [professor, setProfessor] = useState('');
  const [semester, setSemester] = useState(currentSemester || '2026.2');
  const [selectedDisciplineForDetail, setSelectedDisciplineForDetail] = useState<Discipline | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddDiscipline(name.trim(), professor.trim(), semester.trim());
    setName('');
    setProfessor('');
  };

  // Filter documents for the selected discipline if viewing details
  const linkedDocs = selectedDisciplineForDetail
    ? documents.filter((d) => d.disciplineId === selectedDisciplineForDetail.id && !d.isDeleted)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-700 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Mapeamento de Disciplinas & Professores
              </h2>
              <p className="text-xs text-slate-500">
                Cadastre suas matérias e veja todos os arquivos associados a cada uma
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Create New Discipline Form */}
          <form onSubmit={handleSubmit} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-slate-600" />
              Cadastrar Nova Disciplina
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Nome da Disciplina *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Inteligência Artificial"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Nome do(a) Professor(a)
                </label>
                <input
                  type="text"
                  value={professor}
                  onChange={(e) => setProfessor(e.target.value)}
                  placeholder="Ex: Profa. Mariana Costa"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500">Semestre:</span>
                <input
                  type="text"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-24 px-2 py-1 text-xs font-mono bg-white border border-slate-200 rounded-md text-slate-800"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors shadow-2xs"
              >
                Adicionar Disciplina
              </button>
            </div>
          </form>

          {/* List of Disciplines */}
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Disciplinas Cadastradas ({disciplines.length})
            </span>

            {disciplines.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4 bg-slate-50 rounded-xl">
                Nenhuma disciplina cadastrada ainda.
              </p>
            ) : (
              <div className="space-y-2">
                {disciplines.map((disc) => {
                  const docCount = documents.filter(
                    (d) => d.disciplineId === disc.id && !d.isDeleted
                  ).length;

                  return (
                    <div
                      key={disc.id}
                      className="p-3.5 bg-white hover:bg-slate-50/80 border border-slate-200 rounded-xl flex items-center justify-between transition-colors text-xs"
                    >
                      <div className="truncate pr-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 truncate">
                            {disc.name}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded">
                            {disc.semester}
                          </span>
                        </div>
                        {disc.professorName && (
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                            <User className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{disc.professorName}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {/* Filter by this discipline */}
                        <button
                          type="button"
                          onClick={() => {
                            onSelectDisciplineFilter(disc.id);
                            onClose();
                          }}
                          className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                          title="Filtrar documentos desta matéria na tela principal"
                        >
                          <FileText className="w-3 h-3" />
                          <span>{docCount} docs</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>

                        {/* Delete Discipline */}
                        <button
                          type="button"
                          onClick={() => onDeleteDiscipline(disc.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Excluir disciplina"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
