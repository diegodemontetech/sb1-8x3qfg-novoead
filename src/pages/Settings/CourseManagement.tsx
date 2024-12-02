import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { courseService } from '../../services/api';
import { useToast } from '../../hooks/useToast';
import ManagementForm from './components/ManagementForm';
import ManagementList from './components/ManagementList';
import LoadingSpinner from '../../components/LoadingSpinner';

const CourseManagement = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await courseService.getAllCourses();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      showToast('error', 'Erro ao carregar cursos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      if (editingCourse) {
        await courseService.updateCourse(editingCourse.id, data);
        showToast('success', 'Curso atualizado com sucesso');
      } else {
        await courseService.createCourse(data);
        showToast('success', 'Curso criado com sucesso');
      }
      fetchCourses();
      handleCloseForm();
    } catch (error: any) {
      console.error('Error saving course:', error);
      showToast('error', error.message || 'Erro ao salvar curso');
    }
  };

  const handleEdit = (course: any) => {
    setEditingCourse(course);
    setIsAddingCourse(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este curso?')) {
      return;
    }

    try {
      await courseService.deleteCourse(id);
      showToast('success', 'Curso excluído com sucesso');
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      showToast('error', 'Erro ao excluir curso');
    }
  };

  const handleCloseForm = () => {
    setIsAddingCourse(false);
    setEditingCourse(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const formFields = [
    { name: 'title', label: 'Título', type: 'text', required: true },
    { name: 'description', label: 'Descrição', type: 'textarea', required: true },
    { name: 'instructor', label: 'Instrutor', type: 'text', required: true },
    { name: 'duration', label: 'Duração', type: 'text', required: true },
    { name: 'thumbnail', label: 'URL da Thumbnail', type: 'text', required: true },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'draft', label: 'Rascunho' },
        { value: 'published', label: 'Publicado' },
        { value: 'archived', label: 'Arquivado' }
      ],
      required: true
    },
    {
      name: 'isFeatured',
      label: 'Destaque',
      type: 'select',
      options: [
        { value: 'true', label: 'Sim' },
        { value: 'false', label: 'Não' }
      ]
    }
  ];

  const listFields = [
    { key: 'title', label: 'Título' },
    { key: 'instructor', label: 'Instrutor' },
    { key: 'duration', label: 'Duração' },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <span className={`text-sm ${
          value === 'published' ? 'text-green-500' : 
          value === 'archived' ? 'text-red-500' : 
          'text-yellow-500'
        }`}>
          {value === 'published' ? 'Publicado' : 
           value === 'archived' ? 'Arquivado' : 
           'Rascunho'}
        </span>
      )
    },
    {
      key: 'isFeatured',
      label: 'Destaque',
      render: (value: boolean) => (
        <span className={`text-sm ${value ? 'text-[#E50914]' : 'text-gray-400'}`}>
          {value ? 'Em Destaque' : 'Normal'}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Cursos</h2>
        <button
          onClick={() => setIsAddingCourse(true)}
          className="flex items-center gap-2 bg-[#E50914] text-white px-4 py-2 rounded-md hover:bg-[#b8070f] transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Novo Curso</span>
        </button>
      </div>

      <ManagementForm
        isOpen={isAddingCourse}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        title={editingCourse ? 'Editar Curso' : 'Novo Curso'}
        fields={formFields}
        initialData={editingCourse}
      />

      <ManagementList
        items={courses}
        fields={listFields}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default CourseManagement;