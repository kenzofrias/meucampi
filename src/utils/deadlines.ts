import type { DueDateType } from '../types/index.ts';

export type DeadlineStatus = 'expired' | 'today' | 'urgent' | 'warning' | 'normal';

export interface DeadlineInfo {
  daysRemaining: number;
  status: DeadlineStatus;
  isUrgent: boolean;
  badgeLabel: string;
  detailLabel: string;
  dateFormatted: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  iconBg: string;
  type: DueDateType;
}

/**
 * Normaliza uma string de data (YYYY-MM-DD ou ISO) e calcula a diferença em dias
 * em relação ao dia de hoje (meia-noite a meia-noite).
 */
export function getDaysUntilDeadline(dueDate: string): number {
  const parts = dueDate.split('T')[0].split('-');
  if (parts.length < 3) return 0;

  const targetYear = parseInt(parts[0], 10);
  const targetMonth = parseInt(parts[1], 10) - 1;
  const targetDay = parseInt(parts[2], 10);

  const targetDate = new Date(targetYear, targetMonth, targetDay, 0, 0, 0, 0);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

  const diffMs = targetDate.getTime() - today.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Retorna as informações completas de estilo e texto para badges e notificações de prazo.
 */
export function getDeadlineInfo(
  dueDate?: string,
  dueDateType: DueDateType = 'entrega'
): DeadlineInfo | null {
  if (!dueDate) return null;

  const daysRemaining = getDaysUntilDeadline(dueDate);
  const dateParts = dueDate.split('T')[0].split('-');
  const dateFormatted =
    dateParts.length === 3
      ? `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`
      : dueDate;

  const isEntrega = dueDateType === 'entrega';
  const actionWord = isEntrega ? 'Entrega' : 'Expira';

  let status: DeadlineStatus = 'normal';
  let isUrgent = false;
  let badgeLabel = '';
  let detailLabel = '';
  let badgeBg = 'bg-slate-100';
  let badgeText = 'text-slate-700';
  let badgeBorder = 'border-slate-200';
  let iconBg = 'bg-slate-500';

  if (daysRemaining < 0) {
    status = 'expired';
    isUrgent = true;
    const absDays = Math.abs(daysRemaining);
    badgeLabel = absDays === 1 ? 'Venceu ontem' : `Venceu há ${absDays} dias`;
    detailLabel = isEntrega ? `Prazo de entrega expirou há ${absDays} dia(s)` : `Documento expirado há ${absDays} dia(s)`;
    badgeBg = 'bg-rose-50';
    badgeText = 'text-rose-700';
    badgeBorder = 'border-rose-200';
    iconBg = 'bg-rose-500';
  } else if (daysRemaining === 0) {
    status = 'today';
    isUrgent = true;
    badgeLabel = 'Vence hoje!';
    detailLabel = isEntrega ? 'Prazo de entrega é HOJE!' : 'Validade do documento expira HOJE!';
    badgeBg = 'bg-red-100 animate-pulse';
    badgeText = 'text-red-800 font-bold';
    badgeBorder = 'border-red-300';
    iconBg = 'bg-red-600';
  } else if (daysRemaining === 1) {
    status = 'urgent';
    isUrgent = true;
    badgeLabel = 'Vence amanhã!';
    detailLabel = isEntrega ? 'Entrega de trabalho amanhã!' : 'Validade expira amanhã!';
    badgeBg = 'bg-amber-100';
    badgeText = 'text-amber-900 font-bold';
    badgeBorder = 'border-amber-300';
    iconBg = 'bg-amber-600';
  } else if (daysRemaining <= 3) {
    status = 'urgent';
    isUrgent = true;
    badgeLabel = `${actionWord} em ${daysRemaining} dias`;
    detailLabel = `${actionWord} em ${daysRemaining} dias (${dateFormatted})`;
    badgeBg = 'bg-amber-50';
    badgeText = 'text-amber-800 font-semibold';
    badgeBorder = 'border-amber-200';
    iconBg = 'bg-amber-500';
  } else if (daysRemaining <= 7) {
    status = 'warning';
    isUrgent = false;
    badgeLabel = `${actionWord} em ${daysRemaining} dias`;
    detailLabel = `${actionWord} nesta semana (${dateFormatted})`;
    badgeBg = 'bg-indigo-50';
    badgeText = 'text-indigo-700 font-medium';
    badgeBorder = 'border-indigo-200';
    iconBg = 'bg-indigo-500';
  } else {
    status = 'normal';
    isUrgent = false;
    badgeLabel = `Prazo: ${dateParts[2]}/${dateParts[1]}`;
    detailLabel = `Data limite: ${dateFormatted} (${daysRemaining} dias restantes)`;
    badgeBg = 'bg-slate-100';
    badgeText = 'text-slate-600 font-medium';
    badgeBorder = 'border-slate-200';
    iconBg = 'bg-slate-400';
  }

  return {
    daysRemaining,
    status,
    isUrgent,
    badgeLabel,
    detailLabel,
    dateFormatted,
    badgeBg,
    badgeText,
    badgeBorder,
    iconBg,
    type: dueDateType,
  };
}
