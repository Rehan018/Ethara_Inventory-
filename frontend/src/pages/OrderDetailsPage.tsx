import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CancelIcon from '@mui/icons-material/CancelOutlined';
import {
  Alert,
  Box,
  Button,
  Divider,
  LinearProgress,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getErrorMessage } from '../api/http';
import { cancelOrder, getOrder } from '../api/orders';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { PageHeader } from '../components/PageHeader';
import { StatusChip } from '../components/StatusChip';
import { useToast } from '../hooks/useToast';
import { formatCurrency, formatDate } from '../utils/format';

export function OrderDetailsPage() {
  const { orderId } = useParams();
  const queryClient = useQueryClient();
  const { toast, showToast, closeToast } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const numericOrderId = useMemo(() => Number(orderId), [orderId]);

  const orderQuery = useQuery({
    queryKey: ['orders', numericOrderId],
    queryFn: () => getOrder(numericOrderId),
    enabled: Number.isFinite(numericOrderId),
  });

  const cancelMutation = useMutation({
    mutationFn: () => cancelOrder(numericOrderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['orders', numericOrderId] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setConfirmOpen(false);
      showToast('Order cancelled and stock restored');
    },
    onError: (err) => showToast(getErrorMessage(err), 'error'),
  });

  const order = orderQuery.data;

  return (
    <>
      <Button component={Link} to="/orders" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
        Back to orders
      </Button>

      <PageHeader
        title={order ? `Order #${order.id}` : 'Order details'}
        subtitle={order ? `${order.customer.full_name} · ${formatDate(order.created_at)}` : undefined}
        action={
          order && order.status !== 'CANCELLED'
            ? {
                label: 'Cancel order',
                icon: <CancelIcon />,
                onClick: () => setConfirmOpen(true),
              }
            : undefined
        }
      />

      {orderQuery.isLoading ? <LinearProgress sx={{ mb: 2 }} /> : null}
      {orderQuery.error ? <Alert severity="error">{getErrorMessage(orderQuery.error)}</Alert> : null}

      {order ? (
        <Stack spacing={3}>
          <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', p: 2.5 }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' },
                gap: 2,
              }}
            >
              <Box>
                <Typography color="text.secondary" variant="body2">
                  Status
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <StatusChip status={order.status} />
                </Box>
              </Box>
              <Box>
                <Typography color="text.secondary" variant="body2">
                  Customer
                </Typography>
                <Typography fontWeight={700}>{order.customer.full_name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {order.customer.email}
                </Typography>
              </Box>
              <Box>
                <Typography color="text.secondary" variant="body2">
                  Items
                </Typography>
                <Typography variant="h6">{order.items.length}</Typography>
              </Box>
              <Box>
                <Typography color="text.secondary" variant="body2">
                  Total amount
                </Typography>
                <Typography variant="h6">{formatCurrency(order.total_amount)}</Typography>
              </Box>
            </Box>
          </Paper>

          <Paper elevation={0} sx={{ width: '100%', overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
            <Stack sx={{ p: 2.5 }} spacing={0.5}>
              <Typography variant="h6">Line items</Typography>
              <Typography color="text.secondary" variant="body2">
                Prices are captured from the product catalog when the order is created
              </Typography>
            </Stack>
            <Divider />
            <TableContainer sx={{ width: '100%', overflowX: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>SKU</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right" sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                      Unit price
                    </TableCell>
                    <TableCell align="right">Line total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Stack spacing={0.25}>
                          <Typography>{item.product.name}</Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ display: { xs: 'block', sm: 'none' } }}
                          >
                            {item.product.sku}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{item.product.sku}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right" sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                        {formatCurrency(item.unit_price)}
                      </TableCell>
                      <TableCell align="right">{formatCurrency(item.line_total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Stack>
      ) : null}

      <ConfirmDialog
        open={confirmOpen}
        title="Cancel order"
        message={`Cancel order #${order?.id || ''}? Stock will be returned to inventory.`}
        confirmLabel="Cancel order"
        loading={cancelMutation.isPending}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => cancelMutation.mutate()}
      />

      <Snackbar open={toast.open} autoHideDuration={3500} onClose={closeToast}>
        <Alert severity={toast.severity} onClose={closeToast} variant="filled">
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
}
