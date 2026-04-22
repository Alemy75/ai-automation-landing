// src/data/services.ts
export interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
  accent: 'primary' | 'accent' | 'violet';
}

export const services: Service[] = [
  {
    id: 'websites',
    icon: 'Globe',
    title: 'Сайты и лендинги',
    description: 'Быстрые, SEO-оптимизированные сайты, которые продают',
    accent: 'primary',
  },
  {
    id: 'crm',
    icon: 'Bot',
    title: 'CRM-системы',
    description: 'Управление клиентами и сделками под ваш бизнес',
    accent: 'accent',
  },
  {
    id: 'webapps',
    icon: 'LayoutDashboard',
    title: 'Веб-приложения',
    description: 'Автоматизация рутинных задач и бизнес-процессов',
    accent: 'violet',
  },
  {
    id: 'admin',
    icon: 'Settings2',
    title: 'Админ-панели',
    description: 'Удобное управление данными и операциями бизнеса',
    accent: 'accent',
  },
];
