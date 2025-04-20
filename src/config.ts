// Environment variables with type safety

export const API_URL = process.env.NEXT_PUBLIC_API_URL as string;
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME as string;
export const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION as string;
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_APP_DESCRIPTION as string;

export const APP_FEATURES = {
  notifications: true,
  darkMode: true,
  offlineMode: false,
};

export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
  },
  roles: {
    list: '/roles',
    create: '/roles',
    update: (id: number) => `/roles/${id}`,
    delete: (id: number) => `/roles/${id}`,
  },
  members: {
    list: '/api/v1/members/all',
    create: '/api/v1/members',
    update: (id: number) => `/api/v1/members/${id}`,
    delete: (id: number) => `/api/v1/members/${id}`,
    profile: (id: number) => `/api/v1/members/${id}/profile`,
    byAssembly: (assemblyId: number) => `/api/v1/members/assembly/${assemblyId}`,
    byParty: (party: string) => `/api/v1/members/party/${party}`,
    byDesignation: (designation: string) => `/api/v1/members/designation/${designation}`,
  },
  news: {
    list: '/api/v1/news',
    latest: '/api/v1/news/latest',
    create: '/api/v1/news',
    update: (id: number) => `/api/v1/news/${id}`,
    delete: (id: number) => `/api/v1/news/${id}`,
    category: (category: string) => `/api/v1/news/category/${category}`,
  },
  publications: {
    list: '/api/v1/publications',
    create: '/api/v1/publications',
    update: (id: number) => `/api/v1/publications/${id}`,
    delete: (id: number) => `/api/v1/publications/${id}`,
    category: (category: string) => `/api/v1/publications/category/${category}`,
    download: (id: number) => `/api/v1/publications/${id}/download`,
  },
  events: {
    list: '/api/v1/calendar',
    create: '/api/v1/calendar',
    update: (id: number) => `/api/v1/calendar/${id}`,
    delete: (id: number) => `/api/v1/calendar/${id}`,
    upcoming: '/api/v1/calendar/upcoming',
    ongoing: '/api/v1/calendar/ongoing',
    completed: '/api/v1/calendar/completed',
  },
  assemblies: {
    list: '/api/v1/assemblies',
    create: '/api/v1/assemblies',
    update: (id: number) => `/api/v1/assemblies/${id}`,
    delete: (id: number) => `/api/v1/assemblies/${id}`,
    active: '/api/v1/assemblies/active',
    members: (id: number) => `/api/v1/assemblies/${id}/members`,
    sessions: (id: number) => `/api/v1/assemblies/${id}/sessions`,
  },
  sessions: {
    list: '/api/v1/sessions',
    create: '/api/v1/sessions',
    update: (id: number) => `/api/v1/sessions/${id}`,
    delete: (id: number) => `/api/v1/sessions/${id}`,
    current: '/api/v1/sessions/current',
    documents: (id: number) => `/api/v1/sessions/${id}/documents`,
  },
  documents: {
    list: '/api/v1/documents',
    create: '/api/v1/documents',
    update: (id: number) => `/api/v1/documents/${id}`,
    delete: (id: number) => `/api/v1/documents/${id}`,
    download: (id: number) => `/api/v1/documents/${id}/download`,
    type: (type: string) => `/api/v1/documents/type/${type}`,
  },
  committees: {
    list: '/api/v1/committees',
    create: '/api/v1/committees',
    update: (id: number) => `/api/v1/committees/${id}`,
    delete: (id: number) => `/api/v1/committees/${id}`,
    members: (id: number) => `/api/v1/committees/${id}/members`,
    meetings: (id: number) => `/api/v1/committees/${id}/meetings`,
    documents: (id: number) => `/api/v1/committees/${id}/documents`,
    minutes: (id: number) => `/api/v1/committees/${id}/minutes`,
    reports: (id: number) => `/api/v1/committees/${id}/reports`,
  },
  contact: {
    info: '/api/v1/contact-info',
    form: '/api/v1/contact-forms',
    submit: '/api/v1/contact-forms/submit',
    update: (id: number) => `/api/v1/contact-forms/${id}`,
    status: (id: number) => `/api/v1/contact-forms/${id}/status`,
  },
}; 