import React, { useEffect, useRef } from 'react';
import Portal from './Portal';

interface DropdownPortalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose?: () => void;
  closeOnClickOutside?: boolean;
  triggerRef?: React.RefObject<HTMLElement>;
}

const DropdownPortal = ({ 
  children, 
  isOpen, 
  onClose, 
  closeOnClickOutside = true,
  triggerRef
}: DropdownPortalProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !closeOnClickOutside) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Don't close if clicking on the trigger element
      if (triggerRef?.current?.contains(target)) return;
      
      // Don't close if clicking inside the dropdown
      if (dropdownRef.current?.contains(target)) return;
      
      // Close the dropdown
      if (onClose) onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, closeOnClickOutside, triggerRef]);

  if (!isOpen) return null;

  return (
    <Portal containerId="dropdown-portal">
      <div 
        ref={dropdownRef}
        style={{ 
          position: 'absolute',
          zIndex: 1000,
          pointerEvents: 'auto'
        }}
      >
        {children}
      </div>
    </Portal>
  );
};

export default DropdownPortal;