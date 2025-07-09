import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  CircularProgress,
  Alert,
  Autocomplete,
  Link,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { motion, AnimatePresence } from 'framer-motion';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { updateRsvp, findGuestByName } from '../../services/rsvp.service';

export interface Guest {
  id: string;
  name: string;
  confirmed: boolean | null;
}

const videos = [
  '/src/assets/videos/bs-pb2.mp4',
  '/src/assets/videos/ah-pb.mp4',
  '/src/assets/videos/bs-pb1.mp4',
  '/src/assets/videos/at-pb.mp4',

];

const RSVPSection = styled(Box)(() => ({
  position: 'relative',
  minHeight: '100vh',
  width: '100%',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  background: '#f8f9fa',
}));

const RSVPContainer = styled(Container)(() => ({
  position: 'relative',
  zIndex: 2,
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  paddingRight: '5rem',
  '@media (max-width: 1200px)': {
    paddingRight: '2.5rem',
  },
  '@media (max-width: 960px)': {
    justifyContent: 'center',
    padding: '1rem',
  },
}));

const VideoCarouselContainer = styled(Box)(() => ({
  position: 'absolute',
  top: '50%',
  left: '3%',
  width: '61vw',
  height: '70vh',
  transform: 'translateY(-50%)',
  zIndex: 1,
  borderTopRightRadius: '32px',
  borderBottomRightRadius: '32px',
  borderBottomLeftRadius: '32px',
  borderTopLeftRadius: '32px',
  overflow: 'hidden',
  boxShadow: '0 20px 40px rgba(0,0,0,0.10)',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(242, 246, 245, 0.32)',
    pointerEvents: 'none',
    borderTopRightRadius: '32px',
    borderBottomRightRadius: '32px',
    borderBottomLeftRadius: '32px',
    borderTopLeftRadius: '32px',
  },
  '@media (max-width: 960px)': {
    width: '100vw',
    height: '45vh',
    borderRadius: 0,
    left: 0,
    top: 0,
    transform: 'none',
    boxShadow: 'none',
  },
}));

const PlayerWrapper = styled(Box)({
  position: 'relative',
  paddingTop: '63.50%', /* 16:9 Aspect Ratio */
  width: '100%',
  height: '100%',
});

const StyledVideo = styled('video')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});


const RSVPFormCard = styled(Paper)(() => ({
  background: '#2f2c2c',
  padding: '2.5rem',
  borderRadius: '20px',
  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
  width: '100%',
  maxWidth: '420px',
  '@media (max-width: 960px)': {
    maxWidth: '500px',
    background: '#2f2c2c',
  },
}));

const Title = styled(Typography)(({ theme }) => ({
  fontFamily: "'Playfair Display', serif",
  fontSize: '2rem',
  fontWeight: 500,
  color: '#fff6e7',
  marginBottom: theme.spacing(1.5),
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.3rem',
  },
}));

const Subtitle = styled(Typography)(() => ({
  fontFamily: "'Inter', sans-serif",
  fontSize: '0.95rem',
  color: '#fff6e7',
  marginBottom: '2rem',
  lineHeight: 1.7,
}));

const StyledTextField = styled(TextField)(() => ({
  '& .MuiInput-root': {
    borderRadius: 0,
    borderBottom: '1px solid #e3c095',
    background: 'transparent',
    color: '#fff6e7',
    fontFamily: "'Inter', sans-serif",
    fontSize: '1rem',
    '&:before, &:after': {
      borderBottom: '1px solid #e3c095',
    },
    '&:hover:not(.Mui-disabled):before': {
      borderBottom: '1px solid #fff6e7',
    },
  },
  '& .MuiInputBase-input': {
    color: '#fff6e7',
    fontFamily: "'Inter', sans-serif",
    fontSize: '1rem',
    fontWeight: 100,
  },
  '& .MuiInputLabel-root': {
    color: '#e3c095',
    fontFamily: "'Inter', sans-serif",
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#fff6e7',
  },
  '& .MuiOutlinedInput-root, & .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
}));

const StyledButton = styled(Button)(() => ({
  borderRadius: '30px',
  padding: '0.75rem 2rem',
  fontFamily: "'Inter', sans-serif",
  fontWeight: 400,
  textTransform: 'uppercase',
  fontSize: '0.8rem',
  letterSpacing: '0.15em',
  marginTop: '1.5rem',
  boxShadow: 'none',
  border: '1px solid rgba(255, 246, 231, 0.5)',
  color: '#fff6e7',
  background: 'transparent',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'rgba(255, 246, 231, 0.05)',
    borderColor: '#fff6e7',
  },
  '&.Mui-disabled': {
    borderColor: 'rgba(255, 246, 231, 0.2)',
    color: 'rgba(255, 246, 231, 0.3)',
    background: 'transparent',
  },
}));

const RSVP: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [foundGuests, setFoundGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationStatus, setConfirmationStatus] = useState<{ [key: string]: string }>({});
  const [rejectionStatus, setRejectionStatus] = useState<{ [key: string]: string }>({});
  const [options, setOptions] = useState<Guest[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [animatingConfirm, setAnimatingConfirm] = useState<string | null>(null);
  const [showCheckOnly, setShowCheckOnly] = useState(false);

  // Fetch guest suggestions as user types
  const handleInputChange = async (_event: React.SyntheticEvent, value: string) => {
    setSearchTerm(value);
    if (value.length < 2) {
      setOptions([]);
      return;
    }
    setLoading(true);
    try {
      const guests = await findGuestByName(value);
      setOptions(guests);
    } catch {
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!selectedGuest) {
      setError('Por favor, selecione seu nome na lista.');
      return;
    }
    setLoading(true);
    setError(null);
    setFoundGuests([]);
    try {
      setFoundGuests([selectedGuest]);
    } catch {
      setError('Erro ao buscar convidado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (guestId: string) => {
    setAnimatingConfirm(guestId);
    setError(null);
    setLoading(true);
    setTimeout(async () => {
      try {
        await updateRsvp(guestId, { confirmed: true });
        setConfirmationStatus(prev => ({ ...prev, [guestId]: 'Confirmado!' }));
        setShowCheckOnly(true);
      } catch (err) {
        setError('Erro ao confirmar presença. Tente novamente.');
      } finally {
        setLoading(false);
        setAnimatingConfirm(null);
      }
    }, 500);
  };

  const handleReject = async (guestId: string) => {
    setLoading(true);
    setError(null);
    try {
      await updateRsvp(guestId, { confirmed: false });
      setRejectionStatus(prev => ({ ...prev, [guestId]: 'Rejeitado' }));
    } catch (err) {
      setError('Erro ao rejeitar presença. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RSVPSection id="rsvp">
      <VideoCarouselContainer>
        <Swiper
          spaceBetween={0}
          centeredSlides={true}
          autoplay={{
            delay: 10000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          navigation={false}
          modules={[Autoplay, Pagination, Navigation]}
          loop={true}
        >
          {videos.map((video, index) => (
            <SwiperSlide key={index}>
              <PlayerWrapper>
                <StyledVideo src={video} autoPlay loop muted playsInline />
              </PlayerWrapper>
            </SwiperSlide>
          ))}
        </Swiper>
      </VideoCarouselContainer>

      <RSVPContainer>
        <RSVPFormCard>
          <Title>Garanta seu ingresso</Title>
          <Subtitle>
            Digite seu nome para encontrar seu convite e confirmar sua presença no nosso grande dia.
          </Subtitle>

          {showCheckOnly && selectedGuest ? (
            <Box mt={3} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
              <Typography sx={{ color: '#fff6e7', fontSize: '1.2rem', fontWeight: 500, mb: 2 }}>
                {selectedGuest.name}
              </Typography>
              <motion.div
                key="check"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.4 }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 48 }} />
              </motion.div>
              <Link
                component="button"
                underline="hover"
                sx={{ mt: 3, color: '#e3c095', fontWeight: 400, fontSize: '1rem' }}
                onClick={() => {
                  setShowCheckOnly(false);
                  setSelectedGuest(null);
                  setSearchTerm('');
                  setConfirmationStatus({});
                  setRejectionStatus({});
                  setError(null);
                }}
              >
                Click aqui para confirmar outro convidado
              </Link>
            </Box>
          ) : (
            <>
              <Box component="form" onSubmit={e => e.preventDefault()}>
                <Autocomplete
                  freeSolo={false}
                  options={options}
                  getOptionLabel={(option) => option.name}
                  loading={loading}
                  value={selectedGuest}
                  onChange={(_event, newValue) => setSelectedGuest(newValue)}
                  inputValue={searchTerm}
                  onInputChange={handleInputChange}
                  renderInput={(params) => (
                    <StyledTextField
                      {...params}
                      fullWidth
                      variant="standard"
                      placeholder="Digite seu nome completo"
                    />
                  )}
                />
              </Box>

              {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

              {selectedGuest && (
                <Box mt={3}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" py={1}>
                    <Typography sx={{ color: '#fff6e7', fontSize: '1rem', fontWeight: 400 }}>
                      {selectedGuest.name}
                    </Typography>
                    <AnimatePresence mode="wait" initial={false}>
                      {selectedGuest.confirmed === true || (animatingConfirm === selectedGuest.id && confirmationStatus[selectedGuest.id]) ? (
                        <motion.div
                          key="check"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.4 }}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
                        >
                          <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 28 }} />
                        </motion.div>
                      ) : selectedGuest.confirmed === false || rejectionStatus[selectedGuest.id] === 'Rejeitado' ? (
                        <motion.div
                          key="cancel"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.4 }}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
                        >
                          <CancelIcon sx={{ color: '#f44336', fontSize: 28 }} />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="buttons"
                          initial={{ opacity: 0, x: 40 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -40 }}
                          transition={{ duration: 0.4 }}
                          style={{ display: 'flex', gap: 8 }}
                        >
                          <Button
                            variant="outlined"
                            size="small"
                            sx={{
                              borderRadius: '20px',
                              borderColor: '#e3c095',
                              color: '#e3c095',
                              px: 2,
                              fontSize: '0.95rem',
                              fontWeight: 400,
                              background: 'transparent',
                              minWidth: 110,
                              transition: 'all 0.2s',
                              boxShadow: 'none',
                              '&:hover': {
                                borderColor: '#fff6e7',
                                color: '#fff6e7',
                                background: 'rgba(255,246,231,0.04)'
                              }
                            }}
                            onClick={() => handleReject(selectedGuest.id)}
                            disabled={loading}
                          >
                            {rejectionStatus[selectedGuest.id] || 'Não vou'}
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            sx={{
                              borderRadius: '20px',
                              borderColor: '#e3c095',
                              color: '#e3c095',
                              px: 2,
                              fontSize: '0.95rem',
                              fontWeight: 400,
                              background: 'transparent',
                              minWidth: 110,
                              transition: 'all 0.2s',
                              boxShadow: 'none',
                              '&:hover': {
                                borderColor: '#fff6e7',
                                color: '#fff6e7',
                                background: 'rgba(255,246,231,0.04)'
                              }
                            }}
                            onClick={() => handleConfirm(selectedGuest.id)}
                            disabled={loading || animatingConfirm === selectedGuest.id}
                          >
                            {confirmationStatus[selectedGuest.id] || 'Vou'}
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Box>
                </Box>
              )}
            </>
          )}
        </RSVPFormCard>
      </RSVPContainer>
    </RSVPSection>
  );
};

export default RSVP; 