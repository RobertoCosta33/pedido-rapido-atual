/**
 * Componente Modal reutilizável
 */

import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import CloseIcon from '@mui/icons-material/Close';
import {
  Overlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalBody,
  ModalFooter,
} from './styles';

type ModalSize = 'small' | 'medium' | 'large' | 'fullscreen';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: ModalSize;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = 'medium',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  footer,
  children,
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200);
  }, [onClose]);
  
  // Fecha com Escape
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, handleClose]);
  
  // Bloqueia scroll do body
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      handleClose();
    }
  };
  
  if (!isOpen || !mounted) return null;
  
  const modalContent = (
    <Overlay $isClosing={isClosing} onClick={handleOverlayClick}>
      <ModalContainer
        $size={size}
        $isClosing={isClosing}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {(title || showCloseButton) && (
          <ModalHeader>
            {title && <ModalTitle id="modal-title">{title}</ModalTitle>}
            {showCloseButton && (
              <CloseButton onClick={handleClose} aria-label="Fechar modal">
                <CloseIcon />
              </CloseButton>
            )}
          </ModalHeader>
        )}
        
        <ModalBody>{children}</ModalBody>
        
        {footer && <ModalFooter>{footer}</ModalFooter>}
      </ModalContainer>
    </Overlay>
  );
  
  return createPortal(modalContent, document.body);
};

export default Modal;

