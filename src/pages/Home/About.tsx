import React from 'react';
import { Box, Typography, Button, Container, Grid, ImageList, ImageListItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import pb1 from '../../assets/couple/pb1.png';
import pb2 from '../../assets/couple/pb2.png';
import pb3 from '../../assets/couple/pb3.png';
import pb4 from '../../assets/couple/pb4.png';
import pb5 from '../../assets/couple/pb5.png';
import pb6 from '../../assets/couple/pb6.png';
import pb7 from '../../assets/couple/pb7.png';

const AboutSection = styled(Box)(({ theme }) => ({
  background: '#fff',
  padding: '4rem 0',
  [theme.breakpoints.down('md')]: {
    padding: '2rem 0',
  },
}));

const Title = styled(Typography)(({ theme }) => ({
  textAlign: 'left',
  fontFamily: "'Great Vibes', cursive",
  fontSize: '3rem',
  fontWeight: 400,
  color: '#b22432',
  marginBottom: theme.spacing(4),
  lineHeight: 1.2,
  paddingLeft: '7vw',
  [theme.breakpoints.down('md')]: {
    fontSize: '2.2rem',
    marginBottom: theme.spacing(2.5),
    paddingLeft: 0,
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.5rem',
    marginBottom: theme.spacing(2),
  },
}));

const AlbumButton = styled(Button)(() => ({
  borderRadius: '30px',
  border: '1px solid #b71c1c',
  color: '#b71c1c',
  padding: '0.3rem 1.5rem',
  textTransform: 'none',
  fontFamily: "'Montserrat', sans-serif",
  fontWeight: 400,
  fontSize: '1rem',
  marginBottom: '2.5rem',
  marginTop: '0.5rem',
  background: 'transparent',
  boxShadow: 'none',
  '&:hover': {
    background: 'rgba(183, 28, 28, 0.04)',
    borderColor: '#8B0000',
    color: '#8B0000',
    boxShadow: 'none',
  },
}));

const IndentedColumn = styled(Box)(({ theme }) => ({
  paddingLeft: '7vw',
  [theme.breakpoints.down('md')]: {
    paddingLeft: 0,
  },
}));

const TextBlock = styled(Box)(() => ({
  maxWidth: 420,
}));

const SectionTitle = styled(Typography)(() => ({
  fontFamily: "'Montserrat', sans-serif",
  fontWeight: 500,
  fontSize: '1.5rem',
  marginBottom: '0.5rem',
  color: '#000',
}));

const SectionTitleSmall = styled(Typography)(() => ({
  fontFamily: "'Montserrat', sans-serif",
  fontWeight: 400,
  fontSize: '1.3rem',
  marginBottom: '0.5rem',
  color: '#000',
}));

const BodyText = styled(Typography)(() => ({
  fontFamily: "'Montserrat', sans-serif",
  color: '#333',
  fontSize: '1rem',
  lineHeight: 1.7,
}));

const ImageBox = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  [theme.breakpoints.down('md')]: {
    justifyContent: 'center',
    marginTop: theme.spacing(4),
  },
}));

const StyledImageList = styled(ImageList)(() => ({
  width: '100%',
  height: 'auto',
  borderRadius: 2,
  overflow: 'hidden',
  gap: '12px !important',
  '& .MuiImageListItem-root': {
    transition: 'all 0.3s ease-in-out',
    cursor: 'pointer',
    borderRadius: '8px',
    overflow: 'hidden',
    display: 'flex !important',
    alignItems: 'stretch !important',
    '&:hover': {
      transform: 'scale(1.05)',
      zIndex: 10,
      boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
    },
  },
  '& .MuiImageListItem-img': {
    transition: 'all 0.3s ease-in-out',
    borderRadius: '8px',
    width: '100% !important',
    height: '100% !important',
    objectFit: 'cover',
    flex: '1 1 auto !important',
    '&:hover': {
      filter: 'brightness(1.1)',
    },
  },
}));

const About: React.FC = () => {
  const navigate = useNavigate();

  const handleAlbumClick = () => {
    navigate('/album');
  };

  return (
    <AboutSection id="about">
      <Container maxWidth="lg">
        <Title variant="h2">
          Si subes a esta hora<br />
          <span style={{ paddingLeft: '13rem' }}>tendrás que quedarte para siempre…</span>
        </Title>
        <AlbumButton variant="outlined" onClick={handleAlbumClick}>
          Álbum
        </AlbumButton>

        <Grid container spacing={4} alignItems="flex-start">
          <Grid item xs={12} md={7}>
            <IndentedColumn>
              <TextBlock>
                <SectionTitle variant="h4">Prólogo</SectionTitle>
                <BodyText paragraph>
                  Essa frase é dita por uma personagem no livro O Amor nos Tempos do Cólera quando o protagonista pergunta se pode subir ao seu apartamento. A fala marcou o relacionamento, pois foi assim que a história do casal começou. Enquanto Gabriel lia o livro de García Márquez, enviava para Thayná cada trecho que lhe brilhava aos olhos — e um dos mais marcantes foi justamente esse.
                </BodyText>
              </TextBlock>
              <TextBlock>
                <Box mt={7}>
                  <SectionTitleSmall variant="h4">E enfim..</SectionTitleSmall>
                  <BodyText>
                    Ela, que já havia lido o livro, subiu ao apartamento dele e nunca mais quis ir embora. Desde então, foram quatro países, sete apartamentos e nenhum dia separados.<br />
                    "Se subir agora, terá que ficar para siempre" saiu do papel e se tornou parte de uma história real que, em outubro, celebrará um de seus capítulos mais importantes — do jeitinho que eles gostam: uma bagunça organizada, um pecado respeitoso, junto das pessoas mais especiais que cruzaram o caminho deles.
                  </BodyText>
                </Box>
              </TextBlock>
            </IndentedColumn>
          </Grid>
          <Grid item xs={12} md={5}>
            <ImageBox>
              <StyledImageList
                variant="quilted"
                cols={3}
                rowHeight={140}
              >
                {itemData.map((item) => (
                  <ImageListItem key={item.img} cols={item.cols || 1} rows={item.rows || 1}>
                    <img
                      {...srcset(item.img, 121, item.rows, item.cols)}
                      alt={item.title}
                      loading="lazy"
                    />
                  </ImageListItem>
                ))}
              </StyledImageList>
            </ImageBox>
          </Grid>
        </Grid>
      </Container>
    </AboutSection>
  );
};

function srcset(image: string, size: number, rows = 1, cols = 1) {
  return {
    src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${size * cols}&h=${
      size * rows
    }&fit=crop&auto=format&dpr=2 2x`,
  };
}

const itemData = [
  {
    img: pb1,
    title: 'Thayná e Gabriel - Momento Especial 1',
    rows: 2,
    cols: 2,
  },
  {
    img: pb2,
    title: 'Thayná e Gabriel - Momento Especial 2',
    rows: 2,
    cols: 1,
  },
  {
    img: pb3,
    title: 'Thayná e Gabriel - Momento Especial 3',
    rows: 1,
    cols: 1,
  },
  {
    img: pb4,
    title: 'Thayná e Gabriel - Momento Especial 4',
    rows: 2,
    cols: 2,
  },
  {
    img: pb5,
    title: 'Thayná e Gabriel - Momento Especial 5',
    rows: 1,
    cols: 1,
  },
  {
    img: pb6,
    title: 'Thayná e Gabriel - Momento Especial 6',
    rows: 2,
    cols: 1,
  },
  {
    img: pb7,
    title: 'Thayná e Gabriel - Momento Especial 7',
    rows: 2,
    cols: 2,
  }
];

export default About; 