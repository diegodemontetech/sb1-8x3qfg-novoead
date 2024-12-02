import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { userService, groupService } from '../../services/api';
import { useToast } from '../../hooks/useToast';
import ManagementForm from './components/ManagementForm';
import ManagementList from './components/ManagementList';
import LoadingSpinner from '../../components/LoadingSpinner';

const UserManagement = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersData, groupsData] = await Promise.all([
        userService.getAllUsers(),
        groupService.getAllGroups()
      ]);
      setUsers(usersData);
      setGroups(groupsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      showToast('error', 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      if (editingUser) {
        await userService.updateUser(editingUser.id, data);
        showToast('success', 'Usuário atualizado com sucesso');
      } else {
        await userService.createUser(data);
        showToast('success', 'Usuário criado com sucesso');
      }
      fetchData();
      handleCloseForm();
    } catch (error: any) {
      console.error('Error saving user:', error);
      showToast('error', error.message || 'Erro ao salvar usuário');
    }
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setIsAddingUser(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) {
      return;
    }

    try {
      await userService.deleteUser(id);
      showToast('success', 'Usuário excluído com sucesso');
      fetchData();
    } catch (error) {
      console.error('Error deleting user:', error);
      showToast('error', 'Erro ao excluir usuário');
    }
  };

  const handleCloseForm = () => {
    setIsAddingUser(false);
    setEditingUser(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const formFields = [
    { name: 'name', label: 'Nome', type: 'text', required: true },
    { name: 'email', label: 'E-mail', type: 'email', required: true },
    ...(!editingUser ? [
      { name: 'password', label: 'Senha', type: 'password', required: true }
    ] : []),
    {
      name: 'role',
      label: 'Função',
      type: 'select',
      options: [
        { value: 'user', label: 'Usuário' },
        { value: 'instructor', label: 'Instrutor' },
        { value: 'admin', label: 'Administrador' }
      ],
      required: true
    },
    {
      name: 'groupId',
      label: 'Grupo',
      type: 'select',
      options: groups.map((group: any) => ({
        value: group.id,
        label: group.name
      }))
    }
  ];

  const listFields = [
    { key: 'name', label: 'Nome' },
    { key: 'email', label: 'E-mail' },
    {
      key: 'role',
      label: 'Função',
      render: (role: string) => (
        <span className={`text-sm ${
          role === 'admin' ? 'text-[#E50914]' :
          role === 'instructor' ? 'text-yellow-500' :
          'text-gray-400'
        }`}>
          {role === 'admin' ? 'Administrador' :
           role === 'instructor' ? 'Instrutor' :
           'Usuário'}
        </span>
      )
    },
    {
      key: 'groups',
      label: 'Grupo',
      render: (groups: any[]) => (
        <span className="text-gray-400">
          {groups?.[0]?.group?.name || 'Nenhum grupo'}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Usuários</h2>
        <button
          onClick={() => setIsAddingUser(true)}
          className="flex items-center gap-2 bg-[#E50914] text-white px-4 py-2 rounded-md hover:bg-[#b8070f] transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Novo Usuário</span>
        </button>
      </div>

      <ManagementForm
        isOpen={isAddingUser}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        title={editingUser ? 'Editar Usuário' : 'Novo Usuário'}
        fields={formFields}
        initialData={editingUser}
      />

      <ManagementList
        items={users}
        fields={listFields}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default UserManagement;