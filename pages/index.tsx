import React, { useState, useEffect } from 'react';
import { Search, Plus, Settings, Download, Upload } from 'lucide-react';
import { useSocialData } from '../contexts/SocialContext';
import { useTheme } from '../contexts/ThemeContext';
import { GroupCard } from '../components/GroupCard';
import { Modal } from '../components/Modal';

export default function Home() {
  const { groups, names, loading, addGroup, addName } = useSocialData();
  const { currentTheme, themes, setTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [modalType, setModalType] = useState<'group' | 'name'>('group');
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [formData, setFormData] = useState({ name: '', firstName: '', notes: '' });

  // Auto-expand groups with matching names
  useEffect(() => {
    if (searchTerm) {
      const matchingGroups = new Set<string>();
      names.forEach((name) => {
        if (
          name.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          name.notes.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          matchingGroups.add(name.groupId);
        }
      });
      setExpandedGroups(matchingGroups);
    }
  }, [searchTerm, names]);

  const handleToggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const handleFABClick = () => {
    const expandedCount = expandedGroups.size;
    if (expandedCount === 0) {
      // No group expanded - add new group
      setModalType('group');
      setFormData({ name: '', firstName: '', notes: '' });
      setShowAddModal(true);
    } else if (expandedCount === 1) {
      // One group expanded - add new name to that group
      const groupId = Array.from(expandedGroups)[0];
      setModalType('name');
      setSelectedGroupId(groupId);
      setFormData({ name: '', firstName: '', notes: '' });
      setShowAddModal(true);
    }
  };

  const handleAdd = async () => {
    if (modalType === 'group' && formData.name.trim()) {
      await addGroup(formData.name.trim());
      setShowAddModal(false);
      setFormData({ name: '', firstName: '', notes: '' });
    } else if (modalType === 'name' && formData.firstName.trim() && selectedGroupId) {
      await addName(selectedGroupId, formData.firstName.trim(), formData.notes);
      setShowAddModal(false);
      setFormData({ name: '', firstName: '', notes: '' });
    }
  };

  const handleExport = () => {
    const data = {
      groups: groups.map((group) => ({
        id: group.id,
        name: group.name,
        updatedAt: group.updatedAt,
      })),
      names: names.map((name) => ({
        id: name.id,
        firstName: name.firstName,
        notes: name.notes,
        groupId: name.groupId,
        createdAt: name.createdAt,
      })),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'social-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          console.log('Import data:', data);
          // In a real app, you would implement the import logic here
          alert('Import functionality would be implemented here');
        } catch {
          alert('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Social</h1>
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search groups and names..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-64"
                />
              </div>
              
              {/* Settings Button */}
              <button
                onClick={() => setShowSettingsModal(true)}
                className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                aria-label="Settings"
              >
                <Settings size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {groups.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search size={48} className="mx-auto" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No groups yet</h2>
            <p className="text-gray-600 mb-6">Create your first group to get started</p>
            <button
              onClick={() => {
                setModalType('group');
                setShowAddModal(true);
              }}
              className="btn-primary"
            >
              Create Group
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {groups.map((group) => {
              const groupNames = names.filter((name) => name.groupId === group.id);
              const isExpanded = expandedGroups.has(group.id);
              
              return (
                <GroupCard
                  key={group.id}
                  group={group}
                  names={groupNames}
                  isExpanded={isExpanded}
                  onToggle={() => handleToggleGroup(group.id)}
                  searchTerm={searchTerm}
                />
              );
            })}
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <button
        onClick={handleFABClick}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary-500 text-white rounded-full shadow-lg hover:bg-primary-600 transition-colors flex items-center justify-center z-30"
        aria-label="Add new item"
      >
        <Plus size={24} />
      </button>

      {/* Add Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={modalType === 'group' ? 'Add New Group' : 'Add New Name'}
      >
        <div className="space-y-4">
          {modalType === 'group' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Group Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                placeholder="Enter group name"
                autoFocus
              />
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="input-field"
                  placeholder="Enter first name"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="input-field"
                  placeholder="Enter notes (optional)"
                  rows={3}
                />
              </div>
            </>
          )}
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setShowAddModal(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={
                (modalType === 'group' && !formData.name.trim()) ||
                (modalType === 'name' && !formData.firstName.trim())
              }
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
        </div>
      </Modal>

      {/* Settings Modal */}
      <Modal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        title="Settings"
      >
        <div className="space-y-6">
          {/* Theme Selection */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Theme</h3>
            <div className="grid grid-cols-3 gap-3">
              {themes.map((theme) => (
                <button
                  key={theme.name}
                  onClick={() => setTheme(theme.name)}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    currentTheme.name === theme.name
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div
                    className="w-full h-8 rounded mb-2"
                    style={{ backgroundColor: theme.colors.primary }}
                  ></div>
                  <span className="text-sm font-medium capitalize">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Import/Export */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Data Management</h3>
            <div className="space-y-2">
              <button
                onClick={handleExport}
                className="w-full flex items-center gap-2 px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                <Download size={16} />
                Export Data
              </button>
              <label className="w-full flex items-center gap-2 px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-md transition-colors cursor-pointer">
                <Upload size={16} />
                Import Data
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
} 