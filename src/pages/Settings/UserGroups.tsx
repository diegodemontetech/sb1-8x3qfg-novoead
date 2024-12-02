import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { groupService, courseService } from '../../services/api';
import { useToast } from '../../hooks/useToast';
import GroupForm from './components/GroupForm';
import GroupList from './components/GroupList';
import LoadingSpinner from '../../components/LoadingSpinner';

const AVAILABLE_PERMISSIONS = [
  { id: 'courses.read', label: 'Visualizar Cursos' },
  { id: 'courses.write', label: 'Gerenciar Cursos' },
  { id: 'users.read', label: 'Visualizar Usuários' },
  { id: 'users.write', label: 'Gerenciar Usuários' },
  { id: 'settings', label: 'Configurações' },
  { id: 'all', label: 'Acesso Total' }
];

const UserGroups = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [editingGroup, setEditingGroup] = useState<any>(null);
  const [groups, setGroups] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [groupsData, coursesData] = await Promise.all([
        groupService.getAllGroups(),
        courseService.getAllCourses()
      ]);
      setGroups(groupsData);
      setCourses(coursesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      showToast('error', 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      if (editingGroup) {
        await groupService.updateGroup(editingGroup.id, data);
        showToast('success', 'Grupo atualizado com sucesso');
      } else {
        await groupService.createGroup(data);
        showToast('success', 'Grupo criado com sucesso');
      }
      fetchData();
      handleCloseForm();
    } catch (error: any) {
      console.error('Error saving group:', error);
      showToast('error', error.message || 'Erro ao salvar grupo');
    }
  };

  const handleEdit = (group: any) => {
    setEditingGroup({
      ...group,
      courseIds: group.courses?.map((c: any) => c.id) || []
    });
    setIsAddingGroup(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este grupo?')) {
      return;
    }

    try {
      await groupService.deleteGroup(id);
      showToast('success', 'Grupo excluído com sucesso');
      fetchData();
    } catch (error) {
      console.error('Error deleting group:', error);
      showToast('error', 'Erro ao excluir grupo');
    }
  };

  const handleCloseForm = () => {
    setIsAddingGroup(false);
    setEditingGroup(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Grupos de Usuários</h2>
        <button
          onClick={() => setIsAddingGroup(true)}
          className="flex items-center gap-2 bg-[#E50914] text-white px-4 py-2 rounded-md hover:bg-[#b8070f] transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Novo Grupo</span>
        </button>
      </div>

      <GroupForm
        isOpen={isAddingGroup}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        group={editingGroup}
        availablePermissions={AVAILABLE_PERMISSIONS}
        availableCourses={courses}
      />

      <GroupList
        groups={groups}
        onEdit={handleEdit}
        onDelete={handleDelete}
        availablePermissions={AVAILABLE_PERMISSIONS}
      />
    </div>
  );
};

export default UserGroups;