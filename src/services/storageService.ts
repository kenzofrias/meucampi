import type { DocumentItem, UniversityProfile, Discipline, AcademicScope } from '../types/index.ts';

const STORAGE_KEYS = {
  PROFILE: 'meucampi_profile',
  DOCUMENTS: 'meucampi_documents',
  DISCIPLINES: 'meucampi_disciplines',
};

const DEFAULT_PROFILE: UniversityProfile = {
  universityName: 'Universidade Estadual de Campinas (UNICAMP)',
  courseName: 'Bacharelado em Ciência da Computação',
  currentSemesterOrdinal: '6º Semestre',
  activePeriod: '2026.2',
  studentName: 'Kenzo Frias',
  registrationNumber: '202310842-SP',
};

const DEFAULT_DISCIPLINES: Discipline[] = [
  {
    id: 'disc-1',
    name: 'Algoritmos e Estruturas de Dados Avançadas',
    professorName: 'Prof. Dr. Henrique Albuquerque',
    semester: '2026.2',
  },
  {
    id: 'disc-2',
    name: 'Engenharia de Software II',
    professorName: 'Profa. Dra. Mariana Costa',
    semester: '2026.2',
  },
  {
    id: 'disc-3',
    name: 'Redes e Sistemas Distribuídos',
    professorName: 'Prof. Carlos Eduardo Mendes',
    semester: '2026.2',
  },
  {
    id: 'disc-4',
    name: 'Banco de Dados & Big Data',
    professorName: 'Prof. Roberto Silveira',
    semester: '2026.1',
  },
];

const DEFAULT_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-1',
    title: 'Comprovante de Matrícula Oficial - 2026.2',
    scope: 'secretaria',
    semester: '2026.2',
    description: 'Atestado emitido com autenticação digital para passe estudantil e comprovação de vínculo.',
    tags: ['Matrícula', 'Atestado', 'Oficial', 'PasseEscolar'],
    fileName: 'comprovante_matricula_2026_2.pdf',
    fileType: 'pdf',
    fileSize: '1.2 MB',
    verificationCode: 'UNICAMP-2026-MAT-9941-K8F',
    dueDate: '2026-12-31',
    dueDateType: 'expiracao',
    createdAt: '2026-08-10T10:00:00.000Z',
    updatedAt: '2026-08-10T10:00:00.000Z',
    isDeleted: false,
    sampleContent: `UNIVERSIDADE ESTADUAL DE CAMPINAS\nDIRETORIA ACADÊMICA - REGISTRO ESCOLAR\n\nATESTADO DE MATRÍCULA E FREQUÊNCIA REGULAR\n\nCertificamos que KENZO FRIAS, RA 202310842-SP, está regularmente matriculado no 6º Semestre do curso de Bacharelado em Ciência da Computação no período letivo de 2026.2.\n\nCódigo de Validação: UNICAMP-2026-MAT-9941-K8F\nValidade: 31/12/2026`,
  },
  {
    id: 'doc-2',
    title: 'Histórico Escolar Analítico com CR',
    scope: 'secretaria',
    semester: '2026.2',
    description: 'Histórico completo consolidado com notas, Coeficiente de Rendimento (CR 8.74) e carga horária.',
    tags: ['Histórico', 'CR', 'Integralização', 'Notas'],
    fileName: 'historico_escolar_atualizado.pdf',
    fileType: 'pdf',
    fileSize: '2.4 MB',
    verificationCode: 'HIST-UNICAMP-88123-VERIF',
    createdAt: '2026-08-05T14:30:00.000Z',
    updatedAt: '2026-08-05T14:30:00.000Z',
    isDeleted: false,
    sampleContent: `UNIVERSIDADE ESTADUAL DE CAMPINAS\nHISTÓRICO ESCOLAR DE GRADUAÇÃO\n\nAluno: Kenzo Frias | RA: 202310842-SP\nCoeficiente de Rendimento Médio: 8.74\nHoras Cumpridas: 1.840h de 3.200h (57.5% Integralizado)\nSituação Cadastral: Regular Ativo`,
  },
  {
    id: 'doc-3',
    title: 'Slides Aula 04 - Árvores Rubro-Negras e Grafos',
    scope: 'aulas',
    semester: '2026.2',
    disciplineId: 'disc-1',
    disciplineName: 'Algoritmos e Estruturas de Dados Avançadas',
    professorName: 'Prof. Dr. Henrique Albuquerque',
    description: 'Conceitos de balanceamento, rotação e complexidade assintótica O(log n). Conteúdo da P1.',
    tags: ['Slides', 'Grafos', 'ProvaP1', 'Resumo'],
    fileName: 'aula04_arvores_rubro_negras.pdf',
    fileType: 'pdf',
    fileSize: '3.8 MB',
    createdAt: '2026-08-18T16:00:00.000Z',
    updatedAt: '2026-08-18T16:00:00.000Z',
    isDeleted: false,
    sampleContent: `AULA 04: ÁRVORES BALANCEADAS RUBRO-NEGRAS\nDisciplina: Algoritmos e Estruturas de Dados Avançadas\nDocente: Prof. Dr. Henrique Albuquerque\n\nPropriedades Invariantes:\n1. Cada nó é vermelho ou preto.\n2. A raiz é estritamente preta.\n3. Se um nó é vermelho, seus filhos são pretos.\n4. Todo caminho da raiz às folhas contém o mesmo número de nós pretos.`,
  },
  {
    id: 'doc-4',
    title: 'Lista de Exercícios 02 - Sockets e Comunicação RPC',
    scope: 'aulas',
    semester: '2026.2',
    disciplineId: 'disc-3',
    disciplineName: 'Redes e Sistemas Distribuídos',
    professorName: 'Prof. Carlos Eduardo Mendes',
    description: 'Implementação de cliente-servidor com concorrência em POSIX threads e TCP.',
    tags: ['ListaExercicios', 'Laboratório', 'Sockets', 'Redes'],
    fileName: 'lista02_distribuidos_redes.pdf',
    fileType: 'pdf',
    fileSize: '850 KB',
    dueDate: '2026-11-01',
    dueDateType: 'entrega',
    createdAt: '2026-08-22T09:15:00.000Z',
    updatedAt: '2026-08-22T09:15:00.000Z',
    isDeleted: false,
    sampleContent: `LISTA PRÁTICA 02 - COMUNICAÇÃO DISTRIBUÍDA\nProblema 1: Desenvolva uma aplicação de chat concorrente em TCP usando threads.\nProblema 2: Implemente um mecanismo de eleição de líder em anel distribuído.`,
  },
  {
    id: 'doc-5',
    title: 'Certificado: Congresso Nacional de Inteligência Artificial',
    scope: 'certificados',
    semester: '2026.1',
    description: 'Apresentação de artigo e participação como ouvinte com 30 horas complementares válidas.',
    tags: ['HorasComplementares', 'Congresso', 'Artigo', 'Certificado'],
    fileName: 'certificado_congresso_ia_2026.pdf',
    fileType: 'pdf',
    fileSize: '1.5 MB',
    verificationCode: 'CERT-CONG-IA-30H-2026',
    createdAt: '2026-05-20T18:00:00.000Z',
    updatedAt: '2026-05-20T18:00:00.000Z',
    isDeleted: false,
    sampleContent: `CERTIFICADO DE PARTICIPAÇÃO E APRESENTAÇÃO\n\nCertificamos que KENZO FRIAS participou do 14º Congresso Nacional de Inteligência Artificial, totalizando 30 horas de atividades acadêmico-científicas reconhecidas.`,
  },
  {
    id: 'doc-6',
    title: 'Termo de Compromisso de Estágio (TCE)',
    scope: 'estagio',
    semester: '2026.2',
    description: 'Contrato tripartite entre UNICAMP, Nexus Tecnologia Ltda e o estudante.',
    tags: ['TCE', 'Contrato', 'SeguroEstagio', 'RelatorioAtividades'],
    fileName: 'tce_assinado_nexus_tech.pdf',
    fileType: 'pdf',
    fileSize: '2.8 MB',
    verificationCode: 'ESTAG-2026-BR-00431',
    dueDate: '2026-11-05',
    dueDateType: 'expiracao',
    createdAt: '2026-08-01T11:00:00.000Z',
    updatedAt: '2026-08-01T11:00:00.000Z',
    isDeleted: false,
    sampleContent: `TERMO DE COMPROMISSO DE ESTÁGIO NÃO-OBRIGATÓRIO\n(Lei Federal nº 11.788/2008)\n\nCONCEDENTE: Nexus Tecnologia Ltda.\nINSTITUIÇÃO DE ENSINO: Universidade Estadual de Campinas (UNICAMP)\nESTAGIÁRIO: Kenzo Frias\nCarga Horária Semanal: 30 horas\nApólice de Seguro de Acidentes: Porto Seguro nº 9942018`,
  },
  {
    id: 'doc-7',
    title: 'Pré-Projeto de TCC - Orquestração em Nuvem',
    scope: 'projetos',
    semester: '2026.2',
    disciplineId: 'disc-2',
    disciplineName: 'Engenharia de Software II',
    professorName: 'Profa. Dra. Mariana Costa',
    description: 'Estruturação do trabalho de conclusão e revisão bibliográfica aprovada.',
    tags: ['TCC', 'IniciacaoCientifica', 'RelatorioPesquisa'],
    fileName: 'pre_projeto_tcc_nuvem.pdf',
    fileType: 'pdf',
    fileSize: '1.9 MB',
    dueDate: '2026-11-15',
    dueDateType: 'entrega',
    createdAt: '2026-08-15T15:00:00.000Z',
    updatedAt: '2026-08-15T15:00:00.000Z',
    isDeleted: false,
    sampleContent: `PROPOSTA DE TRABALHO DE CONCLUSÃO DE CURSO\nTítulo: Avaliação de Desempenho e Eficiência em Microsserviços Reativos\nOrientadora: Profa. Dra. Mariana Costa\nAluno: Kenzo Frias`,
  },
  {
    id: 'doc-8',
    title: 'Atestado de Matrícula Provisório - 2025.1 (Arquivado)',
    scope: 'secretaria',
    semester: '2025.1',
    description: 'Documento de período anterior enviado para a lixeira temporária.',
    tags: ['Matrícula', 'Atestado'],
    fileName: 'atestado_provisorio_2025_1.pdf',
    fileType: 'pdf',
    fileSize: '450 KB',
    createdAt: '2025-02-10T10:00:00.000Z',
    updatedAt: '2026-08-20T10:00:00.000Z',
    isDeleted: true,
    deletedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // Deleted 5 days ago
    sampleContent: `ATESTADO PROVISÓRIO 2025.1 (EXPIRADO)\nDocumento na lixeira temporária de 30 dias.`,
  },
];

export const storageService = {
  // PROFILE
  getProfile(): UniversityProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Storage unavailable, using default profile', e);
    }
    return DEFAULT_PROFILE;
  },

  saveProfile(profile: UniversityProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile', e);
    }
  },

  // DISCIPLINES
  getDisciplines(): Discipline[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DISCIPLINES);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Storage unavailable, using default disciplines', e);
    }
    // initialize defaults
    this.saveDisciplines(DEFAULT_DISCIPLINES);
    return DEFAULT_DISCIPLINES;
  },

  saveDisciplines(disciplines: Discipline[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.DISCIPLINES, JSON.stringify(disciplines));
    } catch (e) {
      console.error('Failed to save disciplines', e);
    }
  },

  addDiscipline(discipline: Omit<Discipline, 'id'>): Discipline {
    const list = this.getDisciplines();
    const newDiscipline: Discipline = {
      ...discipline,
      id: `disc-${Date.now()}`,
    };
    const updated = [newDiscipline, ...list];
    this.saveDisciplines(updated);
    return newDiscipline;
  },

  deleteDiscipline(id: string): void {
    const list = this.getDisciplines();
    const updated = list.filter((d) => d.id !== id);
    this.saveDisciplines(updated);
  },

  // DOCUMENTS
  getDocuments(): DocumentItem[] {
    let docs: DocumentItem[] = [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
      if (data) {
        docs = JSON.parse(data);

        // Auto-enrich sample documents if they miss due dates from previous version
        let needsMigration = false;
        docs = docs.map((d) => {
          if (!d.dueDate) {
            const def = DEFAULT_DOCUMENTS.find((dd) => dd.id === d.id);
            if (def && def.dueDate) {
              needsMigration = true;
              return { ...d, dueDate: def.dueDate, dueDateType: def.dueDateType };
            }
          }
          return d;
        });
        if (needsMigration) {
          this.saveDocuments(docs);
        }
      } else {
        docs = DEFAULT_DOCUMENTS;
        this.saveDocuments(docs);
      }
    } catch (e) {
      console.warn('Storage unavailable, using default documents', e);
      docs = DEFAULT_DOCUMENTS;
    }

    // Auto-purge items in trash older than 30 days
    const now = Date.now();
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
    const validDocs = docs.filter((doc) => {
      if (!doc.isDeleted || !doc.deletedAt) return true;
      const deletedTime = new Date(doc.deletedAt).getTime();
      return now - deletedTime < thirtyDaysMs;
    });

    if (validDocs.length !== docs.length) {
      this.saveDocuments(validDocs);
    }

    return validDocs;
  },

  saveDocuments(documents: DocumentItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
    } catch (e) {
      console.error('Failed to save documents', e);
    }
  },

  addDocument(doc: Omit<DocumentItem, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted'>): DocumentItem {
    const docs = this.getDocuments();
    const now = new Date().toISOString();
    const newDoc: DocumentItem = {
      ...doc,
      id: `doc-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      isDeleted: false,
    };
    const updated = [newDoc, ...docs];
    this.saveDocuments(updated);
    return newDoc;
  },

  updateDocument(id: string, updates: Partial<DocumentItem>): DocumentItem | null {
    const docs = this.getDocuments();
    let updatedItem: DocumentItem | null = null;
    const now = new Date().toISOString();

    const updated = docs.map((doc) => {
      if (doc.id === id) {
        updatedItem = {
          ...doc,
          ...updates,
          updatedAt: now,
        };
        return updatedItem;
      }
      return doc;
    });

    if (updatedItem) {
      this.saveDocuments(updated);
    }
    return updatedItem;
  },

  moveDocumentToTrash(id: string): void {
    const docs = this.getDocuments();
    const now = new Date().toISOString();
    const updated = docs.map((doc) => {
      if (doc.id === id) {
        return {
          ...doc,
          isDeleted: true,
          deletedAt: now,
        };
      }
      return doc;
    });
    this.saveDocuments(updated);
  },

  restoreDocument(id: string): void {
    const docs = this.getDocuments();
    const updated = docs.map((doc) => {
      if (doc.id === id) {
        return {
          ...doc,
          isDeleted: false,
          deletedAt: undefined,
        };
      }
      return doc;
    });
    this.saveDocuments(updated);
  },

  permanentlyDeleteDocument(id: string): void {
    const docs = this.getDocuments();
    const updated = docs.filter((doc) => doc.id !== id);
    this.saveDocuments(updated);
  },

  emptyTrash(): void {
    const docs = this.getDocuments();
    const updated = docs.filter((doc) => !doc.isDeleted);
    this.saveDocuments(updated);
  },

  // Helper: calculate remaining days in trash for a deleted item (up to 30 days)
  getRemainingDaysInTrash(deletedAt?: string): number {
    if (!deletedAt) return 30;
    const deletedTime = new Date(deletedAt).getTime();
    const elapsedMs = Date.now() - deletedTime;
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
    const remainingMs = thirtyDaysMs - elapsedMs;
    const remainingDays = Math.ceil(remainingMs / (24 * 60 * 60 * 1000));
    return Math.max(0, remainingDays);
  },
};
