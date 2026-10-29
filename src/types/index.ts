export type AcademicScope =
  | 'secretaria'
  | 'aulas'
  | 'certificados'
  | 'projetos'
  | 'estagio';

export interface ScopeDefinition {
  id: AcademicScope;
  label: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  iconBg: string;
  suggestedTags: string[];
}

export const ACADEMIC_SCOPES: Record<AcademicScope, ScopeDefinition> = {
  secretaria: {
    id: 'secretaria',
    label: 'Secretaria & Matrícula',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700',
    badgeBorder: 'border-blue-200',
    iconBg: 'bg-blue-600',
    suggestedTags: ['Matrícula', 'Atestado', 'Histórico', 'PasseEscolar', 'Comprovante', 'Calendário'],
  },
  aulas: {
    id: 'aulas',
    label: 'Aulas & Atividades',
    badgeBg: 'bg-violet-50',
    badgeText: 'text-violet-700',
    badgeBorder: 'border-violet-200',
    iconBg: 'bg-violet-600',
    suggestedTags: ['Slides', 'ListaExercicios', 'Ementa', 'Resumo', 'Laboratório', 'ProvaP1', 'ProvaP2'],
  },
  certificados: {
    id: 'certificados',
    label: 'Certificados & Horas',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-800',
    badgeBorder: 'border-amber-200',
    iconBg: 'bg-amber-600',
    suggestedTags: ['HorasComplementares', 'Congresso', 'CursoExtensao', 'Workshop', 'Monitoria', 'Palestra'],
  },
  projetos: {
    id: 'projetos',
    label: 'Projetos & Pesquisa',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    badgeBorder: 'border-emerald-200',
    iconBg: 'bg-emerald-600',
    suggestedTags: ['IniciacaoCientifica', 'TCC', 'Artigo', 'Banner', 'RelatorioPesquisa', 'RelatorioFinal'],
  },
  estagio: {
    id: 'estagio',
    label: 'Estágio & Carreira',
    badgeBg: 'bg-cyan-50',
    badgeText: 'text-cyan-800',
    badgeBorder: 'border-cyan-200',
    iconBg: 'bg-cyan-600',
    suggestedTags: ['TCE', 'TermoAditivo', 'RelatorioAtividades', 'SeguroEstagio', 'Contrato', 'PlanoDeEstagio'],
  },
};

export interface UniversityProfile {
  universityName: string;
  courseName: string;
  currentSemesterOrdinal: string; // Ex: '6º Semestre'
  activePeriod: string; // Ex: '2026.2' ou '2026.1'
  studentName?: string;
  registrationNumber?: string; // RA
}

export interface Discipline {
  id: string;
  name: string;
  professorName: string;
  semester: string;
}

export type FileType = 'pdf' | 'image' | 'doc';

export type DueDateType = 'entrega' | 'expiracao';

export interface DocumentItem {
  id: string;
  title: string;
  scope: AcademicScope;
  semester: string;
  disciplineId?: string;
  disciplineName?: string;
  professorName?: string;
  description?: string;
  tags: string[];
  fileName: string;
  fileType: FileType;
  fileSize: string;
  fileDataUrl?: string; // base64 or preview data
  sampleContent?: string; // preview text for visual simulation
  verificationCode?: string;
  dueDate?: string; // Formato YYYY-MM-DD para controle de prazos e vencimentos
  dueDateType?: DueDateType; // 'entrega' (trabalho/lista/TCC) ou 'expiracao' (certificado/matrícula)
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  deletedAt?: string; // ISO date string
}
