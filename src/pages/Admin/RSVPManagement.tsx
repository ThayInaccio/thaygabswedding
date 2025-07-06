import React, { useState, useEffect } from 'react';
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
  TablePagination,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { rsvpService, findGuestByName, updateRsvp } from '../../services/rsvp.service';
import type { Guest } from '../../services/rsvp.service';

// SealsCRM-inspired backgrounds and shadows
const crmTableBg = '#f8fafd';
const crmShadow = '0 2px 12px 0 rgba(44,62,80,0.06)';

const RSVPContainer = styled(Box)({
  padding: '2.5rem 1.5rem',
  background: crmTableBg,
  minHeight: '100vh',
});

const RSVPTitle = styled(Typography)({
  fontFamily: 'Inter, Montserrat, sans-serif',
  fontWeight: 800,
  fontSize: '2.1rem',
  color: '#222',
  marginBottom: '0.2rem',
  textAlign: 'left',
});

const RSVPSubtitle = styled(Typography)({
  fontFamily: 'Inter, Montserrat, sans-serif',
  fontWeight: 400,
  fontSize: '1.08rem',
  color: '#888',
  marginBottom: '2.2rem',
  textAlign: 'left',
});

const SearchContainer = styled(Box)({
  display: 'flex',
  gap: '1rem',
  marginBottom: '2rem',
  alignItems: 'center',
  maxWidth: '700px',
  marginLeft: 0,
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: '#fafafa',
    '& fieldset': {
      borderColor: '#e0e0e0',
      borderWidth: '1px',
    },
    '&:hover fieldset': {
      borderColor: '#8B0000',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#8B0000',
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#8B0000',
  },
});

const StyledFormControl = styled(FormControl)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: '#fafafa',
    '& fieldset': {
      borderColor: '#e0e0e0',
      borderWidth: '1px',
    },
    '&:hover fieldset': {
      borderColor: '#8B0000',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#8B0000',
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#8B0000',
  },
});

const StyledPaper = styled(Paper)({
  borderRadius: '14px',
  boxShadow: crmShadow,
  overflow: 'hidden',
  border: 'none',
  background: '#fff',
});

const StyledTable = styled(Table)({
  '& .MuiTableCell-head': {
    backgroundColor: '#f4f6fb',
    fontFamily: 'Inter, Montserrat, sans-serif',
    fontWeight: 700,
    fontSize: '0.97rem',
    color: '#222',
    borderBottom: '2px solid #f0f0f0',
    padding: '0.85rem',
  },
  '& .MuiTableCell-body': {
    fontFamily: 'Inter, Montserrat, sans-serif',
    fontSize: '0.97rem',
    color: '#444',
    padding: '0.85rem',
    borderBottom: '1px solid #f4f6fb',
  },
  '& .MuiTableRow-root:hover': {
    backgroundColor: '#f8fafd',
  },
});

const StatusChip = styled(Chip)<{ status: string }>(({ status }) => ({
  fontWeight: 600,
  fontSize: '0.85rem',
  borderRadius: '16px',
  boxShadow: 'none',
  ...(status === 'confirmed' && {
    backgroundColor: '#eafaf1',
    color: '#219150',
    border: 'none',
  }),
  ...(status === 'declined' && {
    backgroundColor: '#fff0f0',
    color: '#d32f2f',
    border: 'none',
  }),
  ...(status === 'pending' && {
    backgroundColor: '#fffbe6',
    color: '#bfa100',
    border: 'none',
  }),
}));

const ActionButton = styled(IconButton)({
  padding: '7px',
  borderRadius: '8px',
  background: '#f4f6fb',
  color: '#555',
  transition: 'all 0.18s',
  '&:hover': {
    background: '#eafaf1',
    color: '#219150',
    transform: 'scale(1.08)',
  },
});

const AddButton = styled(Button)({
  borderRadius: '22px',
  padding: '0.65rem 1.7rem',
  fontFamily: 'Inter, Montserrat, sans-serif',
  fontWeight: 600,
  fontSize: '1rem',
  textTransform: 'none',
  background: '#222',
  color: '#fff',
  boxShadow: crmShadow,
  '&:hover': {
    background: '#444',
    boxShadow: '0 4px 16px rgba(44,62,80,0.10)',
  },
});

const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    borderRadius: '14px',
    boxShadow: '0 8px 32px rgba(44,62,80,0.10)',
  },
});

const DialogTitleStyled = styled(DialogTitle)({
  fontFamily: 'Inter, Montserrat, sans-serif',
  fontWeight: 800,
  fontSize: '1.5rem',
  color: '#222',
  textAlign: 'left',
  paddingBottom: '0.5rem',
});

const RSVPManagement: React.FC = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [filteredGuests, setFilteredGuests] = useState<Guest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [editForm, setEditForm] = useState<Partial<Guest>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addForm, setAddForm] = useState<Partial<Guest>>({
    name: '',
    email: '',
    attending: true,
    numberOfGuests: 1,
    dietaryRestrictions: '',
    message: '',
    confirmed: null,
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  useEffect(() => {
    loadGuests();
  }, []);

  useEffect(() => {
    filterGuests();
  }, [guests, searchTerm, statusFilter]);

  const loadGuests = async () => {
    setLoading(true);
    setError(null);
    try {
      const guestsData = await rsvpService.getAllRSVPs();
      setGuests(guestsData);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar convidados');
      console.error('Error loading guests:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterGuests = () => {
    let filtered = guests;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(guest =>
        guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guest.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(guest => {
        if (statusFilter === 'confirmed') return guest.confirmed === true;
        if (statusFilter === 'declined') return guest.confirmed === false;
        if (statusFilter === 'pending') return guest.confirmed === null;
        return true;
      });
    }

    setFilteredGuests(filtered);
  };

  const handleEditGuest = (guest: Guest) => {
    setSelectedGuest(guest);
    setEditForm({
      name: guest.name,
      email: guest.email,
      attending: guest.attending,
      numberOfGuests: guest.numberOfGuests,
      dietaryRestrictions: guest.dietaryRestrictions,
      message: guest.message,
      confirmed: guest.confirmed,
    });
    setEditDialogOpen(true);
  };

  const handleSaveGuest = async () => {
    if (!selectedGuest) return;

    setLoading(true);
    setError(null);
    try {
      const updatedGuest = await rsvpService.updateRSVP(selectedGuest.id, editForm);
      
      // Update guest in the list
      const updatedGuests = guests.map(guest =>
        guest.id === selectedGuest.id ? updatedGuest : guest
      );

      setGuests(updatedGuests);
      setEditDialogOpen(false);
      setSelectedGuest(null);
      setEditForm({});
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar convidado');
      console.error('Error updating guest:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGuest = async (guestId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este convidado?')) {
      setLoading(true);
      setError(null);
      try {
        await rsvpService.deleteRSVP(guestId);
        const updatedGuests = guests.filter(guest => guest.id !== guestId);
        setGuests(updatedGuests);
      } catch (err: any) {
        setError(err.message || 'Erro ao excluir convidado');
        console.error('Error deleting guest:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const getStatusLabel = (guest: Guest) => {
    if (guest.confirmed === true) return 'Confirmado';
    if (guest.confirmed === false) return 'Recusado';
    return 'Pendente';
  };

  const getStatusColor = (guest: Guest) => {
    if (guest.confirmed === true) return 'confirmed';
    if (guest.confirmed === false) return 'declined';
    return 'pending';
  };

  const handleAddGuest = async () => {
    // Validate required fields
    if (!addForm.name?.trim()) {
      setAddError('Nome é obrigatório');
      return;
    }

    setAddLoading(true);
    setAddError(null);
    try {
      const newGuest = await rsvpService.createRSVP({
        name: addForm.name.trim(),
        email: addForm.email?.trim() || '',
        attending: true, // Default to true since we removed the field
        numberOfGuests: 1, // Default to 1 since we removed the field
        dietaryRestrictions: '', // Default empty since we removed the field
        message: '', // Default empty since we removed the field
        confirmed: addForm.confirmed ?? null,
      });
      setGuests([newGuest, ...guests]);
      setAddDialogOpen(false);
      setAddForm({
        name: '',
        email: '',
        attending: true,
        numberOfGuests: 1,
        dietaryRestrictions: '',
        message: '',
        confirmed: null,
      });
    } catch (err: any) {
      setAddError(err.message || 'Erro ao adicionar convidado');
    } finally {
      setAddLoading(false);
    }
  };

  if (loading && guests.length === 0) {
    return (
      <RSVPContainer>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress sx={{ color: '#8B0000' }} />
        </Box>
      </RSVPContainer>
    );
  }

  return (
    <RSVPContainer>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <RSVPTitle>Gerenciar Convidados</RSVPTitle>
        <RSVPSubtitle>
          Visualize e gerencie os RSVPs dos seus convidados
        </RSVPSubtitle>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
          {error}
        </Alert>
      )}

      <SearchContainer>
        <StyledTextField
          placeholder="Buscar por nome ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#8B0000' }} />
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1 }}
        />
        <StyledFormControl sx={{ minWidth: 180 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">Todos os Status</MenuItem>
            <MenuItem value="pending">Pendente</MenuItem>
            <MenuItem value="confirmed">Confirmado</MenuItem>
            <MenuItem value="declined">Recusado</MenuItem>
          </Select>
        </StyledFormControl>
        <AddButton startIcon={<AddIcon />} onClick={() => setAddDialogOpen(true)}>
          Adicionar
        </AddButton>
      </SearchContainer>

      <StyledPaper>
        <TableContainer>
          <StyledTable>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredGuests
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((guest) => (
                  <TableRow key={guest.id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{guest.name}</TableCell>
                    <TableCell>{guest.email}</TableCell>
                    <TableCell>
                      <StatusChip
                        label={getStatusLabel(guest)}
                        status={getStatusColor(guest)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <ActionButton
                        onClick={() => handleEditGuest(guest)}
                        sx={{ color: '#8B0000', mr: 1 }}
                        disabled={loading}
                      >
                        <EditIcon fontSize="small" />
                      </ActionButton>
                      <ActionButton
                        onClick={() => handleDeleteGuest(guest.id)}
                        sx={{ color: '#f44336' }}
                        disabled={loading}
                      >
                        <DeleteIcon fontSize="small" />
                      </ActionButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </StyledTable>
        </TableContainer>
        <Divider />
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredGuests.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          labelRowsPerPage="Linhas por página:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`
          }
          sx={{
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '0.9rem',
            },
          }}
        />
      </StyledPaper>

      {/* Edit Dialog */}
      <StyledDialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitleStyled>Editar Convidado</DialogTitleStyled>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mt: 1 }}>
            <StyledTextField
              label="Nome"
              value={editForm.name || ''}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              fullWidth
            />
            <StyledTextField
              label="Email"
              value={editForm.email || ''}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              fullWidth
            />
            <StyledFormControl fullWidth>
              <InputLabel>Status de Confirmação</InputLabel>
              <Select
                value={editForm.confirmed === null ? 'pending' : editForm.confirmed ? 'confirmed' : 'declined'}
                label="Status de Confirmação"
                onChange={(e) => {
                  const value = e.target.value;
                  let confirmed: boolean | null = null;
                  if (value === 'confirmed') confirmed = true;
                  else if (value === 'declined') confirmed = false;
                  setEditForm({ ...editForm, confirmed });
                }}
              >
                <MenuItem value="pending">Pendente</MenuItem>
                <MenuItem value="confirmed">Confirmado</MenuItem>
                <MenuItem value="declined">Recusado</MenuItem>
              </Select>
            </StyledFormControl>
            <StyledTextField
              label="Restrições Alimentares"
              value={editForm.dietaryRestrictions || ''}
              onChange={(e) => setEditForm({ ...editForm, dietaryRestrictions: e.target.value })}
              fullWidth
            />
            <StyledTextField
              label="Mensagem"
              value={editForm.message || ''}
              onChange={(e) => setEditForm({ ...editForm, message: e.target.value })}
              fullWidth
              multiline
              rows={3}
              sx={{ gridColumn: '1 / -1' }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={() => setEditDialogOpen(false)} 
            disabled={loading}
            sx={{ 
              fontFamily: "'Montserrat', sans-serif",
              color: '#666',
              '&:hover': { backgroundColor: '#f5f5f5' }
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSaveGuest} 
            variant="contained" 
            sx={{ 
              background: '#8B0000',
              fontFamily: "'Montserrat', sans-serif",
              borderRadius: '25px',
              px: 3,
              '&:hover': { background: '#600000' }
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Salvar'}
          </Button>
        </DialogActions>
      </StyledDialog>

      {/* Add Guest Dialog */}
      <StyledDialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitleStyled>Adicionar Convidado</DialogTitleStyled>
        <DialogContent sx={{ pt: 2 }}>
          {addError && (
            <Alert severity="error" sx={{ mb: 2 }}>{addError}</Alert>
          )}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mt: 1 }}>
            <StyledTextField
              label="Nome *"
              value={addForm.name || ''}
              onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
              fullWidth
              required
            />
            <StyledTextField
              label="Email"
              value={addForm.email || ''}
              onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
              fullWidth
            />
            <StyledFormControl fullWidth>
              <InputLabel>Status de Confirmação</InputLabel>
              <Select
                value={addForm.confirmed === null ? 'pending' : addForm.confirmed ? 'confirmed' : 'declined'}
                label="Status de Confirmação"
                onChange={(e) => {
                  const value = e.target.value;
                  let confirmed: boolean | null = null;
                  if (value === 'confirmed') confirmed = true;
                  else if (value === 'declined') confirmed = false;
                  setAddForm({ ...addForm, confirmed });
                }}
              >
                <MenuItem value="pending">Pendente</MenuItem>
                <MenuItem value="confirmed">Confirmado</MenuItem>
                <MenuItem value="declined">Recusado</MenuItem>
              </Select>
            </StyledFormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={() => setAddDialogOpen(false)} 
            disabled={addLoading}
            sx={{ 
              fontFamily: "'Montserrat', sans-serif",
              color: '#666',
              '&:hover': { backgroundColor: '#f5f5f5' }
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleAddGuest} 
            variant="contained" 
            sx={{ 
              background: '#8B0000',
              fontFamily: "'Montserrat', sans-serif",
              borderRadius: '25px',
              px: 3,
              '&:hover': { background: '#600000' }
            }}
            disabled={addLoading}
          >
            {addLoading ? <CircularProgress size={20} color="inherit" /> : 'Adicionar'}
          </Button>
        </DialogActions>
      </StyledDialog>
    </RSVPContainer>
  );
};

export default RSVPManagement; 