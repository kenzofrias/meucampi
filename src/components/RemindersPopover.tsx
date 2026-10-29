import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  Clock,
  AlertTriangle,
  AlertCircle,
  Calendar,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { DocumentItem } from '../types';
import { getDeadlineInfo, DeadlineInfo } from '../utils/deadlines';

interface RemindersPopoverProps {
  documents: DocumentItem[];
  onOpenDocument: (doc: DocumentItem) => void;
}

export const RemindersPopover: React.FC<RemindersPopoverProps> = ({
  documents,
  onOpenDocument,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Extract all non-deleted documents that have a dueDate
  const itemsWithDeadlines = React.useMemo(() => {
    return documents
      .filter((d) => !d.isDeleted && Boolean(d.dueDate))
      .map((doc) => ({
        doc,
        info: getDeadlineInfo(doc.dueDate, doc.dueDateType) as DeadlineInfo,
      }))
      .filter((item) => item.info !== null)
      .sort((a, b) => a.info.daysRemaining - b.info.daysRemaining);
  }, [documents]);

  // Urgent count (expired, today, or <= 3 days)
  const urgentCount = itemsWithDeadlines.filter((item) => item.info.isUrgent).length;
  const totalCount = itemsWithDeadlines.length;

  return (
    <div className="relative" ref={containerRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-lg border transition-all ${
          isOpen
            ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
            : urgentCount > 0
            ? 'bg-amber-50/70 border-amber-200 text-amber-800 hover:bg-amber-100'
            : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        }`}
        title="Lembretes & Prazos Acadêmicos"
      >
        <Bell className="w-4 h-4" />
        
        {totalCount > 0 && (
          <span
            className={`absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full text-white font-mono text-[10px] font-bold flex items-center justify-center shadow-xs ${
              urgentCount > 0 ? 'bg-rose-500 animate-pulse' : 'bg-indigo-600'
            }`}
          >
            {urgentCount > 0 ? urgentCount : totalCount}
          </span>
        )}
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Prazos & Lembretes
                </h4>
                <p className="text-[10px] text-slate-500 font-medium">
                  {urgentCount > 0
                    ? `⚠️ ${urgentCount} prazo(s) com atenção necessária`
                    : `${totalCount} compromisso(s) acadêmico(s)`}
                </p>
              </div>
            </div>
            {totalCount > 0 && (
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                {totalCount} total
              </span>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 p-1">
            {itemsWithDeadlines.length === 0 ? (
              <div className="text-center py-8 px-4 text-slate-500 space-y-1.5">
                <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold text-slate-700">Sem prazos pendentes</p>
                <p className="text-[11px] text-slate-400">
                  Adicione prazos ao cadastrar atividades ou comprovantes para receber lembretes visuais aqui.
                </p>
              </div>
            ) : (
              itemsWithDeadlines.map(({ doc, info }) => (
                <div
                  key={doc.id}
                  onClick={() => {
                    onOpenDocument(doc);
                    setIsOpen(false);
                  }}
                  className="p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer flex items-start justify-between gap-3 group"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${info.badgeBg} ${info.badgeText} ${info.badgeBorder}`}
                      >
                        {info.status === 'expired' ? (
                          <AlertCircle className="w-3 h-3 text-rose-600" />
                        ) : info.status === 'today' ? (
                          <AlertTriangle className="w-3 h-3 text-red-600" />
                        ) : info.status === 'urgent' ? (
                          <Clock className="w-3 h-3 text-amber-600" />
                        ) : (
                          <Calendar className="w-3 h-3 text-slate-500" />
                        )}
                        <span>{info.badgeLabel}</span>
                      </span>

                      {doc.disciplineName && (
                        <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
                          {doc.disciplineName}
                        </span>
                      )}
                    </div>

                    <h5 className="text-xs font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {doc.title}
                    </h5>

                    <p className="text-[10px] text-slate-500 font-mono">
                      Data limite: {info.dateFormatted}
                    </p>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors shrink-0 mt-2" />
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-slate-50/80 border-t border-slate-100 text-center">
            <span className="text-[10px] text-slate-400 font-medium">
              💡 As notificações são sincronizadas localmente no seu MeuCampi
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

