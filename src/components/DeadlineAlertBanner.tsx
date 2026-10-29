import React, { useState } from 'react';
import { AlertTriangle, Clock, X, ArrowRight } from 'lucide-react';
import { DocumentItem } from '../types';
import { getDeadlineInfo } from '../utils/deadlines';

interface DeadlineAlertBannerProps {
  documents: DocumentItem[];
  onOpenDocument: (doc: DocumentItem) => void;
  onFilterDeadlines: () => void;
}

export const DeadlineAlertBanner: React.FC<DeadlineAlertBannerProps> = ({
  documents,
  onOpenDocument,
  onFilterDeadlines,
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  // Find urgent documents (expired or <= 3 days)
  const urgentDocs = React.useMemo(() => {
    return documents
      .filter((d) => !d.isDeleted && Boolean(d.dueDate))
      .map((d) => ({
        doc: d,
        info: getDeadlineInfo(d.dueDate, d.dueDateType),
      }))
      .filter((item) => item.info && item.info.isUrgent)
      .map((item) => item!);
  }, [documents]);

  if (isDismissed || urgentDocs.length === 0) {
    return null;
  }

  const primaryDoc = urgentDocs[0];

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-amber-500/10 via-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-4 sm:p-4.5 text-slate-800 shadow-2xs animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-start sm:items-center justify-between gap-3">
        
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <AlertTriangle className="w-5 h-5" />
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                Lembrete de Prazo Crítico
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-200/60 text-amber-900 border border-amber-300">
                {urgentDocs.length === 1 ? '1 pendência' : `${urgentDocs.length} pendências urgentes`}
              </span>
            </div>

            <p className="text-xs text-slate-700">
              <strong className="font-semibold text-slate-900">{primaryDoc.doc.title}</strong>{' '}
              —{' '}
              <span className="font-semibold text-amber-800">
                {primaryDoc.info?.detailLabel}
              </span>
              {urgentDocs.length > 1 && ` e mais ${urgentDocs.length - 1} prazo(s) próximo(s).`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onOpenDocument(primaryDoc.doc)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
          >
            <span>Ver Documento</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onFilterDeadlines}
            className="text-xs font-semibold text-amber-900 hover:text-amber-950 px-2.5 py-1.5 rounded-lg hover:bg-amber-200/40 transition-colors"
          >
            Filtrar Prazos
          </button>

          <button
            onClick={() => setIsDismissed(true)}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
            title="Dispensar aviso"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

