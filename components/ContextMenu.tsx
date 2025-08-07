import React, { useEffect, useRef } from 'react';
import { MoreVertical, Download, Edit, Trash2 } from 'lucide-react';
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

  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'download':
        return <Download size={16} />;
      case 'edit':
        return <Edit size={16} />;
      case 'delete':
        return <Trash2 size={16} />;
      default:
        return <MoreVertical size={16} />;
    }
  };

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[160px]"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, 8px)',
      }}
    >
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => {
            option.action();
            onClose();
          }}
          className={`w-full flex items-center gap-2 px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors ${
            option.danger ? 'text-red-600 hover:text-red-700' : 'text-gray-700'
          }`}
        >
          {getIcon(option.icon)}
          {option.label}
        </button>
      ))}
    </div>
  );
}; 