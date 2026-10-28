import React from 'react';
import {
  X,
  Award,
  CheckCircle2,
  BookOpen,
  FileText,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { StudentProfile, AcademicDocument } from '../types/document';

interface HoursTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
  documents: AcademicDocument[];
  onPreviewDocument: (doc: AcademicDocument) => void;
}

export const HoursTrackerModal: React.FC<HoursTrackerModalProps> = ({
  isOpen,
  onClose,
  student,
  documents,
  onPreviewDocument,
}) => {
  if (!isOpen) return null;

  const earned = student.complementaryHoursEarned;
  const total = student.complementaryHoursRequired;
  const percent = Math.min(100, Math.round((earned / total) * 100));
  const remaining = Math.max(0, total - earned);

  // Filter certificates
  const certificateDocs = documents.filter((d) => d.complementaryHours && d.complementaryHours > 0);

  const categories = [
    {
      name: 'Grupo I: Cursos e Capacitação',
      limit: 'Até 80h permitidas',
      current: 40,
      description: 'Cursos livres, bootcamps de programação, idiomas e certificações.',
    },
    {
      name: 'Grupo II: Congressos e Simpósios',
      limit: 'Até 60h permitidas',
      current: 30,
      description: 'Participação e apresentação de artigos em eventos acadêmicos.',
    },
    {
      name: 'Grupo III: Monitoria e Iniciação Científica',
      limit: 'Até 100h permitidas',
      current: 75,
      description: 'Atuação como monitor bolsista ou voluntário em laboratórios.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-amber-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Gestão de Horas Complementares
              </h2>
              <p className="text-xs text-slate-600">
                Acompanhamento de Atividades Acadêmico-Científico-Culturais (AACC).
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
          
          {/* Main Counter Card */}
          <div className="p-5 bg-slate-900 text-white rounded-xl">
            <div className="flex items-end justify-between mb-3">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                  Progresso para Colação de Grau
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold font-mono tabular-nums text-white">
                    {earned}h
                  </span>
                  <span className="text-sm font-mono text-slate-400">
                    / {total}h exigidas
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-semibold text-amber-400 font-mono">
                  {percent}% Concluído
                </span>
                <p className="text-[11px] text-slate-400">
                  Faltam apenas {remaining}h
                </p>
              </div>
            </div>

            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          {/* Categories Breakdown */}
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-3">
              Distribuição por Grupos Normativos
            </span>

            <div className="grid grid-cols-1 gap-2.5">
              {categories.map((cat, i) => (
                <div
                  key={i}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs"
                >
                  <div>
                    <h4 className="font-semibold text-slate-900">{cat.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{cat.description}</p>
                    <span className="text-[10px] text-slate-400 font-mono">{cat.limit}</span>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <span className="font-mono font-bold text-sm text-slate-900 tabular-nums">
                      {cat.current}h
                    </span>
                    <span className="text-[10px] text-emerald-600 block font-medium">Validado</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Attached Certificates List */}
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Certificados e Comprovantes Vinculados ({certificateDocs.length})
            </span>

            <div className="space-y-2">
              {certificateDocs.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => onPreviewDocument(doc)}
                  className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between cursor-pointer transition-colors text-xs"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div className="truncate">
                      <p className="font-semibold text-slate-900 truncate">{doc.title}</p>
                      <p className="text-[11px] text-slate-500 font-mono">
                        {doc.semester} · {doc.verificationCode || 'Validado'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className="font-mono font-bold text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      +{doc.complementaryHours}h
                    </span>
                    <span className="text-slate-400 hover:text-slate-700">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
