import React, { useState, useEffect } from 'react';
import { Modal } from '../Modal';
import { useSocialStore } from '../../contexts/SocialStore';
import type { Person } from '../../types/social';

interface EditPersonModalProps {
  isOpen: boolean;
  onClose: () => void;
  person: Person | null;
  groupId: string;
  groupName: string;
}

export const EditPersonModal: React.FC<EditPersonModalProps> = ({ 
  isOpen, 
  onClose, 
  person, 
  groupId,
  groupName
}) => {
  const { updatePerson } = useSocialStore();
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load person data when modal opens
  useEffect(() => {
    if (isOpen && person) {
      setName(person.name);
      setNotes(person.notes || '');
      setIsSubmitting(false);
    }
  }, [isOpen, person]);

  // Focus on input when modal opens
  useEffect(() => {
    if (isOpen) {
      const input = document.getElementById('edit-person-name-input') as HTMLInputElement;
      if (input) {
        input.focus();
        input.select();
      }
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !name.trim() || !person) return;

    console.log('Updating person:', person.name, 'to:', name.trim());
    setIsSubmitting(true);
    try {
      updatePerson(groupId, person.id, {
        name: name.trim(),
        notes: notes.trim() || undefined,
      });
      console.log('Person updated successfully');
      onClose();
    } catch (error) {
      console.error('Error updating person:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!person) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-2">Editar Persona</h2>
        <p className="text-gray-600 mb-4">Grupo: {groupName}</p>
        
        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
          <div className="mb-4">
            <label htmlFor="edit-person-name-input" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre
            </label>
            <input
              id="edit-person-name-input"
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
            <label htmlFor="edit-person-notes-input" className="block text-sm font-medium text-gray-700 mb-2">
              Notas (opcional)
            </label>
            <textarea
              id="edit-person-notes-input"
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
              disabled={isSubmitting || !name.trim() || (name.trim() === person.name && notes.trim() === (person.notes || ''))}
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
