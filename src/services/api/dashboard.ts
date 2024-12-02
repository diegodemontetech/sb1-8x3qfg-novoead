import { supabase } from '../../lib/supabase';
import { handleError, handleResponse } from './utils';

export const dashboardService = {
  async getFeaturedContent() {
    try {
      const [coursesResponse, newsResponse, categoriesResponse] = await Promise.all([
        supabase
          .from('courses')
          .select('*, category:categories(*)')
          .eq('is_featured', true)
          .limit(5),
        supabase
          .from('news')
          .select('*, author:users(name, avatar_url)')
          .eq('status', 'published')
          .limit(3),
        supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
      ]);

      // Handle potential errors from each request
      if (coursesResponse.error) throw coursesResponse.error;
      if (newsResponse.error) throw newsResponse.error;
      if (categoriesResponse.error) throw categoriesResponse.error;

      return {
        featuredCourses: handleResponse(coursesResponse.data),
        latestNews: handleResponse(newsResponse.data),
        categories: handleResponse(categoriesResponse.data)
      };
    } catch (error) {
      return handleError(error);
    }
  },

  async getMainFeaturedCourse() {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*, category:categories(*)')
        .eq('is_featured', true)
        .order('rating', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return handleResponse(data);
    } catch (error) {
      return handleError(error);
    }
  }
};