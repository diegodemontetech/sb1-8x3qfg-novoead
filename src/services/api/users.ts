import { supabase } from './config';
import { handleError, handleResponse } from './config';
import type { User } from '../../types';

export const userService = {
  async getAllUsers() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          groups:users_groups(
            group:user_groups(*)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return handleResponse(data);
    } catch (error) {
      return handleError(error);
    }
  },

  async createUser(userData: { 
    email: string; 
    password: string; 
    name: string; 
    role?: string;
    groupId?: string;
  }) {
    try {
      // First create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            role: userData.role || 'user'
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create user');

      // Create user profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .insert([{
          id: authData.user.id,
          email: userData.email,
          name: userData.name,
          role: userData.role || 'user'
        }])
        .select()
        .single();

      if (profileError) throw profileError;

      // If group ID provided, add user to group
      if (userData.groupId) {
        const { error: groupError } = await supabase
          .from('users_groups')
          .insert([{
            user_id: authData.user.id,
            group_id: userData.groupId
          }]);

        if (groupError) throw groupError;
      }

      return handleResponse(profile);
    } catch (error) {
      return handleError(error);
    }
  },

  async updateUser(id: string, userData: {
    name?: string;
    role?: string;
    groupId?: string;
  }) {
    try {
      // Update user profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .update({
          name: userData.name,
          role: userData.role
        })
        .eq('id', id)
        .select()
        .single();

      if (profileError) throw profileError;

      // Update group if provided
      if (userData.groupId) {
        // Remove existing group assignments
        await supabase
          .from('users_groups')
          .delete()
          .eq('user_id', id);

        // Add new group assignment
        const { error: groupError } = await supabase
          .from('users_groups')
          .insert([{
            user_id: id,
            group_id: userData.groupId
          }]);

        if (groupError) throw groupError;
      }

      return handleResponse(profile);
    } catch (error) {
      return handleError(error);
    }
  },

  async deleteUser(id: string) {
    try {
      // Delete user from auth
      const { error: authError } = await supabase.auth.admin.deleteUser(id);
      if (authError) throw authError;

      // Profile will be deleted automatically via cascade
      return true;
    } catch (error) {
      return handleError(error);
    }
  }
};