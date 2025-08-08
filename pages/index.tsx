import React, { useState, useMemo } from 'react';
import { Search, Plus, Settings, Download, Upload, Edit, Trash2, Info } from 'lucide-react';
import { useSocialStore } from '../contexts/SocialStore';
import { GroupCard } from '../components/GroupCard';
import { Modal } from '../components/Modal';
import { ContextMenu } from '../components/ContextMenu';
import { AddGroupModal } from '../components/modals/AddGroupModal';
import { AddPersonModal } from '../components/modals/AddPersonModal';
import { EditGroupModal } from '../components/modals/EditGroupModal';
import { EditPersonModal } from '../components/modals/EditPersonModal';
import { ThemePicker } from '../components/ThemePicker';
import type { Group, Person, SortMode } from '../types/social';

export default function Home() {
  const { 
    groups, 
    loading, 
    sort, 
    deleteGroup, 
    deletePerson, 
    setSort 
  } = useSocialStore();
  
  // UI State
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);
  const [showAddPersonModal, setShowAddPersonModal] = useState(false);
  const [showEditGroupModal, setShowEditGroupModal] = useState(false);
  const [showEditPersonModal, setShowEditPersonModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    type: 'group' | 'person';
    data: Group | Person;
  } | null>(null);

  // Auto-expand groups with matching people
  React.useEffect(() => {
    if (searchTerm) {
      const matchingGroups = new Set<string>();
      groups.forEach((group) => {
        group.people.forEach((person) => {
          if (
            person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (person.notes && person.notes.toLowerCase().includes(searchTerm.toLowerCase()))
          ) {
            matchingGroups.add(group.id);
          }
        });
      });
      setExpandedGroups(matchingGroups);
    }
  }, [searchTerm, groups]);

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
    console.log('FAB clicked, expanded groups:', expandedCount);
    
    if (expandedCount === 0) {
      // No group expanded - add new group
      console.log('Opening add group modal');
      setShowAddGroupModal(true);
    } else if (expandedCount === 1) {
      // One group expanded - add new person to that group
      const groupId = Array.from(expandedGroups)[0];
      const group = groups.find(g => g.id === groupId);
      if (group) {
        console.log('Opening add person modal for group:', group.name);
        setSelectedGroup(group);
        setShowAddPersonModal(true);
      }
    }
  };

  const handleGroupMenu = (e: React.MouseEvent, group: Group) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      type: 'group',
      data: group,
    });
  };

  const handlePersonMenu = (e: React.MouseEvent, person: Person) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      type: 'person',
      data: person,
    });
  };

  const handleContextMenuAction = (action: string) => {
    if (!contextMenu) return;

    if (contextMenu.type === 'group') {
      const group = contextMenu.data as Group;
      switch (action) {
        case 'edit':
          console.log('Opening edit group modal for:', group.name);
          setSelectedGroup(group);
          setShowEditGroupModal(true);
          break;
        case 'delete':
          console.log('Deleting group:', group.name);
          if (confirm(`¿Estás seguro de que quieres eliminar el grupo "${group.name}" y todas sus personas?`)) {
            deleteGroup(group.id);
          }
          break;
      }
    } else if (contextMenu.type === 'person') {
      const person = contextMenu.data as Person;
      const group = groups.find(g => g.people.some(p => p.id === person.id));
      if (!group) return;

      switch (action) {
        case 'edit':
          console.log('Opening edit person modal for:', person.name);
          setSelectedPerson(person);
          setSelectedGroup(group);
          setShowEditPersonModal(true);
          break;
        case 'delete':
          console.log('Deleting person:', person.name);
          if (confirm(`¿Estás seguro de que quieres eliminar a "${person.name}"?`)) {
            deletePerson(group.id, person.id);
          }
          break;
      }
    }
    setContextMenu(null);
  };

  const handleExport = () => {
    const data = {
      groups: groups.map((group) => ({
        id: group.id,
        name: group.name,
        people: group.people,
        updatedAt: group.updatedAt,
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
          // TODO: Implement import logic
          alert('La funcionalidad de importación se implementará próximamente');
        } catch {
          alert('Archivo JSON inválido');
        }
      };
      reader.readAsText(file);
    }
  };

  const handlePersonEdit = (person: Person, group: Group) => {
    console.log('Opening edit person modal for:', person.name);
    setSelectedPerson(person);
    setSelectedGroup(group);
    setShowEditPersonModal(true);
  };

  const handlePersonDelete = (person: Person, group: Group) => {
    console.log('Deleting person:', person.name);
    if (confirm(`¿Estás seguro de que quieres eliminar a "${person.name}"?`)) {
      deletePerson(group.id, person.id);
    }
  };

  // Sort groups based on current sort mode
  const sortedGroups = useMemo(() => {
    const arr = [...groups];
    console.log('Sorting groups with mode:', sort, 'Total groups:', arr.length);
    
    // First, sort by the specified mode
    if (sort === 'az') {
      arr.sort((a,b) => a.name.localeCompare(b.name));
      console.log('Sorted A-Z:', arr.map(g => g.name));
    } else if (sort === 'za') {
      arr.sort((a,b) => b.name.localeCompare(a.name));
      console.log('Sorted Z-A:', arr.map(g => g.name));
    } else {
      arr.sort((a,b) => b.updatedAt - a.updatedAt);
      console.log('Sorted by recent:', arr.map(g => g.name));
    }

    // Then, if there are expanded groups, move them to the top
    if (expandedGroups.size > 0) {
      const expandedGroupsArray = arr.filter(g => expandedGroups.has(g.id));
      const collapsedGroupsArray = arr.filter(g => !expandedGroups.has(g.id));
      return [...expandedGroupsArray, ...collapsedGroupsArray];
    }

    return arr;
  }, [groups, sort, expandedGroups]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
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
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                />
              </div>
              
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
              onClick={() => setShowAddGroupModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Crear Grupo
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedGroups.map((group) => {
              const isExpanded = expandedGroups.has(group.id);
              const isDimmed = expandedGroups.size > 0 && !isExpanded;
              
              return (
                <GroupCard
                  key={group.id}
                  group={group}
                  people={group.people}
                  isExpanded={isExpanded}
                  onToggle={() => handleToggleGroup(group.id)}
                  searchTerm={searchTerm}
                  isDimmed={isDimmed}
                  onGroupMenu={(e) => handleGroupMenu(e, group)}
                  onPersonMenu={(e, person) => handlePersonMenu(e, person)}
                  onPersonEdit={handlePersonEdit}
                  onPersonDelete={handlePersonDelete}
                />
              );
            })}
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <button
        onClick={handleFABClick}
        className="fab"
        aria-label="Agregar nuevo elemento"
      >
        <Plus size={24} />
      </button>

      {/* Modals */}
      <AddGroupModal 
        isOpen={showAddGroupModal} 
        onClose={() => setShowAddGroupModal(false)} 
      />
      
      <AddPersonModal 
        isOpen={showAddPersonModal} 
        onClose={() => setShowAddPersonModal(false)}
        groupId={selectedGroup?.id || ''}
        groupName={selectedGroup?.name || ''}
      />
      
      <EditGroupModal 
        isOpen={showEditGroupModal} 
        onClose={() => setShowEditGroupModal(false)}
        group={selectedGroup}
      />
      
      <EditPersonModal 
        isOpen={showEditPersonModal} 
        onClose={() => setShowEditPersonModal(false)}
        person={selectedPerson}
        groupId={selectedGroup?.id || ''}
        groupName={selectedGroup?.name || ''}
      />

      {/* Settings Modal */}
      <Modal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        title="Configuración"
      >
        <div className="space-y-6">
          {/* Theme Picker */}
          <ThemePicker />

          {/* Sorting Options */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Ordenar Grupos</h3>
            <div className="space-y-2">
              {([
                { value: 'az' as SortMode, label: 'A → Z' },
                { value: 'za' as SortMode, label: 'Z → A' },
                { value: 'recent' as SortMode, label: 'Recientes' }
              ]).map((option) => (
                <label key={option.value} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="sort"
                    value={option.value}
                    checked={sort === option.value}
                    onChange={(e) => {
                      console.log('Changing sort to:', e.target.value);
                      setSort(e.target.value as SortMode);
                    }}
                    className="text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    {option.label}
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

          {/* Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Información</h3>
            <div className="space-y-2">
              <button
                onClick={() => setShowInfoModal(true)}
                className="w-full flex items-center gap-2 px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                <Info size={16} />
                Cómo anclar la web app en tu dock
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Info Modal */}
      <Modal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        title="Cómo anclar la web app en tu dock"
      >
        <div className="space-y-6">
          {/* Android Instructions */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">📱 Android</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <p><strong>Chrome:</strong></p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Abre esta web app en Chrome</li>
                <li>Toca el menú (tres puntos) en la esquina superior derecha</li>
                <li>Selecciona &quot;Añadir a pantalla de inicio&quot;</li>
                <li>Confirma y aparecerá un icono en tu pantalla de inicio</li>
              </ol>
              
              <p className="mt-4"><strong>Samsung Internet:</strong></p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Abre esta web app en Samsung Internet</li>
                <li>Toca el menú (tres puntos)</li>
                <li>Selecciona &quot;Añadir página a&quot; → &quot;Pantalla de inicio&quot;</li>
                <li>Confirma y aparecerá en tu pantalla de inicio</li>
              </ol>
            </div>
          </div>

          {/* iOS Instructions */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">🍎 iOS</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <p><strong>Safari:</strong></p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Abre esta web app en Safari</li>
                <li>Toca el botón de compartir (cuadrado con flecha hacia arriba)</li>
                <li>Desplázate hacia abajo y selecciona &quot;Añadir a pantalla de inicio&quot;</li>
                <li>Confirma y aparecerá un icono en tu pantalla de inicio</li>
              </ol>
              
              <p className="mt-4"><strong>Chrome en iOS:</strong></p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Abre esta web app en Chrome</li>
                <li>Toca el menú (tres puntos)</li>
                <li>Selecciona &quot;Añadir a pantalla de inicio&quot;</li>
                <li>Confirma y aparecerá en tu pantalla de inicio</li>
              </ol>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">✨ Beneficios de anclar la app:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Acceso rápido desde tu pantalla de inicio</li>
              <li>• Funciona como una app nativa</li>
              <li>• No necesitas abrir el navegador cada vez</li>
              <li>• Experiencia más fluida y rápida</li>
            </ul>
          </div>
        </div>
      </Modal>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          options={[
            {
              label: 'Editar',
              action: () => handleContextMenuAction('edit'),
              icon: Edit,
            },
            {
              label: 'Eliminar',
              action: () => handleContextMenuAction('delete'),
              icon: Trash2,
              danger: true,
            },
          ]}
        />
      )}
    </div>
  );
} 