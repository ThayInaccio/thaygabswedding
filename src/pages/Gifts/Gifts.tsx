import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Fade,
  CircularProgress,
  Alert,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CloseIcon from '@mui/icons-material/Close';
import * as giftService from '../../services/gifts.service';
import type { Gift } from '../../types';
import QRCode from 'react-qr-code';
import Autocomplete from '@mui/lab/Autocomplete';
import TextField from '@mui/material/TextField';
import { Guest, findGuestByName } from '../../services/rsvp.service';
import { registerPurchase } from '../../services/api';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { Global } from '@emotion/react';

const GiftsSection = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: `#d6a5ad`,
  border: '18px solid transparent',
  boxSizing: 'border-box',
  padding: '6rem 0 4rem 0',
  [theme.breakpoints.down('md')]: {
    padding: '4rem 0 2rem 0',
  },
}));

const PageTitle = styled(Typography)(({ theme }) => ({
  fontFamily: "'Operetta 12 Demi Bold', serif",
  fontSize: '3.5rem',
  fontWeight: 600,
  textAlign: 'center',
  color: '#e0d5bb',
  marginBottom: '1rem',
  letterSpacing: '-0.02em',
  textShadow: '0 2px 12px rgba(0,0,0,0.32), 0 1px 0 #000',
  [theme.breakpoints.down('md')]: {
    fontSize: '2.5rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '2rem',
  },
}));

const PageSubtitle = styled(Typography)(({ theme }) => ({
  fontFamily: "'Montserrat', sans-serif",
  fontSize: '1.1rem',
  textAlign: 'center',
  color: '#e0d5bb',
  marginBottom: '4rem',
  maxWidth: '700px',
  margin: '0 auto 4rem',
  lineHeight: 1.6,
  fontWeight: 600,
  textShadow: '0 2px 8px rgba(0,0,0,0.22)',
  [theme.breakpoints.down('md')]: {
    fontSize: '1rem',
    marginBottom: '3rem',
  },
}));

const GiftCard = styled(Card)({
  position: 'relative',
  borderRadius: '20px',
  overflow: 'hidden',
  boxShadow: '0 2px 12px rgba(100, 38, 27, 0.10)',
  background: '#fff',
  width: '300px',
  minHeight: '430px',
  display: 'flex',
  flexDirection: 'column',
  transition: 'box-shadow 0.4s, border 0.4s, transform 0.4s cubic-bezier(0.4,0,0.2,1)',
});

const GiftMedia = styled(CardMedia)({
  width: '100%',
  height: '170px',
  objectFit: 'cover',
  borderTopLeftRadius: '20px',
  borderTopRightRadius: '20px',
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
});

const GiftContent = styled(CardContent)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  padding: '1.4rem',
  minHeight: 0,
  justifyContent: 'space-between',
});

const GiftTitle = styled(Typography)({
  fontFamily: "'Montserrat', sans-serif",
  fontWeight: 500,
  fontSize: '1.1rem',
  color: '#333',
  marginBottom: '0.5rem',
  lineHeight: 1.3,
  // Remove ellipsis
});

const GiftDescription = styled(Typography)({
  fontFamily: "'Montserrat', sans-serif",
  fontSize: '0.9rem',
  color: '#666',
  marginBottom: '1rem',
  lineHeight: 1.5,
  flex: 1,
  // Remove ellipsis and line clamp
});

const GiftPrice = styled(Typography)({
  fontFamily: "'Montserrat', sans-serif",
  fontWeight: 600,
  fontSize: '1.2rem',
  color: '#8B0000',
  marginBottom: '1rem',
});

const GiftActions = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '0.5rem',
});

const StyledButton = styled(Button)({
  borderRadius: '20px',
  textTransform: 'none',
  fontFamily: "'Montserrat', sans-serif",
  fontWeight: 500,
  fontSize: '0.85rem',
  padding: '0.5rem 1rem',
  border: '1px solid #8B0000',
  color: '#8B0000',
  background: 'transparent',
  '&:hover': {
    background: '#8B0000',
    color: '#FFFFFF',
  },
});

const StatusChip = styled(Chip)({
  position: 'absolute',
  top: '12px',
  right: '12px',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  color: '#8B0000',
  fontFamily: "'Montserrat', sans-serif",
  fontWeight: 500,
  fontSize: '0.75rem',
  backdropFilter: 'blur(10px)',
  '&.available': {
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    color: '#FFFFFF',
  },
  '&.reserved': {
    backgroundColor: 'rgba(255, 152, 0, 0.9)',
    color: '#FFFFFF',
  },
  '&.purchased': {
    backgroundColor: 'rgba(244, 67, 54, 0.9)',
    color: '#FFFFFF',
  },
});

const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    borderRadius: '16px',
    maxWidth: '500px',
    width: '90vw',
  },
});

const LoadingContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '400px',
});

const ErrorContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '400px',
  gap: '1rem',
});

const NUBANK_PIX_PAYLOAD = "00020126490014BR.GOV.BCB.PIX0127casamentothaygabs@gmail.com5204000053039865802BR5923Gabriel Campos Ferreira6009SAO PAULO62140510miThpoFX8H6304CAA1";
const NUBANK_PIX_LINK = "https://nubank.com.br/cobrar/q6ii6/686a78f7-dd6e-43d7-8e8c-8faafe23c22a";

// Heart and Iara animation component
const HeartCelebration = () => {
  // Generate many random positions and delays for hearts and iaras
  const heartEmojis = ['💖', '💗', '💓', '💞', '❤️', '💘', '💝', '💕'];
  const hearts = Array.from({ length: 60 }, (_, i) => ({
    left: `${Math.random() * 95}%`,
    delay: `${Math.random() * 1.2}s`,
    emoji: heartEmojis[i % heartEmojis.length],
    size: 2 + Math.random() * 2.5, // rem
    top: `${10 + Math.random() * 80}%`,
  }));
  const iaras = Array.from({ length: 40 }, () => ({
    left: `${Math.random() * 95}%`,
    delay: `${Math.random() * 1.2}s`,
    size: 60 + Math.random() * 80, // px
    rotate: (Math.random() - 0.5) * 40, // -20 to 20 deg
    top: `${10 + Math.random() * 80}%`,
    opacity: 0.7 + Math.random() * 0.3,
  }));
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 2000,
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(255,255,255,0.85)',
      animation: 'fadeIn 0.3s',
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes heart-float {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-320px) scale(1.6); opacity: 0; }
        }
        @keyframes iara-float {
          0% { transform: translateY(0) scale(1) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-340px) scale(1.2) rotate(20deg); opacity: 0; }
        }
        .heart {
          position: absolute;
          animation: heart-float 2.2s ease-in forwards;
          user-select: none;
          will-change: transform, opacity;
        }
        .iara {favorites
          position: absolute;
          animation: iara-float 2.4s ease-in forwards;
          user-select: none;
          will-change: transform, opacity;
        }
      `}</style>
      {hearts.map((h, i) => (
        <div
          key={i}
          className="heart"
          style={{
            left: h.left,
            top: h.top,
            fontSize: `${h.size}rem`,
            animationDelay: h.delay,
            opacity: 0.85,
          }}
        >
          {h.emoji}
        </div>
      ))}
      {iaras.map((ia, i) => (
        <img
          key={i}
          src="/iara.png"
          alt="Iara"
          className="iara"
          style={{
            left: ia.left,
            top: ia.top,
            width: ia.size,
            height: ia.size,
            animationDelay: ia.delay,
            transform: `rotate(${ia.rotate}deg)`,
            filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.12))',
            opacity: ia.opacity,
          }}
        />
      ))}
      <div style={{
        position: 'absolute',
        top: '40%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'rgba(255,255,255,0.97)',
        borderRadius: 16,
        padding: '2rem 2.5rem',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        textAlign: 'center',
        fontSize: '1.3rem',
        color: '#8B0000',
        fontWeight: 600,
        zIndex: 2100,
      }}>
        Agradecemos pelo presente!<br />Confirmaremos a compra em até um dia. 💖
      </div>
    </div>
  );
};

const StyledSwiperSlide = styled(SwiperSlide)({
  overflow: 'visible',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  height: '100%',
});

const Gifts: React.FC = () => {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [buyDialogOpen, setBuyDialogOpen] = useState(false);
  const [buyGift, setBuyGift] = useState<Gift | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [guestError, setGuestError] = useState('');
  const [guestOptions, setGuestOptions] = useState<Guest[]>([]);
  const [guestLoading, setGuestLoading] = useState(false);

  useEffect(() => {
    loadGifts();
  }, []);

  const loadGifts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await giftService.getAllGifts();
      setGifts(data);
    } catch (err) {
      setError('Erro ao carregar a lista de presentes. Tente novamente.');
      console.error('Error loading gifts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = (gift: Gift) => {
    setBuyGift(gift);
    setBuyDialogOpen(true);
    setSelectedGuest(null);
    setGuestError('');
    // Pix payload generation removed
  };

  const handleBuyDialogClose = () => {
    setBuyDialogOpen(false);
    setBuyGift(null);
    setSelectedGuest(null);
    setGuestError('');
  };

  const handleBuySubmit = async () => {
    if (!selectedGuest) {
      setGuestError('Selecione seu nome na lista de convidados');
      return;
    }
    if (!buyGift) {
      setGuestError('Nenhum presente selecionado');
      return;
    }
    try {
      await registerPurchase(buyGift.id, selectedGuest.id, buyGift.price);
      setBuyDialogOpen(false);
      setBuyGift(null);
      setSelectedGuest(null);
      setGuestError('');
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2500);
    } catch (err: any) {
      setGuestError(err.message || 'Erro ao registrar compra');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const getStatusChip = (gift: Gift) => {
    const status = gift.status || 'available';
    const label = status === 'available' ? 'Disponível' : 
                  status === 'reserved' ? 'Reservado' : 'Comprado';
    
    return (
      <StatusChip 
        label={label} 
        className={status}
        size="small"
      />
    );
  };

  if (loading) {
    return (
      <GiftsSection id="gifts">
        <Container maxWidth="lg">
          <LoadingContainer>
            <CircularProgress size={60} sx={{ color: '#8B0000' }} />
          </LoadingContainer>
        </Container>
      </GiftsSection>
    );
  }

  if (error) {
    return (
      <GiftsSection id="gifts">
        <Container maxWidth="lg">
          <ErrorContainer>
            <Alert severity="error" sx={{ maxWidth: '500px' }}>
              {error}
            </Alert>
            <StyledButton onClick={loadGifts}>
              Tentar Novamente
            </StyledButton>
          </ErrorContainer>
        </Container>
      </GiftsSection>
    );
  }

  return (
    <GiftsSection id="gifts">
      <Container maxWidth="lg">
        <Fade in timeout={800}>
          <Box>
            <PageTitle>
              Presentes em cartaz
            </PageTitle>
            <PageSubtitle>
            Compre ingresso do filme que você gostaria de assistir
            </PageSubtitle>

            <Swiper
              modules={[Navigation]}
              navigation
              centeredSlides
              loop
              slidesPerView={3}
              style={{ padding: '2rem 0', overflow: 'visible' }}
              breakpoints={{
                0: { slidesPerView: 1 },
                600: { slidesPerView: 1.5 },
                900: { slidesPerView: 2.5 },
                1200: { slidesPerView: 3 },
              }}
              className="gift-swiper"
            >
              {gifts.map((gift, index) => (
                <StyledSwiperSlide key={gift.id}>
                  <Fade in timeout={800 + index * 100}>
                    <GiftCard>
                      <Box sx={{ position: 'relative' }}>
                        <GiftMedia
                          image={gift.image_url || '/src/assets/teg1.jpeg'}
                          title={gift.name}
                        />
                        {getStatusChip(gift)}
                      </Box>
                      <GiftContent>
                        <GiftTitle variant="h6">
                          {gift.name}
                        </GiftTitle>
                        <GiftDescription variant="body2">
                          {gift.description || 'Um presente especial para o nosso grande dia.'}
                        </GiftDescription>
                        <GiftPrice>
                          {formatPrice(gift.price)}
                        </GiftPrice>
                        <GiftActions>
                          <StyledButton
                            variant="outlined"
                            onClick={() => handlePurchase(gift)}
                            startIcon={<ShoppingCartIcon />}
                            fullWidth
                          >
                            Comprar
                          </StyledButton>
                        </GiftActions>
                      </GiftContent>
                    </GiftCard>
                  </Fade>
                </StyledSwiperSlide>
              ))}
            </Swiper>
            {/* Buy Dialog */}
            <StyledDialog open={buyDialogOpen} onClose={handleBuyDialogClose}>
              <DialogTitle sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: '1.2rem', color: '#222',
                borderBottom: 'none', padding: '2rem 2rem 1rem 2rem', background: 'transparent',
              }}>
                <span>Comprar Presente</span>
                <IconButton onClick={handleBuyDialogClose} size="small" sx={{ color: '#aaa' }}>
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent sx={{
                p: '2rem',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                background: 'transparent',
              }}>
                {buyGift && (
                  <>
                    <CardMedia
                      component="img"
                      image={buyGift.image_url || '/src/assets/teg1.jpeg'}
                      alt={buyGift.name}
                      sx={{ width: 120, height: 120, objectFit: 'cover', borderRadius: '50%', mb: 2, boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}
                    />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#8B0000', mb: 0.5, fontFamily: 'Montserrat, sans-serif', fontSize: '1.1rem' }}>{buyGift.name}</Typography>
                    <Typography variant="body2" sx={{ color: '#888', mb: 2, fontFamily: 'Montserrat, sans-serif', fontSize: '0.95rem', textAlign: 'center' }}>{buyGift.description}</Typography>
                    <Typography variant="subtitle1" sx={{ color: '#8B0000', fontWeight: 700, mb: 2, fontSize: '1.1rem', fontFamily: 'Montserrat, sans-serif' }}>
                      {formatPrice(buyGift.price)}
                    </Typography>
                    <Box sx={{ width: '100%', mb: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1, color: '#444', fontFamily: 'Montserrat, sans-serif', fontWeight: 500 }}>Quem está comprando o presente?</Typography>
                      <Autocomplete
                        options={guestOptions}
                        getOptionLabel={(option) => option.name}
                        value={selectedGuest}
                        onChange={(_, value) => { setSelectedGuest(value); setGuestError(''); }}
                        onInputChange={async (_, value, reason) => {
                          if (reason === 'input' && value.length >= 2) {
                            setGuestLoading(true);
                            try {
                              const results = await findGuestByName(value);
                              setGuestOptions(results);
                            } catch {
                              setGuestOptions([]);
                            }
                            setGuestLoading(false);
                          } else if (value.length < 2) {
                            setGuestOptions([]);
                          }
                        }}
                        loading={guestLoading}
                        renderInput={(params) => (
                          <TextField {...params} label="Busque seu nome" variant="standard" error={!!guestError} helperText={guestError || 'Digite pelo menos 2 letras para buscar seu nome'} sx={{ width: '100%', background: 'transparent', fontFamily: 'Montserrat, sans-serif' }} />
                        )}
                        fullWidth
                        disablePortal
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                      />
                    </Box>
                    <Box sx={{ textAlign: 'center', mb: 2, width: '100%' }}>
                      <Typography variant="body2" sx={{ mb: 1, color: '#444', fontFamily: 'Montserrat, sans-serif', fontWeight: 500 }}>Pagamento via Pix</Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#fafafa', p: 2, borderRadius: 3, boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
                        <QRCode value={NUBANK_PIX_PAYLOAD} size={120} title="Pix QR Code" />
                      </Box>
                      <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#888', fontFamily: 'Montserrat, sans-serif' }}>
                        Chave Pix: <b style={{ color: '#8B0000' }}>casamentothaygabs@gmail.com</b>
                      </Typography>
                      <Box sx={{ mt: 2, p: 1, background: '#f5f5f5', borderRadius: 2 }}>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: '#8B0000', fontFamily: 'Montserrat, sans-serif' }}>Copia e cola Pix:</Typography>
                        <Box sx={{ wordBreak: 'break-all', fontSize: 12, mt: 0.5, color: '#444', fontFamily: 'Montserrat, sans-serif' }}>{NUBANK_PIX_PAYLOAD}</Box>
                      </Box>
                      <Box sx={{ mt: 2 }}>
                        <a href={NUBANK_PIX_LINK} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                          <Button variant="outlined" sx={{ borderRadius: 20, color: '#8B0000', borderColor: '#8B0000', fontWeight: 500, fontFamily: 'Montserrat, sans-serif', px: 3, py: 1, textTransform: 'none', background: 'transparent', '&:hover': { background: '#8B0000', color: '#fff' } }}>Pagar pelo site do Nubank</Button>
                        </a>
                      </Box>
                    </Box>
                  </>
                )}
              </DialogContent>
              <DialogActions sx={{ justifyContent: 'center', p: '1.5rem', background: 'transparent' }}>
                <Button onClick={handleBuyDialogClose} sx={{ borderRadius: 20, color: '#888', fontWeight: 500, fontFamily: 'Montserrat, sans-serif', px: 3, py: 1, textTransform: 'none', background: 'transparent', boxShadow: 'none', border: 'none', '&:hover': { background: '#f5f5f5' } }}>Cancelar</Button>
                <Button onClick={handleBuySubmit} variant="contained" sx={{ borderRadius: 20, background: '#8B0000', color: '#fff', fontWeight: 600, fontFamily: 'Montserrat, sans-serif', px: 3, py: 1, textTransform: 'none', boxShadow: 'none', '&:hover': { background: '#600000' } }}>Confirmar</Button>
              </DialogActions>
            </StyledDialog>
            {showCelebration && <HeartCelebration />}
          </Box>
        </Fade>
      </Container>
      <Global styles={`
        .gift-swiper .swiper-slide {
          transition: transform 0.4s cubic-bezier(0.4,0,0.2,1), box-shadow 0.4s, opacity 0.4s;
          opacity: 0.6;
          transform: scale(0.92);
          z-index: 1;
        }
        .gift-swiper .swiper-slide-active {
          opacity: 1;
          transform: scale(1.10) translateY(-10px);
          z-index: 4;
        }
        .gift-swiper .swiper-slide-next,
        .gift-swiper .swiper-slide-prev {
          opacity: 0.85;
          transform: scale(0.98);
          z-index: 2;
        }
        .gift-swiper {
          padding-bottom: 2.5rem !important;
        }
      `} />
    </GiftsSection>
  );
};

export default Gifts; 