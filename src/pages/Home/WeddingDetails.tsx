import React from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import './WeddingDetails.css';
import chandler from '../../assets/dress/chandler.png';
import theodore from '../../assets/dress/theodore.png';
import rachel from '../../assets/dress/rachel.png';
import atonement from '../../assets/dress/atonement.png';

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


const WeddingDetails: React.FC = () => {

  return (
    <WeddingSection id="wedding-details">
      <Container maxWidth="lg">
        <Title>
          Dress Code
        </Title>

        <Grid container spacing={4} alignItems="center" justifyContent="center">
          <Grid item xs={12} md={4}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Typography align="center" sx={{ color: '#666' }}>
              Poderíamos simplesmente descrever como esporte fino, comum para um casamento no fim da tarde, mas isso não nos representaria por completo. Claro que um vestido de festa, um terno e uma calça social serão muito bem-vindos, mas gostaríamos de ver um toque a mais. Não queremos que nossos familiares e amigos desapareçam atrás de uma “roupa obrigatória”; por isso, nossa sugestão é que você acrescente seu toque único ao look.
Por exemplo, se você é alguém que só usa All Star, pode vir de terno e All Star; se gosta de meias coloridas, use-as; se não sai de casa sem uma camisa de time, venha com ela por baixo da camisa social, ou mesmo com algum detalhe do time e por aí vai. 

              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Box
                sx={{
                  width: { xs: '100%', sm: 240 },
                  height: { xs: 360, sm: 427 }, // 9:16 aspect ratio to match Chandler image
                  overflow: 'hidden',
                  boxShadow: '0 4px 24px rgba(178,36,50,0.07)',
                  mb: 2,
                  background: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Swiper
                  spaceBetween={0}
                  slidesPerView={1}
                  loop={true}
                  navigation={true}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                  }}
                  modules={[Navigation, Autoplay]}
                  style={{ width: '100%', height: '100%' }}
                >
                  <SwiperSlide>
                    <Box
                      component="img"
                      src={chandler}
                      alt="Dress code inspiração Chandler"
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </SwiperSlide>
                  <SwiperSlide>
                    <Box
                      component="img"
                      src={theodore}
                      alt="Dress code inspiração Theodore"
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </SwiperSlide>
                  <SwiperSlide>
                    <Box
                      component="img"
                      src={rachel}
                      alt="Dress code inspiração Rachel"
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </SwiperSlide>
                  <SwiperSlide>
                    <Box
                      component="img"
                      src={atonement}
                      alt="Dress code inspiração Atonement"
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </SwiperSlide>
                </Swiper>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Typography align="center" sx={{ color: '#666' }}>
              Queremos enxergar vocês para além das roupas sociais. Queremos que cada um traga um pouco de si, das pessoas que aprendemos a amar. Só assim a festa ficará completa. Esses pequenos detalhes de personalidade, com certeza, renderão boas fotos e risadas. No fim do dia, as histórias que surgirem na festa serão o que mais importa, o que contaremos no futuro.
Mas não se preocupe! Se não conseguir pensar em nada, não tem problema. Siga o esporte fino tradicional, talvez com um toque colorido. No mais, venham bonitos, porque nós estaremos lindos e queremos boas fotos!

            </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </WeddingSection>
  );
};


export default WeddingDetails;