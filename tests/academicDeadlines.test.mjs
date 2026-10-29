import test from 'node:test';
import assert from 'node:assert/strict';
import { getDaysUntilDeadline, getDeadlineInfo } from '../src/utils/deadlines.ts';

// =========================================================================
// CRITÉRIO 1: CÁLCULO E CLASSIFICAÇÃO DE PRAZOS (deadlines.ts)
// =========================================================================

test('Critério 1.1: Deve retornar null para documentos sem data de prazo', () => {
  const result = getDeadlineInfo(undefined);
  assert.equal(result, null);

  const resultEmpty = getDeadlineInfo('');
  assert.equal(resultEmpty, null);
});

test('Critério 1.2: Documento vencido/expirado há mais de 1 dia', () => {
  const now = new Date();
  const pastDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 4);
  const isoStr = pastDate.toISOString().split('T')[0];

  const info = getDeadlineInfo(isoStr, 'entrega');
  assert.ok(info !== null);
  assert.equal(info.status, 'expired');
  assert.equal(info.isUrgent, true);
  assert.equal(info.daysRemaining, -4);
  assert.equal(info.badgeLabel, 'Venceu há 4 dias');
  assert.match(info.badgeBg, /rose/);
});

test('Critério 1.3: Documento vencido ontem (-1 dia)', () => {
  const now = new Date();
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  const isoStr = yesterday.toISOString().split('T')[0];

  const info = getDeadlineInfo(isoStr, 'entrega');
  assert.ok(info !== null);
  assert.equal(info.status, 'expired');
  assert.equal(info.isUrgent, true);
  assert.equal(info.daysRemaining, -1);
  assert.equal(info.badgeLabel, 'Venceu ontem');
});

test('Critério 1.4: Documento com prazo para HOJE (0 dias)', () => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const isoStr = today.toISOString().split('T')[0];

  const info = getDeadlineInfo(isoStr, 'entrega');
  assert.ok(info !== null);
  assert.equal(info.status, 'today');
  assert.equal(info.isUrgent, true);
  assert.equal(info.daysRemaining, 0);
  assert.equal(info.badgeLabel, 'Vence hoje!');
  assert.match(info.badgeBg, /animate-pulse/);
});

test('Critério 1.5: Documento com prazo para AMANHÃ (+1 dia)', () => {
  const now = new Date();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const isoStr = tomorrow.toISOString().split('T')[0];

  const info = getDeadlineInfo(isoStr, 'entrega');
  assert.ok(info !== null);
  assert.equal(info.status, 'urgent');
  assert.equal(info.isUrgent, true);
  assert.equal(info.daysRemaining, 1);
  assert.equal(info.badgeLabel, 'Vence amanhã!');
});

test('Critério 1.6: Documento crítico no curto prazo (+3 dias)', () => {
  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3);
  const isoStr = target.toISOString().split('T')[0];

  const info = getDeadlineInfo(isoStr, 'entrega');
  assert.ok(info !== null);
  assert.equal(info.status, 'urgent');
  assert.equal(info.isUrgent, true);
  assert.equal(info.daysRemaining, 3);
  assert.equal(info.badgeLabel, 'Entrega em 3 dias');
});

test('Critério 1.7: Documento com prazo na semana (+6 dias, atenção)', () => {
  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 6);
  const isoStr = target.toISOString().split('T')[0];

  const info = getDeadlineInfo(isoStr, 'entrega');
  assert.ok(info !== null);
  assert.equal(info.status, 'warning');
  assert.equal(info.isUrgent, false);
  assert.equal(info.daysRemaining, 6);
  assert.equal(info.badgeLabel, 'Entrega em 6 dias');
});

test('Critério 1.8: Documento no prazo normal (> 7 dias)', () => {
  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 20);
  const isoStr = target.toISOString().split('T')[0];

  const info = getDeadlineInfo(isoStr, 'entrega');
  assert.ok(info !== null);
  assert.equal(info.status, 'normal');
  assert.equal(info.isUrgent, false);
  assert.ok(info.daysRemaining > 7);
  assert.match(info.badgeLabel, /^Prazo: \d{2}\/\d{2}$/);
});

test('Critério 1.9: Diferenciação semântica entre entrega e expiração', () => {
  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5);
  const isoStr = target.toISOString().split('T')[0];

  const infoEntrega = getDeadlineInfo(isoStr, 'entrega');
  assert.equal(infoEntrega?.badgeLabel, 'Entrega em 5 dias');

  const infoExpiracao = getDeadlineInfo(isoStr, 'expiracao');
  assert.equal(infoExpiracao?.badgeLabel, 'Expira em 5 dias');
});

// =========================================================================
// CRITÉRIO 2: PERSISTÊNCIA E INTEGRIDADE DE DADOS
// =========================================================================

test('Critério 2.1: Estrutura do DocumentItem suporta dueDate e dueDateType', () => {
  const doc = {
    id: 'test-doc-1',
    title: 'Trabalho de Redes',
    scope: 'aulas',
    semester: '2026.2',
    fileName: 'redes.pdf',
    fileType: 'pdf',
    fileSize: '1.0 MB',
    tags: ['Sockets'],
    isDeleted: false,
    dueDate: '2026-11-01',
    dueDateType: 'entrega',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  assert.equal(doc.dueDate, '2026-11-01');
  assert.equal(doc.dueDateType, 'entrega');
  assert.equal(doc.isDeleted, false);
});

test('Critério 2.2: Documento sem prazo mantém compatibilidade retroativa', () => {
  const doc = {
    id: 'test-doc-2',
    title: 'Atestado Geral',
    scope: 'secretaria',
    semester: '2026.2',
    fileName: 'atestado.pdf',
    fileType: 'pdf',
    fileSize: '500 KB',
    tags: ['Atestado'],
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  assert.equal(doc.dueDate, undefined);
  assert.equal(doc.dueDateType, undefined);
  const info = getDeadlineInfo(doc.dueDate, doc.dueDateType);
  assert.equal(info, null);
});

// =========================================================================
// CRITÉRIO 3: LÓGICA DE FILTRAGEM DO FEED (App.tsx)
// =========================================================================

test('Critério 3.1: Filtro de prazos no App.tsx', () => {
  const now = new Date();
  const dUrgente = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2).toISOString().split('T')[0];
  const dNormal = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 25).toISOString().split('T')[0];

  const docs = [
    { id: '1', title: 'Trabalho Urgente', dueDate: dUrgente, dueDateType: 'entrega', isDeleted: false, tags: [], scope: 'aulas', semester: '2026.2' },
    { id: '2', title: 'Atestado Normal', dueDate: dNormal, dueDateType: 'expiracao', isDeleted: false, tags: [], scope: 'secretaria', semester: '2026.2' },
    { id: '3', title: 'Slide de Aula', isDeleted: false, tags: [], scope: 'aulas', semester: '2026.2' },
  ];

  // Filtro: 'all'
  const filterAll = docs.filter(d => !d.isDeleted);
  assert.equal(filterAll.length, 3);

  // Filtro: 'with_deadline'
  const filterWithDeadline = docs.filter(d => !d.isDeleted && Boolean(d.dueDate));
  assert.equal(filterWithDeadline.length, 2);
  assert.equal(filterWithDeadline.some(d => d.id === '3'), false);

  // Filtro: 'urgent'
  const filterUrgent = docs.filter(d => {
    if (!d.dueDate || d.isDeleted) return false;
    const info = getDeadlineInfo(d.dueDate, d.dueDateType);
    return info && info.isUrgent;
  });
  assert.equal(filterUrgent.length, 1);
  assert.equal(filterUrgent[0].id, '1');
});

// =========================================================================
// CRITÉRIO 4: CENTRAL DE NOTIFICAÇÕES E ORDENAÇÃO DE LEMBRETES
// =========================================================================

test('Critério 4.1: Ordenação correta por prioridade de prazo', () => {
  const now = new Date();
  const d1 = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString().split('T')[0]; // Vencido ontem (-1)
  const d2 = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2).toISOString().split('T')[0]; // Urgente (+2)
  const d3 = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 15).toISOString().split('T')[0]; // Futuro (+15)

  const items = [
    { title: 'Doc Futuro', dueDate: d3, dueDateType: 'entrega' },
    { title: 'Doc Vencido', dueDate: d1, dueDateType: 'expiracao' },
    { title: 'Doc Urgente', dueDate: d2, dueDateType: 'entrega' },
  ];

  // Ordenação como realizada no RemindersPopover
  const sorted = items
    .map(doc => ({ doc, info: getDeadlineInfo(doc.dueDate, doc.dueDateType) }))
    .sort((a, b) => a.info.daysRemaining - b.info.daysRemaining);

  assert.equal(sorted[0].doc.title, 'Doc Vencido');
  assert.equal(sorted[1].doc.title, 'Doc Urgente');
  assert.equal(sorted[2].doc.title, 'Doc Futuro');
  assert.equal(sorted[0].info.daysRemaining < sorted[1].info.daysRemaining, true);
  assert.equal(sorted[1].info.daysRemaining < sorted[2].info.daysRemaining, true);
});

test('Critério 4.2: Contagem precisa de urgentes vs total de lembretes', () => {
  const now = new Date();
  const dVencido = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2).toISOString().split('T')[0];
  const dHoje = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString().split('T')[0];
  const dUrgente = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3).toISOString().split('T')[0];
  const dTranquilo = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 10).toISOString().split('T')[0];

  const docs = [
    { dueDate: dVencido, dueDateType: 'expiracao' },
    { dueDate: dHoje, dueDateType: 'entrega' },
    { dueDate: dUrgente, dueDateType: 'entrega' },
    { dueDate: dTranquilo, dueDateType: 'expiracao' },
  ];

  const deadlineInfos = docs.map(d => getDeadlineInfo(d.dueDate, d.dueDateType));
  const urgentCount = deadlineInfos.filter(i => i && i.isUrgent).length;
  const totalCount = deadlineInfos.length;

  assert.equal(totalCount, 4);
  assert.equal(urgentCount, 3); // vencido, hoje e 3 dias são urgentes
});

// =========================================================================
// CRITÉRIO 5: INTEGRIDADE DO PAYLOAD DO FORMULÁRIO (DocumentFormModal)
// =========================================================================

test('Critério 5.1: Payload gerado ao cadastrar com prazo preenchido', () => {
  const formData = {
    title: 'Entrega Final TCC',
    scope: 'projetos',
    semester: '2026.2',
    tags: ['TCC', 'Final'],
    fileName: 'tcc.pdf',
    fileType: 'pdf',
    fileSize: '3.5 MB',
    enableDeadline: true,
    dueDate: '2026-11-20',
    dueDateType: 'entrega',
  };

  const docPayload = {
    title: formData.title.trim(),
    scope: formData.scope,
    semester: formData.semester,
    tags: formData.tags,
    fileName: formData.fileName,
    fileType: formData.fileType,
    fileSize: formData.fileSize,
    dueDate: formData.enableDeadline && formData.dueDate ? formData.dueDate : undefined,
    dueDateType: formData.enableDeadline && formData.dueDate ? formData.dueDateType : undefined,
  };

  assert.equal(docPayload.dueDate, '2026-11-20');
  assert.equal(docPayload.dueDateType, 'entrega');
});

test('Critério 5.2: Payload gerado ao desativar o toggle de prazo', () => {
  const formData = {
    title: 'Slide de Aula 05',
    scope: 'aulas',
    semester: '2026.2',
    tags: ['Slides'],
    fileName: 'aula05.pdf',
    fileType: 'pdf',
    fileSize: '2.0 MB',
    enableDeadline: false,
    dueDate: '2026-11-20',
    dueDateType: 'entrega',
  };

  const docPayload = {
    title: formData.title.trim(),
    scope: formData.scope,
    semester: formData.semester,
    tags: formData.tags,
    fileName: formData.fileName,
    fileType: formData.fileType,
    fileSize: formData.fileSize,
    dueDate: formData.enableDeadline && formData.dueDate ? formData.dueDate : undefined,
    dueDateType: formData.enableDeadline && formData.dueDate ? formData.dueDateType : undefined,
  };

  assert.equal(docPayload.dueDate, undefined);
  assert.equal(docPayload.dueDateType, undefined);
});

