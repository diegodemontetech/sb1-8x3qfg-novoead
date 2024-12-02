import { supabase } from '../../lib/supabase';
import { handleError, handleResponse } from './utils';

export const authService = {
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      // Get user profile data
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select(`
          *,
          groups:users_groups(
            group:user_groups(*)
          )
        `)
        .eq('id', data.user.id)
        .single();

      if (profileError) throw profileError;

      return handleResponse({ ...data, profile });
    } catch (error) {
      return handleError(error);
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return true;
    } catch (error) {
      return handleError(error);
    }
  }
};