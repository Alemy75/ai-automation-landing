// src/data/cases.ts
export interface Case {
  id: string;
  title: string;
  category: string;
  metric: string;
  metricLabel: string;
  gradient: string;
}

export const cases: Case[] = [
  {
    id: 'construction-crm',
    title: 'CRM для строительной компании',
    category: 'CRM-система',
    metric: '+40%',
    metricLabel: 'эффективность менеджеров',
    gradient: 'linear-gradient(135deg, rgba(99,102,241,0.4), rgba(16,185,129,0.3))',
  },
  {
    id: 'warehouse-automation',
    title: 'Автоматизация склада',
    category: 'Веб-приложение',
    metric: '−60%',
    metricLabel: 'времени на учёт товаров',
    gradient: 'linear-gradient(135deg, rgba(139,92,246,0.4), rgba(99,102,241,0.3))',
  },
  {
    id: 'beauty-booking',
    title: 'Платформа записи для салона красоты',
    category: 'Лендинг + Система',
    metric: '+85%',
    metricLabel: 'онлайн-записей',
    gradient: 'linear-gradient(135deg, rgba(16,185,129,0.4), rgba(99,102,241,0.3))',
  },
];
