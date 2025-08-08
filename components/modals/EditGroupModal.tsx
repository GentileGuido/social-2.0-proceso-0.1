import React, { useState, useEffect } from 'react';
import { Modal } from '../Modal';
import { useSocialStore } from '../../contexts/SocialStore';
import type { Group } from '../../types/social';

interface EditGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: Group | null;
}

export const EditGroupModal: React.FC<EditGroupModalProps> = ({ 
  isOpen, 
  onClose, 
  group 
}) => {
  const { renameGroup } = useSocialStore();
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load group data when modal opens
  useEffect(() => {
    if (isOpen && group) {
      setName(group.name);
      setIsSubmitting(false);
    }
  }, [isOpen, group]);

  // Focus on input when modal opens
  useEffect(() => {
    if (isOpen) {
      const input = document.getElementById('edit-group-name-input') as HTMLInputElement;
      if (input) {
        input.focus();
        input.select();
      }
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !name.trim() || !group) return;

    setIsSubmitting(true);
    try {
      renameGroup(group.id, name.trim());
      onClose();
    } catch (error) {
      console.error('Error updating group:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!group) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-4">Editar Grupo</h2>
        
        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
          <div className="mb-4">
            <label htmlFor="edit-group-name-input" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Grupo
            </label>
            <input
              id="edit-group-name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ingresa el nombre del grupo"
              disabled={isSubmitting}
              required
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim() || name.trim() === group.name}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
