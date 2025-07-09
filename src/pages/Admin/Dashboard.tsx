import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PeopleIcon from '@mui/icons-material/People';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EventIcon from '@mui/icons-material/Event';
import RedeemIcon from '@mui/icons-material/Redeem';
import { rsvpService, type GuestStats } from '../../services/rsvp.service';
import { fetchAllPurchases } from '../../services/api';
import { getAllGifts } from '../../services/gifts.service';

const DashboardContainer = styled(Box)({
  width: '100%',
});


const crmShadow = '0 2px 12px 0 rgba(44,62,80,0.06)';

// Update StatsCard for SealsCRM style
const StatsCard = styled(Card)<{ bgcolor?: string }>(({ bgcolor }) => ({
  borderRadius: 16,
  boxShadow: crmShadow,
  border: 'none',
  background: bgcolor || '#fff',
  padding: 0,
  minHeight: 140,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  transition: 'box-shadow 0.2s',
  '&:hover': {
    boxShadow: '0 4px 24px 0 rgba(44,62,80,0.10)',
  },
}));

const StatsCardContent = styled(CardContent)({
  padding: '1.5rem 1.5rem 1.2rem 1.5rem',
  textAlign: 'center',
  width: '100%',
});

const StatsIcon = styled(Avatar)({
  width: 44,
  height: 44,
  margin: '0 auto 0.5rem auto',
  background: '#f6f8fb',
  color: '#3a3a3a',
  boxShadow: '0 2px 8px rgba(44,62,80,0.04)',
});

const StatsValue = styled(Typography)({
  fontFamily: 'Inter, Montserrat, sans-serif',
  fontWeight: 800,
  fontSize: '2.2rem',
  color: '#222',
  marginBottom: '0.2rem',
  lineHeight: 1.1,
});

const StatsLabel = styled(Typography)({
  fontFamily: 'Inter, Montserrat, sans-serif',
  fontWeight: 600,
  fontSize: '1.05rem',
  color: '#555',
  marginBottom: '0.2rem',
});

const StatsDescription = styled(Typography)({
  fontFamily: 'Inter, Montserrat, sans-serif',
  fontSize: '0.92rem',
  color: '#888',
  marginBottom: 0,
});

const ProgressCard = styled(Card)({
  borderRadius: '20px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
  border: '1px solid #f0f0f0',
  background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
});

const ProgressCardContent = styled(CardContent)({
  padding: '2rem',
});

const ProgressTitle = styled(Typography)({
  fontFamily: "'Montserrat', sans-serif",
  fontWeight: 600,
  fontSize: '1.2rem',
  color: '#333',
  marginBottom: '1.5rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
});

const ProgressItem = styled(Box)({
  marginBottom: '1.5rem',
});

const ProgressLabel = styled(Typography)({
  fontFamily: "'Montserrat', sans-serif",
  fontSize: '0.9rem',
  color: '#555',
  marginBottom: '0.5rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const StyledLinearProgress = styled(LinearProgress)({
  height: '8px',
  borderRadius: '4px',
  backgroundColor: '#f0f0f0',
  '& .MuiLinearProgress-bar': {
    borderRadius: '4px',
    background: 'linear-gradient(90deg, #8B0000 0%, #b22432 100%)',
  },
});

const RecentActivityCard = styled(Card)({
  borderRadius: '20px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
  border: '1px solid #f0f0f0',
  background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
});

const RecentActivityContent = styled(CardContent)({
  padding: '2rem',
});

const ActivityTitle = styled(Typography)({
  fontFamily: "'Montserrat', sans-serif",
  fontWeight: 600,
  fontSize: '1.2rem',
  color: '#333',
  marginBottom: '1.5rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
});

const ActivityItem = styled(ListItem)({
  padding: '1rem 0',
  borderBottom: '1px solid #f0f0f0',
  '&:last-child': {
    borderBottom: 'none',
  },
});

const ActivityAvatar = styled(Avatar)({
  width: '40px',
  height: '40px',
  background: 'linear-gradient(135deg, #8B0000 0%, #b22432 100%)',
});

const ActivityText = styled(Typography)({
  fontFamily: "'Montserrat', sans-serif",
  fontSize: '0.9rem',
  color: '#333',
});

const StatusChip = styled(Chip)({
  fontFamily: "'Montserrat', sans-serif",
  fontWeight: 500,
  fontSize: '0.75rem',
  height: '24px',
});

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<GuestStats>({
    totalGuests: 0,
    confirmedGuests: 0,
    declinedGuests: 0,
    pendingGuests: 0,
    totalRSVPs: 0,
    confirmedRSVPs: 0,
    declinedRSVPs: 0,
    pendingRSVPs: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalConfirmed, setTotalConfirmed] = useState(0);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [lastLoad, setLastLoad] = useState<number>(0);

  useEffect(() => {
    loadStats();
    Promise.all([
      fetchAllPurchases(),
      rsvpService.getAllRSVPs(),
      getAllGifts()
    ]).then(([purchases, guests, _]) => {
      const confirmedPurchases = purchases
        .filter((p: any) => p.status === 'confirmed')
        .sort((a: any, b: any) => new Date(b.confirmed_at || b.created_at).getTime() - new Date(a.confirmed_at || a.created_at).getTime())
        .slice(0, 5)
        .map((p: any) => ({
          type: 'purchase',
          label: `Compra de presente por: ${guests.find((g: any) => g.id === p.guest_id)?.name || 'Convidado'}`,
        }));
      const guestConfirmations = guests
        .filter((g: any) => g.confirmed === true)
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5)
        .map((g: any) => ({
          type: 'guest',
          label: `Confirmação de presença: ${g.name}`,
        }));
      setRecentActivities([...confirmedPurchases, ...guestConfirmations]
        .sort(() => 0) // keep order as is
        .slice(0, 8));
      // Total confirmed
      const total = purchases
        .filter((p: any) => p.status === 'confirmed')
        .reduce((sum: number, p: any) => sum + Number(p.price), 0);
      setTotalConfirmed(total);
    });
  }, []);

  const loadStats = async () => {
    const now = Date.now();
    if (now - lastLoad < 10000) { // 10 seconds cooldown
      setError('Por favor, aguarde antes de recarregar as estatísticas.');
      return;
    }
    setLastLoad(now);
    try {
      setLoading(true);
      setError(null);
      const guestStats = await rsvpService.getGuestStats();
      setStats(guestStats);
    } catch (error) {
      console.error('Error loading stats:', error);
      setError('Erro ao carregar estatísticas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const getConfirmationRate = () => {
    return stats.totalGuests > 0 ? (stats.confirmedGuests / stats.totalGuests) * 100 : 0;
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh',
        }}
      >
        <CircularProgress size={60} sx={{ color: '#8B0000' }} />
      </Box>
    );
  }

  return (
    <DashboardContainer>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Main Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatsCard>
            <StatsCardContent>
              <StatsIcon>
                <PeopleIcon sx={{ fontSize: '2rem' }} />
              </StatsIcon>
              <StatsValue>{stats.totalRSVPs ?? 0}</StatsValue>
              <StatsLabel>Convidados</StatsLabel>
              <StatsDescription>Total de convidados</StatsDescription>
              <Chip 
                label={`${getConfirmationRate().toFixed(0)}% confirmados`}
                color="success"
                size="small"
                sx={{ fontWeight: 600 }}
              />
            </StatsCardContent>
          </StatsCard>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatsCard>
            <StatsCardContent>
              <StatsIcon>
                <CheckCircleIcon sx={{ fontSize: '2rem' }} />
              </StatsIcon>
              <StatsValue>{stats.confirmedGuests ?? 0}</StatsValue>
              <StatsLabel>Confirmados</StatsLabel>
              <StatsDescription>Convidados confirmados</StatsDescription>
              <Chip 
                label={`${stats.pendingGuests ?? 0} pendentes`}
                color="warning"
                size="small"
                sx={{ fontWeight: 600 }}
              />
            </StatsCardContent>
          </StatsCard>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatsCard>
            <StatsCardContent>
              <StatsIcon>
                <RedeemIcon sx={{ fontSize: '2rem', color: '#219150' }} />
              </StatsIcon>
              <StatsValue>
                R$ {totalConfirmed.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </StatsValue>
              <StatsLabel>Total Recebido</StatsLabel>
              <StatsDescription>Presentes confirmados</StatsDescription>
            </StatsCardContent>
          </StatsCard>
        </Grid>
      </Grid>

      {/* Progress and Activity Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <ProgressCard>
            <ProgressCardContent>
              <ProgressTitle>
                <TrendingUpIcon sx={{ color: '#8B0000' }} />
                Progresso Geral
              </ProgressTitle>
              
              <ProgressItem>
                <ProgressLabel>
                  <span>Confirmações de Convidados</span>
                  <span>{getConfirmationRate().toFixed(0)}%</span>
                </ProgressLabel>
                <StyledLinearProgress 
                  variant="determinate" 
                  value={getConfirmationRate()} 
                />
              </ProgressItem>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Convidados por Status
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <StatusChip 
                  label={`${stats.confirmedGuests} Confirmados`}
                  sx={{ backgroundColor: '#e8f5e8', color: '#2e7d32' }}
                />
                <StatusChip 
                  label={`${stats.pendingGuests ?? 0} Pendentes`}
                  sx={{ backgroundColor: '#fff3e0', color: '#ef6c00' }}
                />
                <StatusChip 
                  label={`${stats.declinedGuests} Recusados`}
                  sx={{ backgroundColor: '#ffebee', color: '#c62828' }}
                />
              </Box>
            </ProgressCardContent>
          </ProgressCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <RecentActivityCard>
            <RecentActivityContent>
              <ActivityTitle>
                <EventIcon sx={{ color: '#8B0000' }} /> Atividades Recentes
              </ActivityTitle>
              <List>
                {recentActivities.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">Nenhuma atividade recente.</Typography>
                ) : (
                  recentActivities.map((activity, idx) => (
                    <ActivityItem key={idx}>
                      <ActivityAvatar>
                        {activity.type === 'purchase' ? <RedeemIcon /> : <CheckCircleIcon />}
                      </ActivityAvatar>
                      <ListItemText
                        primary={<ActivityText>{activity.label}</ActivityText>}
                      />
                    </ActivityItem>
                  ))
                )}
              </List>
            </RecentActivityContent>
          </RecentActivityCard>
        </Grid>
      </Grid>
    </DashboardContainer>
  );
};

export default Dashboard; 