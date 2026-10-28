import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Download,
  CheckCircle2,
  AlertCircle,
  FileText,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { AcademicDocument, DossierPreset } from '../types/document';

interface DossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  presets: DossierPreset[];
  allDocuments: AcademicDocument[];
  onPreviewDocument: (doc: AcademicDocument) => void;
}

export const DossierModal: React.FC<DossierModalProps> = ({
  isOpen,
  onClose,
  presets,
  allDocuments,
  onPreviewDocument,
}) => {
  if (!isOpen) return null;

  const [selectedPresetId, setSelectedPresetId] = useState<string>(presets[0]?.id || '');
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const currentPreset = presets.find((p) => p.id === selectedPresetId) || presets[0];

  const matchedDocs = currentPreset
    ? allDocuments.filter((doc) => currentPreset.matchedDocumentIds.includes(doc.id))
    : [];

  const handleGeneratePackage = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => {
        setDownloadSuccess(false);
      }, 3500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-indigo-950 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-800/80 flex items-center justify-center text-indigo-200">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">
                Gerador de Dossiê Universitário
              </h2>
              <p className="text-xs text-indigo-200/80">
                Agrupe e consolide documentos em pacotes oficiais para órgãos e empresas.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-indigo-300 hover:text-white hover:bg-indigo-900 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Preset Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-2">
              Selecione a Finalidade do Dossiê:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {presets.map((preset) => {
                const active = preset.id === selectedPresetId;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSelectedPresetId(preset.id)}
                    className={`p-3 text-left rounded-xl border transition-all text-xs ${
                      active
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 ring-1 ring-indigo-500 font-medium'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="font-semibold text-slate-900 mb-0.5">
                      {preset.name}
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {preset.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preset Overview & Checklist */}
          {currentPreset && (
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-4">
              <div>
                <h3 className="text-xs font-bold text-slate-900 mb-1">
                  Requisitos do Pacote: {currentPreset.name}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {currentPreset.description}
                </p>
              </div>

              {/* Required Documents Checklist */}
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                  Documentos Obrigatórios Indexados ({matchedDocs.length}/{currentPreset.requiredDocumentTypes.length})
                </span>

                <div className="space-y-2">
                  {currentPreset.requiredDocumentTypes.map((req, i) => {
                    const matched = matchedDocs[i];
                    return (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200 text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          {matched ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                          )}
                          <div className="truncate">
                            <span className="font-medium text-slate-800 block truncate">
                              {req}
                            </span>
                            {matched && (
                              <span className="text-[10px] text-slate-500 font-mono truncate block">
                                Anexado: {matched.title} ({matched.fileSize})
                              </span>
                            )}
                          </div>
                        </div>

                        {matched && (
                          <button
                            type="button"
                            onClick={() => onPreviewDocument(matched)}
                            className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium px-2 py-1 rounded hover:bg-indigo-50 shrink-0"
                          >
                            Ver Arquivo
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Total Size & Verification */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>Total de Arquivos: {matchedDocs.length} itens</span>
                <span>Folha de Rosto Oficial: Incluída</span>
              </div>
            </div>
          )}

          {/* Feedback Banner */}
          {downloadSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Dossiê Universitário gerado com sucesso!</strong> O pacote consolidado contém a folha de rosto timbrada e os {matchedDocs.length} documentos anexados em conformidade.
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Fechar
            </button>
            <button
              type="button"
              onClick={handleGeneratePackage}
              disabled={downloading}
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg flex items-center gap-2 shadow-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>{downloading ? 'Gerando Pacote...' : 'Baixar Dossiê Consolidado (PDF/ZIP)'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
