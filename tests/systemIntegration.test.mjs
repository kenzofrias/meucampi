import test from 'node:test';
import assert from 'node:assert/strict';

// 1. Polyfill in-memory localStorage for Node test runner
const memoryStorage = new Map();
globalThis.localStorage = {
  getItem: (key) => (memoryStorage.has(key) ? memoryStorage.get(key) : null),
  setItem: (key, val) => memoryStorage.set(key, String(val)),
  removeItem: (key) => memoryStorage.delete(key),
  clear: () => memoryStorage.clear(),
};

// 2. Import modules
import { storageService } from '../src/services/storageService.ts';
import { getDaysUntilDeadline, getDeadlineInfo } from '../src/utils/deadlines.ts';

// Helper to reset storage before tests
function resetStorage() {
  memoryStorage.clear();
}

// =========================================================================
// SUITE 1: CRUD E CICLO DE VIDA COMPLETO DE DOCUMENTOS
// =========================================================================

test('Suite 1.1: Inicialização do Storage com Documentos Padrão e Migração de Prazos', () => {
  resetStorage();
  const docs = storageService.getDocuments();

  assert.ok(Array.isArray(docs), 'Deve retornar um array');
  assert.ok(docs.length >= 7, 'Deve conter pelo menos 7 documentos padrão');

  // Verifica se a migração automática populou prazos nos itens padrão conhecidos
  const doc4 = docs.find((d) => d.id === 'doc-4');
  assert.ok(doc4, 'doc-4 deve existir');
  assert.equal(doc4.dueDate, '2026-11-01');
  assert.equal(doc4.dueDateType, 'entrega');

  const doc1 = docs.find((d) => d.id === 'doc-1');
  assert.equal(doc1?.dueDate, '2026-12-31');
  assert.equal(doc1?.dueDateType, 'expiracao');
});

test('Suite 1.2: Criação de Novo Documento (addDocument) com Todos os Metadados', () => {
  resetStorage();
  const novoDoc = storageService.addDocument({
    title: 'Relatório Final de Estágio Supervisionado',
    scope: 'estagio',
    semester: '2026.2',
    disciplineId: 'disc-2',
    disciplineName: 'Engenharia de Software II',
    professorName: 'Profa. Dra. Mariana Costa',
    description: 'Relatório de 300 horas cumpridas na Nexus Tech.',
    tags: ['Estágio', 'Relatório', 'Obrigatório'],
    fileName: 'relatorio_final_estagio.pdf',
    fileType: 'pdf',
    fileSize: '3.1 MB',
    verificationCode: 'ESTAG-FINAL-2026-OK',
    dueDate: '2026-11-10',
    dueDateType: 'entrega',
  });

  assert.ok(novoDoc.id.startsWith('doc-'), 'ID deve iniciar com doc-');
  assert.ok(novoDoc.createdAt, 'Deve ter createdAt');
  assert.ok(novoDoc.updatedAt, 'Deve ter updatedAt');
  assert.equal(novoDoc.isDeleted, false, 'Novo documento não deve estar na lixeira');
  assert.equal(novoDoc.dueDate, '2026-11-10');
  assert.equal(novoDoc.dueDateType, 'entrega');

  // Verifica se persistiu no storage
  const docs = storageService.getDocuments();
  const encontrado = docs.find((d) => d.id === novoDoc.id);
  assert.ok(encontrado, 'Deve estar persistido no storage');
  assert.equal(encontrado.title, 'Relatório Final de Estágio Supervisionado');
});

test('Suite 1.3: Atualização de Documento (updateDocument) alterando Metadados e Prazos', () => {
  resetStorage();
  const docs = storageService.getDocuments();
  const targetId = docs[0].id;

  const atualizado = storageService.updateDocument(targetId, {
    title: 'Título Totalmente Atualizado',
    dueDate: '2026-12-15',
    dueDateType: 'expiracao',
  });

  assert.ok(atualizado, 'Deve retornar o item atualizado');
  assert.equal(atualizado.id, targetId, 'ID não deve mudar');
  assert.equal(atualizado.title, 'Título Totalmente Atualizado');
  assert.equal(atualizado.dueDate, '2026-12-15');
  assert.equal(atualizado.dueDateType, 'expiracao');

  // Verifica se foi salvo
  const docsRecarregados = storageService.getDocuments();
  const salvo = docsRecarregados.find((d) => d.id === targetId);
  assert.equal(salvo?.title, 'Título Totalmente Atualizado');
  assert.equal(salvo?.dueDate, '2026-12-15');
});

test('Suite 1.4: Remoção Opcional de Prazo na Edição', () => {
  resetStorage();
  const docs = storageService.getDocuments();
  const docComPrazo = docs.find((d) => d.dueDate);
  assert.ok(docComPrazo, 'Deve haver um documento com prazo');

  const atualizado = storageService.updateDocument(docComPrazo.id, {
    dueDate: undefined,
    dueDateType: undefined,
  });

  assert.equal(atualizado?.dueDate, undefined);
  assert.equal(atualizado?.dueDateType, undefined);
});

test('Suite 1.5: Ciclo de Lixeira: Mover, Restaurar, Deletar Permanente e Esvaziar', () => {
  resetStorage();
  const docs = storageService.getDocuments();
  const docAtivo = docs.find((d) => !d.isDeleted);
  assert.ok(docAtivo, 'Deve haver doc ativo');

  // 1. Mover para a lixeira
  storageService.moveDocumentToTrash(docAtivo.id);
  let atualizados = storageService.getDocuments();
  let itemLixeira = atualizados.find((d) => d.id === docAtivo.id);
  assert.equal(itemLixeira?.isDeleted, true);
  assert.ok(itemLixeira?.deletedAt, 'Deve ter data de exclusão');

  // 2. Restaurar da lixeira
  storageService.restoreDocument(docAtivo.id);
  atualizados = storageService.getDocuments();
  let itemRestaurado = atualizados.find((d) => d.id === docAtivo.id);
  assert.equal(itemRestaurado?.isDeleted, false);
  assert.equal(itemRestaurado?.deletedAt, undefined);

  // 3. Exclusão permanente individual
  storageService.permanentlyDeleteDocument(docAtivo.id);
  atualizados = storageService.getDocuments();
  assert.equal(atualizados.some((d) => d.id === docAtivo.id), false);

  // 4. Esvaziar lixeira (emptyTrash)
  // Envia outro item para lixeira
  const outroDoc = atualizados[0];
  storageService.moveDocumentToTrash(outroDoc.id);
  storageService.emptyTrash();
  atualizados = storageService.getDocuments();
  assert.equal(atualizados.some((d) => d.isDeleted), false, 'Nenhum item deletado deve sobrar');
});

test('Suite 1.6: Retenção e Expiração Automática da Lixeira de 30 dias', () => {
  resetStorage();
  
  // Item deletado há 5 dias: deve restar ~25 dias
  const cincoDiasAtras = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString();
  const diasRestantes = storageService.getRemainingDaysInTrash(cincoDiasAtras);
  assert.equal(diasRestantes, 25);

  // Item deletado há 31 dias: auto-purge deve removê-lo ao chamar getDocuments()
  const trintaUmDiasAtras = new Date(Date.now() - 31 * 24 * 60 * 60 * 1000).toISOString();
  const itemExpirado = {
    id: 'doc-muito-antigo-lixeira',
    title: 'Expirado há mais de 30 dias',
    scope: 'secretaria',
    semester: '2024.1',
    tags: [],
    fileName: 'antigo.pdf',
    fileType: 'pdf',
    fileSize: '100 KB',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    isDeleted: true,
    deletedAt: trintaUmDiasAtras,
  };

  const listaAtual = storageService.getDocuments();
  storageService.saveDocuments([...listaAtual, itemExpirado]);

  // Ao chamar getDocuments, ele deve expurgar o item antigo automaticamente
  const docsAposPurge = storageService.getDocuments();
  assert.equal(docsAposPurge.some((d) => d.id === 'doc-muito-antigo-lixeira'), false);
});

// =========================================================================
// SUITE 2: GERENCIAMENTO DE PERFIL E DISCIPLINAS
// =========================================================================

test('Suite 2.1: Leitura e Edição da Realidade Universitária (Perfil)', () => {
  resetStorage();
  const perfil = storageService.getProfile();
  assert.equal(perfil.studentName, 'Kenzo Frias');
  assert.equal(perfil.activePeriod, '2026.2');

  const novoPerfil = {
    ...perfil,
    currentSemesterOrdinal: '7º Semestre',
    activePeriod: '2027.1',
    courseName: 'Engenharia de Software',
  };
  storageService.saveProfile(novoPerfil);

  const perfilSalvo = storageService.getProfile();
  assert.equal(perfilSalvo.currentSemesterOrdinal, '7º Semestre');
  assert.equal(perfilSalvo.activePeriod, '2027.1');
  assert.equal(perfilSalvo.courseName, 'Engenharia de Software');
});

test('Suite 2.2: Gerenciamento de Disciplinas (Adição e Remoção)', () => {
  resetStorage();
  const discsIniciais = storageService.getDisciplines();
  const qtdInicial = discsIniciais.length;

  // Adicionar nova disciplina
  const novaDisc = storageService.addDiscipline({
    name: 'Compiladores e Teoria da Computação',
    professorName: 'Prof. Marcelo Santos',
    semester: '2026.2',
  });

  assert.ok(novaDisc.id.startsWith('disc-'));
  assert.equal(novaDisc.name, 'Compiladores e Teoria da Computação');

  const discsAtualizadas = storageService.getDisciplines();
  assert.equal(discsAtualizadas.length, qtdInicial + 1);

  // Deletar a disciplina
  storageService.deleteDiscipline(novaDisc.id);
  const discsFinais = storageService.getDisciplines();
  assert.equal(discsFinais.length, qtdInicial);
  assert.equal(discsFinais.some((d) => d.id === novaDisc.id), false);
});

// =========================================================================
// SUITE 3: MOTOR DE FILTROS E BUSCA MULTICRITÉRIO INTEGRADO
// =========================================================================

test('Suite 3.1: Filtro por Semestre Letivo', () => {
  resetStorage();
  const docs = storageService.getDocuments().filter((d) => !d.isDeleted);

  const docs2026_2 = docs.filter((d) => d.semester === '2026.2');
  assert.ok(docs2026_2.length > 0);
  assert.ok(docs2026_2.every((d) => d.semester === '2026.2'));

  const docs2026_1 = docs.filter((d) => d.semester === '2026.1');
  assert.ok(docs2026_1.length > 0);
  assert.ok(docs2026_1.every((d) => d.semester === '2026.1'));
});

test('Suite 3.2: Filtro por Âmbito Institucional (Os 5 Escopos)', () => {
  resetStorage();
  const docs = storageService.getDocuments().filter((d) => !d.isDeleted);

  const escopos = ['secretaria', 'aulas', 'certificados', 'projetos', 'estagio'];
  for (const escopo of escopos) {
    const filtrados = docs.filter((d) => d.scope === escopo);
    assert.ok(filtrados.length > 0, `Deve haver pelo menos um documento para o escopo ${escopo}`);
    assert.ok(filtrados.every((d) => d.scope === escopo));
  }
});

test('Suite 3.3: Filtro por Tags e Disciplina', () => {
  resetStorage();
  const docs = storageService.getDocuments().filter((d) => !d.isDeleted);

  // Filtro por Tag 'Matrícula'
  const tagMatricula = docs.filter((d) => d.tags.includes('Matrícula'));
  assert.ok(tagMatricula.length > 0);
  assert.ok(tagMatricula.every((d) => d.tags.includes('Matrícula')));

  // Filtro por Disciplina 'disc-3'
  const disc3Docs = docs.filter((d) => d.disciplineId === 'disc-3');
  assert.ok(disc3Docs.length > 0);
  assert.ok(disc3Docs.every((d) => d.disciplineId === 'disc-3'));
});

test('Suite 3.4: Busca Textual Global (Título, Professor, Matéria, Tag, Código de Validação)', () => {
  resetStorage();
  const docs = storageService.getDocuments().filter((d) => !d.isDeleted);

  const executeSearch = (q) => {
    const term = q.toLowerCase();
    return docs.filter((d) => {
      const matchTitle = d.title.toLowerCase().includes(term);
      const matchDesc = d.description?.toLowerCase().includes(term) || false;
      const matchDisc = d.disciplineName?.toLowerCase().includes(term) || false;
      const matchProf = d.professorName?.toLowerCase().includes(term) || false;
      const matchCode = d.verificationCode?.toLowerCase().includes(term) || false;
      const matchTag = d.tags.some((t) => t.toLowerCase().includes(term));
      return matchTitle || matchDesc || matchDisc || matchProf || matchCode || matchTag;
    });
  };

  // 1. Busca por nome do professor
  const resProf = executeSearch('Albuquerque');
  assert.ok(resProf.length > 0);
  assert.ok(resProf.every((d) => d.professorName?.includes('Albuquerque')));

  // 2. Busca por código de verificação
  const resCode = executeSearch('UNICAMP-2026-MAT-9941');
  assert.equal(resCode.length, 1);
  assert.equal(resCode[0].id, 'doc-1');

  // 3. Busca por tag
  const resTag = executeSearch('Sockets');
  assert.ok(resTag.some((d) => d.id === 'doc-4'));
});

test('Suite 3.5: Combinação Multicritério Extrema (Semestre + Âmbito + Disciplina + Prazo Urgente + Busca)', () => {
  resetStorage();
  const docs = storageService.getDocuments().filter((d) => !d.isDeleted);

  const resultado = docs.filter((doc) => {
    // 1. Semestre
    if (doc.semester !== '2026.2') return false;
    // 2. Âmbito
    if (doc.scope !== 'aulas') return false;
    // 3. Disciplina
    if (doc.disciplineId !== 'disc-3') return false;
    // 4. Prazo Urgente
    if (!doc.dueDate) return false;
    const info = getDeadlineInfo(doc.dueDate, doc.dueDateType);
    if (!info || !info.isUrgent) return false;
    // 5. Busca por texto
    if (!doc.title.toLowerCase().includes('sockets')) return false;

    return true;
  });

  // Deve encontrar exatamente a Lista de Exercícios 02 (doc-4)
  assert.equal(resultado.length, 1);
  assert.equal(resultado[0].id, 'doc-4');
  assert.equal(resultado[0].title, 'Lista de Exercícios 02 - Sockets e Comunicação RPC');
});

// =========================================================================
// SUITE 4: AGREGAÇÕES E CONTADORES DO DASHBOARD
// =========================================================================

test('Suite 4.1: Cálculo de Contagens por Semestre (semesterCounts)', () => {
  resetStorage();
  const activeDocs = storageService.getDocuments().filter((d) => !d.isDeleted);
  
  const counts = { all: activeDocs.length };
  activeDocs.forEach((doc) => {
    counts[doc.semester] = (counts[doc.semester] || 0) + 1;
  });

  assert.equal(counts.all, activeDocs.length);
  assert.ok(counts['2026.2'] > 0);
  assert.ok(counts['2026.1'] > 0);
});

test('Suite 4.2: Extração de Tags Únicas do Sistema (allAvailableTags)', () => {
  resetStorage();
  const activeDocs = storageService.getDocuments().filter((d) => !d.isDeleted);

  const tagsSet = new Set();
  activeDocs.forEach((d) => d.tags.forEach((t) => tagsSet.add(t)));
  const allTags = Array.from(tagsSet);

  // Não pode haver duplicatas
  const hasDuplicates = new Set(allTags).size !== allTags.length;
  assert.equal(hasDuplicates, false);
  assert.ok(allTags.includes('Matrícula'));
  assert.ok(allTags.includes('TCE'));
});

test('Suite 4.3: Contadores de Prazos Totais e Prazos Urgentes', () => {
  resetStorage();
  const activeDocs = storageService.getDocuments().filter((d) => !d.isDeleted);

  let totalWithDeadline = 0;
  let urgentCount = 0;

  activeDocs.forEach((doc) => {
    if (doc.dueDate) {
      totalWithDeadline++;
      const info = getDeadlineInfo(doc.dueDate, doc.dueDateType);
      if (info && info.isUrgent) urgentCount++;
    }
  });

  assert.ok(totalWithDeadline >= 3, 'Deve ter pelo menos 3 documentos com prazo nos dados padrão');
  assert.ok(urgentCount >= 1, 'Deve ter pelo menos 1 documento urgente nos dados padrão');
  assert.ok(totalWithDeadline >= urgentCount, 'Total com prazo não pode ser menor que urgentes');
});

// =========================================================================
// SUITE 5: NOTIFICAÇÕES VISUAIS E PAINEL DE LEMBRETES
// =========================================================================

test('Suite 5.1: Central de Lembretes (RemindersPopover) - Ordenação e Filtro de Deletados', () => {
  resetStorage();
  const allDocs = storageService.getDocuments();

  // Garante que itens deletados NÃO entrem na central de lembretes
  const reminderItems = allDocs
    .filter((d) => !d.isDeleted && Boolean(d.dueDate))
    .map((doc) => ({
      doc,
      info: getDeadlineInfo(doc.dueDate, doc.dueDateType),
    }))
    .filter((item) => item.info !== null)
    .sort((a, b) => a.info.daysRemaining - b.info.daysRemaining);

  assert.ok(reminderItems.length > 0);
  // Todos os itens devem estar ativos
  assert.ok(reminderItems.every((item) => !item.doc.isDeleted));

  // Ordenação deve ser estritamente não-decrescente
  for (let i = 1; i < reminderItems.length; i++) {
    assert.ok(
      reminderItems[i].info.daysRemaining >= reminderItems[i - 1].info.daysRemaining,
      'Lembretes devem estar ordenados por urgência'
    );
  }
});

test('Suite 5.2: Ativação Condicional do Banner de Alerta Crítico (DeadlineAlertBanner)', () => {
  resetStorage();
  const allDocs = storageService.getDocuments();

  // Com documentos padrão, deve existir item urgente
  const hasUrgent = allDocs.some((d) => {
    if (d.isDeleted || !d.dueDate) return false;
    const info = getDeadlineInfo(d.dueDate, d.dueDateType);
    return info && info.isUrgent;
  });
  assert.equal(hasUrgent, true, 'Banner deve estar ativo quando há urgências');

  // Se removermos os prazos dos itens urgentes, o banner não deve ser ativado
  const semUrgencias = allDocs.map((d) => {
    if (d.id === 'doc-4') return { ...d, dueDate: undefined };
    return d;
  });
  const hasUrgentAposLimpar = semUrgencias.some((d) => {
    if (d.isDeleted || !d.dueDate) return false;
    const info = getDeadlineInfo(d.dueDate, d.dueDateType);
    return info && info.isUrgent;
  });
  assert.equal(hasUrgentAposLimpar, false, 'Banner não deve ativar se não houver pendências urgentes');
});

// =========================================================================
// SUITE 6: RESILIÊNCIA E CASOS DE BORDA
// =========================================================================

test('Suite 6.1: Documento Mínimo Sem Campos Opcionais Não Corrompe o Sistema', () => {
  resetStorage();
  const docMinimo = storageService.addDocument({
    title: 'Anotações Simples',
    scope: 'aulas',
    semester: '2026.2',
    tags: [],
    fileName: 'anotacoes.txt',
    fileType: 'doc',
    fileSize: '12 KB',
  });

  assert.ok(docMinimo.id);
  assert.equal(docMinimo.disciplineId, undefined);
  assert.equal(docMinimo.professorName, undefined);
  assert.equal(docMinimo.dueDate, undefined);

  // Deve ser filtrável sem erros
  const docs = storageService.getDocuments();
  const filtrado = docs.filter((d) => d.id === docMinimo.id);
  assert.equal(filtrado.length, 1);

  // getDeadlineInfo deve lidar com segurança
  const deadline = getDeadlineInfo(docMinimo.dueDate, docMinimo.dueDateType);
  assert.equal(deadline, null);
});

test('Suite 6.2: Cálculo de Prazos em Viradas de Mês e Ano', () => {
  // Teste de cálculo entre meses (ex: virada de Outubro para Novembro)
  const diffViradaMes = getDaysUntilDeadline('2026-11-01');
  // Se hoje for 29/10/2026: 31 - 29 + 1 = 3 dias
  assert.ok(typeof diffViradaMes === 'number');

  // Teste de virada de ano (ex: 2027-01-01)
  const diffViradaAno = getDaysUntilDeadline('2027-01-01');
  assert.ok(diffViradaAno > 30, 'Virada de ano deve ter mais de 30 dias');
});

test('Suite 6.3: Resiliência contra LocalStorage Indisponível ou Corrompido', () => {
  // Simula dado corrompido no localStorage
  memoryStorage.set('meucampi_documents', 'INVALID_JSON_DATA{{{');
  
  // storageService deve capturar o erro via try/catch e retornar os documentos padrão sem travar a aplicação
  const docs = storageService.getDocuments();
  assert.ok(Array.isArray(docs));
  assert.ok(docs.length > 0);
});

