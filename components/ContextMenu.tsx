import React, { useEffect, useRef } from 'react';
import { MoreVertical, Download, Edit, Trash2 } from 'lucide-react';
import { ContextMenuOption } from '../types';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  options: ContextMenuOption[];
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  onClose,
  options,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const getIcon = (icon?: any) => {
    if (!icon) return <MoreVertical size={16} />;
    return React.createElement(icon, { size: 16 });
  };

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[160px]"
      style={{
        left: x,
        top: y,
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