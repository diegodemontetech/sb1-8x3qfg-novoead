import React from 'react';
import { Edit2, Trash } from 'lucide-react';
import { motion } from 'framer-motion';

interface Permission {
  id: string;
  label: string;
}

interface GroupListProps {
  groups: any[];
  onEdit: (group: any) => void;
  onDelete: (id: string) => void;
  availablePermissions: Permission[];
}

const GroupList = ({ groups, onEdit, onDelete, availablePermissions }: GroupListProps) => {
  const getPermissionLabel = (permissionId: string) => {
    const permission = availablePermissions.find(p => p.id === permissionId);
    return permission?.label || permissionId;
  };

  if (!groups?.length) {
    return (
      <div className="text-center py-8 text-gray-400">
        Nenhum grupo encontrado
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <motion.div
          key={group.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#2A2A2A] rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white">{group.name}</h3>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => onEdit(group)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Edit2 className="h-5 w-5" />
              </button>
              <button 
                onClick={() => onDelete(group.id)}
                className="text-gray-400 hover:text-[#E50914] transition-colors"
              >
                <Trash className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {group.permissions.map((permissionId: string) => (
              <span
                key={permissionId}
                className="px-3 py-1 text-sm bg-[#3A3A3A] text-gray-300 rounded-full"
              >
                {getPermissionLabel(permissionId)}
              </span>
            ))}
          </div>

          {group.users?.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className="text-sm text-gray-400">
                {group.users.length} usuário{group.users.length !== 1 ? 's' : ''} neste grupo
              </p>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default GroupList;