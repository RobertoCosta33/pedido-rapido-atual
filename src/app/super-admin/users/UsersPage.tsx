'use client';

/**
 * Componente de gestão de usuários
 * Lista, filtra e gerencia usuários do sistema
 */

import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  MoreVert as MoreIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  SupervisorAccount as SuperAdminIcon,
} from '@mui/icons-material';
import { Card, DataTable } from '@/components';
import { userService } from '@/services';
import { User, UserRole } from '@/types';
import { formatDate } from '@/utils';

// Styled Components
const PageContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Filters = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const StatsCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const StatCard = styled(Card)`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const StatValue = styled(Typography)`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const roleLabels: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin Quiosque',
  customer: 'Cliente',
};

const roleColors: Record<UserRole, 'error' | 'primary' | 'success'> = {
  super_admin: 'error',
  admin: 'primary',
  customer: 'success',
};

const roleIcons: Record<UserRole, React.ReactNode> = {
  super_admin: <SuperAdminIcon fontSize="small" />,
  admin: <AdminIcon fontSize="small" />,
  customer: <PersonIcon fontSize="small" />,
};

interface UserStats {
  total: number;
  superAdmins: number;
  admins: number;
  customers: number;
  activeUsers: number;
  inactiveUsers: number;
}

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Carrega usuários
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [usersData, statsData] = await Promise.all([
        userService.getAll(),
        userService.getStats(),
      ]);
      setUsers(usersData);
      setFilteredUsers(usersData);
      setStats(statsData);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar usuários');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filtra usuários
  useEffect(() => {
    let result = [...users];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term)
      );
    }

    if (roleFilter !== 'all') {
      result = result.filter((u) => u.role === roleFilter);
    }

    if (statusFilter !== 'all') {
      result = result.filter((u) =>
        statusFilter === 'active' ? u.isActive : !u.isActive
      );
    }

    setFilteredUsers(result);
  }, [users, searchTerm, roleFilter, statusFilter]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, userId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedUserId(userId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUserId(null);
  };

  const handleToggleActive = async () => {
    if (!selectedUserId) return;

    try {
      await userService.toggleActive(selectedUserId);
      await loadData();
    } catch (err) {
      console.error('Erro ao alterar status:', err);
    }

    handleMenuClose();
  };

  // Colunas da tabela
  const columns = [
    {
      key: 'name' as keyof User,
      label: 'Usuário',
      render: (_: unknown, user: User) => (
        <UserInfo>
          <Avatar src={user.avatar} alt={user.name}>
            {user.name.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {user.name}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {user.email}
            </Typography>
          </Box>
        </UserInfo>
      ),
    },
    {
      key: 'role' as keyof User,
      label: 'Tipo',
      render: (role: User['role']) => (
        <Chip
          icon={roleIcons[role] as React.ReactElement}
          label={roleLabels[role]}
          color={roleColors[role]}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      key: 'phone' as keyof User,
      label: 'Telefone',
      render: (phone: User['phone']) => phone || '-',
    },
    {
      key: 'isActive' as keyof User,
      label: 'Status',
      render: (isActive: User['isActive']) => (
        <Chip
          label={isActive ? 'Ativo' : 'Inativo'}
          color={isActive ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    {
      key: 'createdAt' as keyof User,
      label: 'Cadastro',
      render: (date: User['createdAt']) => formatDate(date),
    },
    {
      key: 'id' as keyof User,
      label: 'Ações',
      width: '80px',
      render: (_: unknown, user: User) => (
        <IconButton
          size="small"
          onClick={(e) => handleMenuOpen(e, user.id)}
        >
          <MoreIcon />
        </IconButton>
      ),
    },
  ];

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
    <PageContainer>
      <Header>
        <Typography variant="h4" fontWeight={700}>
          Gestão de Usuários
        </Typography>
      </Header>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Estatísticas */}
      {stats && (
        <StatsCards>
          <StatCard>
            <StatValue>{stats.total}</StatValue>
            <Typography color="textSecondary">Total de Usuários</Typography>
          </StatCard>
          <StatCard>
            <StatValue>{stats.superAdmins}</StatValue>
            <Typography color="textSecondary">Super Admins</Typography>
          </StatCard>
          <StatCard>
            <StatValue>{stats.admins}</StatValue>
            <Typography color="textSecondary">Admins Quiosque</Typography>
          </StatCard>
          <StatCard>
            <StatValue>{stats.customers}</StatValue>
            <Typography color="textSecondary">Clientes</Typography>
          </StatCard>
        </StatsCards>
      )}

      {/* Filtros */}
      <Filters>
        <TextField
          placeholder="Buscar por nome ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{ minWidth: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Tipo</InputLabel>
          <Select
            value={roleFilter}
            label="Tipo"
            onChange={(e) => setRoleFilter(e.target.value as UserRole | 'all')}
          >
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="super_admin">Super Admin</MenuItem>
            <MenuItem value="admin">Admin Quiosque</MenuItem>
            <MenuItem value="customer">Cliente</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
          >
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="active">Ativos</MenuItem>
            <MenuItem value="inactive">Inativos</MenuItem>
          </Select>
        </FormControl>
      </Filters>

      {/* Tabela */}
      <Card>
        <DataTable
          columns={columns}
          data={filteredUsers}
          emptyMessage="Nenhum usuário encontrado"
        />
      </Card>

      {/* Menu de ações */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleToggleActive}>
          {users.find((u) => u.id === selectedUserId)?.isActive
            ? 'Desativar'
            : 'Ativar'}
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>Editar</MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          Excluir
        </MenuItem>
      </Menu>
    </PageContainer>
  );
};

export default UsersPage;

