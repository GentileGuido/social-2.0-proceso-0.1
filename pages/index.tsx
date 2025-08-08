import React, { useState, useEffect } from 'react';
import { Search, Plus, Settings, Download, Upload, LogOut, User } from 'lucide-react';
import { useSocialData } from '../contexts/SocialContext';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { GroupCard } from '../components/GroupCard';
import { Modal } from '../components/Modal';
import { isFirebaseEnabled, isDemoMode } from '../lib/config';
import { missingFirebaseEnv } from '../lib/firebaseGuard';

type SortOption = 'A-Z' | 'Z-A' | 'Recent';

// Helper function to safely get timestamp milliseconds
const getTimestampMillis = (timestamp: any): number => {
  if (timestamp?.toMillis) {
    return timestamp.toMillis();
  }
  if (timestamp?.seconds) {
    return timestamp.seconds * 1000;
  }
  return 0;
};

export default function Home() {
  const { groups, people, loading, error, addGroup, addPerson } = useSocialData();
  const { currentTheme, themes, setTheme } = useTheme();
  const { user, loading: authLoading, signInWithGoogle, signOutUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [modalType, setModalType] = useState<'group' | 'person'>('group');
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [formData, setFormData] = useState({ name: '', personName: '', notes: '' });
  const [sortOption, setSortOption] = useState<SortOption>('Recent');
  const [isSaving, setIsSaving] = useState(false);

  // Auto-expand groups with matching people
  useEffect(() => {
    if (searchTerm) {
      const matchingGroups = new Set<string>();
      people.forEach((person) => {
        if (
          person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (person.notes && person.notes.toLowerCase().includes(searchTerm.toLowerCase()))
        ) {
          matchingGroups.add(person.groupId);
        }
      });
      setExpandedGroups(matchingGroups);
    }
  }, [searchTerm, people]);

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
      setFormData({ name: '', personName: '', notes: '' });
      setShowAddModal(true);
    } else if (expandedCount === 1) {
      // One group expanded - add new person to that group
      const groupId = Array.from(expandedGroups)[0];
      setModalType('person');
      setSelectedGroupId(groupId);
      setFormData({ name: '', personName: '', notes: '' });
      setShowAddModal(true);
    }
  };

  const handleAdd = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      if (modalType === 'group' && formData.name.trim()) {
        await addGroup(formData.name.trim());
        setShowAddModal(false);
        setFormData({ name: '', personName: '', notes: '' });
      } else if (modalType === 'person' && formData.personName.trim() && selectedGroupId) {
        await addPerson(selectedGroupId, formData.personName.trim(), formData.notes);
        setShowAddModal(false);
        setFormData({ name: '', personName: '', notes: '' });
      }
    } catch (error) {
      console.error('Error adding item:', error);
      // You could show a toast notification here
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    const data = {
      groups: groups.map((group) => ({
        id: group.id,
        name: group.name,
        updatedAt: group.createdAt,
      })),
      people: people.map((person) => ({
        id: person.id,
        name: person.name,
        notes: person.notes,
        groupId: person.groupId,
        createdAt: person.createdAt,
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
          alert('La funcionalidad de importación se implementaría aquí');
        } catch {
          alert('Archivo JSON inválido');
        }
      };
      reader.readAsText(file);
    }
  };

  const sortedGroups = [...groups].sort((a, b) => {
    switch (sortOption) {
      case 'A-Z':
        return a.name.localeCompare(b.name);
      case 'Z-A':
        return b.name.localeCompare(a.name);
      case 'Recent':
        return b.createdAt - a.createdAt;
      default:
        return 0;
    }
  });

  // Show login screen if not authenticated and not in demo mode
  if (!user && !authLoading && !isDemoMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Social</h1>
            <p className="text-gray-600">Inicia sesión para continuar</p>
          </div>
          
          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 border rounded-lg px-4 py-3 transition-colors bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuar con Google
          </button>
        </div>
      </div>
    );
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Show error state if there's a Firebase error and Firebase is enabled
  if (error && isFirebaseEnabled && missingFirebaseEnv()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-red-600 mb-2">Error de Configuración</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500">
              Por favor, verifica que las variables de entorno de Firebase estén configuradas correctamente.
            </p>
          </div>
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
                  placeholder="Buscar grupos y personas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-64"
                />
              </div>
              
              {/* User Menu */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User size={16} />
                  <span>{user?.displayName || user?.email}</span>
                </div>
                {!isDemoMode && (
                  <button
                    onClick={signOutUser}
                    className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                    aria-label="Cerrar sesión"
                  >
                    <LogOut size={20} />
                  </button>
                )}
                
                {/* Settings Button */}
                <button
                  onClick={() => setShowSettingsModal(true)}
                  className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                  aria-label="Configuración"
                >
                  <Settings size={20} />
                </button>
              </div>
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
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Aún no hay grupos</h2>
            <p className="text-gray-600 mb-6">Crea tu primer grupo para comenzar</p>
            <button
              onClick={() => {
                setModalType('group');
                setShowAddModal(true);
              }}
              className="btn-primary"
            >
              Crear Grupo
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedGroups.map((group) => {
              const groupPeople = people.filter((person) => person.groupId === group.id);
              const isExpanded = expandedGroups.has(group.id);
              const isDimmed = expandedGroups.size > 0 && !isExpanded;
              
              return (
                <GroupCard
                  key={group.id}
                  group={group}
                  people={groupPeople}
                  isExpanded={isExpanded}
                  onToggle={() => handleToggleGroup(group.id)}
                  searchTerm={searchTerm}
                  isDimmed={isDimmed}
                />
              );
            })}
          </div>
        )}
      </main>

      {/* Centered Floating Action Button */}
      <button
        onClick={handleFABClick}
        className="fixed bottom-6 inset-x-0 mx-auto w-14 h-14 rounded-full bg-cyan-600 text-white shadow-lg flex items-center justify-center z-30 hover:bg-cyan-700 transition-colors"
        aria-label="Agregar nuevo elemento"
      >
        <Plus size={24} />
      </button>

      {/* Add Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={modalType === 'group' ? 'Agregar Nuevo Grupo' : 'Agregar Nueva Persona'}
      >
        <div className="space-y-4">
          {modalType === 'group' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Grupo
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                placeholder="Ingrese nombre del grupo"
                autoFocus
              />
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  value={formData.personName}
                  onChange={(e) => setFormData({ ...formData, personName: e.target.value })}
                  className="input-field"
                  placeholder="Ingrese nombre"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notas
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="input-field"
                  placeholder="Ingrese notas (opcional)"
                  rows={3}
                />
              </div>
            </>
          )}
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setShowAddModal(false)}
              className="btn-secondary"
              disabled={isSaving}
            >
              Cancelar
            </button>
            <button
              onClick={handleAdd}
              disabled={
                isSaving ||
                (modalType === 'group' && !formData.name.trim()) ||
                (modalType === 'person' && !formData.personName.trim())
              }
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Guardando...' : 'Agregar'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Settings Modal */}
      <Modal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        title="Configuración"
      >
        <div className="space-y-6">
          {/* Theme Selection */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Tema</h3>
            <div className="grid grid-cols-7 gap-3">
              {themes.map((theme) => (
                <button
                  key={theme.name}
                  onClick={() => setTheme(theme.name)}
                  className={`p-3 rounded-full border-2 transition-colors ${
                    currentTheme.name === theme.name
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  title={theme.name}
                >
                  <div
                    className="w-full h-8 rounded-full"
                    style={{ backgroundColor: theme.colors.primary }}
                  ></div>
                </button>
              ))}
            </div>
          </div>

          {/* Sorting Options */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Ordenar Grupos</h3>
            <div className="space-y-2">
              {(['A-Z', 'Z-A', 'Recent'] as SortOption[]).map((option) => (
                <label key={option} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="sort"
                    value={option}
                    checked={sortOption === option}
                    onChange={(e) => setSortOption(e.target.value as SortOption)}
                    className="text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">
                    {option === 'A-Z' && 'A → Z'}
                    {option === 'Z-A' && 'Z → A'}
                    {option === 'Recent' && 'Recientes'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Import/Export */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Gestión de Datos</h3>
            <div className="space-y-2">
              <button
                onClick={handleExport}
                className="w-full flex items-center gap-2 px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                <Download size={16} />
                Exportar Datos
              </button>
              <label className="w-full flex items-center gap-2 px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-md transition-colors cursor-pointer">
                <Upload size={16} />
                Importar Datos
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