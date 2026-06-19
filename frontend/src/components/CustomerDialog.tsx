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
import type { CustomerInput } from '../types';

type CustomerDialogProps = {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onSubmit: (payload: CustomerInput) => void;
};

const emptyValues: CustomerInput = {
  full_name: '',
  email: '',
  phone: '',
};

export function CustomerDialog({ open, loading, onClose, onSubmit }: CustomerDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerInput>({ defaultValues: emptyValues });

  useEffect(() => {
    if (open) {
      reset(emptyValues);
    }
  }, [open, reset]);

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Add customer</DialogTitle>
        <DialogContent>
          <Stack spacing={2.25} sx={{ pt: 1 }}>
            <TextField
              label="Full name"
              autoFocus
              fullWidth
              error={Boolean(errors.full_name)}
              helperText={errors.full_name?.message}
              {...register('full_name', { required: 'Full name is required', minLength: 2 })}
            />
            <TextField
              label="Email address"
              type="email"
              fullWidth
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: 'Enter a valid email address',
                },
              })}
            />
            <TextField
              label="Phone number"
              fullWidth
              error={Boolean(errors.phone)}
              helperText={errors.phone?.message}
              {...register('phone', {
                required: 'Phone number is required',
                minLength: { value: 7, message: 'Phone number looks too short' },
              })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            Create customer
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
