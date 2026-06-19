import { Chip } from '@mui/material';

type StatusChipProps = {
  status: string;
};

export function StatusChip({ status }: StatusChipProps) {
  const isCancelled = status === 'CANCELLED';
  return (
    <Chip
      size="small"
      label={isCancelled ? 'Cancelled' : 'Created'}
      color="default"
      variant="outlined"
      sx={{
        bgcolor: isCancelled ? 'transparent' : '#f3f8f4',
        borderColor: isCancelled ? 'divider' : '#b8d1bf',
        color: isCancelled ? 'text.secondary' : '#2f6f4e',
      }}
    />
  );
}
