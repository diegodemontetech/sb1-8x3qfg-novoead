import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export const handleError = (error: any) => {
  // Don't treat empty results as errors for list endpoints
  if (error.code === 'PGRST116') {
    return [];
  }
  
  console.error('API Error:', error);
  throw new Error(error.message || 'An unexpected error occurred');
};

export const handleResponse = <T>(data: T | null): T | [] => {
  if (!data) {
    return Array.isArray(data) ? [] : data as T;
  }
  return data;
};

// Export all services
export * from './services/auth';
export * from './services/courses';
export * from './services/categories';
export * from './services/certificates';
export * from './services/ebooks';
export * from './services/news';
export * from './services/quiz';
export * from './services/users';