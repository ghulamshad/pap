export interface Video {
  id: number;
  title: string;
  slug: string;
  description?: string;
  url: string;
  thumbnail_url?: string;
  duration: number;
  category_id?: number;
  is_active: boolean;
  order: number;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  ad_config?: {
    enabled: boolean;
    ad_tag_url?: string;
    ad_breaks?: {
      time: number;
      type: 'pre_roll' | 'mid_roll' | 'post_roll';
    }[];
  };
  captions?: {
    enabled: boolean;
    language: string;
    url: string;
  }[];
}

export interface VideoCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent_id?: number;
  is_active: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface VideoFormData {
  title: string;
  description?: string;
  video_file?: File;
  thumbnail?: File;
  category_id?: number;
  is_active: boolean;
  metadata?: Record<string, any>;
} 