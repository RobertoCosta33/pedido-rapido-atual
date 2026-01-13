'use client';

/**
 * Página de gerenciamento de quiosques
 * Consome API real do backend ASP.NET Core
 */

import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Button, Input, DataTable, Modal, Card } from '@/components';
import { kiosksService, KioskDto } from '@/services/kiosks.service';
import { useNotification } from '@/contexts';
import { formatDate } from '@/utils/formatters';
import { TableColumn } from '@/types';

// ============================================================================
// Styled Components
// ============================================================================

const Container = styled.div``;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`;

const SearchWrapper = styled.div`
  width: 300px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100%;
  }
`;

const StatusBadge = styled.span<{ $active: boolean }>`
  padding: 4px 12px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 0.75rem;
  font-weight: 600;
  background: ${({ theme, $active }) =>
    $active ? `${theme.colors.success.main}20` : `${theme.colors.error.main}20`};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.success.main : theme.colors.error.main};
`;

const PremiumBadge = styled.span`
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.65rem;
  font-weight: 700;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #000;
  margin-left: 8px;
`;

const Actions = styled.div`
  display: flex;
  gap: 4px;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  gap: ${({ theme }) => theme.spacing.md};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
`;

// ============================================================================
// Types
// ============================================================================

interface PageState {
  loading: boolean;
  error: string | null;
  kiosks: KioskDto[];
}

// ============================================================================
// Component
// ============================================================================

export const KiosksPage: React.FC = () => {
  const { showSuccess, showError } = useNotification();
  const [state, setState] = useState<PageState>({
    loading: true,
    error: null,
    kiosks: [],
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedKiosk, setSelectedKiosk] = useState<KioskDto | null>(null);
  
  /**
   * Carrega quiosques da API real
   */
  const loadKiosks = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await kiosksService.getAll();
      setState({ loading: false, error: null, kiosks: data });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao carregar quiosques';
      setState(prev => ({ ...prev, loading: false, error: message }));
      showError(message);
    }
  }, [showError]);

  useEffect(() => {
    loadKiosks();
  }, [loadKiosks]);
  
  const handleEdit = (kiosk: KioskDto) => {
    setSelectedKiosk(kiosk);
    setModalOpen(true);
  };
  
  const handleDelete = async (kiosk: KioskDto) => {
    if (confirm(`Deseja realmente excluir o quiosque "${kiosk.name}"?`)) {
      try {
        await kiosksService.delete(kiosk.id);
        setState(prev => ({
          ...prev,
          kiosks: prev.kiosks.filter(k => k.id !== kiosk.id),
        }));
        showSuccess('Quiosque removido com sucesso');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro ao remover quiosque';
        showError(message);
      }
    }
  };
  
  const handleSave = () => {
    setModalOpen(false);
    setSelectedKiosk(null);
    loadKiosks();
    showSuccess('Quiosque salvo com sucesso');
  };
  
  // Filtro de busca
  const filteredKiosks = state.kiosks.filter((kiosk) =>
    kiosk.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kiosk.city.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Colunas da tabela
  const columns: TableColumn<KioskDto>[] = [
    { 
      key: 'name', 
      label: 'Nome', 
      sortable: true,
      render: (value, item) => (
        <>
          {value as string}
          {item.isPremium && <PremiumBadge>PREMIUM</PremiumBadge>}
        </>
      ),
    },
    { key: 'slug', label: 'Slug' },
    { 
      key: 'city', 
      label: 'Localização', 
      render: (_, item) => `${item.city}/${item.state}` 
    },
    {
      key: 'averageRating',
      label: 'Avaliação',
      align: 'center',
      render: (value) => `⭐ ${(value as number).toFixed(1)}`,
    },
    { 
      key: 'allowOnlineOrders', 
      label: 'Status', 
      align: 'center',
      render: (value) => (
        <StatusBadge $active={value as boolean}>
          {value ? 'Online' : 'Offline'}
        </StatusBadge>
      ),
    },
    { 
      key: 'createdAt', 
      label: 'Criado em', 
      render: (value) => formatDate(new Date(value as string)),
    },
    {
      key: 'id',
      label: 'Ações',
      align: 'center',
      sortable: false,
      render: (_, item) => (
        <Actions>
          <IconButton size="small" title="Visualizar">
            <VisibilityIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" title="Editar" onClick={() => handleEdit(item)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" title="Excluir" onClick={() => handleDelete(item)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Actions>
      ),
    },
  ];

  // Estado de loading
  if (state.loading) {
    return (
      <Container>
        <Header>
          <Title>Quiosques</Title>
        </Header>
        <LoadingContainer>
          <CircularProgress />
          <Typography color="textSecondary">Carregando quiosques...</Typography>
        </LoadingContainer>
      </Container>
    );
  }

  // Estado de erro
  if (state.error) {
    return (
      <Container>
        <Header>
          <Title>Quiosques</Title>
        </Header>
        <Alert 
          severity="error"
          action={
            <Button variant="outlined" size="small" onClick={loadKiosks}>
              <RefreshIcon /> Tentar novamente
            </Button>
          }
        >
          {state.error}
        </Alert>
      </Container>
    );
  }
  
  return (
    <Container>
      <Header>
        <Title>Quiosques ({state.kiosks.length})</Title>
        
        <Toolbar>
          <SearchWrapper>
            <Input
              placeholder="Buscar quiosque..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<SearchIcon />}
            />
          </SearchWrapper>
          
          <Button onClick={loadKiosks} variant="secondary" title="Atualizar">
            <RefreshIcon />
          </Button>
          
          <Button onClick={() => setModalOpen(true)}>
            <AddIcon /> Novo Quiosque
          </Button>
        </Toolbar>
      </Header>
      
      {filteredKiosks.length === 0 ? (
        <EmptyState>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Nenhum quiosque encontrado
          </Typography>
          <Typography color="textSecondary">
            {searchTerm 
              ? 'Tente buscar por outro termo'
              : 'Clique em "Novo Quiosque" para adicionar'}
          </Typography>
        </EmptyState>
      ) : (
        <Card>
          <DataTable
            columns={columns}
            data={filteredKiosks}
            keyExtractor={(kiosk) => kiosk.id}
          />
        </Card>
      )}
      
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedKiosk ? 'Editar Quiosque' : 'Novo Quiosque'}
      >
        <Box sx={{ p: 2 }}>
          <Typography color="textSecondary">
            Formulário de edição será implementado em breve.
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              Salvar
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default KiosksPage;
