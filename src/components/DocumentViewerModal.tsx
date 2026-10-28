import React, { useState } from 'react';
import {
  X,
  Download,
  Printer,
  Copy,
  Check,
  Sparkles,
  Calendar,
  Award,
  ShieldCheck,
  FileText,
  Clock,
  BookOpen,
  Send,
} from 'lucide-react';
import { AcademicDocument } from '../types/document';

interface DocumentViewerModalProps {
  document: AcademicDocument | null;
  onClose: () => void;
  onUpdateNotes: (id: string, notes: string) => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  document,
  onClose,
  onUpdateNotes,
}) => {
  if (!document) return null;

  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'ai_tools'>('preview');
  const [localNotes, setLocalNotes] = useState(document.notes || '');
  const [notesSaved, setNotesSaved] = useState(false);
  const [activeFlashcard, setActiveFlashcard] = useState<number | null>(null);

  const handleCopyCode = () => {
    if (document.verificationCode) {
      navigator.clipboard.writeText(document.verificationCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleSaveNotes = () => {
    onUpdateNotes(document.id, localNotes);
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Pre-computed contextual AI flashcards based on document type
  const getContextualFlashcards = () => {
    if (document.category === 'aulas') {
      return [
        {
          q: 'Qual é o invariante principal das Árvores Rubro-Negras quanto à altura preta?',
          a: 'Todo caminho simples da raiz até qualquer folha nula deve conter exatamente o mesmo número de nós pretos (black-height constante).',
        },
        {
          q: 'Qual a complexidade de tempo de busca e inserção no pior caso?',
          a: 'O(log n), garantida pela propriedade de que a altura máxima nunca excede 2 * log(n + 1).',
        },
        {
          q: 'O que acontece quando o pai e o tio do nó inserido são ambos vermelhos?',
          a: 'Recoloração: o pai e o tio tornam-se pretos e o avô torna-se vermelho, propagando a checagem para cima.',
        },
      ];
    }
    if (document.category === 'secretaria') {
      return [
        {
          q: 'Como comprovar a autenticidade deste documento perante órgãos externos?',
          a: `Utilize o código verificador ${document.verificationCode || 'UETC-VERIF'} no portal da universidade ou aponte a câmera para o QR Code oficial.`,
        },
        {
          q: 'Qual a vigência oficial deste atestado?',
          a: document.validUntil
            ? `Válido até ${new Date(document.validUntil).toLocaleDateString('pt-BR')}.`
            : 'Válido durante o semestre letivo corrente da universidade.',
        },
      ];
    }
    return [
      {
        q: 'Qual o valor das horas complementares computadas?',
        a: document.complementaryHours
          ? `${document.complementaryHours} horas aceitas pelo colegiado da coordenação do curso.`
          : 'Documento de apoio e regulamento.',
      },
      {
        q: 'Em qual grupo de atividades complementares este documento se enquadra?',
        a: 'Grupo II - Atividades Acadêmico-Científicas e Aperfeiçoamento Profissional.',
      },
    ];
  };

  const flashcards = getContextualFlashcards();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-200 bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-3 truncate">
            <span className="p-2 bg-slate-200/60 rounded-lg text-slate-700">
              <FileText className="w-4 h-4" />
            </span>
            <div className="truncate">
              <h2 className="text-sm font-bold text-slate-900 truncate">
                {document.title}
              </h2>
              <p className="text-[11px] text-slate-500 font-mono">
                {document.semester} · {document.fileSize} · {document.uploadDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* View Switcher */}
            <div className="flex items-center bg-slate-200/70 p-1 rounded-lg text-xs font-medium">
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeTab === 'preview'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Documento
              </button>
              <button
                onClick={() => setActiveTab('ai_tools')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
                  activeTab === 'ai_tools'
                    ? 'bg-white text-indigo-700 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3 h-3 text-indigo-600" />
                <span>IA do Aluno</span>
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 rounded-lg transition-colors"
              title="Imprimir documento"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-lg transition-colors"
              title="Fechar visualizador"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Content Split View */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Main Visual Document Canvas */}
          <div className="flex-1 bg-slate-100/90 p-4 sm:p-8 overflow-y-auto flex justify-center items-start">
            
            {activeTab === 'preview' ? (
              /* Authentic Paper Sheet Presentation */
              <div className="w-full max-w-2xl bg-white shadow-md rounded-sm border border-slate-300 p-8 sm:p-12 text-slate-800 text-xs leading-relaxed relative min-h-[600px] flex flex-col justify-between">
                
                {/* Official University Header */}
                <div>
                  <div className="text-center border-b pb-4 mb-6 border-slate-300">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-slate-800 mb-2">
                      <ShieldCheck className="w-6 h-6 text-slate-900" />
                    </div>
                    <h3 className="font-bold text-sm tracking-wide uppercase text-slate-900">
                      Universidade Estadual de Tecnologia e Ciência
                    </h3>
                    <p className="text-[11px] text-slate-500 font-serif uppercase tracking-wider">
                      Pró-Reitoria de Graduação · Secretaria Geral Acadêmica
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      CNPJ: 44.108.920/0001-82 · Sistema Integrado Acadêmico
                    </p>
                  </div>

                  {/* Document Title Banner */}
                  <div className="text-center my-6">
                    <h4 className="text-base font-bold text-slate-900 uppercase tracking-tight">
                      {document.title}
                    </h4>
                    {document.verificationCode && (
                      <p className="text-[11px] font-mono text-slate-500 mt-1">
                        Autenticidade: {document.verificationCode}
                      </p>
                    )}
                  </div>

                  {/* Specific Document Dynamic Templates */}
                  {document.scheduleData && (
                    <div className="my-5">
                      <p className="font-semibold text-slate-700 mb-2">
                        Grade Horária Semanal Cadastrada:
                      </p>
                      <table className="w-full border border-slate-300 text-left text-[11px]">
                        <thead>
                          <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-300">
                            <th className="p-2 border-r border-slate-300">Dia</th>
                            <th className="p-2 border-r border-slate-300">Horário</th>
                            <th className="p-2 border-r border-slate-300">Disciplina</th>
                            <th className="p-2">Local / Sala</th>
                          </tr>
                        </thead>
                        <tbody>
                          {document.scheduleData.map((item, idx) => (
                            <tr key={idx} className="border-b border-slate-200">
                              <td className="p-2 font-medium border-r border-slate-200">{item.day}</td>
                              <td className="p-2 font-mono border-r border-slate-200">{item.time}</td>
                              <td className="p-2 border-r border-slate-200">{item.discipline}</td>
                              <td className="p-2 text-slate-600">{item.room}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {document.gradeData && (
                    <div className="my-5">
                      <p className="font-semibold text-slate-700 mb-2">
                        Componentes Curriculares Concluídos e Aproveitamentos:
                      </p>
                      <table className="w-full border border-slate-300 text-left text-[11px]">
                        <thead>
                          <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-300">
                            <th className="p-2 border-r border-slate-300">Código</th>
                            <th className="p-2 border-r border-slate-300">Componente</th>
                            <th className="p-2 text-center border-r border-slate-300">Média</th>
                            <th className="p-2 text-center border-r border-slate-300">Créditos</th>
                            <th className="p-2 text-center">Situação</th>
                          </tr>
                        </thead>
                        <tbody>
                          {document.gradeData.map((g, idx) => (
                            <tr key={idx} className="border-b border-slate-200">
                              <td className="p-2 font-mono text-slate-500 border-r border-slate-200">{g.code}</td>
                              <td className="p-2 font-medium border-r border-slate-200">{g.discipline}</td>
                              <td className="p-2 text-center font-mono font-semibold border-r border-slate-200">{g.grade.toFixed(1)}</td>
                              <td className="p-2 text-center font-mono border-r border-slate-200">{g.credits}</td>
                              <td className="p-2 text-center text-emerald-700 font-medium">{g.situation}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Body text / content preview */}
                  <div className="whitespace-pre-line text-slate-700 my-4 text-xs font-serif leading-relaxed bg-slate-50/50 p-4 rounded-md border border-slate-200">
                    {document.contentPreview || document.description}
                  </div>
                </div>

                {/* Official Stamp & Validation Footer */}
                <div className="mt-8 pt-6 border-t border-slate-300 flex items-end justify-between text-[10px] text-slate-500 font-mono">
                  <div>
                    <p className="font-semibold text-slate-700">CARIMBO DE AUTENTICAÇÃO DIGITAL</p>
                    <p>Chave: {document.verificationCode || 'UETC-VAL-SYS-CERT-2026'}</p>
                    <p>Emissão: {document.uploadDate} · Protocolo Geral nº 44109</p>
                  </div>
                  <div className="text-right">
                    <div className="w-16 h-16 border-2 border-slate-400 border-dashed rounded flex items-center justify-center text-[9px] text-slate-400 uppercase font-sans mb-1 ml-auto">
                      QR Code Oficial
                    </div>
                    <span>Conferência Online Ativa</span>
                  </div>
                </div>

              </div>
            ) : (
              /* AI Study Assistant View */
              <div className="w-full max-w-2xl bg-white rounded-xl border border-slate-200 p-6 space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <h3 className="text-sm font-bold text-slate-900">
                      Assistente Acadêmico Inteligente
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500">
                    Análise semântica gerada a partir do conteúdo deste documento universitário.
                  </p>
                </div>

                {/* Auto Summary Card */}
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider block mb-1">
                    Resumo Executivo do Documento
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {document.description} Este arquivo pertence à categoria de{' '}
                    <strong>{document.category}</strong> do semestre <strong>{document.semester}</strong>.
                    Possui status <strong>{document.status.toUpperCase()}</strong> e
                    pode ser utilizado para comprovação oficial perante a universidade e empresas conveniadas.
                  </p>
                </div>

                {/* Key Flashcards for Learning or Administrative Requirements */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                      Flashcards de Revisão / Pontos Chave ({flashcards.length})
                    </span>
                    <span className="text-[10px] text-slate-400">Clique no card para revelar resposta</span>
                  </div>

                  <div className="space-y-2.5">
                    {flashcards.map((card, idx) => {
                      const isFlipped = activeFlashcard === idx;
                      return (
                        <div
                          key={idx}
                          onClick={() => setActiveFlashcard(isFlipped ? null : idx)}
                          className="p-3.5 bg-white border border-slate-200 hover:border-indigo-300 rounded-lg cursor-pointer transition-all shadow-2xs"
                        >
                          <div className="flex items-start gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-slate-900 mb-1">
                                {card.q}
                              </p>
                              {isFlipped ? (
                                <p className="text-xs text-indigo-900 bg-indigo-50/60 p-2 rounded border border-indigo-100 mt-2 leading-relaxed">
                                  {card.a}
                                </p>
                              ) : (
                                <span className="text-[11px] text-indigo-600 font-medium hover:underline inline-block mt-1">
                                  Toque para ver resposta →
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* Right Inspector & Student Notes Drawer */}
          <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-slate-200 bg-white p-5 flex flex-col justify-between overflow-y-auto shrink-0 space-y-6">
            
            <div className="space-y-5">
              {/* Metadata Details */}
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Metadados do Arquivo
                </span>
                <dl className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <dt className="text-slate-500">Categoria:</dt>
                    <dd className="font-medium text-slate-900 capitalize">{document.category}</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <dt className="text-slate-500">Semestre:</dt>
                    <dd className="font-mono text-slate-900">{document.semester}</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <dt className="text-slate-500">Formato:</dt>
                    <dd className="font-mono uppercase text-slate-900">{document.fileType}</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <dt className="text-slate-500">Tamanho:</dt>
                    <dd className="font-mono tabular-nums text-slate-900">{document.fileSize}</dd>
                  </div>
                  {document.validUntil && (
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <dt className="text-slate-500">Expira em:</dt>
                      <dd className="font-mono text-slate-900">{document.validUntil}</dd>
                    </div>
                  )}
                  {document.complementaryHours && (
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <dt className="text-slate-500">Horas Validadas:</dt>
                      <dd className="font-semibold text-emerald-700">+{document.complementaryHours} horas</dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Verification Code Box with 1-click copy */}
              {document.verificationCode && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                    Código de Autenticação
                  </span>
                  <div className="flex items-center justify-between gap-2">
                    <code className="text-xs font-mono font-semibold text-slate-800 truncate">
                      {document.verificationCode}
                    </code>
                    <button
                      onClick={handleCopyCode}
                      className="p-1.5 hover:bg-slate-200 rounded text-slate-600 transition-colors shrink-0"
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
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Marcadores (Tags)
                </span>
                <div className="flex flex-wrap gap-1.5 text-xs text-slate-600">
                  {document.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[11px] text-slate-700 transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Personal Student Study Notes */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Minhas Anotações de Estudo
                  </span>
                  {notesSaved && (
                    <span className="text-[10px] text-emerald-600 font-medium">Salvo!</span>
                  )}
                </div>
                <textarea
                  value={localNotes}
                  onChange={(e) => setLocalNotes(e.target.value)}
                  placeholder="Escreva lembretes para a prova, datas de entrega ou notas sobre este arquivo..."
                  rows={4}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white text-slate-800 resize-none"
                />
                <button
                  onClick={handleSaveNotes}
                  className="mt-1.5 w-full py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md transition-colors"
                >
                  Salvar Anotações
                </button>
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-200 space-y-2">
              <button
                onClick={handlePrint}
                className="w-full py-2 px-3 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg flex items-center justify-center gap-2 transition-colors shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Baixar Documento / PDF</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
