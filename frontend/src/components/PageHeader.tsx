import { Box, Button, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    icon?: ReactNode;
    onClick: () => void;
  };
};

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      justifyContent="space-between"
      alignItems={{ xs: 'stretch', sm: 'center' }}
      gap={2}
      sx={{ mb: 3, pb: 2.5, borderBottom: '1px solid', borderColor: 'divider' }}
    >
      <Box>
        <Typography variant="h4" component="h1">
          {title}
        </Typography>
        {subtitle ? (
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        ) : null}
      </Box>

      {action ? (
        <Button variant="contained" startIcon={action.icon} onClick={action.onClick}>
          {action.label}
        </Button>
      ) : null}
    </Stack>
  );
}
