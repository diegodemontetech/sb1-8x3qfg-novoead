import React from 'react';
import { Edit2, Trash } from 'lucide-react';
import { motion } from 'framer-motion';

interface ListField {
  key: string;
  label: string;
  render?: (value: any) => React.ReactNode;
}

interface ManagementListProps {
  items: any[];
  fields: ListField[];
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
}

const ManagementList = ({ items, fields, onEdit, onDelete }: ManagementListProps) => {
  if (!items?.length) {
    return (
      <div className="text-center py-8 text-gray-400">
        Nenhum item encontrado
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-4 bg-[#2A2A2A] rounded-lg"
        >
          <div className="flex-1 grid grid-cols-2 gap-4">
            {fields.map((field) => (
              <div key={field.key}>
                <span className="text-sm text-gray-400">{field.label}:</span>
                <div className="text-gray-300">
                  {field.render ? field.render(item[field.key]) : item[field.key]}
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex items-center gap-4 ml-4">
            <button 
              onClick={() => onEdit(item)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Edit2 className="h-5 w-5" />
            </button>
            <button 
              onClick={() => onDelete(item.id)}
              className="text-gray-400 hover:text-[#E50914] transition-colors"
            >
              <Trash className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ManagementList;