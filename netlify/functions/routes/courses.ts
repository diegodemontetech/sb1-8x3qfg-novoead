import { supabase } from '../config';
import { RouteHandler } from '../types';

export const courseRoutes: Record<string, RouteHandler> = {
  'GET /courses': async () => {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        category:categories(*),
        lessons(*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data: data || [] };
  },

  'GET /courses/featured': async () => {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        category:categories(*),
        lessons(*)
      `)
      .eq('is_featured', true)
      .order('rating', { ascending: false });

    if (error) throw error;
    return { data: data || [] };
  },

  'GET /courses/:id': async (_, params) => {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        category:categories(*),
        lessons(
          *,
          quiz:quizzes(*)
        )
      `)
      .eq('id', params.id)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Course not found');
    return { data };
  }
};