import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Storage buckets
export const storage = {
  videos: supabase.storage.from('videos'),
  pdfs: supabase.storage.from('pdfs'),
  images: supabase.storage.from('images')
};

// Helper to get public URL for stored files
export const getPublicUrl = (bucket: 'videos' | 'pdfs' | 'images', path: string) => {
  const { data } = storage[bucket].getPublicUrl(path);
  return data.publicUrl;
};

// Error handling
export const handleError = (error: any) => {
  // Don't treat empty results as errors for list endpoints
  if (error.code === 'PGRST116') {
    return [];
  }
  
  console.error('API Error:', error);
  throw new Error(error.message || 'An unexpected error occurred');
};

// Response handling
export const handleResponse = <T>(data: T | null): T | [] => {
  if (!data) {
    return Array.isArray(data) ? [] : data as T;
  }
  return data;
};