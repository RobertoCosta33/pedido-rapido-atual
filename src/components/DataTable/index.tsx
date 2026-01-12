/**
 * Componente DataTable para exibição de dados tabulares
 */

import React, { useState, useMemo } from 'react';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import InboxIcon from '@mui/icons-material/Inbox';
import CircularProgress from '@mui/material/CircularProgress';
import { TableColumn } from '@/types';
import {
  TableContainer,
  TableWrapper,
  Table,
  TableHead,
  TableHeadRow,
  TableHeaderCell,
  SortIcon,
  TableBody,
  TableRow,
  TableCell,
  EmptyState,
  EmptyStateText,
  LoadingOverlay,
  Pagination,
  PaginationInfo,
  PaginationControls,
  PaginationButton,
  RowsPerPageSelect,
} from './styles';

export interface DataTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  isLoading?: boolean;
  emptyMessage?: string;
  sortable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  onRowClick?: (item: T) => void;
}

export const DataTable = <T extends object>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  emptyMessage = 'Nenhum item encontrado',
  sortable = true,
  pagination = true,
  pageSize: initialPageSize = 10,
  pageSizeOptions = [10, 25, 50],
  onRowClick,
}: DataTableProps<T>) => {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  
  // Ordena dados
  const sortedData = useMemo(() => {
    if (!sortColumn) return data;
    
    return [...data].sort((a, b) => {
      const aValue = (a as Record<string, unknown>)[sortColumn];
      const bValue = (b as Record<string, unknown>)[sortColumn];
      
      if (aValue === bValue) return 0;
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      
      const comparison = aValue < bValue ? -1 : 1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, sortColumn, sortDirection]);
  
  // Pagina dados
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize, pagination]);
  
  const totalPages = Math.ceil(sortedData.length / pageSize);
  
  const handleSort = (columnKey: string) => {
    if (!sortable) return;
    
    if (sortColumn === columnKey) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };
  
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };
  
  if (isLoading) {
    return (
      <TableContainer>
        <LoadingOverlay>
          <CircularProgress />
        </LoadingOverlay>
      </TableContainer>
    );
  }
  
  if (data.length === 0) {
    return (
      <TableContainer>
        <EmptyState>
          <InboxIcon />
          <EmptyStateText>{emptyMessage}</EmptyStateText>
        </EmptyState>
      </TableContainer>
    );
  }
  
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, sortedData.length);
  
  return (
    <TableContainer>
      <TableWrapper>
        <Table>
          <TableHead>
            <TableHeadRow>
              {columns.map((column) => (
                <TableHeaderCell
                  key={String(column.key)}
                  $sortable={sortable && column.sortable !== false}
                  $align={column.align}
                  $width={column.width}
                  onClick={() => column.sortable !== false && handleSort(String(column.key))}
                >
                  {column.label}
                  {sortable && column.sortable !== false && (
                    <SortIcon
                      $active={sortColumn === column.key}
                      $direction={sortColumn === column.key ? sortDirection : undefined}
                    >
                      <ArrowUpwardIcon style={{ width: 16, height: 16 }} />
                    </SortIcon>
                  )}
                </TableHeaderCell>
              ))}
            </TableHeadRow>
          </TableHead>
          
          <TableBody>
            {paginatedData.map((item) => (
              <TableRow
                key={keyExtractor(item)}
                $clickable={!!onRowClick}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((column) => {
                  const value = (item as Record<string, unknown>)[String(column.key)];
                  
                  return (
                    <TableCell key={String(column.key)} $align={column.align}>
                      {column.render
                        ? column.render(value as T[keyof T], item)
                        : String(value ?? '-')}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableWrapper>
      
      {pagination && totalPages > 1 && (
        <Pagination>
          <PaginationInfo>
            Mostrando {startItem}-{endItem} de {sortedData.length} itens
          </PaginationInfo>
          
          <PaginationControls>
            <RowsPerPageSelect>
              <span>Por página:</span>
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </RowsPerPageSelect>
            
            <PaginationButton
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeftIcon />
            </PaginationButton>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <PaginationButton
                  key={pageNum}
                  $active={pageNum === currentPage}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </PaginationButton>
              );
            })}
            
            <PaginationButton
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRightIcon />
            </PaginationButton>
          </PaginationControls>
        </Pagination>
      )}
    </TableContainer>
  );
};

export default DataTable;

