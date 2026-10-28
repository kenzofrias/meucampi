export type DocumentCategory = 
  | 'aulas'
  | 'secretaria'
  | 'estagio_horas'
  | 'financeiro'
  | 'tcc_pesquisa';

export type DocumentStatus = 
  | 'valido'
  | 'expirado'
  | 'pendente_validacao'
  | 'em_revisao';

export type FileType = 'pdf' | 'image' | 'doc';

export interface KeyDate {
  event: string;
  date: string;
}

export interface AcademicDocument {
  id: string;
  title: string;
  description?: string;
  category: DocumentCategory;
  semester: string;
  discipline?: string;
  professor?: string;
  fileType: FileType;
  fileSize: string;
  uploadDate: string;
  validUntil?: string;
  status: DocumentStatus;
  verificationCode?: string;
  complementaryHours?: number;
  hoursApproved?: boolean;
  tags: string[];
  starred?: boolean;
  notes?: string;
  fileUrl?: string;
  contentPreview?: string;
  gradeData?: Array<{
    code: string;
    discipline: string;
    grade: number;
    credits: number;
    situation: string;
  }>;
  scheduleData?: Array<{
    day: string;
    time: string;
    discipline: string;
    room: string;
  }>;
}

export interface StudentProfile {
  name: string;
  registrationNumber: string; // RA
  university: string;
  campus: string;
  course: string;
  currentSemester: string;
  admissionYear: string;
  gpa: number; // Coeficiente de Rendimento (CR)
  complementaryHoursEarned: number;
  complementaryHoursRequired: number;
  mandatoryInternshipStatus: 'Pendente' | 'Em Andamento' | 'Concluído';
}

export interface DossierPreset {
  id: string;
  name: string;
  description: string;
  requiredDocumentTypes: string[];
  matchedDocumentIds: string[];
}
