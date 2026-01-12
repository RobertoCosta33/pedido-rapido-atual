/**
 * Estilos do componente DataTable
 */

import styled from 'styled-components';

export const TableContainer = styled.div`
  background: ${({ theme }) => theme.colors.background.paper};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  overflow: hidden;
`;

export const TableWrapper = styled.div`
  overflow-x: auto;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableHead = styled.thead`
  background: ${({ theme }) => theme.colors.background.subtle};
`;

export const TableHeadRow = styled.tr``;

interface TableHeaderCellProps {
  $sortable?: boolean;
  $align?: 'left' | 'center' | 'right';
  $width?: string;
}

export const TableHeaderCell = styled.th<TableHeaderCellProps>`
  padding: ${({ theme }) => theme.spacing.md};
  text-align: ${({ $align }) => $align || 'left'};
  font-weight: 600;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  white-space: nowrap;
  cursor: ${({ $sortable }) => ($sortable ? 'pointer' : 'default')};
  user-select: none;
  transition: color ${({ theme }) => theme.transitions.fast};
  width: ${({ $width }) => $width || 'auto'};
  
  &:hover {
    color: ${({ theme, $sortable }) => ($sortable ? theme.colors.primary.main : theme.colors.text.secondary)};
  }
`;

export const SortIcon = styled.span<{ $active?: boolean; $direction?: 'asc' | 'desc' }>`
  display: inline-flex;
  margin-left: 4px;
  opacity: ${({ $active }) => ($active ? 1 : 0.3)};
  transform: ${({ $direction }) => ($direction === 'desc' ? 'rotate(180deg)' : 'none')};
  transition: all ${({ theme }) => theme.transitions.fast};
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr<{ $clickable?: boolean }>`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  transition: background ${({ theme }) => theme.transitions.fast};
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: ${({ theme }) => theme.colors.background.subtle};
  }
`;

export const TableCell = styled.td<{ $align?: 'left' | 'center' | 'right' }>`
  padding: ${({ theme }) => theme.spacing.md};
  text-align: ${({ $align }) => $align || 'left'};
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.text.primary};
  vertical-align: middle;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.colors.text.secondary};
  
  svg {
    width: 64px;
    height: 64px;
    margin-bottom: ${({ theme }) => theme.spacing.md};
    opacity: 0.5;
  }
`;

export const EmptyStateText = styled.p`
  font-size: 1rem;
  margin: 0;
`;

export const LoadingOverlay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xxl};
`;

export const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const PaginationInfo = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const PaginationButton = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  padding: 0 ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  font-weight: 500;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  background: ${({ theme, $active }) => ($active ? theme.colors.primary.main : 'transparent')};
  color: ${({ theme, $active }) => ($active ? 'white' : theme.colors.text.primary)};
  
  &:hover:not(:disabled) {
    background: ${({ theme, $active }) => ($active ? theme.colors.primary.dark : theme.colors.background.subtle)};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const RowsPerPageSelect = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  
  select {
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
    border: 1px solid ${({ theme }) => theme.colors.border.default};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    background: ${({ theme }) => theme.colors.background.paper};
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: 0.875rem;
    cursor: pointer;
    
    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary.main};
    }
  }
`;

