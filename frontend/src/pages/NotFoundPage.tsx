import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', bgcolor: 'background.default', px: 2 }}>
      <Paper elevation={0} sx={{ width: '100%', maxWidth: 420, p: 4, textAlign: 'center', border: '1px solid', borderColor: 'divider' }}>
        <Stack spacing={2.5} alignItems="center">
          <Typography variant="h4">Page not found</Typography>
          <Typography color="text.secondary">The page you opened is not available.</Typography>
          <Button component={Link} to="/" variant="contained">
            Go to dashboard
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
