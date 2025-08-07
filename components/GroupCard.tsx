import React, { useState, useRef } from 'react';
import { ChevronDown, ChevronRight, Users } from 'lucide-react';
import { Group, Name, ContextMenuOption } from '../types';
import { useSocialData } from '../contexts/SocialContext';
import { ContextMenu } from './ContextMenu';
import { Modal } from './Modal';

interface GroupCardProps {
  group: Group;
  names: Name[];
  isExpanded: boolean;
  onToggle: () => void;
  searchTerm: string;
}

export const GroupCard: React.FC<GroupCardProps> = ({
  group,
  names,
  isExpanded,
  onToggle,
  searchTerm,
}) => {
  const { updateGroup, deleteGroup, updateName, moveName, groups } = useSocialData();
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [editingGroup, setEditingGroup] = useState(false);
  const [editingName, setEditingName] = useState<string | null>(null);
  const [groupName, setGroupName] = useState(group.name);
  const [editingNameData, setEditingNameData] = useState({ firstName: '', notes: '' });
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [movingNameId, setMovingNameId] = useState<string | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const cardRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  const handleLongPress = (e: React.TouchEvent) => {
    e.preventDefault();
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      setContextMenuPosition({ x: rect.left, y: rect.bottom });
      setShowContextMenu(true);
    }
  };

  const groupOptions: ContextMenuOption[] = [
    {
      label: 'Edit Group',
      action: () => setEditingGroup(true),
      icon: 'edit',
    },
    {
      label: 'Delete Group',
      action: () => {
        if (confirm('Are you sure you want to delete this group and all its names?')) {
          deleteGroup(group.id);
        }
      },
      icon: 'delete',
      danger: true,
    },
  ];

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

  const handleMoveName = async () => {
    if (movingNameId && selectedGroupId) {
      await moveName(movingNameId, selectedGroupId);
      setMovingNameId(null);
      setSelectedGroupId('');
      setShowMoveModal(false);
    }
  };

  const filteredNames = names.filter(
    (name) =>
      name.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      name.notes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div
        ref={cardRef}
        className="bg-white rounded-lg shadow-md border border-gray-200 mb-4 overflow-hidden"
        onContextMenu={handleContextMenu}
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
              <h3 className="font-semibold text-gray-900">{group.name}</h3>
            </div>
            <span className="text-sm text-gray-500">({names.length} names)</span>
          </div>
        </div>

        {/* Names List */}
        {isExpanded && (
          <div className="border-t border-gray-200 bg-gray-50">
            {filteredNames.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No names in this group</div>
            ) : (
              filteredNames.map((name) => (
                <div
                  key={name.id}
                  className="p-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-100 transition-colors"
                  onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setContextMenuPosition({ x: e.clientX, y: e.clientY });
                    setShowContextMenu(true);
                  }}
                >
                  <div className="font-medium text-gray-900">{name.firstName}</div>
                  {name.notes && (
                    <div className="text-sm text-gray-600 mt-1">{name.notes}</div>
                  )}
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
        options={groupOptions}
      />

      {/* Edit Group Modal */}
      <Modal
        isOpen={editingGroup}
        onClose={() => setEditingGroup(false)}
        title="Edit Group"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Group Name
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter group name"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setEditingGroup(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveGroup}
              className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Name Modal */}
      <Modal
        isOpen={!!editingName}
        onClose={() => setEditingName(null)}
        title="Edit Name"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              value={editingNameData.firstName}
              onChange={(e) => setEditingNameData({ ...editingNameData, firstName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter first name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={editingNameData.notes}
              onChange={(e) => setEditingNameData({ ...editingNameData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter notes (optional)"
              rows={3}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setEditingName(null)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveName}
              className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </Modal>

      {/* Move Name Modal */}
      <Modal
        isOpen={showMoveModal}
        onClose={() => setShowMoveModal(false)}
        title="Move Name"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Destination Group
            </label>
            <select
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select a group</option>
              {groups
                .filter((g) => g.id !== group.id)
                .map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setShowMoveModal(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleMoveName}
              disabled={!selectedGroupId}
              className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Move
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}; 