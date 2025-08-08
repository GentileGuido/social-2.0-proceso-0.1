import React, { useEffect, useRef } from 'react';
import { MoreVertical } from 'lucide-react';
import type { ContextMenuOption } from '../types/social';

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

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const getIcon = (icon?: React.ComponentType<{ size?: number | string }>) => {
    if (!icon) return <MoreVertical size={16} />;
    return React.createElement(icon, { size: 16 });
  };

  // Calculate position to keep menu in viewport
  const getMenuPosition = () => {
    const menuWidth = 160;
    const menuHeight = options.length * 40 + 16; // Approximate height
    
    let left = x;
    let top = y;
    
    // Adjust horizontal position
    if (left + menuWidth > window.innerWidth) {
      left = x - menuWidth;
    }
    
    // Adjust vertical position
    if (top + menuHeight > window.innerHeight) {
      top = y - menuHeight;
    }
    
    return { left, top };
  };

  const position = getMenuPosition();

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[160px]"
      style={{
        left: position.left,
        top: position.top,
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