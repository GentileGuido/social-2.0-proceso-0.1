import React from 'react';
import { Users, MoreVertical, Trash2 } from 'lucide-react';
import type { Group, Person } from '../types/social';

interface GroupCardProps {
  group: Group;
  people: Person[];
  isExpanded: boolean;
  onToggle: () => void;
  searchTerm: string;
  isDimmed?: boolean;
  onGroupMenu: (e: React.MouseEvent, group: Group) => void;
  onPersonMenu: (e: React.MouseEvent, person: Person, group: Group) => void;
  onPersonEdit: (person: Person, group: Group) => void;
  onPersonDelete: (person: Person, group: Group) => void;
}

export const GroupCard: React.FC<GroupCardProps> = ({
  group,
  people,
  isExpanded,
  onToggle,
  searchTerm,
  isDimmed = false,
  onGroupMenu,
  onPersonMenu,
  onPersonEdit,
  onPersonDelete,
}) => {
  // Filter people based on search term
  const filteredPeople = people.filter((person) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      person.name.toLowerCase().includes(searchLower) ||
      (person.notes && person.notes.toLowerCase().includes(searchLower))
    );
  });

  // Sort people alphabetically
  const sortedPeople = [...filteredPeople].sort((a, b) => 
    a.name.localeCompare(b.name)
  );

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 transition-all duration-200 ${
      isDimmed ? 'opacity-30 grayscale' : ''
    }`}>
      {/* Group Header - Entire card clickable */}
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex-1">
              <h3 className="font-semibold" style={{ color: 'var(--brand)' }}>{group.name}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Users size={14} />
                <span>{people.length} persona{people.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onGroupMenu(e, group);
            }}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            aria-label="Opciones del grupo"
          >
            <MoreVertical size={16} className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* People List */}
      {isExpanded && (
        <div className="border-t border-gray-100">
          {sortedPeople.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              {searchTerm ? 'No se encontraron personas' : 'No hay personas en este grupo'}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {sortedPeople.map((person) => (
                <div
                  key={person.id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div 
                      className="flex-1 cursor-pointer"
                      onClick={() => onPersonEdit(person, group)}
                    >
                      <h4 className="font-medium" style={{ color: 'var(--brand)' }}>{person.name}</h4>
                      {person.notes && (
                        <p className="text-sm text-gray-600 mt-1">{person.notes}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onPersonMenu(e, person, group);
                        }}
                        className="p-2 hover:bg-gray-100 rounded transition-colors"
                        aria-label={`Opciones de ${person.name}`}
                      >
                        <MoreVertical size={16} className="text-gray-500" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onPersonDelete(person, group);
                        }}
                        className="p-2 hover:bg-red-50 rounded transition-colors"
                        aria-label={`Eliminar ${person.name}`}
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 