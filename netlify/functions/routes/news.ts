import { supabase } from '../config';
import { RouteHandler } from '../types';

export const newsRoutes: Record<string, RouteHandler> = {
  'GET /news': async (event) => {
    const limit = event.queryStringParameters?.limit 
      ? parseInt(event.queryStringParameters.limit) 
      : undefined;

    const query = supabase
      .from('news')
      .select(`
        *,
        author:users(id, name, avatar_url),
        comments(
          *,
          author:users(id, name, avatar_url),
          replies(
            *,
            author:users(id, name, avatar_url)
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (limit) {
      query.limit(limit);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { data: data || [] };
  }
};