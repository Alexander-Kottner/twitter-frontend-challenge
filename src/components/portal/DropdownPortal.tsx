import React, { useEffect, useRef, useState } from 'react';
import Portal from './Portal';

interface DropdownPortalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose?: () => void;
  closeOnClickOutside?: boolean;
  triggerRef?: React.RefObject<HTMLElement>;
  offset?: { x: number; y: number };
}

const DropdownPortal = ({ 
  children, 
  isOpen, 
  onClose, 
  closeOnClickOutside = true,
  triggerRef,
  offset = { x: 0, y: 2 }
}: DropdownPortalProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    if (!isOpen || !triggerRef?.current) return;

    const updatePosition = () => {
      const triggerElement = triggerRef.current;
      if (!triggerElement) return;

      const rect = triggerElement.getBoundingClientRect();
      setPosition({
        top: rect.bottom + offset.y,
        left: rect.left + offset.x,
        width: rect.width
      });
    };

    updatePosition();

    // Update position on scroll or resize
    const handlePositionUpdate = () => updatePosition();
    window.addEventListener('scroll', handlePositionUpdate, true);
    window.addEventListener('resize', handlePositionUpdate);

    return () => {
      window.removeEventListener('scroll', handlePositionUpdate, true);
      window.removeEventListener('resize', handlePositionUpdate);
    };
  }, [isOpen, triggerRef, offset.x, offset.y]);

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
          position: 'fixed',
          top: position.top,
          left: position.left,
          width: position.width,
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