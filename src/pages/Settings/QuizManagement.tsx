import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { quizService, courseService } from '../../services/api';
import { useToast } from '../../hooks/useToast';
import ManagementForm from './components/ManagementForm';
import ManagementList from './components/ManagementList';
import LoadingSpinner from '../../components/LoadingSpinner';

const QuizManagement = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isAddingQuiz, setIsAddingQuiz] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<any>(null);
  const [quizzes, setQuizzes] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [quizzesData, coursesData] = await Promise.all([
        quizService.getAllQuizzes(),
        courseService.getAllCourses()
      ]);
      setQuizzes(quizzesData);
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
      // Parse questions from string to JSON
      const parsedData = {
        ...data,
        questions: JSON.parse(data.questions)
      };

      if (editingQuiz) {
        await quizService.updateQuiz(editingQuiz.id, parsedData);
        showToast('success', 'Quiz atualizado com sucesso');
      } else {
        await quizService.createQuiz(parsedData);
        showToast('success', 'Quiz criado com sucesso');
      }
      fetchData();
      handleCloseForm();
    } catch (error: any) {
      console.error('Error saving quiz:', error);
      showToast('error', error.message || 'Erro ao salvar quiz');
    }
  };

  const handleEdit = (quiz: any) => {
    // Convert questions back to string for form
    setEditingQuiz({
      ...quiz,
      questions: JSON.stringify(quiz.questions, null, 2)
    });
    setIsAddingQuiz(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este quiz?')) {
      return;
    }

    try {
      await quizService.deleteQuiz(id);
      showToast('success', 'Quiz excluído com sucesso');
      fetchData();
    } catch (error) {
      console.error('Error deleting quiz:', error);
      showToast('error', 'Erro ao excluir quiz');
    }
  };

  const handleCloseForm = () => {
    setIsAddingQuiz(false);
    setEditingQuiz(null);
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
      name: 'lessonId',
      label: 'Aula',
      type: 'select',
      options: courses.flatMap(course => 
        course.lessons?.map(lesson => ({
          value: lesson.id,
          label: `${course.title} - ${lesson.title}`
        })) || []
      ),
      required: true
    },
    {
      name: 'questions',
      label: 'Questões (JSON)',
      type: 'textarea',
      required: true,
      placeholder: `[
  {
    "text": "Pergunta 1",
    "options": ["Opção 1", "Opção 2", "Opção 3", "Opção 4"],
    "correctAnswer": 0
  }
]`
    },
    {
      name: 'passingScore',
      label: 'Nota Mínima para Aprovação (%)',
      type: 'number',
      required: true
    }
  ];

  const listFields = [
    {
      key: 'lesson',
      label: 'Aula',
      render: (lesson: any) => 
        lesson ? `${lesson.course.title} - ${lesson.title}` : 'N/A'
    },
    {
      key: 'questions',
      label: 'Questões',
      render: (questions: any[]) => 
        Array.isArray(questions) ? `${questions.length} questões` : '0 questões'
    },
    {
      key: 'passingScore',
      label: 'Nota Mínima',
      render: (score: number) => `${score}%`
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Quiz</h2>
        <button
          onClick={() => setIsAddingQuiz(true)}
          className="flex items-center gap-2 bg-[#E50914] text-white px-4 py-2 rounded-md hover:bg-[#b8070f] transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Novo Quiz</span>
        </button>
      </div>

      <ManagementForm
        isOpen={isAddingQuiz}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        title={editingQuiz ? 'Editar Quiz' : 'Novo Quiz'}
        fields={formFields}
        initialData={editingQuiz}
      />

      <ManagementList
        items={quizzes}
        fields={listFields}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default QuizManagement;