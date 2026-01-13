'use client';

/**
 * Página de Gerenciamento de Funcionários
 * CRUD completo de funcionários do quiosque
 */

import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PersonOff as PersonOffIcon,
  PersonAdd as PersonAddIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import { PlanGate } from '@/components';
import { employeeService, Employee, CreateEmployeeData, EMPLOYEE_ROLES } from '@/services';
import { formatCurrency, formatPhone } from '@/utils/formatters';

// Styled Components
const PageContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const StatCard = styled(Paper)`
  padding: ${({ theme }) => theme.spacing.md};
  text-align: center;
`;

const EmployeesPage = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    averageRating: 0,
    totalSalary: 0,
  });
  
  // Form state
  const [formData, setFormData] = useState<CreateEmployeeData>({
    kioskId: '',
    name: '',
    role: 'waiter',
    phone: '',
    email: '',
    document: '',
    hireDate: new Date().toISOString().split('T')[0],
    salary: 0,
    workSchedule: '',
  });

  /**
   * Carrega funcionários e estatísticas
   */
  const loadData = useCallback(async () => {
    if (!user?.kioskId) return;
    
    setLoading(true);
    try {
      const [employeesList, employeeStats] = await Promise.all([
        employeeService.getByKiosk(user.kioskId),
        employeeService.getStats(user.kioskId),
      ]);
      
      setEmployees(employeesList);
      setStats(employeeStats);
    } catch (error) {
      console.error('Erro ao carregar funcionários:', error);
      showNotification('Erro ao carregar funcionários', 'error');
    } finally {
      setLoading(false);
    }
  }, [user?.kioskId, showNotification]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /**
   * Abre dialog para adicionar/editar funcionário
   */
  const handleOpenDialog = (employee?: Employee) => {
    if (employee) {
      setEditingEmployee(employee);
      setFormData({
        kioskId: employee.kioskId,
        name: employee.name,
        role: employee.role,
        phone: employee.phone,
        email: employee.email,
        document: employee.document,
        hireDate: employee.hireDate.toISOString().split('T')[0],
        salary: employee.salary,
        workSchedule: employee.workSchedule,
      });
    } else {
      setEditingEmployee(null);
      setFormData({
        kioskId: user?.kioskId || '',
        name: '',
        role: 'waiter',
        phone: '',
        email: '',
        document: '',
        hireDate: new Date().toISOString().split('T')[0],
        salary: 0,
        workSchedule: '',
      });
    }
    setDialogOpen(true);
  };

  /**
   * Fecha dialog
   */
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingEmployee(null);
  };

  /**
   * Salva funcionário
   */
  const handleSave = async () => {
    try {
      if (editingEmployee) {
        await employeeService.update(editingEmployee.id, formData);
        showNotification('Funcionário atualizado com sucesso!', 'success');
      } else {
        await employeeService.create(formData);
        showNotification('Funcionário cadastrado com sucesso!', 'success');
      }
      handleCloseDialog();
      loadData();
    } catch (error) {
      console.error('Erro ao salvar funcionário:', error);
      showNotification('Erro ao salvar funcionário', 'error');
    }
  };

  /**
   * Confirma exclusão
   */
  const handleConfirmDelete = async () => {
    if (!employeeToDelete) return;
    
    try {
      await employeeService.delete(employeeToDelete.id);
      showNotification('Funcionário removido com sucesso!', 'success');
      setDeleteDialogOpen(false);
      setEmployeeToDelete(null);
      loadData();
    } catch (error) {
      console.error('Erro ao remover funcionário:', error);
      showNotification('Erro ao remover funcionário', 'error');
    }
  };

  /**
   * Alterna status ativo/inativo
   */
  const handleToggleActive = async (employee: Employee) => {
    try {
      if (employee.isActive) {
        await employeeService.deactivate(employee.id);
        showNotification('Funcionário desativado', 'info');
      } else {
        await employeeService.activate(employee.id);
        showNotification('Funcionário ativado', 'success');
      }
      loadData();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      showNotification('Erro ao alterar status', 'error');
    }
  };

  // Loading state
  if (loading) {
    return (
      <PageContainer>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  return (
    <PlanGate
      feature="employeesEnabled"
      title="Gerenciamento de Funcionários"
      description="Cadastre e gerencie os funcionários do seu quiosque. Acompanhe desempenho, avaliações e folha de pagamento."
      requiredPlans={['professional', 'premium']}
      onUpgradeClick={() => window.location.href = '/admin/upgrade'}
    >
    <PageContainer>
      <PageHeader>
        <Typography variant="h4" fontWeight={600}>
          Funcionários
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Novo Funcionário
        </Button>
      </PageHeader>

      {/* Stats Cards */}
      <StatsContainer>
        <StatCard elevation={2}>
          <Typography variant="h4" color="primary">{stats.total}</Typography>
          <Typography variant="body2" color="textSecondary">Total</Typography>
        </StatCard>
        <StatCard elevation={2}>
          <Typography variant="h4" color="success.main">{stats.active}</Typography>
          <Typography variant="body2" color="textSecondary">Ativos</Typography>
        </StatCard>
        <StatCard elevation={2}>
          <Typography variant="h4" color="text.secondary">{stats.inactive}</Typography>
          <Typography variant="body2" color="textSecondary">Inativos</Typography>
        </StatCard>
        <StatCard elevation={2}>
          <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
            <Typography variant="h4">{stats.averageRating.toFixed(1)}</Typography>
            <StarIcon color="warning" />
          </Box>
          <Typography variant="body2" color="textSecondary">Avaliação Média</Typography>
        </StatCard>
        <StatCard elevation={2}>
          <Typography variant="h4" color="info.main">{formatCurrency(stats.totalSalary)}</Typography>
          <Typography variant="body2" color="textSecondary">Folha Mensal</Typography>
        </StatCard>
      </StatsContainer>

      {/* Tabela de Funcionários */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Funcionário</TableCell>
              <TableCell>Cargo</TableCell>
              <TableCell>Contato</TableCell>
              <TableCell>Salário</TableCell>
              <TableCell>Avaliação</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="textSecondary" py={4}>
                    Nenhum funcionário cadastrado
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <Avatar src={employee.photo} alt={employee.name}>
                        {employee.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography fontWeight={500}>{employee.name}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          Desde {employee.hireDate.toLocaleDateString('pt-BR')}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={EMPLOYEE_ROLES[employee.role] || employee.role} 
                      size="small" 
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{formatPhone(employee.phone)}</Typography>
                    <Typography variant="caption" color="textSecondary">{employee.email}</Typography>
                  </TableCell>
                  <TableCell>{formatCurrency(employee.salary)}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <Rating value={employee.rating} precision={0.1} size="small" readOnly />
                      <Typography variant="caption" color="textSecondary">
                        ({employee.totalRatings})
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={employee.isActive ? 'Ativo' : 'Inativo'}
                      color={employee.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Editar">
                      <IconButton size="small" onClick={() => handleOpenDialog(employee)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={employee.isActive ? 'Desativar' : 'Ativar'}>
                      <IconButton size="small" onClick={() => handleToggleActive(employee)}>
                        {employee.isActive ? <PersonOffIcon fontSize="small" /> : <PersonAddIcon fontSize="small" />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => {
                          setEmployeeToDelete(employee);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog de Adicionar/Editar */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingEmployee ? 'Editar Funcionário' : 'Novo Funcionário'}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} pt={1}>
            <TextField
              label="Nome Completo"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
            />
            <FormControl fullWidth>
              <InputLabel>Cargo</InputLabel>
              <Select
                value={formData.role}
                label="Cargo"
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                {Object.entries(EMPLOYEE_ROLES).map(([key, label]) => (
                  <MenuItem key={key} value={key}>{label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Telefone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="E-mail"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="CPF"
              value={formData.document}
              onChange={(e) => setFormData({ ...formData, document: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Data de Admissão"
              type="date"
              value={formData.hireDate}
              onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Salário"
              type="number"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
              fullWidth
              InputProps={{ inputProps: { min: 0, step: 0.01 } }}
            />
            <TextField
              label="Horário de Trabalho"
              value={formData.workSchedule}
              onChange={(e) => setFormData({ ...formData, workSchedule: e.target.value })}
              fullWidth
              placeholder="Ex: Segunda a Sexta, 08h às 16h"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>
            {editingEmployee ? 'Salvar' : 'Cadastrar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir o funcionário <strong>{employeeToDelete?.name}</strong>?
          </Typography>
          <Typography variant="body2" color="textSecondary" mt={1}>
            Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={handleConfirmDelete}>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
    </PlanGate>
  );
};

export default EmployeesPage;

