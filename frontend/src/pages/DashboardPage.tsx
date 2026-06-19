import InventoryIcon from '@mui/icons-material/Inventory2';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptIcon from '@mui/icons-material/ReceiptLong';
import WarningIcon from '@mui/icons-material/WarningAmber';
import {
  Alert,
  Box,
  Chip,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getDashboard } from '../api/dashboard';
import { getErrorMessage } from '../api/http';
import { PageHeader } from '../components/PageHeader';
import { formatCurrency } from '../utils/format';

const statCards = [
  { key: 'total_products', label: 'Products', icon: <InventoryIcon />, tone: '#171717' },
  { key: 'total_customers', label: 'Customers', icon: <PeopleIcon />, tone: '#575757' },
  { key: 'total_orders', label: 'Orders', icon: <ReceiptIcon />, tone: '#2f6f4e' },
  { key: 'low_stock_products', label: 'Low stock', icon: <WarningIcon />, tone: '#7a6242' },
] as const;

export function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboard,
  });

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Current inventory and order snapshot" />

      {isLoading ? <LinearProgress sx={{ mb: 2 }} /> : null}
      {error ? <Alert severity="error">{getErrorMessage(error)}</Alert> : null}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
          gap: 2,
          mb: 3,
        }}
      >
        {statCards.map((card) => (
          <Paper
            key={card.key}
            elevation={0}
            sx={{
              p: 2.5,
              border: '1px solid',
              borderColor: 'divider',
              minHeight: 128,
              display: 'flex',
              alignItems: 'stretch',
            }}
          >
            <Stack justifyContent="space-between" spacing={2} sx={{ width: '100%' }}>
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  display: 'grid',
                  placeItems: 'center',
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                  color: card.tone,
                }}
              >
                {card.icon}
              </Box>
              <Box>
                <Typography color="text.secondary" variant="body2">
                  {card.label}
                </Typography>
                <Typography variant="h4" sx={{ mt: 0.25 }}>
                  {data ? data[card.key] : 0}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        ))}
      </Box>

      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', sm: 'center' }}
          spacing={1}
          sx={{ p: 2.5, borderBottom: '1px solid', borderColor: 'divider' }}
        >
          <Box>
            <Typography variant="h6">Low stock products</Typography>
            <Typography color="text.secondary" variant="body2">
              Products at or below their configured threshold
            </Typography>
          </Box>
          <Chip label={`${data?.recent_orders || 0} active orders`} color="default" variant="outlined" />
        </Stack>

        <TableContainer sx={{ width: '100%', overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>SKU</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Stock</TableCell>
                <TableCell align="right" sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                  Threshold
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.low_stock_items.length ? (
                data.low_stock_items.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{product.sku}</TableCell>
                    <TableCell align="right">{formatCurrency(product.price)}</TableCell>
                    <TableCell align="right">{product.quantity_in_stock}</TableCell>
                    <TableCell align="right" sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                      {product.low_stock_threshold}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Typography color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                      No low stock products
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
}
