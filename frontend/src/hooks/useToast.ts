import { AlertColor } from '@mui/material';
import { useState } from 'react';

export type ToastState = {
  open: boolean;
  message: string;
  severity: AlertColor;
};

export function useToast() {
  const [toast, setToast] = useState<ToastState>({
    open: false,
    message: '',
    severity: 'success',
  });

  const showToast = (message: string, severity: AlertColor = 'success') => {
    setToast({ open: true, message, severity });
  };

  const closeToast = () => {
    setToast((current) => ({ ...current, open: false }));
  };

  return { toast, showToast, closeToast };
}
