import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#8ab4f8',
      light: '#b3d3ff',
      dark: '#5b8bd6',
      contrastText: '#000000',
    },
    secondary: {
      main: '#f50057',
      light: '#ff5983',
      dark: '#bb002f',
      contrastText: '#ffffff',
    },
    error: {
      main: '#ef5350',
      contrastText: '#000000',
    },
    warning: {
      main: '#ffb74d',
      contrastText: '#000000',
    },
    info: {
      main: '#64b5f6',
      contrastText: '#000000',
    },
    success: {
      main: '#81c784',
      contrastText: '#000000',
    },
    background: {
      default: '#121212',
      paper: '#1e1e2f',
    },
    text: {
      primary: '#ffffff',
      secondary: '#cfcfcf',
      disabled: '#888888',
    },
    divider: '#444444',
    action: {
      active: '#ffffff',
      hover: '#333333',
      selected: '#2a2a3b',
      disabled: '#555555',
      disabledBackground: '#2e2e2e',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    button: {
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
});

export default darkTheme;
