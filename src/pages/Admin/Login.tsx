import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Container,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LockIcon from '@mui/icons-material/Lock';
import AdminButton from '../../components/common/AdminButton';

const LoginSection = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '2rem',
});

const LoginCard = styled(Paper)({
  padding: '3rem',
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  maxWidth: '400px',
  width: '100%',
  textAlign: 'center',
});

const LoginTitle = styled(Typography)({
  fontFamily: "'Great Vibes', cursive",
  fontSize: '2.5rem',
  fontWeight: 400,
  color: '#8B0000',
  marginBottom: '1rem',
});

const LoginSubtitle = styled(Typography)({
  fontFamily: "'Montserrat', sans-serif",
  fontSize: '1rem',
  color: '#666',
  marginBottom: '2rem',
});

const StyledTextField = styled(TextField)({
  marginBottom: '1.5rem',
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    '& fieldset': {
      borderColor: '#ddd',
    },
    '&:hover fieldset': {
      borderColor: '#8B0000',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#8B0000',
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#8B0000',
  },
});

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading } = useAuth();

  const from = location.state?.from?.pathname || '/admin/dashboard';

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, from]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
        }}
      >
        <CircularProgress size={60} sx={{ color: '#8B0000' }} />
      </Box>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const success = await login(username, password);
      if (success) {
        navigate(from, { replace: true });
      } else {
        setError('Usuário ou senha incorretos');
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginSection>
      <Container maxWidth="sm">
        <LoginCard>
          <Box sx={{ mb: 3 }}>
            <LockIcon sx={{ fontSize: 48, color: '#8B0000', mb: 2 }} />
            <LoginTitle>
              Admin Login
            </LoginTitle>
            <LoginSubtitle>
              Acesse o painel administrativo
            </LoginSubtitle>
          </Box>

          <Box component="form" onSubmit={handleLogin}>
            <StyledTextField
              fullWidth
              label="Usuário"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />
            
            <StyledTextField
              fullWidth
              label="Senha"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <AdminButton
              type="submit"
              fullWidth
              disabled={loading || !username || !password}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
            </AdminButton>
          </Box>
        </LoginCard>
      </Container>
    </LoginSection>
  );
};

export default Login; 