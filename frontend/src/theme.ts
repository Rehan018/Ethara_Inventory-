import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#171717',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#7a6242',
    },
    error: {
      main: '#b3261e',
    },
    success: {
      main: '#2f6f4e',
    },
    background: {
      default: '#fbfbfa',
      paper: '#ffffff',
    },
    text: {
      primary: '#171717',
      secondary: '#696969',
    },
    divider: '#deded8',
  },
  shape: {
    borderRadius: 6,
  },
  typography: {
    fontFamily: ['Inter', 'Roboto', 'Arial', 'sans-serif'].join(','),
    h4: {
      fontFamily: ['Georgia', 'Times New Roman', 'serif'].join(','),
      fontWeight: 700,
      letterSpacing: 0,
      lineHeight: 1.12,
    },
    h5: {
      fontFamily: ['Georgia', 'Times New Roman', 'serif'].join(','),
      fontWeight: 700,
      letterSpacing: 0,
      lineHeight: 1.18,
    },
    h6: {
      fontWeight: 650,
      letterSpacing: 0,
    },
    subtitle1: {
      letterSpacing: 0,
    },
    body1: {
      letterSpacing: 0,
    },
    body2: {
      letterSpacing: 0,
    },
    button: {
      fontWeight: 650,
      textTransform: 'none',
      letterSpacing: 0,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#fbfbfa',
        },
        '::selection': {
          backgroundColor: '#deded8',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          border: '1px solid #171717',
          borderRadius: 999,
          boxShadow: 'none',
          minHeight: 38,
          paddingLeft: 18,
          paddingRight: 18,
          backgroundColor: 'transparent',
          color: '#171717',
          '&:hover': {
            borderColor: '#171717',
            backgroundColor: 'rgba(23, 23, 23, 0.06)',
            boxShadow: 'none',
          },
        },
        contained: {
          border: '1px solid #171717',
          backgroundColor: 'transparent',
          color: '#171717',
          '&:hover': {
            backgroundColor: '#171717',
            color: '#ffffff',
          },
        },
        containedPrimary: {
          borderColor: '#171717',
          backgroundColor: 'transparent',
          color: '#171717',
          '&:hover': {
            backgroundColor: '#171717',
            color: '#ffffff',
          },
        },
        containedError: {
          borderColor: '#171717',
          backgroundColor: 'transparent',
          color: '#b3261e',
          '&:hover': {
            borderColor: '#b3261e',
            backgroundColor: '#b3261e',
            color: '#ffffff',
          },
        },
        outlined: {
          borderColor: '#171717',
          color: '#171717',
          '&:hover': {
            borderColor: '#171717',
            backgroundColor: 'rgba(23, 23, 23, 0.06)',
          },
        },
        text: {
          borderColor: '#171717',
          '&:hover': {
            backgroundColor: 'rgba(23, 23, 23, 0.06)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          border: '1px solid rgba(23, 23, 23, 0.55)',
          borderRadius: 999,
          color: '#4d4d4d',
          '&:hover': {
            borderColor: '#171717',
            backgroundColor: 'rgba(23, 23, 23, 0.06)',
            color: '#171717',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderColor: '#deded8',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          backgroundColor: '#ffffff',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#d7d6d0',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#9f9e99',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#171717',
            borderWidth: 1,
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#696969',
          '&.Mui-focused': {
            color: '#171717',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottomColor: '#e6e5df',
          paddingTop: 14,
          paddingBottom: 14,
        },
        head: {
          backgroundColor: '#f5f5f2',
          color: '#555555',
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: 0,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&.MuiTableRow-hover:hover': {
            backgroundColor: '#f7f7f4',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 8,
          border: '1px solid #deded8',
          boxShadow: '0 24px 80px rgba(0, 0, 0, 0.16)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 650,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          boxShadow: 'none',
        },
      },
    },
  },
});
