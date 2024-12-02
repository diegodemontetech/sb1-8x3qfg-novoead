import { supabase } from './config';
import { handleError, handleResponse } from './config';

export const groupService = {
  async getAllGroups() {
    try {
      const { data, error } = await supabase
        .from('user_groups')
        .select(`
          *,
          users:users_groups(
            user:users(*)
          ),
          courses:courses(*)
        `)
        .order('name');

      if (error) throw error;
      return handleResponse(data);
    } catch (error) {
      return handleError(error);
    }
  },

  async createGroup(groupData: { name: string; permissions: string[]; courseIds?: string[] }) {
    try {
      const { data, error } = await supabase
        .from('user_groups')
        .insert([{
          name: groupData.name,
          permissions: groupData.permissions
        }])
        .select()
        .single();

      if (error) throw error;

      // If courseIds are provided, create group-course relationships
      if (groupData.courseIds?.length) {
        const { error: coursesError } = await supabase
          .from('group_courses')
          .insert(
            groupData.courseIds.map(courseId => ({
              group_id: data.id,
              course_id: courseId
            }))
          );

        if (coursesError) throw coursesError;
      }

      return handleResponse(data);
    } catch (error) {
      return handleError(error);
    }
  },

  async updateGroup(id: string, groupData: { name?: string; permissions?: string[]; courseIds?: string[] }) {
    try {
      const { data, error } = await supabase
        .from('user_groups')
        .update({
          name: groupData.name,
          permissions: groupData.permissions
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Update course relationships if courseIds are provided
      if (groupData.courseIds !== undefined) {
        // First delete existing relationships
        await supabase
          .from('group_courses')
          .delete()
          .eq('group_id', id);

        // Then create new ones if there are any
        if (groupData.courseIds.length) {
          const { error: coursesError } = await supabase
            .from('group_courses')
            .insert(
              groupData.courseIds.map(courseId => ({
                group_id: id,
                course_id: courseId
              }))
            );

          if (coursesError) throw coursesError;
        }
      }

      return handleResponse(data);
    } catch (error) {
      return handleError(error);
    }
  },

  async deleteGroup(id: string) {
    try {
      const { error } = await supabase
        .from('user_groups')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      return handleError(error);
    }
  }
};