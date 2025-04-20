export interface ContactInfo {
  id: number;
  address: string;
  phone: string;
  email: string;
  fax: string;
  working_hours: string;
  social_media: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  map_embed: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ImportantLink {
  id: number;
  title: string;
  description: string;
  url: string;
  category: string;
  icon: string;
  order: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Download {
  id: number;
  title: string;
  description: string;
  category: string;
  file_path: string;
  original_filename: string;
  file_size: number;
  file_type: string;
  download_count: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Legislation {
  id: number;
  title: string;
  description: string;
  document_type: string;
  document_path: string;
  original_filename: string;
  file_size: number;
  file_type: string;
  status: string;
  download_count: number;
  published_date: string;
  created_at: string;
  updated_at: string;
}

export interface ContactForm {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
} 