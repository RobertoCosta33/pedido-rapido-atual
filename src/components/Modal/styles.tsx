/**
 * Estilos do componente Modal
 */

import styled, { css, keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

export const Overlay = styled.div<{ $isClosing: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing.md};
  animation: ${fadeIn} 0.2s ease-out;
  
  ${({ $isClosing }) =>
    $isClosing &&
    css`
      animation: ${fadeIn} 0.2s ease-out reverse;
    `}
`;

type ModalSize = 'small' | 'medium' | 'large' | 'fullscreen';

interface ModalContainerProps {
  $size: ModalSize;
  $isClosing: boolean;
}

const sizeStyles = {
  small: css`
    max-width: 400px;
  `,
  medium: css`
    max-width: 600px;
  `,
  large: css`
    max-width: 900px;
  `,
  fullscreen: css`
    max-width: calc(100vw - 32px);
    max-height: calc(100vh - 32px);
    width: 100%;
    height: 100%;
  `,
};

export const ModalContainer = styled.div<ModalContainerProps>`
  background: ${({ theme }) => theme.colors.background.paper};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  width: 100%;
  max-height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  animation: ${slideUp} 0.3s ease-out;
  
  ${({ $size }) => sizeStyles[$size]}
  
  ${({ $isClosing }) =>
    $isClosing &&
    css`
      animation: ${slideUp} 0.2s ease-out reverse;
    `}
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
`;

export const ModalTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.h4.fontSize};
  font-weight: ${({ theme }) => theme.typography.h4.fontWeight};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

export const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: transparent;
  color: ${({ theme }) => theme.colors.text.secondary};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.background.subtle};
    color: ${({ theme }) => theme.colors.text.primary};
  }
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

export const ModalBody = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  overflow-y: auto;
  flex: 1;
`;

export const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};
`;

