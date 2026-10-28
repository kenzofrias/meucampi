import React from 'react';
import {
  FileText,
  BookOpen,
  Briefcase,
  CreditCard,
  Star,
  Eye,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import { AcademicDocument } from '../types/document';

interface DocumentTableViewProps {
  documents: AcademicDocument[];
  selectedDocIds: string[];
  onToggleSelectDoc: (id: string) => void;
  onSelectAll: () => void;
  onPreview: (doc: AcademicDocument) => void;
  onToggleStar: (id: string, e: React.MouseEvent) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

export const DocumentTableView: React.FC<DocumentTableViewProps> = ({
  documents,
  selectedDocIds,
  onToggleSelectDoc,
  onSelectAll,
  onPreview,
  onToggleStar,
  onDelete,
}) => {
  const allSelected = documents.length > 0 && selectedDocIds.length === documents.length;

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'secretaria':
        return 'Secretaria';
      case 'aulas':
        return 'Aulas/Materiais';
      case 'estagio_horas':
        return 'Estágio & Horas';
      case 'financeiro':
        return 'Financeiro';
      default:
        return 'Geral';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-medium">
              <th className="py-3 px-4 w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onSelectAll}
                  className="rounded border-slate-300 text-slate-900 focus:ring-slate-900/10 cursor-pointer"
                  title="Selecionar todos"
                />
              </th>
              <th className="py-3 px-2 w-8"></th>
              <th className="py-3 px-3">Documento & Descrição</th>
              <th className="py-3 px-3">Categoria</th>
              <th className="py-3 px-3">Semestre</th>
              <th className="py-3 px-3">Horas / Vínculo</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3 text-right">Tamanho</th>
              <th className="py-3 px-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {documents.map((doc) => {
              const isSelected = selectedDocIds.includes(doc.id);
              return (
                <tr
                  key={doc.id}
                  onClick={() => onPreview(doc)}
                  className={`group hover:bg-slate-50/80 cursor-pointer transition-colors ${
                    isSelected ? 'bg-indigo-50/40' : ''
                  }`}
                >
                  <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelectDoc(doc.id)}
                      className="rounded border-slate-300 text-slate-900 focus:ring-slate-900/10 cursor-pointer"
                    />
                  </td>

                  <td className="py-3 px-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => onToggleStar(doc.id, e)}
                      className="text-slate-300 hover:text-amber-500 transition-colors"
                      title={doc.starred ? 'Desfavoritar' : 'Favoritar'}
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          doc.starred ? 'fill-amber-400 text-amber-500' : ''
                        }`}
                      />
                    </button>
                  </td>

                  <td className="py-3 px-3 max-w-xs md:max-w-md">
                    <div className="font-semibold text-slate-900 group-hover:text-indigo-600 truncate">
                      {doc.title}
                    </div>
                    {doc.discipline ? (
                      <div className="text-[11px] text-slate-500 truncate">
                        {doc.discipline} {doc.professor && `· ${doc.professor}`}
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-400 truncate">
                        {doc.description || 'Documento oficial'}
                      </div>
                    )}
                  </td>

                  <td className="py-3 px-3 whitespace-nowrap text-slate-600">
                    {getCategoryLabel(doc.category)}
                  </td>

                  <td className="py-3 px-3 whitespace-nowrap font-mono text-[11px] text-slate-500">
                    {doc.semester}
                  </td>

                  <td className="py-3 px-3 whitespace-nowrap">
                    {doc.complementaryHours ? (
                      <span className="font-semibold text-emerald-700 tabular-nums">
                        +{doc.complementaryHours} horas
                      </span>
                    ) : doc.verificationCode ? (
                      <span className="font-mono text-[11px] text-slate-400 truncate max-w-[120px] block">
                        {doc.verificationCode}
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>

                  <td className="py-3 px-3 whitespace-nowrap">
                    {doc.status === 'valido' && (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-medium text-[11px]">
                        <CheckCircle2 className="w-3 h-3" /> Válido
                      </span>
                    )}
                    {doc.status === 'expirado' && (
                      <span className="inline-flex items-center gap-1 text-rose-600 font-medium text-[11px]">
                        <AlertTriangle className="w-3 h-3" /> Expirado
                      </span>
                    )}
                    {doc.status === 'pendente_validacao' && (
                      <span className="inline-flex items-center gap-1 text-amber-600 font-medium text-[11px]">
                        <Clock className="w-3 h-3" /> Pendente
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-3 text-right font-mono text-[11px] text-slate-500 tabular-nums whitespace-nowrap">
                    {doc.fileSize}
                  </td>

                  <td className="py-3 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onPreview(doc)}
                        className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 rounded transition-colors"
                        title="Visualizar"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => onDelete(doc.id, e)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
