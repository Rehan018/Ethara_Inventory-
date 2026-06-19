import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  Alert,
  Box,
  IconButton,
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
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { createProduct, deleteProduct, getProducts, updateProduct } from '../api/products';
import { getErrorMessage } from '../api/http';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { PageHeader } from '../components/PageHeader';
import { ProductDialog } from '../components/ProductDialog';
import { useToast } from '../hooks/useToast';
import type { Product, ProductInput } from '../types';
import { formatCurrency } from '../utils/format';

export function ProductsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const { toast, showToast, closeToast } = useToast();

  const { data = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return data;
    return data.filter((product) =>
      [product.name, product.sku].some((value) => value.toLowerCase().includes(query)),
    );
  }, [data, search]);

  const saveMutation = useMutation({
    mutationFn: (payload: ProductInput) =>
      selectedProduct ? updateProduct(selectedProduct.id, payload) : createProduct(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setDialogOpen(false);
      setSelectedProduct(null);
      showToast(selectedProduct ? 'Product updated' : 'Product created');
    },
    onError: (err) => showToast(getErrorMessage(err), 'error'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setDeleteTarget(null);
      showToast('Product deleted');
    },
    onError: (err) => showToast(getErrorMessage(err), 'error'),
  });

  return (
    <>
      <PageHeader
        title="Products"
        subtitle="Manage SKUs, pricing and available stock"
        action={{
          label: 'Add product',
          icon: <AddIcon />,
          onClick: () => {
            setSelectedProduct(null);
            setDialogOpen(true);
          },
        }}
      />

      {isLoading ? <LinearProgress sx={{ mb: 2 }} /> : null}
      {error ? <Alert severity="error">{getErrorMessage(error)}</Alert> : null}

      <Paper elevation={0} sx={{ width: '100%', overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <TextField
            size="small"
            label="Search products"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            sx={{ width: { xs: '100%', sm: 320 } }}
          />
        </Box>
        <TableContainer sx={{ width: '100%', overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>SKU</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Stock</TableCell>
                <TableCell align="right" sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                  Low stock at
                </TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.length ? (
                filteredProducts.map((product) => (
                  <TableRow key={product.id} hover>
                    <TableCell>
                      <Stack spacing={0.25}>
                        <Typography fontWeight={700}>{product.name}</Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ display: { xs: 'block', sm: 'none' } }}
                        >
                          {product.sku}
                        </Typography>
                        {product.quantity_in_stock <= product.low_stock_threshold ? (
                          <Typography variant="body2" color="secondary.main">
                            Low stock
                          </Typography>
                        ) : null}
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{product.sku}</TableCell>
                    <TableCell align="right">{formatCurrency(product.price)}</TableCell>
                    <TableCell align="right">{product.quantity_in_stock}</TableCell>
                    <TableCell align="right" sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                      {product.low_stock_threshold}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit product">
                        <IconButton
                          aria-label="Edit product"
                          onClick={() => {
                            setSelectedProduct(product);
                            setDialogOpen(true);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete product">
                        <IconButton aria-label="Delete product" onClick={() => setDeleteTarget(product)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                      No products found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <ProductDialog
        open={dialogOpen}
        product={selectedProduct}
        loading={saveMutation.isPending}
        onClose={() => {
          setDialogOpen(false);
          setSelectedProduct(null);
        }}
        onSubmit={(payload) => saveMutation.mutate(payload)}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete product"
        message={`Delete ${deleteTarget?.name || 'this product'}? This cannot be undone.`}
        confirmLabel="Delete"
        loading={deleteMutation.isPending}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
      />

      <Snackbar open={toast.open} autoHideDuration={3500} onClose={closeToast}>
        <Alert severity={toast.severity} onClose={closeToast} variant="filled">
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
}
