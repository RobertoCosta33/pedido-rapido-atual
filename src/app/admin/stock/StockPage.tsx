'use client';

/**
 * Página de gerenciamento de estoque
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import WarningIcon from '@mui/icons-material/Warning';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import { Button, Input, DataTable, Modal, Card } from '@/components';
import { stockService } from '@/services';
import { useNotification } from '@/contexts';
import { formatCurrency, formatUnit } from '@/utils/formatters';
import { Ingredient, StockAlert, TableColumn, MeasurementUnit } from '@/types';

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

const AlertsSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const AlertsTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  
  svg {
    color: ${({ theme }) => theme.colors.warning.main};
  }
`;

const AlertsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const AlertCard = styled.div`
  background: ${({ theme }) => theme.colors.warning.main}10;
  border: 1px solid ${({ theme }) => theme.colors.warning.main}30;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const AlertInfo = styled.div`
  flex: 1;
`;

const AlertName = styled.p`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const AlertStock = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.warning.dark};
  margin: 4px 0 0;
`;

const StockLevel = styled.div<{ $level: 'danger' | 'warning' | 'ok' }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const StockBar = styled.div<{ $percentage: number; $level: 'danger' | 'warning' | 'ok' }>`
  width: 60px;
  height: 8px;
  background: ${({ theme }) => theme.colors.background.subtle};
  border-radius: 4px;
  overflow: hidden;
  
  &::after {
    content: '';
    display: block;
    width: ${({ $percentage }) => Math.min($percentage, 100)}%;
    height: 100%;
    background: ${({ theme, $level }) => {
      switch ($level) {
        case 'danger': return theme.colors.error.main;
        case 'warning': return theme.colors.warning.main;
        default: return theme.colors.success.main;
      }
    }};
    transition: width 0.3s ease;
  }
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

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  display: block;
`;

const Select = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 2px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.background.paper};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 1rem;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const MovementForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background.subtle};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

export const StockPage: React.FC = () => {
  const { showSuccess, showError } = useNotification();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [movementModalOpen, setMovementModalOpen] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [movementType, setMovementType] = useState<'in' | 'out'>('in');
  
  const measurementUnits = stockService.getMeasurementUnits();
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    try {
      setIsLoading(true);
      const [ingredientsData, alertsData] = await Promise.all([
        stockService.getIngredients('1'),
        stockService.getAlerts('1'),
      ]);
      setIngredients(ingredientsData);
      setAlerts(alertsData);
    } catch (error) {
      showError('Erro ao carregar dados');
    } finally {
      setIsLoading(false);
    }
  };
  
  const getStockLevel = (current: number, minimum: number): 'danger' | 'warning' | 'ok' => {
    const percentage = (current / minimum) * 100;
    if (percentage <= 50) return 'danger';
    if (percentage <= 100) return 'warning';
    return 'ok';
  };
  
  const getStockPercentage = (current: number, minimum: number, maximum?: number): number => {
    const max = maximum || minimum * 2;
    return (current / max) * 100;
  };
  
  const handleEdit = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    setModalOpen(true);
  };
  
  const handleMovement = (ingredient: Ingredient, type: 'in' | 'out') => {
    setSelectedIngredient(ingredient);
    setMovementType(type);
    setMovementModalOpen(true);
  };
  
  const handleSave = () => {
    setModalOpen(false);
    setSelectedIngredient(null);
    showSuccess('Insumo salvo com sucesso');
    loadData();
  };
  
  const handleSaveMovement = () => {
    setMovementModalOpen(false);
    setSelectedIngredient(null);
    showSuccess(`Movimentação de ${movementType === 'in' ? 'entrada' : 'saída'} registrada`);
    loadData();
  };
  
  const filteredIngredients = ingredients.filter((ingredient) =>
    ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const columns: TableColumn<Ingredient>[] = [
    { key: 'name', label: 'Insumo', sortable: true },
    { 
      key: 'currentStock', 
      label: 'Estoque Atual',
      render: (value, item) => {
        const level = getStockLevel(value as number, item.minimumStock);
        const percentage = getStockPercentage(value as number, item.minimumStock, item.maximumStock);
        
        return (
          <StockLevel $level={level}>
            <span>{value} {formatUnit(item.unit, value as number)}</span>
            <StockBar $percentage={percentage} $level={level} />
          </StockLevel>
        );
      },
    },
    { 
      key: 'minimumStock', 
      label: 'Mínimo',
      render: (value, item) => `${value} ${formatUnit(item.unit, value as number)}`,
    },
    { 
      key: 'costPerUnit', 
      label: 'Custo/Un',
      render: (value) => formatCurrency(value as number),
    },
    { 
      key: 'supplier', 
      label: 'Fornecedor',
      render: (value) => value || '-',
    },
    {
      key: 'actions',
      label: 'Ações',
      align: 'center',
      sortable: false,
      render: (_, item) => (
        <Actions>
          <IconButton 
            size="small" 
            title="Entrada" 
            color="success"
            onClick={() => handleMovement(item, 'in')}
          >
            <AddCircleIcon fontSize="small" />
          </IconButton>
          <IconButton 
            size="small" 
            title="Saída" 
            color="error"
            onClick={() => handleMovement(item, 'out')}
          >
            <RemoveCircleIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" title="Editar" onClick={() => handleEdit(item)}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Actions>
      ),
    },
  ];
  
  return (
    <Container>
      <Header>
        <Title>Controle de Estoque</Title>
        
        <Toolbar>
          <SearchWrapper>
            <Input
              placeholder="Buscar insumos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<SearchIcon />}
            />
          </SearchWrapper>
          
          <Button
            leftIcon={<AddIcon />}
            onClick={() => {
              setSelectedIngredient(null);
              setModalOpen(true);
            }}
          >
            Novo Insumo
          </Button>
        </Toolbar>
      </Header>
      
      {alerts.length > 0 && (
        <AlertsSection>
          <AlertsTitle>
            <WarningIcon />
            Alertas de Estoque ({alerts.length})
          </AlertsTitle>
          
          <AlertsGrid>
            {alerts.map((alert) => (
              <AlertCard key={alert.id}>
                <AlertInfo>
                  <AlertName>{alert.ingredientName}</AlertName>
                  <AlertStock>
                    Atual: {alert.currentStock} | Mínimo: {alert.minimumStock}
                  </AlertStock>
                </AlertInfo>
                <Chip 
                  label={alert.type === 'out_of_stock' ? 'Sem estoque' : 'Baixo'}
                  color={alert.type === 'out_of_stock' ? 'error' : 'warning'}
                  size="small"
                />
              </AlertCard>
            ))}
          </AlertsGrid>
        </AlertsSection>
      )}
      
      <DataTable
        columns={columns}
        data={filteredIngredients}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        emptyMessage="Nenhum insumo encontrado"
      />
      
      {/* Modal de Insumo */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedIngredient ? 'Editar Insumo' : 'Novo Insumo'}
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
          <Input
            label="Nome do Insumo"
            placeholder="Ex: Pão Brioche"
            defaultValue={selectedIngredient?.name}
            required
          />
          
          <FormGrid>
            <div>
              <Label>Unidade de Medida</Label>
              <Select defaultValue={selectedIngredient?.unit || 'unit'}>
                {measurementUnits.map((unit) => (
                  <option key={unit.value} value={unit.value}>{unit.label}</option>
                ))}
              </Select>
            </div>
            <Input
              type="number"
              label="Custo por Unidade (R$)"
              placeholder="0,00"
              defaultValue={selectedIngredient?.costPerUnit}
            />
          </FormGrid>
          
          <FormGrid>
            <Input
              type="number"
              label="Estoque Mínimo"
              placeholder="0"
              defaultValue={selectedIngredient?.minimumStock}
            />
            <Input
              type="number"
              label="Estoque Máximo"
              placeholder="0"
              defaultValue={selectedIngredient?.maximumStock}
            />
          </FormGrid>
          
          <Input
            label="Fornecedor"
            placeholder="Nome do fornecedor"
            defaultValue={selectedIngredient?.supplier}
          />
        </ModalContent>
      </Modal>
      
      {/* Modal de Movimentação */}
      <Modal
        isOpen={movementModalOpen}
        onClose={() => setMovementModalOpen(false)}
        title={movementType === 'in' ? 'Entrada de Estoque' : 'Saída de Estoque'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setMovementModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveMovement}>
              Registrar {movementType === 'in' ? 'Entrada' : 'Saída'}
            </Button>
          </>
        }
      >
        <ModalContent>
          {selectedIngredient && (
            <Card variant="outlined" padding="16px">
              <p style={{ margin: 0, fontWeight: 600 }}>{selectedIngredient.name}</p>
              <p style={{ margin: '4px 0 0', fontSize: '0.875rem', color: '#666' }}>
                Estoque atual: {selectedIngredient.currentStock} {formatUnit(selectedIngredient.unit)}
              </p>
            </Card>
          )}
          
          <MovementForm>
            <Input
              type="number"
              label="Quantidade"
              placeholder="0"
              required
            />
            <Input
              label="Motivo"
              placeholder={movementType === 'in' ? 'Ex: Reposição de estoque' : 'Ex: Produto danificado'}
            />
          </MovementForm>
        </ModalContent>
      </Modal>
    </Container>
  );
};

