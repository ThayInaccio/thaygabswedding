import { Button, ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const AdminButton = styled(Button)<ButtonProps>({
  borderRadius: 22,
  padding: '0.65rem 1.7rem',
  fontFamily: 'Inter, Montserrat, sans-serif',
  fontWeight: 600,
  fontSize: '1rem',
  textTransform: 'none',
  background: '#222',
  color: '#fff',
  boxShadow: '0 2px 12px 0 rgba(44,62,80,0.06)',
  '&:hover': {
    background: '#444',
    boxShadow: '0 4px 16px rgba(44,62,80,0.10)',
  },
  '&.MuiButton-outlined': {
    background: '#fff',
    color: '#222',
    border: '1.5px solid #222',
    boxShadow: 'none',
    '&:hover': {
      background: '#f8fafd',
      color: '#1976d2',
      border: '1.5px solid #1976d2',
    },
  },
  '&.MuiButton-error': {
    background: '#fff0f0',
    color: '#d32f2f',
    border: '1.5px solid #d32f2f',
    '&:hover': {
      background: '#fff',
      color: '#fff',
      backgroundColor: '#d32f2f',
    },
  },
});

export default AdminButton; 