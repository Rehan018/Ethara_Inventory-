import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import type { Customer, OrderInput, Product } from '../types';
import { formatCurrency } from '../utils/format';

type DraftItem = {
  product_id: number;
  quantity: number;
};

type OrderDialogProps = {
  open: boolean;
  loading: boolean;
  products: Product[];
  customers: Customer[];
  onClose: () => void;
  onSubmit: (payload: OrderInput) => void;
};

const emptyItem: DraftItem = { product_id: 0, quantity: 1 };

export function OrderDialog({ open, loading, products, customers, onClose, onSubmit }: OrderDialogProps) {
  const [customerId, setCustomerId] = useState(0);
  const [items, setItems] = useState<DraftItem[]>([emptyItem]);
  const [error, setError] = useState('');

  const productsById = useMemo(() => new Map(products.map((product) => [product.id, product])), [products]);

  const estimatedTotal = items.reduce((sum, item) => {
    const product = productsById.get(item.product_id);
    return sum + Number(product?.price || 0) * item.quantity;
  }, 0);

  useEffect(() => {
    if (!open) return;
    setCustomerId(0);
    setItems([emptyItem]);
    setError('');
  }, [open]);

  const updateItem = (index: number, nextItem: DraftItem) => {
    setItems((current) => current.map((item, itemIndex) => (itemIndex === index ? nextItem : item)));
  };

  const removeItem = (index: number) => {
    setItems((current) => (current.length === 1 ? current : current.filter((_, itemIndex) => itemIndex !== index)));
  };

  const submit = () => {
    setError('');

    if (!customerId) {
      setError('Select a customer');
      return;
    }

    if (items.some((item) => !item.product_id || item.quantity < 1)) {
      setError('Select products and keep every quantity above zero');
      return;
    }

    const uniqueProducts = new Set(items.map((item) => item.product_id));
    if (uniqueProducts.size !== items.length) {
      setError('Add each product only once');
      return;
    }

    const insufficient = items.find((item) => {
      const product = productsById.get(item.product_id);
      return product && item.quantity > product.quantity_in_stock;
    });

    if (insufficient) {
      const product = productsById.get(insufficient.product_id);
      setError(`${product?.name || 'Product'} does not have enough stock`);
      return;
    }

    onSubmit({ customer_id: customerId, items });
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="md">
      <DialogTitle>Create order</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          {error ? <Alert severity="error">{error}</Alert> : null}

          <FormControl fullWidth>
            <InputLabel id="customer-label">Customer</InputLabel>
            <Select
              labelId="customer-label"
              label="Customer"
              value={customerId}
              onChange={(event) => setCustomerId(Number(event.target.value))}
            >
              <MenuItem value={0} disabled>
                Select customer
              </MenuItem>
              {customers.map((customer) => (
                <MenuItem key={customer.id} value={customer.id}>
                  {customer.full_name} ({customer.email})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Stack spacing={1.5}>
            {items.map((item, index) => {
              const product = productsById.get(item.product_id);
              return (
                <Paper key={`${index}-${item.product_id}`} variant="outlined" sx={{ p: 2 }}>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', md: 'minmax(220px, 1fr) 150px 120px 40px' },
                      gap: 1.5,
                      alignItems: 'center',
                    }}
                  >
                    <FormControl fullWidth>
                      <InputLabel id={`product-label-${index}`}>Product</InputLabel>
                      <Select
                        labelId={`product-label-${index}`}
                        label="Product"
                        value={item.product_id}
                        onChange={(event) =>
                          updateItem(index, { ...item, product_id: Number(event.target.value) })
                        }
                      >
                        <MenuItem value={0} disabled>
                          Select product
                        </MenuItem>
                        {products.map((nextProduct) => (
                          <MenuItem key={nextProduct.id} value={nextProduct.id}>
                            {nextProduct.name} - {nextProduct.sku}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <TextField
                      label="Quantity"
                      type="number"
                      inputProps={{ min: 1 }}
                      value={item.quantity}
                      onChange={(event) =>
                        updateItem(index, { ...item, quantity: Number(event.target.value) || 0 })
                      }
                    />

                    <Typography color="text.secondary">
                      Stock: {product ? product.quantity_in_stock : '-'}
                    </Typography>

                    <Tooltip title="Remove item">
                      <span>
                        <IconButton
                          aria-label="Remove item"
                          onClick={() => removeItem(index)}
                          disabled={items.length === 1}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Box>
                </Paper>
              );
            })}
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" gap={2}>
            <Button
              startIcon={<AddIcon />}
              onClick={() => setItems((current) => [...current, emptyItem])}
              variant="outlined"
            >
              Add item
            </Button>
            <Typography variant="h6">Estimated total: {formatCurrency(estimatedTotal)}</Typography>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="contained" onClick={submit} disabled={loading || products.length === 0 || customers.length === 0}>
          Create order
        </Button>
      </DialogActions>
    </Dialog>
  );
}
