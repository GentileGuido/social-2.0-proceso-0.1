import React, { useState, useRef } from 'react';
import { ChevronDown, ChevronRight, Users, MoreVertical } from 'lucide-react';
import { Group, NameItem, ContextMenuOption } from '../types/social';
import { useSocialData } from '../contexts/SocialContext';
import { ContextMenu } from './ContextMenu';
import { Modal } from './Modal';

interface GroupCardProps {
  group: Group;
  names: NameItem[];
  isExpanded: boolean;
  onToggle: () => void;
  searchTerm: string;
  isDimmed?: boolean;
}

export const GroupCard: React.FC<GroupCardProps> = ({
  group,
  names,
  isExpanded,
  onToggle,
  searchTerm,
  isDimmed = false,
}) => {
  const { updateGroup, deleteGroup, updateName, deleteName, exportGroup, exportName, groups } = useSocialData();
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [contextMenuType, setContextMenuType] = useState<'group' | 'name'>('group');
  const [contextMenuTargetId, setContextMenuTargetId] = useState<string>('');
  const [editingGroup, setEditingGroup] = useState(false);
  const [editingName, setEditingName] = useState<string | null>(null);
  const [groupName, setGroupName] = useState(group.title);
  const [editingNameData, setEditingNameData] = useState({ firstName: '', notes: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingItem, setDeletingItem] = useState<'group' | 'name' | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = (e: React.MouseEvent, type: 'group' | 'name' = 'group', targetId: string = '') => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setContextMenuType(type);
    setContextMenuTargetId(targetId);
    setShowContextMenu(true);
  };

  const handleLongPress = (e: React.TouchEvent) => {
    e.preventDefault();
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      setContextMenuPosition({ x: rect.left, y: rect.bottom });
      setContextMenuType('group');
      setContextMenuTargetId('');
      setShowContextMenu(true);
    }
  };

  const getContextMenuOptions = (): ContextMenuOption[] => {
    if (contextMenuType === 'group') {
      return [
        {
          label: 'Exportar',
          action: () => exportGroup(group.id),
          icon: 'download',
        },
        {
          label: 'Editar',
          action: () => setEditingGroup(true),
          icon: 'edit',
        },
        {
          label: 'Eliminar',
          action: () => {
            setDeletingItem('group');
            setDeletingId(group.id);
            setShowDeleteConfirm(true);
          },
          icon: 'delete',
          danger: true,
        },
      ];
    } else {
      return [
        {
          label: 'Exportar',
          action: () => exportName(contextMenuTargetId),
          icon: 'download',
        },
        {
          label: 'Editar',
          action: () => {
            const name = names.find(n => n.id === contextMenuTargetId);
            if (name) {
              setEditingNameData({ firstName: name.name, notes: name.notes || '' });
              setEditingName(contextMenuTargetId);
            }
          },
          icon: 'edit',
        },
        {
          label: 'Eliminar',
          action: () => {
            setDeletingItem('name');
            setDeletingId(contextMenuTargetId);
            setShowDeleteConfirm(true);
          },
          icon: 'delete',
          danger: true,
        },
      ];
    }
  };

  const handleSaveGroup = async () => {
    if (groupName.trim()) {
      await updateGroup(group.id, groupName.trim());
      setEditingGroup(false);
    }
  };

  const handleSaveName = async () => {
    if (editingName && editingNameData.firstName.trim()) {
      await updateName(editingName, editingNameData.firstName.trim(), editingNameData.notes);
      setEditingName(null);
      setEditingNameData({ firstName: '', notes: '' });
    }
  };

  const handleDelete = async () => {
    if (!deletingItem || !deletingId) return;

    try {
      if (deletingItem === 'group') {
        await deleteGroup(deletingId);
      } else if (deletingItem === 'name') {
        await deleteName(deletingId);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    } finally {
      setShowDeleteConfirm(false);
      setDeletingItem(null);
      setDeletingId(null);
    }
  };

  const filteredNames = names.filter(
    (name) =>
      name.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (name.notes && name.notes.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <>
      <div
        ref={cardRef}
        className={`bg-white rounded-lg shadow-md border border-gray-200 mb-4 overflow-hidden transition-all duration-200 ${
          isDimmed ? 'opacity-50 grayscale' : ''
        }`}
        onContextMenu={(e) => handleContextMenu(e, 'group')}
        onTouchStart={(e) => {
          const timer = setTimeout(() => handleLongPress(e), 500);
          const cleanup = () => clearTimeout(timer);
          e.currentTarget.addEventListener('touchend', cleanup, { once: true });
        }}
      >
        {/* Group Header */}
        <div
          className="p-4 cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-between"
          onClick={onToggle}
        >
          <div className="flex items-center gap-3">
            {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            <div className="flex items-center gap-2">
              <Users size={20} className="text-primary-500" />
              <h3 className="font-semibold text-gray-900">{group.title}</h3>
            </div>
            <span className="text-sm text-gray-500">({names.length} nombres)</span>
          </div>
          
          {/* Three-dot menu button */}
          <button
            onClick={(e) => handleContextMenu(e, 'group')}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Opciones del grupo"
          >
            <MoreVertical size={16} className="text-gray-500" />
          </button>
        </div>

        {/* Names List */}
        {isExpanded && (
          <div className="border-t border-gray-200 bg-gray-50">
            {filteredNames.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No hay nombres en este grupo</div>
            ) : (
              filteredNames.map((name) => (
                <div
                  key={name.id}
                  className="p-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-100 transition-colors flex items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{name.name}</div>
                    {name.notes && (
                      <div className="text-sm text-gray-600 mt-1">{name.notes}</div>
                    )}
                  </div>
                  
                  {/* Three-dot menu button for names */}
                  <button
                    onClick={(e) => handleContextMenu(e, 'name', name.id)}
                    className="p-1 hover:bg-gray-200 rounded-full transition-colors ml-2"
                    aria-label="Opciones del nombre"
                  >
                    <MoreVertical size={16} className="text-gray-500" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Context Menu */}
      <ContextMenu
        isOpen={showContextMenu}
        onClose={() => setShowContextMenu(false)}
        position={contextMenuPosition}
        options={getContextMenuOptions()}
      />

      {/* Edit Group Modal */}
      <Modal
        isOpen={editingGroup}
        onClose={() => setEditingGroup(false)}
        title="Editar Grupo"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Grupo
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Ingrese nombre del grupo"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setEditingGroup(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveGroup}
              className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
            >
              Guardar
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Name Modal */}
      <Modal
        isOpen={!!editingName}
        onClose={() => setEditingName(null)}
        title="Editar Nombre"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              value={editingNameData.firstName}
              onChange={(e) => setEditingNameData({ ...editingNameData, firstName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Ingrese nombre"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notas
            </label>
            <textarea
              value={editingNameData.notes}
              onChange={(e) => setEditingNameData({ ...editingNameData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Ingrese notas (opcional)"
              rows={3}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setEditingName(null)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveName}
              className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
            >
              Guardar
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Confirmar Eliminación"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            ¿Está seguro de que desea eliminar este {deletingItem === 'group' ? 'grupo' : 'nombre'}?
            {deletingItem === 'group' && ' Esta acción también eliminará todos los nombres del grupo.'}
          </p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Eliminar
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}; 