import React from 'react';
import { X, Trash2, RotateCcw, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';
import { DocumentItem } from '../types';
import { storageService } from '../services/storageService';

interface TrashModalProps {
  isOpen: boolean;
  onClose: () => void;
  trashDocuments: DocumentItem[];
  onRestore: (id: string) => void;
  onPermanentDelete: (id: string) => void;
  onEmptyTrash: () => void;
}

export const TrashModal: React.FC<TrashModalProps> = ({
  isOpen,
  onClose,
  trashDocuments,
  onRestore,
  onPermanentDelete,
  onEmptyTrash,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-rose-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-xs">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Lixeira do MeuCampi
              </h2>
              <p className="text-xs text-slate-600">
                Arquivos removidos ficam retidos por 30 dias antes da exclusão permanente
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

        <div className="p-6 space-y-4">
          
          {/* Top Bar with count and empty button */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 font-mono">
              {trashDocuments.length} {trashDocuments.length === 1 ? 'item na lixeira' : 'itens na lixeira'}
            </span>

            {trashDocuments.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Tem certeza que deseja esvaziar a lixeira e purgar todos os documentos permanentemente?')) {
                    onEmptyTrash();
                  }
                }}
                className="text-xs font-semibold text-rose-600 hover:text-rose-800 transition-colors"
              >
                Esvaziar Lixeira Agora
              </button>
            )}
          </div>

          {/* List of Trash Items */}
          {trashDocuments.length === 0 ? (
            <div className="text-center py-12 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-800">Sua lixeira está vazia</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Nenhum documento excluído recentemente.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
              {trashDocuments.map((doc) => {
                const remainingDays = storageService.getRemainingDaysInTrash(doc.deletedAt);

                return (
                  <div
                    key={doc.id}
                    className="p-3.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs hover:border-slate-300 transition-colors"
                  >
                    <div className="truncate pr-3">
                      <h4 className="font-semibold text-slate-900 truncate">
                        {doc.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span className="font-mono">{doc.semester}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1 text-rose-700 font-medium">
                          <Clock className="w-3 h-3" />
                          Expira em {remainingDays} {remainingDays === 1 ? 'dia' : 'dias'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Restore Button */}
                      <button
                        type="button"
                        onClick={() => onRestore(doc.id)}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                        title="Restaurar documento para a tela principal"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Restaurar</span>
                      </button>

                      {/* Permanent Delete */}
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm('Excluir este documento definitivamente? Esta ação não pode ser desfeita.')) {
                            onPermanentDelete(doc.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Excluir permanentemente"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Retention notice footer */}
          <div className="pt-3 border-t border-slate-200 flex items-center gap-2 text-[11px] text-slate-500">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              Documentos que completarem 30 dias na lixeira são expurgados automaticamente para economizar espaço.
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
