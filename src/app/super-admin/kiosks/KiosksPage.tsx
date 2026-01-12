'use client';

/**
 * Página de gerenciamento de quiosques
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import IconButton from '@mui/material/IconButton';
import { Button, Input, DataTable, Modal, Card } from '@/components';
import { productService } from '@/services';
import { useNotification } from '@/contexts';
import { formatDate } from '@/utils/formatters';
import { Kiosk, TableColumn } from '@/types';

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

const Actions = styled.div`
  display: flex;
  gap: 4px;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

export const KiosksPage: React.FC = () => {
  const { showSuccess, showError } = useNotification();
  const [kiosks, setKiosks] = useState<Kiosk[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedKiosk, setSelectedKiosk] = useState<Kiosk | null>(null);
  
  useEffect(() => {
    loadKiosks();
  }, []);
  
  const loadKiosks = async () => {
    try {
      setIsLoading(true);
      const data = await productService.getKiosks();
      setKiosks(data);
    } catch (error) {
      showError('Erro ao carregar quiosques');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEdit = (kiosk: Kiosk) => {
    setSelectedKiosk(kiosk);
    setModalOpen(true);
  };
  
  const handleDelete = async (kiosk: Kiosk) => {
    if (confirm(`Deseja realmente excluir o quiosque "${kiosk.name}"?`)) {
      try {
        // Simulação de exclusão
        setKiosks((prev) => prev.filter((k) => k.id !== kiosk.id));
        showSuccess('Quiosque removido com sucesso');
      } catch (error) {
        showError('Erro ao remover quiosque');
      }
    }
  };
  
  const handleSave = () => {
    setModalOpen(false);
    setSelectedKiosk(null);
    showSuccess('Quiosque salvo com sucesso');
  };
  
  const filteredKiosks = kiosks.filter((kiosk) =>
    kiosk.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kiosk.address.city.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const columns: TableColumn<Kiosk>[] = [
    { key: 'name', label: 'Nome', sortable: true },
    { key: 'slug', label: 'Slug' },
    { 
      key: 'address', 
      label: 'Localização', 
      render: (_, item) => `${item.address.city}/${item.address.state}` 
    },
    { 
      key: 'isActive', 
      label: 'Status', 
      align: 'center',
      render: (value) => (
        <StatusBadge $active={value as boolean}>
          {value ? 'Ativo' : 'Inativo'}
        </StatusBadge>
      ),
    },
    { 
      key: 'licenseExpiry', 
      label: 'Licença até', 
      render: (value) => formatDate(value as Date),
    },
    { 
      key: 'createdAt', 
      label: 'Criado em', 
      render: (value) => formatDate(value as Date),
    },
    {
      key: 'actions',
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
  
  return (
    <Container>
      <Header>
        <Title>Quiosques</Title>
        
        <Toolbar>
          <SearchWrapper>
            <Input
              placeholder="Buscar quiosques..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<SearchIcon />}
            />
          </SearchWrapper>
          
          <Button
            leftIcon={<AddIcon />}
            onClick={() => {
              setSelectedKiosk(null);
              setModalOpen(true);
            }}
          >
            Novo Quiosque
          </Button>
        </Toolbar>
      </Header>
      
      <DataTable
        columns={columns}
        data={filteredKiosks}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        emptyMessage="Nenhum quiosque encontrado"
      />
      
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedKiosk ? 'Editar Quiosque' : 'Novo Quiosque'}
        size="large"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar</Button>
          </>
        }
      >
        <ModalContent>
          <FormGrid>
            <Input
              label="Nome do Quiosque"
              placeholder="Ex: Quiosque Praia Central"
              defaultValue={selectedKiosk?.name}
              required
            />
            <Input
              label="Slug"
              placeholder="praia-central"
              defaultValue={selectedKiosk?.slug}
              required
            />
          </FormGrid>
          
          <Input
            label="Descrição"
            placeholder="Descrição do quiosque"
            defaultValue={selectedKiosk?.description}
          />
          
          <FormGrid>
            <Input
              label="Cidade"
              placeholder="Cidade"
              defaultValue={selectedKiosk?.address.city}
              required
            />
            <Input
              label="Estado"
              placeholder="UF"
              defaultValue={selectedKiosk?.address.state}
              required
            />
          </FormGrid>
          
          <FormGrid>
            <Input
              type="email"
              label="Email de contato"
              placeholder="contato@quiosque.com"
              defaultValue={selectedKiosk?.contact.email}
            />
            <Input
              label="Telefone"
              placeholder="(00) 00000-0000"
              defaultValue={selectedKiosk?.contact.phone}
            />
          </FormGrid>
        </ModalContent>
      </Modal>
    </Container>
  );
};

