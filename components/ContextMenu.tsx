import React, { useEffect, useRef } from 'react';
import { Edit, Trash2, Move } from 'lucide-react';
import { ContextMenuOption } from '../types';

interface ContextMenuProps {
  isOpen: boolean;
  onClose: () => void;
  position: { x: number; y: number };
  options: ContextMenuOption[];
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  isOpen,
  onClose,
  position,
  options,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[160px]"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => {
            option.action();
            onClose();
          }}
          className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors flex items-center gap-2 ${
            option.danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700'
          }`}
        >
          {option.icon === 'edit' && <Edit size={16} />}
          {option.icon === 'delete' && <Trash2 size={16} />}
          {option.icon === 'move' && <Move size={16} />}
          {option.label}
        </button>
      ))}
    </div>
  );
}; 