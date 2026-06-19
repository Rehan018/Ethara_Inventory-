import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { Product, ProductInput } from '../types';

type ProductDialogProps = {
  open: boolean;
  product: Product | null;
  loading: boolean;
  onClose: () => void;
  onSubmit: (payload: ProductInput) => void;
};

const emptyValues: ProductInput = {
  name: '',
  sku: '',
  price: 0,
  quantity_in_stock: 0,
  low_stock_threshold: 5,
};

export function ProductDialog({ open, product, loading, onClose, onSubmit }: ProductDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductInput>({ defaultValues: emptyValues });

  useEffect(() => {
    if (!open) return;

    reset(
      product
        ? {
            name: product.name,
            sku: product.sku,
            price: Number(product.price),
            quantity_in_stock: product.quantity_in_stock,
            low_stock_threshold: product.low_stock_threshold,
          }
        : emptyValues,
    );
  }, [open, product, reset]);

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{product ? 'Edit product' : 'Add product'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2.25} sx={{ pt: 1 }}>
            <TextField
              label="Product name"
              autoFocus
              fullWidth
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
              {...register('name', { required: 'Product name is required', minLength: 2 })}
            />
            <TextField
              label="SKU"
              fullWidth
              error={Boolean(errors.sku)}
              helperText={errors.sku?.message}
              {...register('sku', { required: 'SKU is required', minLength: 2 })}
            />
            <TextField
              label="Price"
              type="number"
              fullWidth
              inputProps={{ step: '0.01', min: 0 }}
              error={Boolean(errors.price)}
              helperText={errors.price?.message}
              {...register('price', {
                required: 'Price is required',
                valueAsNumber: true,
                min: { value: 0, message: 'Price cannot be negative' },
              })}
            />
            <TextField
              label="Quantity in stock"
              type="number"
              fullWidth
              inputProps={{ min: 0 }}
              error={Boolean(errors.quantity_in_stock)}
              helperText={errors.quantity_in_stock?.message}
              {...register('quantity_in_stock', {
                required: 'Quantity is required',
                valueAsNumber: true,
                min: { value: 0, message: 'Quantity cannot be negative' },
              })}
            />
            <TextField
              label="Low stock threshold"
              type="number"
              fullWidth
              inputProps={{ min: 0 }}
              error={Boolean(errors.low_stock_threshold)}
              helperText={errors.low_stock_threshold?.message}
              {...register('low_stock_threshold', {
                required: 'Threshold is required',
                valueAsNumber: true,
                min: { value: 0, message: 'Threshold cannot be negative' },
              })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {product ? 'Save changes' : 'Create product'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
