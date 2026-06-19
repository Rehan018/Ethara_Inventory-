import InventoryIcon from '@mui/icons-material/Inventory2';
import {
  Alert,
  Box,
  Button,
  Link as MuiLink,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../api/http';
import { useAuth } from '../context/AuthContext';

type RegisterForm = {
  full_name: string;
  email: string;
  password: string;
};

export function RegisterPage() {
  const { register: registerAccount, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const submit = async (payload: RegisterForm) => {
    setError('');
    setLoading(true);
    try {
      await registerAccount(payload);
      navigate('/', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        bgcolor: 'background.default',
        px: 2,
        py: 4,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 460,
          p: { xs: 3, sm: 4 },
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Stack spacing={3}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 38,
                height: 38,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                color: 'text.primary',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <InventoryIcon />
            </Box>
            <Box>
              <Typography variant="h5">Create account</Typography>
              <Typography color="text.secondary">Start managing inventory</Typography>
            </Box>
          </Stack>

          {error ? <Alert severity="error">{error}</Alert> : null}

          <Stack component="form" spacing={2.25} onSubmit={handleSubmit(submit)}>
            <TextField
              label="Full name"
              autoComplete="name"
              fullWidth
              error={Boolean(errors.full_name)}
              helperText={errors.full_name?.message}
              {...register('full_name', { required: 'Full name is required', minLength: 2 })}
            />
            <TextField
              label="Email address"
              type="email"
              autoComplete="email"
              fullWidth
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address' },
              })}
            />
            <TextField
              label="Password"
              type="password"
              autoComplete="new-password"
              fullWidth
              error={Boolean(errors.password)}
              helperText={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Password must be at least 8 characters' },
              })}
            />
            <Button type="submit" variant="contained" size="large" disabled={loading}>
              Create account
            </Button>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            Already registered?{' '}
            <MuiLink component={Link} to="/login" underline="hover">
              Login
            </MuiLink>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
