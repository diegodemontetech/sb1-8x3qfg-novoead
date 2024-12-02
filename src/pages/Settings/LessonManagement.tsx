import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { lessonService, courseService } from '../../services/api';
import { useToast } from '../../hooks/useToast';
import ManagementForm from './components/ManagementForm';
import ManagementList from './components/ManagementList';
import LoadingSpinner from '../../components/LoadingSpinner';

const LessonManagement = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isAddingLesson, setIsAddingLesson] = useState(false);
  const [editingLesson, setEditingLesson] = useState<any>(null);
  const [lessons, setLessons] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [lessonsData, coursesData] = await Promise.all([
        lessonService.getAllLessons(),
        courseService.getAllCourses()
      ]);
      setLessons(lessonsData);
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
      if (editingLesson) {
        await lessonService.updateLesson(editingLesson.id, data);
        showToast('success', 'Aula atualizada com sucesso');
      } else {
        await lessonService.createLesson(data);
        showToast('success', 'Aula criada com sucesso');
      }
      fetchData();
      handleCloseForm();
    } catch (error: any) {
      console.error('Error saving lesson:', error);
      showToast('error', error.message || 'Erro ao salvar aula');
    }
  };

  const handleEdit = (lesson: any) => {
    setEditingLesson(lesson);
    setIsAddingLesson(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta aula?')) {
      return;
    }

    try {
      await lessonService.deleteLesson(id);
      showToast('success', 'Aula excluída com sucesso');
      fetchData();
    } catch (error) {
      console.error('Error deleting lesson:', error);
      showToast('error', 'Erro ao excluir aula');
    }
  };

  const handleCloseForm = () => {
    setIsAddingLesson(false);
    setEditingLesson(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const formFields = [
    {
      name: 'courseId',
      label: 'Curso',
      type: 'select',
      options: courses.map((course: any) => ({
        value: course.id,
        label: course.title
      })),
      required: true
    },
    { name: 'title', label: 'Título', type: 'text', required: true },
    { name: 'description', label: 'Descrição', type: 'textarea', required: true },
    { name: 'videoUrl', label: 'URL do Vídeo', type: 'text', required: true },
    { name: 'duration', label: 'Duração', type: 'text', required: true },
    { name: 'order', label: 'Ordem', type: 'number', required: true }
  ];

  const listFields = [
    { key: 'title', label: 'Título' },
    {
      key: 'course',
      label: 'Curso',
      render: (course: any) => course?.title || 'N/A'
    },
    { key: 'duration', label: 'Duração' },
    { key: 'order', label: 'Ordem' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Aulas</h2>
        <button
          onClick={() => setIsAddingLesson(true)}
          className="flex items-center gap-2 bg-[#E50914] text-white px-4 py-2 rounded-md hover:bg-[#b8070f] transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Nova Aula</span>
        </button>
      </div>

      <ManagementForm
        isOpen={isAddingLesson}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        title={editingLesson ? 'Editar Aula' : 'Nova Aula'}
        fields={formFields}
        initialData={editingLesson}
      />

      <ManagementList
        items={lessons}
        fields={listFields}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default LessonManagement;