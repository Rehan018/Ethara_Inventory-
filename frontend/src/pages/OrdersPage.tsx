import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/CancelOutlined';
import VisibilityIcon from '@mui/icons-material/VisibilityOutlined';
import {
  Alert,
  IconButton,
  LinearProgress,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getCustomers } from '../api/customers';
import { getErrorMessage } from '../api/http';
import { cancelOrder, createOrder, getOrders } from '../api/orders';
import { getProducts } from '../api/products';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { OrderDialog } from '../components/OrderDialog';
import { PageHeader } from '../components/PageHeader';
import { StatusChip } from '../components/StatusChip';
import { useToast } from '../hooks/useToast';
import type { Order, OrderInput } from '../types';
import { formatCurrency, formatDate } from '../utils/format';

export function OrdersPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<Order | null>(null);
  const { toast, showToast, closeToast } = useToast();

  const ordersQuery = useQuery({ queryKey: ['orders'], queryFn: getOrders });
  const productsQuery = useQuery({ queryKey: ['products'], queryFn: getProducts });
  const customersQuery = useQuery({ queryKey: ['customers'], queryFn: getCustomers });

  const createMutation = useMutation({
    mutationFn: (payload: OrderInput) => createOrder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setDialogOpen(false);
      showToast('Order created');
    },
    onError: (err) => showToast(getErrorMessage(err), 'error'),
  });

  const cancelMutation = useMutation({
    mutationFn: (id: number) => cancelOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setCancelTarget(null);
      showToast('Order cancelled and stock restored');
    },
    onError: (err) => showToast(getErrorMessage(err), 'error'),
  });

  const isLoading = ordersQuery.isLoading || productsQuery.isLoading || customersQuery.isLoading;
  const error = ordersQuery.error || productsQuery.error || customersQuery.error;

  return (
    <>
      <PageHeader
        title="Orders"
        subtitle="Create and track customer orders"
        action={{
          label: 'Create order',
          icon: <AddIcon />,
          onClick: () => setDialogOpen(true),
        }}
      />

      {isLoading ? <LinearProgress sx={{ mb: 2 }} /> : null}
      {error ? <Alert severity="error">{getErrorMessage(error)}</Alert> : null}

      <Paper elevation={0} sx={{ width: '100%', overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
        <TableContainer sx={{ width: '100%', overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Status</TableCell>
                <TableCell align="right" sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                  Items
                </TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>Created</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ordersQuery.data?.length ? (
                ordersQuery.data.map((order) => (
                  <TableRow key={order.id} hover>
                    <TableCell>
                      <Typography fontWeight={700}>#{order.id}</Typography>
                    </TableCell>
                    <TableCell>{order.customer.full_name}</TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                      <StatusChip status={order.status} />
                    </TableCell>
                    <TableCell align="right" sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                      {order.items.length}
                    </TableCell>
                    <TableCell align="right">{formatCurrency(order.total_amount)}</TableCell>
                    <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>
                      {formatDate(order.created_at)}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="View order">
                        <IconButton component={Link} to={`/orders/${order.id}`} aria-label="View order">
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Cancel order">
                        <span>
                          <IconButton
                            aria-label="Cancel order"
                            onClick={() => setCancelTarget(order)}
                            disabled={order.status === 'CANCELLED'}
                          >
                            <CancelIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7}>
                    <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                      No orders found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <OrderDialog
        open={dialogOpen}
        loading={createMutation.isPending}
        products={productsQuery.data || []}
        customers={customersQuery.data || []}
        onClose={() => setDialogOpen(false)}
        onSubmit={(payload) => createMutation.mutate(payload)}
      />

      <ConfirmDialog
        open={Boolean(cancelTarget)}
        title="Cancel order"
        message={`Cancel order #${cancelTarget?.id || ''}? Stock will be returned to inventory.`}
        confirmLabel="Cancel order"
        loading={cancelMutation.isPending}
        onClose={() => setCancelTarget(null)}
        onConfirm={() => cancelTarget && cancelMutation.mutate(cancelTarget.id)}
      />

      <Snackbar open={toast.open} autoHideDuration={3500} onClose={closeToast}>
        <Alert severity={toast.severity} onClose={closeToast} variant="filled">
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
}
