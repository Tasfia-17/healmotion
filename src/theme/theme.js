import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#e1894f', light: '#f5b88a', dark: '#b5613a' },
    secondary: { main: '#4a9e8e', light: '#7bcfbd', dark: '#2d7566' },
    warning: { main: '#fcd34d', light: '#fde68a', dark: '#ca8a04' },
    background: { default: '#fdfcf6', paper: '#ffffff' },
    text: { primary: '#1a1a1a', secondary: '#545454' },
  },
  typography: {
    fontFamily: '"Poppins", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: 10, padding: '10px 24px' } } },
    MuiCard: { styleOverrides: { root: { borderRadius: 16 } } },
  },
});

export default theme;
