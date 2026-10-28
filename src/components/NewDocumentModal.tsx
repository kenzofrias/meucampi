import React, { useState } from 'react';
import {
  X,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { AcademicDocument, DocumentCategory } from '../types/document';

interface NewDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDocument: (doc: AcademicDocument) => void;
  currentSemester: string;
}

export const NewDocumentModal: React.FC<NewDocumentModalProps> = ({
  isOpen,
  onClose,
  onAddDocument,
  currentSemester,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('aulas');
  const [semester, setSemester] = useState('2026.1');
  const [discipline, setDiscipline] = useState('');
  const [professor, setProfessor] = useState('');
  const [complementaryHours, setComplementaryHours] = useState<string>('');
  const [validUntil, setValidUntil] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('1.5 MB');
  const [isDragging, setIsDragging] = useState(false);

  // Quick preset shortcuts for university students
  const handleApplyPreset = (presetType: 'matricula' | 'historico' | 'aula' | 'certificado') => {
    if (presetType === 'matricula') {
      setTitle('Comprovante de Matrícula - 2026.1');
      setCategory('secretaria');
      setSemester('2026.1');
      setDescription('Atestado oficial de matrícula e vínculo ativo com a universidade.');
      setTagsInput('Matrícula, Secretaria, 2026.1');
    } else if (presetType === 'historico') {
      setTitle('Histórico Escolar Analítico Atualizado');
      setCategory('secretaria');
      setSemester('Permanente');
      setDescription('Histórico completo com notas, coeficientes e carga horária integralizada.');
      setTagsInput('Histórico, CR, Notas, Secretaria');
    } else if (presetType === 'aula') {
      setTitle('Slides Aula 06 - Redes de Computadores e Protocolos');
      setCategory('aulas');
      setSemester('2026.1');
      setDiscipline('Sistemas Distribuídos e Redes');
      setProfessor('Prof. Carlos Mendes');
      setDescription('Material de estudo e resumo teórico com topologias TCP/IP.');
      setTagsInput('Slides, Redes, Aula, P1');
    } else if (presetType === 'certificado') {
      setTitle('Certificado: Workshop de Arquitetura em Nuvem');
      setCategory('estagio_horas');
      setSemester('2026.1');
      setComplementaryHours('20');
      setDescription('Certificado de conclusão de treinamento prático de 20 horas.');
      setTagsInput('Certificado, Horas Complementares, Cloud');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      setFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const parsedHours = complementaryHours ? parseInt(complementaryHours, 10) : undefined;
    const tags = tagsInput
      ? tagsInput.split(',').map((t) => t.trim()).filter(Boolean)
      : [category];

    const newDoc: AcademicDocument = {
      id: `doc-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      semester,
      discipline: discipline.trim() || undefined,
      professor: professor.trim() || undefined,
      fileType: 'pdf',
      fileSize: fileName ? fileSize : '1.2 MB',
      uploadDate: new Date().toISOString().split('T')[0],
      validUntil: validUntil || undefined,
      status: 'valido',
      verificationCode:
        category === 'secretaria' || category === 'estagio_horas'
          ? `AUT-${Math.random().toString(36).substring(2, 8).toUpperCase()}-2026`
          : undefined,
      complementaryHours: parsedHours && !isNaN(parsedHours) ? parsedHours : undefined,
      hoursApproved: Boolean(parsedHours),
      tags,
      starred: false,
      notes: '',
      contentPreview: `${title.toUpperCase()}\n\nDocumento cadastrado em ${new Date().toLocaleDateString('pt-BR')}.\n${description || 'Documento acadêmico indexado no UniDocs.'}`,
    };

    onAddDocument(newDoc);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Adicionar Documento Acadêmico
            </h2>
            <p className="text-xs text-slate-500">
              Faça upload de comprovantes, históricos, apostilas ou certificados.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets Shortcuts */}
        <div className="px-6 pt-4 pb-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Modelos Rápidos (Preencher com 1 clique):
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => handleApplyPreset('matricula')}
              className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium transition-colors"
            >
              🎓 Matrícula 2026.1
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('historico')}
              className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium transition-colors"
            >
              📜 Histórico Escolar
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('aula')}
              className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium transition-colors"
            >
              📚 Slides de Aula
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('certificado')}
              className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium transition-colors"
            >
              🏆 Certificado de Horas
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* File Upload Dropzone */}
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
                const file = e.dataTransfer.files[0];
                setFileName(file.name);
                setFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
                if (!title) setTitle(file.name.replace(/\.[^/.]+$/, ''));
              }
            }}
            className={`border-2 border-dashed rounded-xl p-5 text-center transition-colors cursor-pointer ${
              isDragging
                ? 'border-indigo-500 bg-indigo-50/50'
                : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
            }`}
          >
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.docx"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload-input"
            />
            <label htmlFor="file-upload-input" className="cursor-pointer block">
              <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              {fileName ? (
                <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-800">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>{fileName}</span>
                  <span className="text-slate-400 font-mono">({fileSize})</span>
                </div>
              ) : (
                <>
                  <p className="text-xs font-semibold text-slate-700">
                    Clique para selecionar ou arraste o PDF aqui
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Suporta PDF, JPG, PNG e DOCX de até 25MB
                  </p>
                </>
              )}
            </label>
          </div>

          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Título do Documento *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Histórico Escolar Oficial com CR"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white text-slate-900"
            />
          </div>

          {/* Category & Semester */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Categoria *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DocumentCategory)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white text-slate-900"
              >
                <option value="secretaria">Secretaria & Matrícula</option>
                <option value="aulas">Aulas & Materiais de Estudo</option>
                <option value="estagio_horas">Estágio & Horas Complementares</option>
                <option value="financeiro">Financeiro & Bolsas</option>
                <option value="tcc_pesquisa">TCC & Iniciação Científica</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Semestre Letivo *
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white text-slate-900 font-mono"
              >
                <option value="2026.1">2026.1 (Atual)</option>
                <option value="2025.2">2025.2</option>
                <option value="2025.1">2025.1</option>
                <option value="2024.2">2024.2</option>
                <option value="Permanente">Permanente / Vínculo</option>
              </select>
            </div>
          </div>

          {/* Conditional Fields based on Category */}
          {category === 'aulas' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Disciplina
                </label>
                <input
                  type="text"
                  value={discipline}
                  onChange={(e) => setDiscipline(e.target.value)}
                  placeholder="Ex: Algoritmos e Grafos"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white text-slate-900"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Professor(a)
                </label>
                <input
                  type="text"
                  value={professor}
                  onChange={(e) => setProfessor(e.target.value)}
                  placeholder="Ex: Prof. Henrique Albuquerque"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white text-slate-900"
                />
              </div>
            </div>
          )}

          {category === 'estagio_horas' && (
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Carga Horária do Certificado (horas)
              </label>
              <input
                type="number"
                value={complementaryHours}
                onChange={(e) => setComplementaryHours(e.target.value)}
                placeholder="Ex: 30"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white text-slate-900"
              />
            </div>
          )}

          {category === 'secretaria' && (
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Data de Validade (opcional)
              </label>
              <input
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white text-slate-900"
              />
            </div>
          )}

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Descrição / Observação
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Atestado emitido com carimbo digital para passe de estudante."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white text-slate-900"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Tags (separadas por vírgula)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Ex: P1, Prova, Importante, Moodle"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white text-slate-900"
            />
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors"
            >
              Salvar Documento
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
