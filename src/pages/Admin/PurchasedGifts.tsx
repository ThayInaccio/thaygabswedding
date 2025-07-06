import React, { useEffect, useState } from 'react';
import { fetchAllPurchases } from '../../services/api';
import { getAllGifts } from '../../services/gifts.service';
import { rsvpService } from '../../services/rsvp.service';
import api from '../../services/api';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const Container = styled(Box)({
  padding: '2.5rem 1.5rem',
  background: '#f8fafd',
  minHeight: '100vh',
});

const Title = styled(Typography)({
  fontFamily: 'Inter, Montserrat, sans-serif',
  fontWeight: 800,
  fontSize: '2.1rem',
  color: '#222',
  marginBottom: '2rem',
  textAlign: 'left',
});

const StatusChip = styled(Chip)<{ $status: string }>(({ $status }) => ({
  fontWeight: 600,
  fontSize: '0.85rem',
  borderRadius: '16px',
  ...($status === 'waiting_confirmation' && {
    backgroundColor: '#fffbe6',
    color: '#bfa100',
  }),
  ...($status === 'confirmed' && {
    backgroundColor: '#eafaf1',
    color: '#219150',
  }),
  ...($status === 'rejected' && {
    backgroundColor: '#ffebee',
    color: '#c62828',
  }),
}));

const PurchasedGifts: React.FC = () => {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [gifts, setGifts] = useState<any[]>([]);
  const [guests, setGuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [purchaseData, giftData, guestData] = await Promise.all([
          fetchAllPurchases(),
          getAllGifts(),
          rsvpService.getAllRSVPs(),
        ]);
        setPurchases(purchaseData);
        setGifts(giftData);
        setGuests(guestData);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar compras');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const getGiftName = (gift_id: string) => gifts.find((g) => g.id === gift_id)?.name || 'Presente';
  const getGuestName = (guest_id: string) => guests.find((g) => g.id === guest_id)?.name || 'Convidado';

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await api.patch(`/purchases/${id}/status`, { status });
      // Refresh purchases
      const updated = await fetchAllPurchases();
      setPurchases(updated);
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar status');
    }
  };

  const totalConfirmed = purchases
    .filter((p) => p.status === 'confirmed')
    .reduce((sum, p) => sum + Number(p.price), 0);

  return (
    <Container>
      <Title>Presentes Comprados</Title>
      <Typography variant="h6" sx={{ mb: 3, color: '#219150', fontWeight: 700 }}>
        Total recebido (confirmados): R$ {totalConfirmed.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: '14px', boxShadow: '0 2px 12px 0 rgba(44,62,80,0.06)' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Presente</TableCell>
                <TableCell>Convidado</TableCell>
                <TableCell>Preço</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Data</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {purchases.map((purchase) => (
                <TableRow key={purchase.id}>
                  <TableCell>{getGiftName(purchase.gift_id)}</TableCell>
                  <TableCell>{getGuestName(purchase.guest_id)}</TableCell>
                  <TableCell>R$ {Number(purchase.price).toFixed(2)}</TableCell>
                  <TableCell><StatusChip label={purchase.status} $status={purchase.status} /></TableCell>
                  <TableCell>{new Date(purchase.created_at).toLocaleString('pt-BR')}</TableCell>
                  {purchase.status === 'waiting_confirmation' && (
                    <TableCell>
                      <Button variant="contained" color="success" size="small" sx={{ mr: 1 }} onClick={() => handleStatusChange(purchase.id, 'confirmed')}>Confirmar</Button>
                      <Button variant="outlined" color="error" size="small" onClick={() => handleStatusChange(purchase.id, 'rejected')}>Rejeitar</Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default PurchasedGifts; 