import React from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const WaveContainer = styled(Box)({
  position: 'absolute',
  bottom: 0,
  left: 0,
  width: '100%',
  overflow: 'hidden',
  lineHeight: 0,
  transform: 'rotate(180deg)',
  pointerEvents: 'none',
  zIndex: 10,
});

const BaseWave = styled('svg')({
  position: 'relative',
  display: 'block',
  width: 'calc(100% + 1.3px)',
  height: '70px',
});

const Wave1 = styled(BaseWave)({
  '& path': { fill: '#ffffff', opacity: 0.2 },
});

const Wave2 = styled(BaseWave)({
  position: 'absolute',
  bottom: '30px',
  '& path': { fill: '#ffffff', opacity: 0.3 },
});

const Wave3 = styled(BaseWave)({
  position: 'absolute',
  bottom: '60px',
  '& path': { fill: '#ffffff', opacity: 0.4 },
});

const Wave4 = styled(BaseWave)({
  position: 'absolute',
  bottom: '90px',
  '& path': { fill: '#ffffff', opacity: 0.5 },
});

const Wave5 = styled(BaseWave)({
  position: 'absolute',
  bottom: '120px',
  '& path': { fill: '#ffffff', opacity: 0.5 },
});

const Wave6 = styled(BaseWave)({
  position: 'absolute',
  bottom: '150px',
  '& path': { fill: '#ffffff', opacity: 0.6 },
});

const Footer: React.FC = () => {
  const wavePath1 = "M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z";
  const wavePath2 = "M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z";

  return (
    <WaveContainer>
      <Wave1 xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none"><path d={wavePath1} /></Wave1>
      <Wave2 xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none"><path d={wavePath2} /></Wave2>
      <Wave3 xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none"><path d={wavePath1} /></Wave3>
      <Wave4 xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none"><path d={wavePath2} /></Wave4>
      <Wave5 xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none"><path d={wavePath1} /></Wave5>
      <Wave6 xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none"><path d={wavePath2} /></Wave6>
    </WaveContainer>
  );
};

export default Footer; 