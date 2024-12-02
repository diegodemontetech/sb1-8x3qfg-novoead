import { supabase } from '../config';
import { RouteHandler } from '../types';

export const categoryRoutes: Record<string, RouteHandler> = {
  'GET /categories': async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    return { data: data || [] };
  }
};