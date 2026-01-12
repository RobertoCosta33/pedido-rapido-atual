/**
 * Estilos globais da aplicação
 */

import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  /* Google Fonts Import */
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

  /* CSS Reset */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  /* Root Variables */
  :root {
    --font-primary: ${({ theme }) => theme.typography.fontFamily};
    --font-mono: ${({ theme }) => theme.typography.fontFamilyMono};
    --transition-fast: ${({ theme }) => theme.transitions.fast};
    --transition-normal: ${({ theme }) => theme.transitions.normal};
  }

  /* Base Styles */
  html {
    font-size: 16px;
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: var(--font-primary);
    font-size: 1rem;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.text.primary};
    background-color: ${({ theme }) => theme.colors.background.default};
    transition: background-color var(--transition-normal), color var(--transition-normal);
    min-height: 100vh;
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.3;
    color: ${({ theme }) => theme.colors.text.primary};
  }

  h1 {
    font-size: ${({ theme }) => theme.typography.h1.fontSize};
    font-weight: ${({ theme }) => theme.typography.h1.fontWeight};
  }

  h2 {
    font-size: ${({ theme }) => theme.typography.h2.fontSize};
    font-weight: ${({ theme }) => theme.typography.h2.fontWeight};
  }

  h3 {
    font-size: ${({ theme }) => theme.typography.h3.fontSize};
    font-weight: ${({ theme }) => theme.typography.h3.fontWeight};
  }

  h4 {
    font-size: ${({ theme }) => theme.typography.h4.fontSize};
    font-weight: ${({ theme }) => theme.typography.h4.fontWeight};
  }

  h5 {
    font-size: ${({ theme }) => theme.typography.h5.fontSize};
    font-weight: ${({ theme }) => theme.typography.h5.fontWeight};
  }

  h6 {
    font-size: ${({ theme }) => theme.typography.h6.fontSize};
    font-weight: ${({ theme }) => theme.typography.h6.fontWeight};
  }

  p {
    margin-bottom: 1rem;
    
    &:last-child {
      margin-bottom: 0;
    }
  }

  /* Links */
  a {
    color: ${({ theme }) => theme.colors.primary.main};
    text-decoration: none;
    transition: color var(--transition-fast);

    &:hover {
      color: ${({ theme }) => theme.colors.primary.dark};
    }

    &:focus-visible {
      outline: 2px solid ${({ theme }) => theme.colors.primary.main};
      outline-offset: 2px;
      border-radius: ${({ theme }) => theme.borderRadius.sm};
    }
  }

  /* Images */
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* Lists */
  ul, ol {
    list-style-position: inside;
    margin-bottom: 1rem;
  }

  /* Form Elements */
  button, input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
    
    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  input, textarea, select {
    border: 1px solid ${({ theme }) => theme.colors.border.default};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    background-color: ${({ theme }) => theme.colors.background.paper};
    color: ${({ theme }) => theme.colors.text.primary};
    transition: border-color var(--transition-fast), box-shadow var(--transition-fast);

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary.main};
      box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary.main}33;
    }

    &::placeholder {
      color: ${({ theme }) => theme.colors.text.disabled};
    }

    &:disabled {
      background-color: ${({ theme }) => theme.colors.background.subtle};
      cursor: not-allowed;
    }
  }

  textarea {
    resize: vertical;
    min-height: 100px;
  }

  /* Tables */
  table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
  }

  th, td {
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border.default};
  }

  th {
    font-weight: 600;
    background-color: ${({ theme }) => theme.colors.background.subtle};
  }

  /* Code */
  code, pre {
    font-family: var(--font-mono);
    font-size: 0.875em;
  }

  code {
    background-color: ${({ theme }) => theme.colors.background.subtle};
    padding: 0.2em 0.4em;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
  }

  pre {
    background-color: ${({ theme }) => theme.colors.background.subtle};
    padding: ${({ theme }) => theme.spacing.md};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    overflow-x: auto;

    code {
      background: none;
      padding: 0;
    }
  }

  /* Selection */
  ::selection {
    background-color: ${({ theme }) => theme.colors.primary.main}33;
    color: ${({ theme }) => theme.colors.text.primary};
  }

  /* Scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background.subtle};
    border-radius: ${({ theme }) => theme.borderRadius.full};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border.dark};
    border-radius: ${({ theme }) => theme.borderRadius.full};
    
    &:hover {
      background: ${({ theme }) => theme.colors.text.disabled};
    }
  }

  /* Accessibility */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /* Focus Visible */
  :focus:not(:focus-visible) {
    outline: none;
  }

  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary.main};
    outline-offset: 2px;
  }

  /* Animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  /* Utility Classes */
  .animate-fade-in {
    animation: fadeIn 0.3s ease-out;
  }

  .animate-slide-up {
    animation: slideUp 0.3s ease-out;
  }

  .animate-slide-down {
    animation: slideDown 0.3s ease-out;
  }

  .animate-scale-in {
    animation: scaleIn 0.2s ease-out;
  }

  .animate-spin {
    animation: spin 1s linear infinite;
  }

  .animate-pulse {
    animation: pulse 2s ease-in-out infinite;
  }
`;

