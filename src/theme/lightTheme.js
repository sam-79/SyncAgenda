import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2e2e3f',
      light: '#4c4c66',
      dark: '#151539',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f50057',
      light: '#ff5983',
      dark: '#bb002f',
      contrastText: '#ffffff',
    },
    error: {
      main: '#d32f2f',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#ffa000',
      contrastText: '#000000',
    },
    info: {
      main: '#1976d2',
      contrastText: '#ffffff',
    },
    success: {
      main: '#388e3c',
      contrastText: '#ffffff',
    },
    background: {
      default: '#E0E0E0',
      paper: '#ffffff',
      hover:'#bdbdbd'
    },
    text: {
      primary: '#2e2e3f',
      secondary: '#4f4f5e',
      disabled: '#9e9e9e',
    },
    divider: '#cccccc',
    action: {
      active: '#2e2e3f',
      hover: '#f0f0f0',
      selected: '#e0e0e0',
      disabled: '#c0c0c0',
      disabledBackground: '#e0e0e0',
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

export default lightTheme;
