import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { categoryService } from '../../services/api';
import { useToast } from '../../hooks/useToast';
import ManagementForm from './components/ManagementForm';
import ManagementList from './components/ManagementList';
import LoadingSpinner from '../../components/LoadingSpinner';

const CategoryManagement = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      showToast('error', 'Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id, data);
        showToast('success', 'Categoria atualizada com sucesso');
      } else {
        await categoryService.createCategory(data);
        showToast('success', 'Categoria criada com sucesso');
      }
      fetchCategories();
      handleCloseForm();
    } catch (error: any) {
      console.error('Error saving category:', error);
      showToast('error', error.message || 'Erro ao salvar categoria');
    }
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setIsAddingCategory(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      return;
    }

    try {
      await categoryService.deleteCategory(id);
      showToast('success', 'Categoria excluída com sucesso');
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      showToast('error', 'Erro ao excluir categoria');
    }
  };

  const handleCloseForm = () => {
    setIsAddingCategory(false);
    setEditingCategory(null);
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
    { name: 'description', label: 'Descrição', type: 'textarea', required: true },
    {
      name: 'isActive',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'true', label: 'Ativo' },
        { value: 'false', label: 'Inativo' }
      ]
    }
  ];

  const listFields = [
    { key: 'name', label: 'Nome' },
    { key: 'description', label: 'Descrição' },
    {
      key: 'isActive',
      label: 'Status',
      render: (value: boolean) => (
        <span className={`text-sm ${value ? 'text-green-500' : 'text-red-500'}`}>
          {value ? 'Ativo' : 'Inativo'}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Categorias</h2>
        <button
          onClick={() => setIsAddingCategory(true)}
          className="flex items-center gap-2 bg-[#E50914] text-white px-4 py-2 rounded-md hover:bg-[#b8070f] transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Nova Categoria</span>
        </button>
      </div>

      <ManagementForm
        isOpen={isAddingCategory}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        title={editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
        fields={formFields}
        initialData={editingCategory}
      />

      <ManagementList
        items={categories}
        fields={listFields}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default CategoryManagement;