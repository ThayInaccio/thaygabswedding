import React from 'react';
import {
  Box,
  Typography,
  Container,
  Chip,
  Grid,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import moradaIcon from '../../assets/morada.png';

const WeddingSection = styled(Box)(({ theme }) => ({
  padding: '8rem 0',
  background: '#ffffff',
  minHeight: '100vh',
  [theme.breakpoints.down('md')]: {
    padding: '6rem 0',
  },
}));

const Title = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  fontFamily: "'Great Vibes', cursive",
  fontSize: '3.5rem',
  fontWeight: 400,
  color: '#b22432',
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down('md')]: {
    fontSize: '2.5rem',
    marginBottom: theme.spacing(1.5),
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '2rem',
    marginBottom: theme.spacing(1),
  },
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  fontFamily: "'Montserrat', sans-serif",
  fontSize: '1rem',
  color: '#888',
  marginBottom: '5rem',
  maxWidth: '500px',
  margin: '0 auto 5rem',
  lineHeight: 1.6,
  fontWeight: 300,
  letterSpacing: '0.5px',
  [theme.breakpoints.down('md')]: {
    fontSize: '0.9rem',
    marginBottom: '4rem',
  },
}));

const DetailsCard = styled(Paper)(({ theme }) => ({
  padding: '3rem',
  borderRadius: '0',
  background: '#ffffff',
  boxShadow: 'none',
  border: '1px solid #f0f0f0',
  height: '100%',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: '#b22432',
    transform: 'translateY(-2px)',
  },
  [theme.breakpoints.down('md')]: {
    padding: '2.5rem',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '2rem',
  },
}));

const DetailTitle = styled(Typography)(() => ({
  fontFamily: "'Montserrat', sans-serif",
  fontSize: '1.25rem',
  fontWeight: 400,
  color: '#333',
  marginBottom: '1.5rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  letterSpacing: '0.5px',
}));

const DetailText = styled(Typography)(() => ({
  fontFamily: "'Montserrat', sans-serif",
  fontSize: '0.95rem',
  color: '#666',
  lineHeight: 1.7,
  marginBottom: '1rem',
  fontWeight: 300,
}));

const AddressText = styled(Typography)(() => ({
  fontFamily: "'Montserrat', sans-serif",
  fontSize: '1.1rem',
  color: '#333',
  lineHeight: 1.6,
  fontWeight: 400,
  marginBottom: '1.5rem',
  letterSpacing: '0.3px',
}));

const TimeChip = styled(Chip)(() => ({
  fontFamily: "'Montserrat', sans-serif",
  fontWeight: 400,
  fontSize: '0.85rem',
  background: '#b22432',
  color: '#ffffff',
  borderRadius: '0',
  height: '36px',
  '& .MuiChip-label': {
    padding: '0 20px',
  },
}));

const MapContainer = styled(Box)(() => ({
  margin: '2rem 0',
  borderRadius: '0',
  overflow: 'hidden',
  border: '1px solid #f0f0f0',
}));

const WeddingDetails: React.FC = () => {
  const navigate = useNavigate();


  return (
    <WeddingSection id="wedding-details">
      <Container maxWidth="lg">
        <Title>
          Sobre o Casamento
        </Title>
        <Subtitle>
          Junte-se a nós para celebrar este momento especial em nossas vidas
        </Subtitle>

        <Grid container spacing={4}>
          <Grid item xs={12}>
            <DetailsCard>
              <DetailTitle>
                <img src={moradaIcon} alt="Morada" style={{ width: '24px', height: '24px' }} />
                Local da Cerimônia
              </DetailTitle>
              <AddressText>
                Alameda Carlos Barduchi, 585 - Dois Córregos, Valinhos - SP, 13278-170
              </AddressText>
              <MapContainer>
                <iframe
                  title="Mapa do Local da Cerimônia"
                  src="https://www.google.com/maps?q=Alameda+Carlos+Barduchi,+585+-+Dois+Córregos,+Valinhos+-+SP,+13278-170&output=embed"
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </MapContainer>
              <TimeChip 
                label="15:00" 
                icon={<AccessTimeIcon />}
              />
            </DetailsCard>
          </Grid>

          <Grid item xs={12}>
            <DetailsCard>
              <DetailTitle>
                <EventIcon sx={{ color: '#b22432' }} />
                Informações Importantes
              </DetailTitle>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <DetailText>
                    <strong>Dress Code:</strong> Traje Social Completo
                  </DetailText>
                  <DetailText>
                    <strong>Estacionamento:</strong> Disponível no local
                  </DetailText>
                  <DetailText>
                    <strong>Transporte:</strong> Estacionamento gratuito disponível
                  </DetailText>
                </Grid>
                <Grid item xs={12} md={6}>
                  <DetailText>
                    <strong>Presentes:</strong> Sua presença é nosso maior presente
                  </DetailText>
                  <DetailText>
                    <strong>Fotografia:</strong> Pedimos que não tirem fotos durante a cerimônia
                  </DetailText>
                  <DetailText>
                    <strong>Contato:</strong> Para dúvidas, entre em contato conosco
                  </DetailText>
                </Grid>
              </Grid>
            </DetailsCard>
          </Grid>
        </Grid>
      </Container>
    </WeddingSection>
  );
};

export default WeddingDetails; 