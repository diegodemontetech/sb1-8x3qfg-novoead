import { supabase } from '../../lib/supabase';
import { handleError, handleResponse } from './utils';
import type { Course } from '../../types';

export const courseService = {
  async getAllCourses() {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          category:categories(*),
          lessons(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return handleResponse(data);
    } catch (error) {
      return handleError(error);
    }
  },

  async createCourse(courseData: Partial<Course>) {
    try {
      // Validate required fields
      if (!courseData.title || !courseData.description) {
        throw new Error('Title and description are required');
      }

      const { data, error } = await supabase
        .from('courses')
        .insert([{
          ...courseData,
          status: courseData.status || 'draft',
          rating: courseData.rating || 0,
          is_featured: courseData.isFeatured || false
        }])
        .select()
        .single();

      if (error) throw error;
      return handleResponse(data);
    } catch (error) {
      return handleError(error);
    }
  },

  async updateCourse(id: string, courseData: Partial<Course>) {
    try {
      const { data, error } = await supabase
        .from('courses')
        .update(courseData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return handleResponse(data);
    } catch (error) {
      return handleError(error);
    }
  },

  async deleteCourse(id: string) {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      return handleError(error);
    }
  }
};