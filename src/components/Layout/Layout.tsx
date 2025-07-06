import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import Header from './Header';

// Lazy load components
const Home = React.lazy(() => import('../../pages/Home/Home'));
const RSVPPage = React.lazy(() => import('../../pages/RSVP/RSVP'));
const WeddingDetails = React.lazy(() => import('../../pages/Home/WeddingDetails'));
const Gifts = React.lazy(() => import('../../pages/Gifts/Gifts'));
const Album = React.lazy(() => import('../../pages/Album/Album'));

const LayoutContainer = styled(Box)({
  minHeight: '100vh',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
});

const MainContent = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
});

const LoadingFallback = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '50vh',
});

const Layout: React.FC = () => {
  return (
    <LayoutContainer>
      <Header />
      <MainContent>
        <Suspense fallback={
          <LoadingFallback>
            <CircularProgress size={60} sx={{ color: '#8B0000' }} />
          </LoadingFallback>
        }>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/rsvp" element={<RSVPPage />} />
            <Route path="/wedding" element={<WeddingDetails />} />
            <Route path="/gifts" element={<Gifts />} />
            <Route path="/album" element={<Album />} />
          </Routes>
        </Suspense>
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout; 