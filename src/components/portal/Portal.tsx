import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: ReactNode;
  containerId?: string;
}

const Portal = ({ children, containerId = 'portal-root' }: PortalProps) => {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Get or create the portal container
    let portalContainer = document.getElementById(containerId);
    
    if (!portalContainer) {
      portalContainer = document.createElement('div');
      portalContainer.id = containerId;
      portalContainer.style.position = 'fixed';
      portalContainer.style.top = '0';
      portalContainer.style.left = '0';
      portalContainer.style.zIndex = '9999';
      portalContainer.style.pointerEvents = 'none';
      document.body.appendChild(portalContainer);
    }
    
    setContainer(portalContainer);
    
    // Cleanup function to remove empty portal containers
    return () => {
      if (portalContainer && portalContainer.children.length === 0 && portalContainer.parentNode) {
        document.body.removeChild(portalContainer);
      }
    };
  }, [containerId]);

  if (!container) return null;

  return createPortal(children, container);
};

export default Portal;