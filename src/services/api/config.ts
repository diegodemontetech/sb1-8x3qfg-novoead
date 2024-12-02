import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export const handleError = (error: any) => {
  console.error('API Error:', error);
  
  // Don't treat empty results as errors for list endpoints
  if (error.code === 'PGRST116') {
    return [];
  }
  
  throw new Error(error.message || 'An unexpected error occurred');
};

export const handleResponse = <T>(data: T | null): T | [] => {
  if (!data) {
    return Array.isArray(data) ? [] : data as T;
  }
  return data;
};