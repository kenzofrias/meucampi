import React from 'react';
import {
  FileText,
  Eye,
  Edit2,
  Trash2,
  Calendar,
  BookOpen,
  User,
  ShieldCheck,
  Tag,
  Clock,
  AlertCircle,
  AlertTriangle,
} from 'lucide-react';
import { DocumentItem, ACADEMIC_SCOPES } from '../types';
import { getDeadlineInfo } from '../utils/deadlines';

interface DocumentCardProps {
  document: DocumentItem;
  onPreview: (doc: DocumentItem) => void;
  onEdit: (doc: DocumentItem) => void;
  onDelete: (id: string) => void;
  onTagClick?: (tag: string) => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onPreview,
  onEdit,
  onDelete,
  onTagClick,
}) => {
  const scopeConfig = ACADEMIC_SCOPES[document.scope] || ACADEMIC_SCOPES.secretaria;
  const deadlineInfo = getDeadlineInfo(document.dueDate, document.dueDateType);

  return (
    <div className="group relative flex flex-col justify-between p-5 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200">
      
      <div>
        {/* Top Badges Row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          {/* Scope Badge with dedicated color scheme */}
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${scopeConfig.badgeBg} ${scopeConfig.badgeText} ${scopeConfig.badgeBorder}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${scopeConfig.iconBg}`} />
            {scopeConfig.label}
          </span>

          {/* Semester and File Size */}
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
            <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-medium">
              {document.semester}
            </span>
            <span className="tabular-nums">{document.fileSize}</span>
          </div>
        </div>

        {/* Title */}
        <h3
          onClick={() => onPreview(document)}
          className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug cursor-pointer"
        >
          {document.title}
        </h3>

        {/* Indicador Visual do Prazo & Lembrete Acadêmico */}
        {deadlineInfo && (
          <div
            className={`mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${deadlineInfo.badgeBg} ${deadlineInfo.badgeText} ${deadlineInfo.badgeBorder}`}
            title={deadlineInfo.detailLabel}
          >
            {deadlineInfo.status === 'expired' ? (
              <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            ) : deadlineInfo.status === 'today' ? (
              <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
            ) : deadlineInfo.status === 'urgent' ? (
              <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            ) : (
              <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            )}
            <span>{deadlineInfo.badgeLabel}</span>
            <span className="text-[10px] opacity-75 font-mono">({deadlineInfo.dateFormatted})</span>
          </div>
        )}

        {/* Discipline and Professor Context */}
        {(document.disciplineName || document.professorName) && (
          <div className="mt-2 text-xs text-slate-600 space-y-0.5">
            {document.disciplineName && (
              <div className="flex items-center gap-1.5 truncate">
                <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate font-medium">{document.disciplineName}</span>
              </div>
            )}
            {document.professorName && (
              <div className="flex items-center gap-1.5 text-slate-500 truncate text-[11px]">
                <User className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate">{document.professorName}</span>
              </div>
            )}
          </div>
        )}

        {/* Description */}
        {document.description && (
          <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {document.description}
          </p>
        )}

        {/* Verification Code pill if exists */}
        {document.verificationCode && (
          <div className="mt-2.5 flex items-center gap-1 text-[10px] font-mono text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="truncate">{document.verificationCode}</span>
          </div>
        )}

        {/* Tags */}
        {document.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {document.tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onTagClick?.(tag);
                }}
                className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 text-[10px] font-medium transition-colors"
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer: Metadata and Action Buttons */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-[11px] text-slate-400 font-mono">
          {new Date(document.createdAt).toLocaleDateString('pt-BR')}
        </span>

        <div className="flex items-center gap-1">
          {/* Preview button */}
          <button
            onClick={() => onPreview(document)}
            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            title="Visualizar documento e detalhes"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Edit button */}
          <button
            onClick={() => onEdit(document)}
            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Editar metadados ou substituir arquivo"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          {/* Delete to Trash button */}
          <button
            onClick={() => onDelete(document.id)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Mover para lixeira (30 dias para restauração)"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
