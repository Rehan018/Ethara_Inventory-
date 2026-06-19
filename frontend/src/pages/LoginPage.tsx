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

type LoginForm = {
  email: string;
  password: string;
};

export function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const submit = async (payload: LoginForm) => {
    setError('');
    setLoading(true);
    try {
      await login(payload);
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
          maxWidth: 420,
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
              <Typography variant="h5">Ethara Inventory</Typography>
              <Typography color="text.secondary">Sign in to continue</Typography>
            </Box>
          </Stack>

          {error ? <Alert severity="error">{error}</Alert> : null}

          <Stack component="form" spacing={2.25} onSubmit={handleSubmit(submit)}>
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
              autoComplete="current-password"
              fullWidth
              error={Boolean(errors.password)}
              helperText={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Password must be at least 8 characters' },
              })}
            />
            <Button type="submit" variant="contained" size="large" disabled={loading}>
              Login
            </Button>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            New here?{' '}
            <MuiLink component={Link} to="/register" underline="hover">
              Create an account
            </MuiLink>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
