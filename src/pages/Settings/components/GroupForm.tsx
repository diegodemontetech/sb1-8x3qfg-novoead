import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Checkbox from '@radix-ui/react-checkbox';

interface Permission {
  id: string;
  label: string;
}

interface Course {
  id: string;
  title: string;
}

interface GroupFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  group?: any;
  availablePermissions: Permission[];
  availableCourses: Course[];
}

const GroupForm = ({
  isOpen,
  onClose,
  onSubmit,
  group,
  availablePermissions,
  availableCourses
}: GroupFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    permissions: [] as string[],
    courseIds: [] as string[]
  });

  useEffect(() => {
    if (group) {
      setFormData({
        name: group.name,
        permissions: group.permissions || [],
        courseIds: group.courseIds || []
      });
    } else {
      setFormData({
        name: '',
        permissions: [],
        courseIds: []
      });
    }
  }, [group, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, permissionId]
        : prev.permissions.filter(id => id !== permissionId)
    }));
  };

  const handleCourseChange = (courseId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      courseIds: checked
        ? [...prev.courseIds, courseId]
        : prev.courseIds.filter(id => id !== courseId)
    }));
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1E1E1E] p-8 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-2xl font-bold text-white">
              {group ? 'Editar Grupo' : 'Novo Grupo'}
            </Dialog.Title>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nome do Grupo
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#E50914]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">
                Permissões
              </label>
              <div className="grid grid-cols-2 gap-4">
                {availablePermissions.map((permission) => (
                  <label
                    key={permission.id}
                    className="flex items-center gap-3 p-4 bg-[#2A2A2A] rounded-lg cursor-pointer group"
                  >
                    <Checkbox.Root
                      className="h-5 w-5 bg-gray-700 rounded flex items-center justify-center group-hover:bg-gray-600"
                      checked={formData.permissions.includes(permission.id)}
                      onCheckedChange={(checked) => 
                        handlePermissionChange(permission.id, checked as boolean)
                      }
                    >
                      <Checkbox.Indicator>
                        <div className="h-4 w-4 bg-[#E50914] rounded-sm" />
                      </Checkbox.Indicator>
                    </Checkbox.Root>
                    <span className="text-gray-300">{permission.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">
                Cursos Disponíveis
              </label>
              <div className="grid grid-cols-2 gap-4 max-h-60 overflow-y-auto">
                {availableCourses.map((course) => (
                  <label
                    key={course.id}
                    className="flex items-center gap-3 p-4 bg-[#2A2A2A] rounded-lg cursor-pointer group"
                  >
                    <Checkbox.Root
                      className="h-5 w-5 bg-gray-700 rounded flex items-center justify-center group-hover:bg-gray-600"
                      checked={formData.courseIds.includes(course.id)}
                      onCheckedChange={(checked) => 
                        handleCourseChange(course.id, checked as boolean)
                      }
                    >
                      <Checkbox.Indicator>
                        <div className="h-4 w-4 bg-[#E50914] rounded-sm" />
                      </Checkbox.Indicator>
                    </Checkbox.Root>
                    <span className="text-gray-300 line-clamp-2">{course.title}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 bg-[#E50914] text-white px-6 py-2 rounded-md hover:bg-[#b8070f] transition-colors"
              >
                <Save className="h-5 w-5" />
                <span>Salvar Grupo</span>
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default GroupForm;