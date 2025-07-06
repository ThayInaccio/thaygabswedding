import React, { Suspense, lazy } from 'react';
import { Box, Typography, Container, useTheme, useMediaQuery, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import backgroundImage from '../../assets/background.png';
import Footer from '../../components/Layout/Footer';

// Lazy load non-critical sections
const About = lazy(() => import('./About'));
const Countdown = lazy(() => import('./Countdown'));
const RSVP = lazy(() => import('../../pages/RSVP/RSVP'));
const WeddingDetails = lazy(() => import('./WeddingDetails'));

const HeroSection = styled(Box)(() => ({
  position: 'relative',
  minHeight: '100vh',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(139, 0, 0, 0.3)',
  },
}));

const ContentWrapper = styled(Container)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  padding: '2rem',
  textAlign: 'center',
  maxWidth: '1000px',
  height: '100vh',
  paddingTop: '67vh',
  [theme.breakpoints.down('sm')]: {
    padding: '1rem',
    paddingTop: '60vh',
  },
}));

const Names = styled(Typography)(({ theme }) => ({
  fontFamily: "'Great Vibes', cursive",
  fontSize: '5.5rem',
  textAlign: 'center',
  position: 'relative',
  zIndex: 2,
  marginBottom: '0.5rem',
  textShadow: '3px 3px 6px rgba(0,0,0,0.4)',
  padding: '0 1rem',
  color: '#FFFFFF',
  letterSpacing: '0.05em',
  lineHeight: 1.2,
  fontWeight: 400,
  [theme.breakpoints.down('lg')]: {
    fontSize: '5rem',
  },
  [theme.breakpoints.down('md')]: {
    fontSize: '4rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '3rem',
    marginBottom: '0.3rem',
    padding: '0 0.5rem',
  },
}));

const Divider = styled('div')(({ theme }) => ({
  width: '80px',
  height: '1px',
  backgroundColor: '#FFFFFF',
  margin: '0.8rem auto',
  opacity: 0.8,
  [theme.breakpoints.down('sm')]: {
    width: '60px',
    margin: '0.5rem auto',
  },
}));

const Date = styled(Typography)(({ theme }) => ({
  fontFamily: "'Montserrat', sans-serif",
  fontSize: '1.2rem',
  textAlign: 'center',
  position: 'relative',
  zIndex: 2,
  letterSpacing: '0.4em',
  padding: '0 1rem',
  color: '#FFFFFF',
  textTransform: 'uppercase',
  fontWeight: 200,
  [theme.breakpoints.down('md')]: {
    fontSize: '1rem',
    letterSpacing: '0.3em',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.8rem',
    letterSpacing: '0.25em',
    padding: '0 0.5rem',
  },
}));

const ScrollIndicator = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: '40px',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  color: '#FFFFFF',
  opacity: 0.8,
  animation: 'bounce 2s infinite',
  '@keyframes bounce': {
    '0%, 20%, 50%, 80%, 100%': {
      transform: 'translateY(0)',
    },
    '40%': {
      transform: 'translateY(-10px)',
    },
    '60%': {
      transform: 'translateY(-5px)',
    },
  },
  '& svg': {
    width: '24px',
    height: '24px',
  },
  [theme.breakpoints.down('sm')]: {
    bottom: '20px',
    '& svg': {
      width: '20px',
      height: '20px',
    },
  },
}));

const LoadingSection = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '50vh',
  padding: '2rem',
});

const Home: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <HeroSection>
        <ContentWrapper maxWidth={false}>
          <Names variant="h1">
            Thayná & Gabriel
          </Names>
          <Divider />
          <Date>
            11 · 10 · 2025
          </Date>
        </ContentWrapper>
        {!isMobile && (
          <ScrollIndicator>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
            </svg>
          </ScrollIndicator>
        )}
        <Footer />
      </HeroSection>
      
      <Suspense fallback={<LoadingSection><CircularProgress /></LoadingSection>}>
        <Countdown />
      </Suspense>
      
      <Suspense fallback={<LoadingSection><CircularProgress /></LoadingSection>}>
        <RSVP />
      </Suspense>
      
      <Suspense fallback={<LoadingSection><CircularProgress /></LoadingSection>}>
        <About />
      </Suspense>
      
      <Suspense fallback={<LoadingSection><CircularProgress /></LoadingSection>}>
        <WeddingDetails />
      </Suspense>
      
      <Footer />
    </>
  );
};

export default Home; 