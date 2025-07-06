import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, useMediaQuery } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';

const CountdownSection = styled(Box)(({ theme }) => ({
  padding: '4rem 2rem',
  backgroundColor: '#f8f9fa',
  [theme.breakpoints.down('md')]: {
    padding: '2.5rem 0.5rem',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '1.5rem 0.25rem',
  },
}));

const CountdownContainer = styled(Box)(({ theme }) => ({
  maxWidth: '600px',
  margin: '0 auto',
  [theme.breakpoints.down('md')]: {
    maxWidth: '500px',
  },
  [theme.breakpoints.down('sm')]: {
    maxWidth: '400px',
  },
}));

const Title = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  fontFamily: "'Great Vibes', cursive",
  fontSize: '3rem',
  fontWeight: 400,
  color: '#b22432',
  marginBottom: theme.spacing(4),
  [theme.breakpoints.down('md')]: {
    fontSize: '2.2rem',
    marginBottom: theme.spacing(2.5),
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.5rem',
    marginBottom: theme.spacing(2),
  },
}));

const CountdownGrid = styled(Grid)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(0.5),
  [theme.breakpoints.down('md')]: {
    gap: theme.spacing(0.25),
  },
  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(0.125),
    flexWrap: 'wrap',
  },
}));

const TimeUnitContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '0 4px',
});

const TimeUnitBox = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '80px',
  height: '80px',
  margin: '20px 0',
  [theme.breakpoints.down('md')]: {
    width: '60px',
    height: '60px',
    margin: '14px 0',
  },
  [theme.breakpoints.down('sm')]: {
    width: '40px',
    height: '40px',
    margin: '8px 0',
  },
  '&::before, &::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '40px',
    width: '40px',
    height: '64px',
    background: '#b71c1c',
    borderRadius: '20px 20px 0 0',
    transform: 'rotate(-45deg)',
    transformOrigin: '0 100%',
    [theme.breakpoints.down('md')]: {
      left: '30px',
      width: '30px',
      height: '48px',
      borderRadius: '14px 14px 0 0',
    },
    [theme.breakpoints.down('sm')]: {
      left: '20px',
      width: '20px',
      height: '32px',
      borderRadius: '8px 8px 0 0',
    },
  },
  '&::after': {
    left: 0,
    transform: 'rotate(45deg)',
    transformOrigin: '100% 100%',
  },
}));

const TimeValue = styled(Typography)(({ theme }) => ({
  position: 'absolute',
  top: '35%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 1,
  fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
  fontSize: '1.25rem',
  fontWeight: 300,
  lineHeight: 1,
  color: '#ffffff',
  [theme.breakpoints.down('md')]: {
    fontSize: '1rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.8rem',
  },
}));

const TimeLabel = styled(Typography)(({ theme }) => ({
  fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
  fontSize: '0.75rem',
  fontWeight: 400,
  color: '#616161',
  textTransform: 'uppercase',
  marginTop: theme.spacing(1.5),
  letterSpacing: '0.08em',
  [theme.breakpoints.down('md')]: {
    fontSize: '0.65rem',
    marginTop: theme.spacing(1),
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.6rem',
    marginTop: theme.spacing(0.5),
  },
}));

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const calculateTimeLeft = (): TimeLeft => {
  const weddingDate = new Date('2025-10-11T00:00:00');
  const difference = +weddingDate - +new Date();
  
  if (difference > 0) {
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return { days: 0, hours: 0, minutes: 0, seconds: 0 };
};

const Countdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  const timeUnits = [
    { value: timeLeft.days, label: 'Dias' },
    { value: timeLeft.hours, label: 'Horas' },
    { value: timeLeft.minutes, label: 'Minutos' },
    { value: timeLeft.seconds, label: 'Segundos' },
  ];

  return (
    <CountdownSection id="countdown">
      <Title>
        For me, it was always going to be about love...
      </Title>
      <CountdownContainer>
        <CountdownGrid container wrap={isMobile ? 'wrap' : 'nowrap'} spacing={0}>
          {timeUnits.map((unit) => (
            <Grid item key={unit.label} xs={6} sm={2.5} md={2}>
              <TimeUnitContainer>
                <TimeUnitBox>
                  <TimeValue>
                    {String(unit.value).padStart(2, '0')}
                  </TimeValue>
                </TimeUnitBox>
                <TimeLabel>{unit.label}</TimeLabel>
              </TimeUnitContainer>
            </Grid>
          ))}
        </CountdownGrid>
      </CountdownContainer>
    </CountdownSection>
  );
};

export default Countdown; 