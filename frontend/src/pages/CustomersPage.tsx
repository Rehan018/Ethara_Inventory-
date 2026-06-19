import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/EmailOutlined';
import PhoneIcon from '@mui/icons-material/PhoneOutlined';
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
import { createCustomer, deleteCustomer, getCustomers } from '../api/customers';
import { getErrorMessage } from '../api/http';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { CustomerDialog } from '../components/CustomerDialog';
import { PageHeader } from '../components/PageHeader';
import { useToast } from '../hooks/useToast';
import type { Customer, CustomerInput } from '../types';
import { formatDate } from '../utils/format';

export function CustomersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);
  const { toast, showToast, closeToast } = useToast();

  const { data = [], isLoading, error } = useQuery({
    queryKey: ['customers'],
    queryFn: getCustomers,
  });

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return data;
    return data.filter((customer) =>
      [customer.full_name, customer.email, customer.phone].some((value) =>
        value.toLowerCase().includes(query),
      ),
    );
  }, [data, search]);

  const createMutation = useMutation({
    mutationFn: (payload: CustomerInput) => createCustomer(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setDialogOpen(false);
      showToast('Customer created');
    },
    onError: (err) => showToast(getErrorMessage(err), 'error'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setDeleteTarget(null);
      showToast('Customer deleted');
    },
    onError: (err) => showToast(getErrorMessage(err), 'error'),
  });

  return (
    <>
      <PageHeader
        title="Customers"
        subtitle="Maintain customer contact records"
        action={{
          label: 'Add customer',
          icon: <AddIcon />,
          onClick: () => setDialogOpen(true),
        }}
      />

      {isLoading ? <LinearProgress sx={{ mb: 2 }} /> : null}
      {error ? <Alert severity="error">{getErrorMessage(error)}</Alert> : null}

      <Paper elevation={0} sx={{ width: '100%', overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <TextField
            size="small"
            label="Search customers"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            sx={{ width: { xs: '100%', sm: 320 } }}
          />
        </Box>
        <TableContainer sx={{ width: '100%', overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Customer</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Created</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCustomers.length ? (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.id} hover>
                    <TableCell>
                      <Typography fontWeight={700}>{customer.full_name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Stack spacing={0.75}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <EmailIcon fontSize="small" color="action" />
                          <Typography variant="body2">{customer.email}</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <PhoneIcon fontSize="small" color="action" />
                          <Typography variant="body2">{customer.phone}</Typography>
                        </Stack>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                      {formatDate(customer.created_at)}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Delete customer">
                        <IconButton aria-label="Delete customer" onClick={() => setDeleteTarget(customer)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                      No customers found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <CustomerDialog
        open={dialogOpen}
        loading={createMutation.isPending}
        onClose={() => setDialogOpen(false)}
        onSubmit={(payload) => createMutation.mutate(payload)}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete customer"
        message={`Delete ${deleteTarget?.full_name || 'this customer'}? Existing orders will remain in history.`}
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
