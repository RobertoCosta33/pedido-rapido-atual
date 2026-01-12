/**
 * Exportação centralizada de todos os tipos
 */

export * from './user';
export * from './product';
export * from './stock';
export * from './order';

// Tipos utilitários globais
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
  search?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
  [key: string]: string | Date | undefined;
}

export interface SelectOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface NotificationData {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ModalState {
  isOpen: boolean;
  title?: string;
  content?: React.ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: T[keyof T], item: T) => React.ReactNode;
}

