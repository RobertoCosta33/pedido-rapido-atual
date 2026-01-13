'use client';

/**
 * Página de Pedidos do Cliente
 * Lista pedidos e permite avaliar após entrega
 */

import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  TextField,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import {
  AccessTime as TimeIcon,
  Restaurant as RestaurantIcon,
  Star as StarIcon,
  CheckCircle as CheckIcon,
  LocalShipping as DeliveryIcon,
  Store as StoreIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import { orderService, ratingService, CreateRatingData, RatingType } from '@/services';
import { Order } from '@/types';
import { formatCurrency } from '@/utils/formatters';

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.lg} 0;
`;

const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const OrderCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const OrderItems = styled.div`
  margin: ${({ theme }) => theme.spacing.md} 0;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.backgroundLight};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const RatingSection = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.backgroundLight};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 2px dashed ${({ theme }) => theme.colors.primary};
`;

const RatingItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm} 0;
`;

const statusLabels: Record<string, string> = {
  pending: 'Pendente',
  confirmed: 'Confirmado',
  preparing: 'Preparando',
  ready: 'Pronto',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
};

const statusColors: Record<string, 'warning' | 'info' | 'secondary' | 'success' | 'default' | 'error'> = {
  pending: 'warning',
  confirmed: 'info',
  preparing: 'secondary',
  ready: 'success',
  delivered: 'default',
  cancelled: 'error',
};

interface RatingData {
  type: RatingType;
  targetId: string;
  targetName: string;
  rating: number;
}

const MeusPedidosPage = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { showNotification } = useNotification();
  
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [ratings, setRatings] = useState<RatingData[]>([]);
  const [comment, setComment] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);
  const [ratedOrders, setRatedOrders] = useState<Set<string>>(new Set());

  /**
   * Carrega pedidos do cliente
   */
  const loadOrders = useCallback(async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const data = await orderService.getByCustomer(user.id);
      setOrders(data.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
      
      // Verifica quais pedidos já foram avaliados
      const ratingsData = await ratingService.getAll();
      const ratedOrderIds = new Set(
        ratingsData
          .filter((r) => r.customerId === user.id)
          .map((r) => r.orderId)
      );
      setRatedOrders(ratedOrderIds);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    }
  }, [isAuthenticated, loadOrders]);

  /**
   * Abre dialog de avaliação
   */
  const handleOpenRating = (order: Order) => {
    setSelectedOrder(order);
    
    // Inicializa ratings para os itens do pedido + quiosque + atendimento
    const initialRatings: RatingData[] = [
      // Quiosque
      {
        type: 'kiosk',
        targetId: order.kioskId,
        targetName: 'Quiosque',
        rating: 0,
      },
      // Atendimento
      {
        type: 'service',
        targetId: order.kioskId,
        targetName: 'Atendimento',
        rating: 0,
      },
      // Produtos do pedido
      ...order.items.map((item) => ({
        type: 'product' as RatingType,
        targetId: item.productId,
        targetName: item.productName,
        rating: 0,
      })),
    ];
    
    setRatings(initialRatings);
    setComment('');
    setRatingDialogOpen(true);
  };

  /**
   * Atualiza rating de um item
   */
  const handleRatingChange = (index: number, value: number) => {
    const newRatings = [...ratings];
    newRatings[index].rating = value;
    setRatings(newRatings);
  };

  /**
   * Submete avaliações
   */
  const handleSubmitRatings = async () => {
    if (!selectedOrder || !user) return;
    
    // Verifica se pelo menos uma avaliação foi feita
    const hasRating = ratings.some((r) => r.rating > 0);
    if (!hasRating) {
      showNotification('Avalie pelo menos um item', 'warning');
      return;
    }
    
    setSubmittingRating(true);
    try {
      // Busca nome do quiosque
      const kioskName = 'Quiosque'; // Em produção, buscar do kiosk service
      
      // Submete cada avaliação com nota > 0
      for (const rating of ratings) {
        if (rating.rating > 0) {
          const ratingData: CreateRatingData = {
            type: rating.type,
            targetId: rating.targetId,
            targetName: rating.targetName,
            kioskId: selectedOrder.kioskId,
            kioskName: kioskName,
            orderId: selectedOrder.id,
            customerId: user.id,
            customerName: user.name,
            rating: rating.rating,
            comment: rating.type === 'kiosk' ? comment : undefined,
          };
          
          await ratingService.create(ratingData);
        }
      }
      
      showNotification('Avaliação enviada com sucesso! Obrigado!', 'success');
      setRatingDialogOpen(false);
      setRatedOrders((prev) => new Set([...prev, selectedOrder.id]));
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
      showNotification('Erro ao enviar avaliação', 'error');
    } finally {
      setSubmittingRating(false);
    }
  };

  /**
   * Filtra pedidos por tab
   */
  const filteredOrders = orders.filter((order) => {
    if (tabValue === 0) {
      return !['delivered', 'cancelled'].includes(order.status);
    }
    return ['delivered', 'cancelled'].includes(order.status);
  });

  /**
   * Formata tempo decorrido
   */
  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Agora';
    if (diffMins < 60) return `${diffMins} min`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d`;
  };

  // Não autenticado
  if (!isAuthenticated) {
    return (
      <PageContainer>
        <Container>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Faça login para ver seus pedidos
            </Typography>
            <Typography gutterBottom>
              Você precisa estar logado para visualizar seu histórico de pedidos e avaliar.
            </Typography>
            <Button variant="contained" onClick={() => router.push('/login')}>
              Fazer Login
            </Button>
          </Alert>
        </Container>
      </PageContainer>
    );
  }

  // Loading
  if (loading) {
    return (
      <PageContainer>
        <Container>
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress />
          </Box>
        </Container>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Container>
        <PageHeader>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Meus Pedidos
          </Typography>
          <Typography color="textSecondary">
            Acompanhe seus pedidos e avalie sua experiência
          </Typography>
        </PageHeader>

        <Tabs
          value={tabValue}
          onChange={(_, v) => setTabValue(v)}
          sx={{ mb: 3 }}
        >
          <Tab 
            label={`Em andamento (${orders.filter((o) => !['delivered', 'cancelled'].includes(o.status)).length})`} 
          />
          <Tab 
            label={`Histórico (${orders.filter((o) => ['delivered', 'cancelled'].includes(o.status)).length})`} 
          />
        </Tabs>

        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <RestaurantIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="textSecondary">
                {tabValue === 0 ? 'Nenhum pedido em andamento' : 'Nenhum pedido no histórico'}
              </Typography>
              <Button 
                variant="contained" 
                sx={{ mt: 2 }}
                onClick={() => router.push('/menu')}
              >
                Ver Cardápios
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <OrderCard key={order.id}>
              <CardContent>
                <OrderHeader>
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      Pedido #{order.id.slice(-6).toUpperCase()}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                      <TimeIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="textSecondary">
                        {getTimeAgo(order.createdAt)} atrás
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    label={statusLabels[order.status] || order.status}
                    color={statusColors[order.status] || 'default'}
                    icon={order.status === 'delivered' ? <CheckIcon /> : <DeliveryIcon />}
                  />
                </OrderHeader>

                <OrderItems>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Itens do pedido
                  </Typography>
                  {order.items.map((item, idx) => (
                    <Box key={idx} display="flex" justifyContent="space-between" py={0.5}>
                      <Typography variant="body2">
                        {item.quantity}x {item.productName}
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {formatCurrency(item.totalPrice)}
                      </Typography>
                    </Box>
                  ))}
                  <Divider sx={{ my: 1 }} />
                  <Box display="flex" justifyContent="space-between">
                    <Typography fontWeight={600}>Total</Typography>
                    <Typography fontWeight={700} color="primary">
                      {formatCurrency(order.total)}
                    </Typography>
                  </Box>
                </OrderItems>

                {/* Seção de avaliação para pedidos entregues */}
                {order.status === 'delivered' && !ratedOrders.has(order.id) && (
                  <RatingSection>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <StarIcon color="warning" />
                      <Typography fontWeight={600}>
                        Avalie seu pedido!
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Sua opinião é muito importante para nós e ajuda outros clientes.
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<StarIcon />}
                      onClick={() => handleOpenRating(order)}
                      sx={{ mt: 1 }}
                    >
                      Avaliar Agora
                    </Button>
                  </RatingSection>
                )}

                {/* Já avaliado */}
                {order.status === 'delivered' && ratedOrders.has(order.id) && (
                  <Box 
                    display="flex" 
                    alignItems="center" 
                    gap={1} 
                    mt={2}
                    p={2}
                    bgcolor="success.light"
                    borderRadius={1}
                  >
                    <CheckIcon color="success" />
                    <Typography color="success.dark" fontWeight={500}>
                      Você já avaliou este pedido. Obrigado!
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </OrderCard>
          ))
        )}
      </Container>

      {/* Dialog de Avaliação */}
      <Dialog 
        open={ratingDialogOpen} 
        onClose={() => setRatingDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <StarIcon color="warning" />
            Avaliar Pedido #{selectedOrder?.id.slice(-6).toUpperCase()}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography color="textSecondary" gutterBottom>
            Avalie cada item do seu pedido com 1 a 5 estrelas
          </Typography>

          {ratings.map((item, index) => (
            <RatingItem key={`${item.type}-${item.targetId}`}>
              <Avatar sx={{ bgcolor: item.type === 'kiosk' ? 'primary.main' : item.type === 'service' ? 'secondary.main' : 'warning.main' }}>
                {item.type === 'kiosk' ? <StoreIcon /> : item.type === 'service' ? <PersonIcon /> : <RestaurantIcon />}
              </Avatar>
              <Box flex={1}>
                <Typography variant="body2" fontWeight={500}>
                  {item.targetName}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {item.type === 'kiosk' ? 'Quiosque' : item.type === 'service' ? 'Atendimento' : 'Produto'}
                </Typography>
              </Box>
              <Rating
                value={item.rating}
                onChange={(_, value) => handleRatingChange(index, value || 0)}
                size="large"
              />
            </RatingItem>
          ))}

          <TextField
            label="Comentário (opcional)"
            placeholder="Conte-nos mais sobre sua experiência..."
            multiline
            rows={3}
            fullWidth
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRatingDialogOpen(false)}>
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubmitRatings}
            disabled={submittingRating}
            startIcon={submittingRating ? <CircularProgress size={20} /> : <StarIcon />}
          >
            {submittingRating ? 'Enviando...' : 'Enviar Avaliação'}
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default MeusPedidosPage;


