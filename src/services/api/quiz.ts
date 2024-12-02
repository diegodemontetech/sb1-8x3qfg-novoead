import { supabase } from './config';
import { handleError, handleResponse } from './config';

export const quizService = {
  async getAllQuizzes() {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select(`
          *,
          lesson:lessons(
            id,
            title,
            course:courses(
              id,
              title
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return handleResponse(data);
    } catch (error) {
      return handleError(error);
    }
  },

  async createQuiz(quizData: any) {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .insert([quizData])
        .select()
        .single();

      if (error) throw error;
      return handleResponse(data);
    } catch (error) {
      return handleError(error);
    }
  },

  async updateQuiz(id: string, quizData: any) {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .update(quizData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return handleResponse(data);
    } catch (error) {
      return handleError(error);
    }
  },

  async deleteQuiz(id: string) {
    try {
      const { error } = await supabase
        .from('quizzes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      return handleError(error);
    }
  }
};