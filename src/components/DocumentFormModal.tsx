import React, { useState, useEffect } from 'react';
import {
  X,
  UploadCloud,
  FileText,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  User,
  Tag,
  ShieldCheck,
  Plus,
  Clock,
  Calendar,
} from 'lucide-react';
import {
  DocumentItem,
  AcademicScope,
  ACADEMIC_SCOPES,
  Discipline,
  DueDateType,
} from '../types';

interface DocumentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (docData: Omit<DocumentItem, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted'>) => void;
  onUpdate?: (id: string, updates: Partial<DocumentItem>) => void;
  documentToEdit?: DocumentItem | null;
  disciplines: Discipline[];
  defaultSemester: string;
  onQuickAddDiscipline: (name: string, professor: string) => Discipline;
}

export const DocumentFormModal: React.FC<DocumentFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onUpdate,
  documentToEdit,
  disciplines,
  defaultSemester,
  onQuickAddDiscipline,
}) => {
  if (!isOpen) return null;

  // Step tracker: 1 | 2 | 3
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form Fields
  const [title, setTitle] = useState('');
  const [scope, setScope] = useState<AcademicScope>('secretaria');
  const [semester, setSemester] = useState(defaultSemester || '2026.2');
  const [disciplineId, setDisciplineId] = useState<string>('');
  const [professorName, setProfessorName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [customTagInput, setCustomTagInput] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState<'pdf' | 'image' | 'doc'>('pdf');
  const [fileSize, setFileSize] = useState('1.2 MB');
  const [fileDataUrl, setFileDataUrl] = useState<string | undefined>(undefined);
  const [verificationCode, setVerificationCode] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Deadline & Reminders state
  const [enableDeadline, setEnableDeadline] = useState(false);
  const [dueDate, setDueDate] = useState('');
  const [dueDateType, setDueDateType] = useState<DueDateType>('entrega');

  // Inline Quick Add Discipline state
  const [showAddDiscipline, setShowAddDiscipline] = useState(false);
  const [newDiscName, setNewDiscName] = useState('');
  const [newDiscProf, setNewDiscProf] = useState('');

  // Quick date helper
  const handleSetQuickDate = (daysAhead: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    setDueDate(`${year}-${month}-${day}`);
  };

  // Initialize or reset form
  useEffect(() => {
    if (documentToEdit) {
      setTitle(documentToEdit.title);
      setScope(documentToEdit.scope);
      setSemester(documentToEdit.semester);
      setDisciplineId(documentToEdit.disciplineId || '');
      setProfessorName(documentToEdit.professorName || '');
      setDescription(documentToEdit.description || '');
      setTags(documentToEdit.tags || []);
      setFileName(documentToEdit.fileName);
      setFileType(documentToEdit.fileType);
      setFileSize(documentToEdit.fileSize);
      setFileDataUrl(documentToEdit.fileDataUrl);
      setVerificationCode(documentToEdit.verificationCode || '');
      setDueDate(documentToEdit.dueDate || '');
      setDueDateType(documentToEdit.dueDateType || 'entrega');
      setEnableDeadline(Boolean(documentToEdit.dueDate));
      setStep(1);
    } else {
      setTitle('');
      setScope('secretaria');
      setSemester(defaultSemester || '2026.2');
      setDisciplineId('');
      setProfessorName('');
      setDescription('');
      setTags(['Matrícula']);
      setFileName('');
      setFileType('pdf');
      setFileSize('1.2 MB');
      setFileDataUrl(undefined);
      setVerificationCode('');
      setDueDate('');
      setDueDateType('entrega');
      setEnableDeadline(false);
      setStep(1);
    }
  }, [documentToEdit, defaultSemester, isOpen]);

  // When discipline changes, auto-fill professor name
  const handleDisciplineChange = (selectedId: string) => {
    setDisciplineId(selectedId);
    if (!selectedId) {
      return;
    }
    const found = disciplines.find((d) => d.id === selectedId);
    if (found && found.professorName) {
      setProfessorName(found.professorName);
    }
  };

  // Handle file selection and read file
  const handleFile = (file: File) => {
    setFileName(file.name);
    setFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'png' || ext === 'jpg' || ext === 'jpeg' || ext === 'webp') {
      setFileType('image');
    } else {
      setFileType('pdf');
    }

    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '));
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setFileDataUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleTagToggle = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const handleAddCustomTag = () => {
    const trimmed = customTagInput.trim().replace(/^#/, '');
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setCustomTagInput('');
    }
  };

  const handleCreateDisciplineInline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDiscName.trim()) return;

    const created = onQuickAddDiscipline(newDiscName.trim(), newDiscProf.trim());
    setDisciplineId(created.id);
    setProfessorName(created.professorName);
    setNewDiscName('');
    setNewDiscProf('');
    setShowAddDiscipline(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const selectedDisc = disciplines.find((d) => d.id === disciplineId);

    const docPayload = {
      title: title.trim(),
      scope,
      semester,
      disciplineId: disciplineId || undefined,
      disciplineName: selectedDisc ? selectedDisc.name : undefined,
      professorName: professorName.trim() || undefined,
      description: description.trim() || undefined,
      tags,
      fileName: fileName || (documentToEdit ? documentToEdit.fileName : 'documento_academico.pdf'),
      fileType,
      fileSize: fileName ? fileSize : (documentToEdit ? documentToEdit.fileSize : '1.4 MB'),
      fileDataUrl: fileDataUrl || documentToEdit?.fileDataUrl,
      verificationCode: verificationCode.trim() || undefined,
      dueDate: enableDeadline && dueDate ? dueDate : undefined,
      dueDateType: enableDeadline && dueDate ? dueDateType : undefined,
      sampleContent:
        documentToEdit?.sampleContent ||
        `${title.toUpperCase()}\n\nDocumento cadastrado em ${new Date().toLocaleDateString('pt-BR')}.\nÂmbito: ${ACADEMIC_SCOPES[scope].label}\nPeríodo: ${semester}\n${description || ''}`,
    };

    if (documentToEdit && onUpdate) {
      onUpdate(documentToEdit.id, docPayload);
    } else {
      onSave(docPayload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {documentToEdit ? 'Editar Documento Acadêmico' : 'Cadastrar Documento no MeuCampi'}
            </h2>
            <p className="text-xs text-slate-500">
              Formulário progressivo em 3 etapas simples
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progressive Step Indicator Bar */}
        <div className="px-6 py-3 bg-slate-100/60 border-b border-slate-200 flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step >= 1 ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-500'
              }`}
            >
              1
            </span>
            <span className={step === 1 ? 'text-slate-900' : 'text-slate-500'}>
              Arquivo & Título
            </span>
          </div>

          <div className="w-6 h-px bg-slate-300" />

          <div className="flex items-center gap-2">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step >= 2 ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-500'
              }`}
            >
              2
            </span>
            <span className={step === 2 ? 'text-slate-900' : 'text-slate-500'}>
              Âmbito & Semestre
            </span>
          </div>

          <div className="w-6 h-px bg-slate-300" />

          <div className="flex items-center gap-2">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step === 3 ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-500'
              }`}
            >
              3
            </span>
            <span className={step === 3 ? 'text-slate-900' : 'text-slate-500'}>
              Prazos & Detalhes
            </span>
          </div>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6">
          
          {/* STEP 1: Upload Arquivo & Título */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              {/* Drag & Drop Upload Zone */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Arquivo do Documento (PDF ou Imagem)
                </label>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleFile(e.dataTransfer.files[0]);
                    }
                  }}
                  className={`border-2 border-dashed rounded-xl p-5 text-center transition-colors cursor-pointer ${
                    isDragging
                      ? 'border-indigo-600 bg-indigo-50/50'
                      : fileName
                      ? 'border-emerald-300 bg-emerald-50/30'
                      : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
                  }`}
                >
                  <input
                    type="file"
                    id="file-upload"
                    accept=".pdf,image/*,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer block">
                    {fileName ? (
                      <div className="flex items-center justify-center gap-2 text-emerald-700 text-xs font-semibold">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span>Arquivo selecionado: {fileName} ({fileSize})</span>
                      </div>
                    ) : (
                      <>
                        <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-1.5" />
                        <p className="text-xs font-semibold text-slate-700">
                          Clique para selecionar ou arraste o arquivo aqui
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Suporta comprovantes, históricos, apostilas em PDF ou imagens
                        </p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Título */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Título do Documento *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Comprovante de Matrícula 2026.2 ou Slides Aula 04"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 focus:bg-white text-slate-900"
                />
              </div>

              {/* Código de Autenticação */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Código de Autenticação Digital / Chave da Universidade (Opcional)
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Ex: UNICAMP-2026-MAT-9941 ou AUT-8841-K"
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 focus:bg-white text-slate-900"
                />
              </div>

              {/* Step 1 Actions */}
              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={!title.trim()}
                  onClick={() => setStep(2)}
                  className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-lg transition-colors"
                >
                  <span>Avançar: Âmbito & Semestre</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Âmbito & Semestre */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              {/* Âmbito Pré-Definido Selection */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-2">
                  Escolha o Âmbito Institucional do Documento *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(Object.keys(ACADEMIC_SCOPES) as AcademicScope[]).map((scopeKey) => {
                    const item = ACADEMIC_SCOPES[scopeKey];
                    const isSelected = scope === scopeKey;
                    return (
                      <button
                        key={scopeKey}
                        type="button"
                        onClick={() => {
                          setScope(scopeKey);
                          // Auto suggest first tag of new scope if empty
                          if (tags.length === 0) {
                            setTags([item.suggestedTags[0]]);
                          }
                        }}
                        className={`p-3 rounded-xl border text-left transition-all text-xs flex items-center justify-between ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 ring-1 ring-indigo-500 font-semibold'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${item.iconBg}`} />
                          <span>{item.label}</span>
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Semestre Letivo */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Semestre / Período Letivo *
                </label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 focus:bg-white text-slate-900 font-semibold"
                >
                  <option value="2026.2">2026.2 (Período Vigente)</option>
                  <option value="2026.1">2026.1</option>
                  <option value="2025.2">2025.2</option>
                  <option value="2025.1">2025.1</option>
                  <option value="2024.2">2024.2</option>
                  <option value="Permanente">Permanente / Vínculo Geral</option>
                </select>
              </div>

              {/* Step 2 Actions */}
              <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Voltar</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <span>Avançar: Prazos & Detalhes</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Prazos, Disciplina, Professor, Descrição & Tags */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in">
              
              {/* Seção Nova: Controle de Prazo & Lembrete Acadêmico */}
              <div className="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">
                        Controle de Prazo & Lembretes
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Atividade para entrega ou documento com data de expiração
                      </span>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enableDeadline}
                      onChange={(e) => {
                        setEnableDeadline(e.target.checked);
                        if (e.target.checked && !dueDate) {
                          handleSetQuickDate(7); // sugere 7 dias por padrão
                        }
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                {enableDeadline && (
                  <div className="pt-2 border-t border-slate-200 space-y-3 animate-in fade-in">
                    {/* Escolha do Tipo de Prazo */}
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                        Finalidade do Prazo:
                      </label>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => setDueDateType('entrega')}
                          className={`p-2 rounded-lg border text-left transition-all ${
                            dueDateType === 'entrega'
                              ? 'border-indigo-600 bg-white text-indigo-950 font-semibold ring-1 ring-indigo-500 shadow-2xs'
                              : 'border-slate-200 bg-white/60 text-slate-600 hover:bg-white'
                          }`}
                        >
                          <div className="font-semibold text-xs">📅 Prazo de Entrega</div>
                          <div className="text-[10px] text-slate-400">Trabalho, Lista, TCC</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDueDateType('expiracao')}
                          className={`p-2 rounded-lg border text-left transition-all ${
                            dueDateType === 'expiracao'
                              ? 'border-indigo-600 bg-white text-indigo-950 font-semibold ring-1 ring-indigo-500 shadow-2xs'
                              : 'border-slate-200 bg-white/60 text-slate-600 hover:bg-white'
                          }`}
                        >
                          <div className="font-semibold text-xs">📜 Data de Expiração</div>
                          <div className="text-[10px] text-slate-400">Certificado, Matrícula</div>
                        </button>
                      </div>
                    </div>

                    {/* Campo de Data */}
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                        Data Limite / Vencimento:
                      </label>
                      <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>

                    {/* Atalhos Rápidos de Prazo */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] text-slate-400 font-medium">Atalhos rápidos:</span>
                      <button
                        type="button"
                        onClick={() => handleSetQuickDate(3)}
                        className="px-2 py-0.5 text-[10px] font-medium bg-white border border-slate-200 hover:bg-slate-100 rounded text-slate-700 transition-colors"
                      >
                        +3 dias
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSetQuickDate(7)}
                        className="px-2 py-0.5 text-[10px] font-medium bg-white border border-slate-200 hover:bg-slate-100 rounded text-slate-700 transition-colors"
                      >
                        +7 dias (1 sem)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSetQuickDate(15)}
                        className="px-2 py-0.5 text-[10px] font-medium bg-white border border-slate-200 hover:bg-slate-100 rounded text-slate-700 transition-colors"
                      >
                        +15 dias
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSetQuickDate(30)}
                        className="px-2 py-0.5 text-[10px] font-medium bg-white border border-slate-200 hover:bg-slate-100 rounded text-slate-700 transition-colors"
                      >
                        +30 dias
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Disciplina Selector */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Disciplina Associada (Opcional)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowAddDiscipline(!showAddDiscipline)}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold"
                  >
                    {showAddDiscipline ? 'Cancelar' : '+ Nova Disciplina'}
                  </button>
                </div>

                {/* Inline Quick Add form */}
                {showAddDiscipline ? (
                  <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-200 mb-2 space-y-2 text-xs">
                    <p className="font-semibold text-indigo-950">Cadastrar Nova Disciplina Rápida:</p>
                    <input
                      type="text"
                      placeholder="Nome da Disciplina (Ex: Banco de Dados)"
                      value={newDiscName}
                      onChange={(e) => setNewDiscName(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-indigo-200 rounded-lg text-slate-900"
                    />
                    <input
                      type="text"
                      placeholder="Nome do(a) Professor(a) (Ex: Profa. Mariana)"
                      value={newDiscProf}
                      onChange={(e) => setNewDiscProf(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-indigo-200 rounded-lg text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={handleCreateDisciplineInline}
                      className="px-3 py-1 bg-indigo-600 text-white rounded font-semibold text-xs"
                    >
                      Salvar e Selecionar
                    </button>
                  </div>
                ) : (
                  <select
                    value={disciplineId}
                    onChange={(e) => handleDisciplineChange(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 focus:bg-white text-slate-900 font-medium"
                  >
                    <option value="">Nenhuma disciplina vinculada</option>
                    {disciplines.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} {d.professorName ? `(${d.professorName})` : ''}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Professor Name */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Nome do(a) Professor(a) (Opcional)
                </label>
                <input
                  type="text"
                  value={professorName}
                  onChange={(e) => setProfessorName(e.target.value)}
                  placeholder="Ex: Prof. Dr. Henrique Albuquerque"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 focus:bg-white text-slate-900"
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Descrição / Anotações (Opcional)
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Adicione observações, detalhes para recordar..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 focus:bg-white text-slate-900 resize-none"
                />
              </div>

              {/* Tags Sugeridas pelo Âmbito */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Tags Sugeridas para {ACADEMIC_SCOPES[scope].label}:
                </label>
                <div className="flex flex-wrap gap-1 mb-2">
                  {ACADEMIC_SCOPES[scope].suggestedTags.map((suggested) => {
                    const isSelected = tags.includes(suggested);
                    return (
                      <button
                        key={suggested}
                        type="button"
                        onClick={() => handleTagToggle(suggested)}
                        className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                          isSelected
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        #{suggested}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Tag Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customTagInput}
                    onChange={(e) => setCustomTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomTag();
                      }
                    }}
                    placeholder="Digitar tag personalizada..."
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomTag}
                    className="px-3 py-1.5 text-xs bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg"
                  >
                    Adicionar
                  </button>
                </div>

                {/* Selected Tags list */}
                {tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    <span className="text-[10px] text-slate-400 font-medium block w-full">
                      Tags selecionadas:
                    </span>
                    {tags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[11px] font-medium border border-indigo-200"
                      >
                        #{t}
                        <button
                          type="button"
                          onClick={() => handleTagToggle(t)}
                          className="hover:text-indigo-900"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Step 3 Actions */}
              <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Voltar</span>
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors"
                >
                  {documentToEdit ? 'Salvar Alterações' : 'Concluir e Salvar Documento'}
                </button>
              </div>

            </div>
          )}

        </form>

      </div>
    </div>
  );
};
