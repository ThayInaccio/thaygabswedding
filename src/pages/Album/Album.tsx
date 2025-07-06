import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardMedia,
  Dialog,
  DialogContent,
  IconButton,
  useTheme,
  useMediaQuery,
  Fade,
  Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import FavoriteIcon from '@mui/icons-material/Favorite';

// Import couple photos
import pb1 from '../../assets/couple/pb1.png';
import pb2 from '../../assets/couple/pb2.png';
import pb3 from '../../assets/couple/pb3.png';
import pb4 from '../../assets/couple/pb4.png';
import pb5 from '../../assets/couple/pb5.png';
import pb6 from '../../assets/couple/pb6.png';
import pb7 from '../../assets/couple/pb7.png';

const AlbumSection = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
  padding: '6rem 0 4rem 0',
  [theme.breakpoints.down('md')]: {
    padding: '4rem 0 2rem 0',
  },
}));

const PageTitle = styled(Typography)(({ theme }) => ({
  fontFamily: "'Great Vibes', cursive",
  fontSize: '3.5rem',
  fontWeight: 400,
  textAlign: 'center',
  color: '#8B0000',
  marginBottom: '1rem',
  letterSpacing: '-0.02em',
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
  color: '#666',
  marginBottom: '4rem',
  maxWidth: '600px',
  margin: '0 auto 4rem',
  lineHeight: 1.6,
  fontWeight: 300,
  [theme.breakpoints.down('md')]: {
    fontSize: '1rem',
    marginBottom: '3rem',
  },
}));

const PhotoCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: '0 20px 40px rgba(139, 0, 0, 0.15)',
    '& .photo-overlay': {
      opacity: 1,
    },
  },
}));

const PhotoMedia = styled(CardMedia)({
  height: '300px',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  position: 'relative',
});

const PhotoOverlay = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'linear-gradient(135deg, rgba(139, 0, 0, 0.7) 0%, rgba(139, 0, 0, 0.3) 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0,
  transition: 'opacity 0.3s ease',
  '& .MuiSvgIcon-root': {
    color: '#FFFFFF',
    fontSize: '2rem',
  },
});

const PhotoDate = styled(Chip)({
  position: 'absolute',
  top: '12px',
  right: '12px',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  color: '#8B0000',
  fontFamily: "'Montserrat', sans-serif",
  fontWeight: 500,
  fontSize: '0.75rem',
  backdropFilter: 'blur(10px)',
});

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: 'transparent',
    boxShadow: 'none',
    maxWidth: '90vw',
    maxHeight: '90vh',
  },
}));

const DialogImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  borderRadius: '8px',
});

const NavigationButton = styled(IconButton)({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  color: '#8B0000',
  backdropFilter: 'blur(10px)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  '&.prev': {
    left: '20px',
  },
  '&.next': {
    right: '20px',
  },
});

const CloseButton = styled(IconButton)({
  position: 'absolute',
  top: '20px',
  right: '20px',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  color: '#8B0000',
  backdropFilter: 'blur(10px)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
});

const photos = [
  {
    id: 1,
    src: pb1,
    title: 'Primeiro Encontro',
    date: '2020',
    description: 'O início de uma história de amor',
  },
  {
    id: 2,
    src: pb2,
    title: 'Momentos Especiais',
    date: '2021',
    description: 'Cada dia mais apaixonados',
  },
  {
    id: 3,
    src: pb3,
    title: 'Aventuras Juntos',
    date: '2022',
    description: 'Explorando o mundo lado a lado',
  },
  {
    id: 4,
    src: pb4,
    title: 'Noivado',
    date: '2023',
    description: 'O momento mais especial',
  },
  {
    id: 5,
    src: pb5,
    title: 'Preparativos',
    date: '2024',
    description: 'Construindo nosso futuro',
  },
  {
    id: 6,
    src: pb6,
    title: 'Últimos Momentos',
    date: '2025',
    description: 'Contando os dias para o grande dia',
  },
  {
    id: 7,
    src: pb7,
    title: 'Nossa História',
    date: '2025',
    description: 'Uma jornada de amor e crescimento',
  },
];

const Album: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handlePhotoClick = (index: number) => {
    setCurrentPhotoIndex(index);
    setSelectedPhoto(index);
  };

  const handleClose = () => {
    setSelectedPhoto(null);
  };

  const handlePrevious = () => {
    setCurrentPhotoIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentPhotoIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      handlePrevious();
    } else if (event.key === 'ArrowRight') {
      handleNext();
    } else if (event.key === 'Escape') {
      handleClose();
    }
  };

  return (
    <AlbumSection id="album">
      <Container maxWidth="lg">
        <Fade in timeout={800}>
          <Box>
            <PageTitle>
              Nosso Álbum de Amor
            </PageTitle>
            <PageSubtitle>
              Uma coleção de momentos especiais que contam nossa história de amor, 
              desde o primeiro encontro até os preparativos para o grande dia.
            </PageSubtitle>

            <Grid container spacing={3}>
              {photos.map((photo, index) => (
                <Grid item xs={12} sm={6} md={4} key={photo.id}>
                  <Fade in timeout={800 + index * 100}>
                    <PhotoCard onClick={() => handlePhotoClick(index)}>
                      <PhotoMedia
                        image={photo.src}
                        title={photo.title}
                      />
                      <PhotoOverlay className="photo-overlay">
                        <FavoriteIcon />
                      </PhotoOverlay>
                      <PhotoDate label={photo.date} />
                    </PhotoCard>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Fade>

        <StyledDialog
          open={selectedPhoto !== null}
          onClose={handleClose}
          onKeyDown={handleKeyDown}
          maxWidth={false}
          fullWidth
        >
          <DialogContent sx={{ position: 'relative', padding: 0 }}>
            <CloseButton onClick={handleClose}>
              <CloseIcon />
            </CloseButton>
            
            <NavigationButton
              className="prev"
              onClick={handlePrevious}
              disabled={isMobile}
            >
              <NavigateBeforeIcon />
            </NavigationButton>
            
            <NavigationButton
              className="next"
              onClick={handleNext}
              disabled={isMobile}
            >
              <NavigateNextIcon />
            </NavigationButton>

            <DialogImage
              src={photos[currentPhotoIndex]?.src}
              alt={photos[currentPhotoIndex]?.title}
            />
            
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.7))',
                color: '#FFFFFF',
                padding: '2rem 1rem 1rem',
                textAlign: 'center',
              }}
            >
              <Typography variant="h6" sx={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                {photos[currentPhotoIndex]?.title}
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: "'Montserrat', sans-serif", opacity: 0.8 }}>
                {photos[currentPhotoIndex]?.description}
              </Typography>
            </Box>
          </DialogContent>
        </StyledDialog>
      </Container>
    </AlbumSection>
  );
};

export default Album; 