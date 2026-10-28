import React, { useState } from 'react';
import {
  X,
  FileText,
  Calendar,
  BookOpen,
  User,
  ShieldCheck,
  Tag,
  Download,
  Copy,
  Check,
  Edit2,
  Trash2,
  Printer,
} from 'lucide-react';
import { DocumentItem, ACADEMIC_SCOPES } from '../types';

interface DocumentPreviewModalProps {
  document: DocumentItem | null;
  onClose: () => void;
  onEdit: (doc: DocumentItem) => void;
  onDelete: (id: string) => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  document,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!document) return null;

  const [copiedCode, setCopiedCode] = useState(false);
  const scopeConfig = ACADEMIC_SCOPES[document.scope] || ACADEMIC_SCOPES.secretaria;

  const handleCopyCode = () => {
    if (document.verificationCode) {
      navigator.clipboard.writeText(document.verificationCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl h-[88vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-200 bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-3 truncate">
            <span
              className={`p-2 rounded-lg text-white ${scopeConfig.iconBg}`}
            >
              <FileText className="w-4 h-4" />
            </span>
            <div className="truncate">
              <h2 className="text-sm font-bold text-slate-900 truncate">
                {document.title}
              </h2>
              <p className="text-[11px] text-slate-500 font-mono">
                {document.fileName} · {document.fileSize}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                onClose();
                onEdit(document);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Editar</span>
            </button>

            <button
              onClick={handlePrint}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              title="Imprimir documento"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Split View */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left Canvas: Document Preview Visualizer */}
          <div className="flex-1 bg-slate-100 p-4 sm:p-8 overflow-y-auto flex items-start justify-center">
            
            {/* If there is an uploaded image preview, display it */}
            {document.fileDataUrl && document.fileType === 'image' ? (
              <div className="max-w-lg bg-white p-2 rounded-xl shadow-md border border-slate-200">
                <img
                  src={document.fileDataUrl}
                  alt={document.title}
                  className="w-full h-auto rounded-lg object-contain"
                />
              </div>
            ) : (
              /* Authentic Paper Sheet Presentation */
              <div className="w-full max-w-xl bg-white shadow-md rounded-md border border-slate-300 p-8 text-slate-800 text-xs leading-relaxed min-h-[500px] flex flex-col justify-between">
                <div>
                  {/* Institutional Seal & Header */}
                  <div className="text-center border-b pb-4 mb-5 border-slate-200">
                    <div className="w-10 h-10 mx-auto rounded-full border border-slate-800 flex items-center justify-center mb-1.5">
                      <ShieldCheck className="w-5 h-5 text-slate-900" />
                    </div>
                    <h3 className="font-bold text-xs uppercase tracking-wide text-slate-900">
                      Registro de Documento Acadêmico
                    </h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">
                      Sistema Integrado MeuCampi · Repositório Universitário
                    </p>
                  </div>

                  {/* Document Title Banner */}
                  <div className="mb-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border mb-1 ${scopeConfig.badgeBg} ${scopeConfig.badgeText} ${scopeConfig.badgeBorder}`}
                    >
                      {scopeConfig.label}
                    </span>
                    <h4 className="text-base font-bold text-slate-900">
                      {document.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                      Período Letivo: {document.semester}
                    </p>
                  </div>

                  {/* Body Content / Sample Text */}
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-slate-700 whitespace-pre-line text-xs font-serif leading-relaxed my-4">
                    {document.sampleContent || document.description || 'Conteúdo do documento acadêmico.'}
                  </div>
                </div>

                {/* Footer Validation Stamp */}
                <div className="pt-4 border-t border-slate-200 flex items-end justify-between text-[10px] text-slate-500 font-mono">
                  <div>
                    <p className="font-semibold text-slate-700">MEUCAMPI SECURE VAULT</p>
                    <p>Chave: {document.verificationCode || 'AUT-GEN-LOCAL-2026'}</p>
                    <p>Arquivo: {document.fileName}</p>
                  </div>
                  <div className="text-right">
                    <div className="w-12 h-12 border border-dashed border-slate-400 rounded flex items-center justify-center text-[8px] text-slate-400 uppercase font-sans mb-1 ml-auto">
                      QR Code
                    </div>
                    <span>Autenticidade Verificada</span>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Right Sidebar: Details & Metadata Card */}
          <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-slate-200 bg-white p-5 flex flex-col justify-between overflow-y-auto shrink-0 space-y-6">
            
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Cartão de Metadados
              </h3>

              {/* Data list */}
              <dl className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <dt className="text-slate-500">Âmbito:</dt>
                  <dd className="font-semibold text-slate-800 text-right">
                    {scopeConfig.label}
                  </dd>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <dt className="text-slate-500">Semestre:</dt>
                  <dd className="font-mono text-slate-900 font-bold">{document.semester}</dd>
                </div>

                {document.disciplineName && (
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <dt className="text-slate-500">Disciplina:</dt>
                    <dd className="font-medium text-slate-800 text-right truncate max-w-[150px]">
                      {document.disciplineName}
                    </dd>
                  </div>
                )}

                {document.professorName && (
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <dt className="text-slate-500">Professor:</dt>
                    <dd className="font-medium text-slate-800 text-right truncate max-w-[150px]">
                      {document.professorName}
                    </dd>
                  </div>
                )}

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <dt className="text-slate-500">Formato / Tamanho:</dt>
                  <dd className="font-mono text-slate-900">
                    {document.fileType.toUpperCase()} ({document.fileSize})
                  </dd>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <dt className="text-slate-500">Data de Envio:</dt>
                  <dd className="font-mono text-slate-900">
                    {new Date(document.createdAt).toLocaleDateString('pt-BR')}
                  </dd>
                </div>
              </dl>

              {/* Verification Code Box */}
              {document.verificationCode && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Código de Autenticação
                  </span>
                  <div className="flex items-center justify-between gap-2">
                    <code className="text-xs font-mono font-bold text-slate-800 truncate">
                      {document.verificationCode}
                    </code>
                    <button
                      onClick={handleCopyCode}
                      className="p-1 hover:bg-slate-200 rounded text-slate-600 transition-colors"
                      title="Copiar código"
                    >
                      {copiedCode ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Tags */}
              {document.tags.length > 0 && (
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Tags Registradas
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {document.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {document.description && (
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Descrição / Observação
                  </span>
                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    {document.description}
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-200 space-y-2">
              <button
                onClick={handlePrint}
                className="w-full py-2 px-3 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-xl flex items-center justify-center gap-2 transition-colors shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Baixar Documento</span>
              </button>

              <button
                onClick={() => {
                  onDelete(document.id);
                  onClose();
                }}
                className="w-full py-2 px-3 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Mover para a Lixeira</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
