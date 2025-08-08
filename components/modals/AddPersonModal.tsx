import React, { useState, useEffect } from 'react';
import { Modal } from '../Modal';
import { useSocialStore } from '../../contexts/SocialStore';

interface AddPersonModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  groupName: string;
}

export const AddPersonModal: React.FC<AddPersonModalProps> = ({ 
  isOpen, 
  onClose, 
  groupId, 
  groupName 
}) => {
  const { addPerson } = useSocialStore();
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setName('');
      setNotes('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Focus on input when modal opens
  useEffect(() => {
    if (isOpen) {
      const input = document.getElementById('person-name-input');
      if (input) {
        input.focus();
      }
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !name.trim()) return;

    setIsSubmitting(true);
    try {
      addPerson(groupId, {
        name: name.trim(),
        notes: notes.trim() || undefined,
      });
      onClose();
    } catch (error) {
      console.error('Error adding person:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-2">Agregar Persona</h2>
        <p className="text-gray-600 mb-4">Grupo: {groupName}</p>
        
        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
          <div className="mb-4">
            <label htmlFor="person-name-input" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre
            </label>
            <input
              id="person-name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ingresa el nombre de la persona"
              disabled={isSubmitting}
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="person-notes-input" className="block text-sm font-medium text-gray-700 mb-2">
              Notas (opcional)
            </label>
            <textarea
              id="person-notes-input"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Agrega notas sobre esta persona"
              rows={3}
              disabled={isSubmitting}
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
              disabled={isSubmitting || !name.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Agregando...' : 'Agregar Persona'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
