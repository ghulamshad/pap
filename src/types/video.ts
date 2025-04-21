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

export interface Video {
  id: number;
  title: string;
  slug: string;
  description: string;
  url: string;
  thumbnail_url: string;
  duration: number;  // seconds
  formatted_duration: string; // formatted duration in "mm:ss" format
  category_id: number;
  category?: VideoCategory;
  is_active: boolean;
  order: number;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Helper function to format duration in "mm:ss"
export const formatDuration = (duration: number): string => {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};