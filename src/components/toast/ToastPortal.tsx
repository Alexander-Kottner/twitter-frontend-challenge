import React from 'react';
import Portal from '../portal/Portal';
import { StyledToastContainer } from './ToastContainer';
import { ToastType } from './Toast';

interface ToastPortalProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const ToastPortal = ({ message, type, onClose }: ToastPortalProps) => {
  return (
    <Portal containerId="toast-portal">
      <StyledToastContainer 
        type={type}
        style={{ 
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10000,
          pointerEvents: 'auto'
        }}
      >
        <p>{message}</p>
        <button onClick={onClose} style={{ 
          background: 'none', 
          border: 'none', 
          color: 'inherit', 
          cursor: 'pointer',
          fontSize: '16px',
          padding: '0 4px'
        }}>×</button>
      </StyledToastContainer>
    </Portal>
  );
};

export default ToastPortal;