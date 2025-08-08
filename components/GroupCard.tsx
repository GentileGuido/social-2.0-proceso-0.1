import React from 'react';
import { ChevronDown, ChevronRight, Users, MoreVertical } from 'lucide-react';
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

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 transition-all duration-200 ${
      isDimmed ? 'opacity-50' : ''
    }`}>
      {/* Group Header */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <button
              onClick={onToggle}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              aria-label={isExpanded ? 'Contraer grupo' : 'Expandir grupo'}
            >
              {isExpanded ? (
                <ChevronDown size={20} className="text-gray-600" />
              ) : (
                <ChevronRight size={20} className="text-gray-600" />
              )}
            </button>
            
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{group.name}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Users size={14} />
                <span>{people.length} persona{people.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={(e) => onGroupMenu(e, group)}
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
          {filteredPeople.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              {searchTerm ? 'No se encontraron personas' : 'No hay personas en este grupo'}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredPeople.map((person) => (
                <div
                  key={person.id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{person.name}</h4>
                      {person.notes && (
                        <p className="text-sm text-gray-600 mt-1">{person.notes}</p>
                      )}
                    </div>
                    
                    <button
                      onClick={(e) => onPersonMenu(e, person, group)}
                      className="p-2 hover:bg-gray-100 rounded transition-colors"
                      aria-label={`Opciones de ${person.name}`}
                    >
                      <MoreVertical size={16} className="text-gray-500" />
                    </button>
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