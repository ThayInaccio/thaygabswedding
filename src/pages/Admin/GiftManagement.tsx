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
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  Avatar,
  Card,
  CardMedia,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ImageIcon from '@mui/icons-material/Image';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import * as giftService from '../../services/gifts.service';
import { uploadImage } from '../../services/api';
import { compressImage, isFileTooLarge, getFileSizeMB } from '../../utils/imageOptimizer';
import type { Gift } from '../../types';
import AdminButton from '../../components/common/AdminButton';

// SealsCRM-inspired backgrounds and shadows
const crmTableBg = '#f8fafd';
const crmShadow = '0 2px 12px 0 rgba(44,62,80,0.06)';

const GiftContainer = styled(Box)({
  padding: '2.5rem 1.5rem',
  background: crmTableBg,
  minHeight: '100vh',
});

const GiftTitle = styled(Typography)({
  fontFamily: 'Inter, Montserrat, sans-serif',
  fontWeight: 800,
  fontSize: '2.1rem',
  color: '#222',
  marginBottom: '0.2rem',
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
});

const StyledTableRow = styled(TableRow)<{ $even?: boolean }>(({ $even }) => ({
  backgroundColor: $even ? '#f8fafd' : '#fff',
  transition: 'background 0.18s',
  '&:hover': {
    backgroundColor: '#eafaf1',
  },
}));

const StatusChip = styled(Chip)<{ status: string }>(({ status }) => ({
  fontWeight: 600,
  fontSize: '0.85rem',
  borderRadius: '16px',
  boxShadow: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: '0.3em',
  ...(status === 'available' && {
    backgroundColor: '#eafaf1',
    color: '#219150',
    border: 'none',
  }),
  ...(status === 'reserved' && {
    backgroundColor: '#fffbe6',
    color: '#bfa100',
    border: 'none',
  }),
  ...(status === 'purchased' && {
    backgroundColor: '#f5f0ff',
    color: '#6c63ff',
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
    padding: '1.5rem 1.5rem 1rem 1.5rem',
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

const ImagePreview = styled(Card)({
  width: 100,
  height: 100,
  margin: '1rem 0',
  border: '2px dashed #ddd',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: '#8B0000',
    backgroundColor: '#fafafa',
  },
});

const UploadButton = styled(Button)({
  marginTop: '1rem',
  backgroundColor: '#8B0000',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#600000',
  },
});

const HiddenInput = styled('input')({
  display: 'none',
});

// Styled input components from guests page
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

const GiftManagement: React.FC = () => {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [filteredGifts, setFilteredGifts] = useState<Gift[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [editForm, setEditForm] = useState<Partial<Gift>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Add gift state
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addForm, setAddForm] = useState<Partial<Gift>>({
    name: '',
    description: '',
    price: 0,
    image_url: '',
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [addImagePreview, setAddImagePreview] = useState<string | null>(null);
  const [addUploadingImage, setAddUploadingImage] = useState(false);

  // Debug image preview changes
  useEffect(() => {
    console.log('Image preview changed:', imagePreview);
  }, [imagePreview]);

  // Debug uploaded image URL changes
  useEffect(() => {
    console.log('Uploaded image URL changed:', uploadedImageUrl);
  }, [uploadedImageUrl]);

  useEffect(() => {
    loadGifts();
  }, []);

  useEffect(() => {
    filterGifts();
  }, [gifts, searchTerm, statusFilter]);

  const loadGifts = async () => {
    try {
      setLoading(true);
      setError(null);
      const giftsData = await giftService.getAllGifts();
      setGifts(giftsData);
    } catch (error) {
      console.error('Error loading gifts:', error);
      setError('Erro ao carregar presentes. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const filterGifts = () => {
    let filtered = gifts;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(gift =>
        gift.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gift.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      if (statusFilter === 'available') {
        filtered = filtered.filter(gift => !gift.is_reserved);
      } else if (statusFilter === 'reserved') {
        filtered = filtered.filter(gift => gift.is_reserved);
      }
    }

    setFilteredGifts(filtered);
  };

  const handleEditGift = (gift: Gift) => {
    setSelectedGift(gift);
    setEditForm({
      name: gift.name,
      description: gift.description,
      price: gift.price,
      image_url: gift.image_url,
    });
    setImagePreview(gift.image_url || null);
    setUploadedImageUrl(gift.image_url || null);
    setEditDialogOpen(true);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log('Edit image upload triggered:', file);
    
    if (file) {
      try {
        setUploadingImage(true);
        setError(null);
        
        console.log('File details:', {
          name: file.name,
          size: file.size,
          type: file.type
        });
        
        // Check original file size
        if (isFileTooLarge(file)) {
          setError(`Arquivo muito grande (${getFileSizeMB(file).toFixed(1)}MB). Máximo permitido: 5MB.`);
          return;
        }
        
        // Compress image
        console.log('Compressing image...');
        const compressedFile = await compressImage(file);
        console.log('Image compressed:', compressedFile);
        
        // Upload image
        console.log('Uploading image...');
        const uploadResult = await uploadImage(compressedFile);
        console.log('Upload result:', uploadResult);
        
        console.log('Setting image preview to:', uploadResult.url);
        setImagePreview(uploadResult.url);
        setUploadedImageUrl(uploadResult.url);
        setEditForm({ ...editForm, image_url: uploadResult.url });
        console.log('Image preview and form updated');
      } catch (error) {
        console.error('Error uploading image:', error);
        setError(`Erro ao enviar imagem: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      } finally {
        setUploadingImage(false);
      }
    } else {
      console.log('No file selected');
    }
  };

  const handleSaveGift = async () => {
    if (!selectedGift) return;

    try {
      setUploadingImage(true);
      const updatedGift = await giftService.updateGift(selectedGift.id, editForm);
      setGifts(gifts.map(gift =>
        gift.id === selectedGift.id ? updatedGift : gift
      ));
      setEditDialogOpen(false);
      setSelectedGift(null);
      setEditForm({});
      setImagePreview(null);
      setUploadedImageUrl(null);
    } catch (error) {
      console.error('Error updating gift:', error);
      setError('Erro ao atualizar presente. Tente novamente.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteGift = async (giftId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este presente?')) {
      return;
    }

    try {
      await giftService.deleteGift(giftId);
      setGifts(gifts.filter(gift => gift.id !== giftId));
    } catch (error) {
      console.error('Error deleting gift:', error);
      setError('Erro ao excluir presente. Tente novamente.');
    }
  };

  const getStatusLabel = (gift: Gift) => {
    if (gift.is_reserved) {
      return 'Reservado';
    }
    return 'Disponível';
  };

  const getStatusColor = (gift: Gift) => {
    if (gift.is_reserved) {
      return 'reserved';
    }
    return 'available';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return '-';
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString('pt-BR');
  };

  const handleAddGift = async () => {
    // Validate required fields
    if (!addForm.name?.trim() || !addForm.description?.trim() || !addForm.price) {
      setAddError('Nome, descrição e preço são obrigatórios');
      return;
    }

    if (addForm.price <= 0) {
      setAddError('Preço deve ser maior que zero');
      return;
    }

    setAddLoading(true);
    setAddError(null);
    try {
      const newGift = await giftService.addGift({
        name: addForm.name.trim(),
        description: addForm.description.trim(),
        price: addForm.price,
        image_url: addForm.image_url || '',
        is_reserved: false,
      });
      setGifts([newGift, ...gifts]);
      setAddDialogOpen(false);
      setAddForm({
        name: '',
        description: '',
        price: 0,
        image_url: '',
      });
      setAddImagePreview(null);
    } catch (err: any) {
      setAddError(err.message || 'Erro ao adicionar presente');
    } finally {
      setAddLoading(false);
    }
  };

  const handleAddImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log('Add image upload triggered:', file);
    
    if (file) {
      try {
        setAddUploadingImage(true);
        setAddError(null);
        
        console.log('File details:', {
          name: file.name,
          size: file.size,
          type: file.type
        });
        
        // Check original file size
        if (isFileTooLarge(file)) {
          setAddError(`Arquivo muito grande (${getFileSizeMB(file).toFixed(1)}MB). Máximo permitido: 5MB.`);
          return;
        }
        
        // Compress image
        console.log('Compressing image...');
        const compressedFile = await compressImage(file);
        console.log('Image compressed:', compressedFile);
        
        // Upload image
        console.log('Uploading image...');
        const uploadResult = await uploadImage(compressedFile);
        console.log('Upload result:', uploadResult);
        
        setAddImagePreview(uploadResult.url);
        setAddForm({ ...addForm, image_url: uploadResult.url });
      } catch (error) {
        console.error('Error uploading image:', error);
        setAddError(`Erro ao enviar imagem: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      } finally {
        setAddUploadingImage(false);
      }
    } else {
      console.log('No file selected');
    }
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
    <GiftContainer>
      <GiftTitle>Gerenciamento de Presentes</GiftTitle>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <SearchContainer>
        <StyledTextField
          label="Buscar presentes"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1 }}
        />

        <StyledFormControl sx={{ minWidth: 200 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="available">Disponíveis</MenuItem>
            <MenuItem value="reserved">Reservados</MenuItem>
          </Select>
        </StyledFormControl>

        <AdminButton startIcon={<AddIcon />} onClick={() => setAddDialogOpen(true)}>
          Adicionar Presente
        </AdminButton>
      </SearchContainer>

      <TableContainer component={StyledPaper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Imagem</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Preço</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Reservado por</TableCell>
              <TableCell>Data de Criação</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredGifts
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((gift, index) => (
                <StyledTableRow $even={index % 2 === 0} key={gift.id}>
                  <TableCell>
                    {gift.image_url ? (
                      <Avatar
                        src={gift.image_url}
                        alt={gift.name}
                        sx={{ width: 50, height: 50 }}
                      />
                    ) : (
                      <Avatar sx={{ width: 50, height: 50, bgcolor: '#f0f0f0' }}>
                        <ImageIcon />
                      </Avatar>
                    )}
                  </TableCell>
                  <TableCell>{gift.name}</TableCell>
                  <TableCell>{gift.description}</TableCell>
                  <TableCell>{formatPrice(gift.price)}</TableCell>
                  <TableCell>
                    <StatusChip
                      label={getStatusLabel(gift)}
                      status={getStatusColor(gift)}
                    />
                  </TableCell>
                  <TableCell>{gift.reserved_by || '-'}</TableCell>
                  <TableCell>{formatDate(gift.created_at)}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleEditGift(gift)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteGift(gift.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredGifts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Editar Presente</DialogTitle>
        <DialogContent>
          <StyledTextField
            fullWidth
            label="Nome"
            value={editForm.name || ''}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            margin="normal"
          />
          <StyledTextField
            fullWidth
            label="Descrição"
            value={editForm.description || ''}
            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            margin="normal"
            multiline
            rows={3}
          />
          <StyledTextField
            fullWidth
            label="Preço"
            type="number"
            value={editForm.price || ''}
            onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) })}
            margin="normal"
          />
          
          {/* Image Upload Section */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Imagem do Presente
            </Typography>
            
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Formatos aceitos: JPG, PNG, GIF. Tamanho máximo: 5MB. As imagens serão automaticamente otimizadas.
            </Typography>
            
            {/* Image Preview */}
            <ImagePreview onClick={() => {
              console.log('Image preview clicked, triggering file input...');
              const fileInput = document.getElementById('image-upload') as HTMLInputElement;
              if (fileInput) {
                console.log('File input found, clicking...');
                fileInput.click();
              } else {
                console.error('File input not found!');
              }
            }}>
              {imagePreview ? (
                <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                  <CardMedia
                    component="img"
                    image={imagePreview}
                    alt="Preview"
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {uploadedImageUrl && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'success.main',
                        color: 'white',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}
                    >
                      Enviado
                    </Box>
                  )}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center' }}>
                  <CloudUploadIcon sx={{ fontSize: 40, color: '#ccc' }} />
                  <Typography variant="body2" color="textSecondary">
                    Clique para adicionar imagem
                  </Typography>
                </Box>
              )}
            </ImagePreview>

            {/* Upload Button */}
            <Box sx={{ display: 'inline-block', mb: 2 }}>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              <AdminButton
                variant="contained"
                startIcon={uploadingImage ? <CircularProgress size={16} color="inherit" /> : <CloudUploadIcon />}
                disabled={uploadingImage}
                onClick={() => {
                  console.log('Upload button clicked, triggering file input...');
                  const fileInput = document.getElementById('image-upload') as HTMLInputElement;
                  if (fileInput) {
                    console.log('File input found, clicking...');
                    fileInput.click();
                  } else {
                    console.error('File input not found!');
                  }
                }}
                sx={{ cursor: 'pointer', mr: 1 }}
              >
                {uploadingImage ? 'Enviando...' : 'Escolher Imagem'}
              </AdminButton>
              {uploadedImageUrl && (
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => {
                    setUploadedImageUrl(null);
                    setImagePreview(null);
                    setEditForm({ ...editForm, image_url: '' });
                  }}
                  sx={{ ml: 1 }}
                >
                  Limpar
                </Button>
              )}
            </Box>

            {/* URL Input as alternative */}
            <StyledTextField
              fullWidth
              label="URL da Imagem (alternativa)"
              value={editForm.image_url || ''}
              onChange={(e) => {
                const newUrl = e.target.value;
                setEditForm({ ...editForm, image_url: newUrl });
                // Only update preview if no image has been uploaded or if clearing the URL
                if (!uploadedImageUrl || newUrl === '') {
                  setImagePreview(newUrl || null);
                }
              }}
              margin="normal"
              helperText="Cole aqui uma URL de imagem se preferir ou use o botão acima para fazer upload"
            />

            {/* Upload Status */}
            {uploadingImage && (
              <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={16} />
                <Typography variant="body2" color="textSecondary">
                  Enviando imagem...
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancelar</Button>
          <AdminButton 
            onClick={handleSaveGift} 
            variant="contained"
            disabled={uploadingImage}
          >
            {uploadingImage ? <CircularProgress size={20} /> : 'Salvar'}
          </AdminButton>
        </DialogActions>
      </Dialog>

      {/* Add Gift Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Adicionar Presente</DialogTitle>
        <DialogContent>
          {addError && (
            <Alert severity="error" sx={{ mb: 2 }}>{addError}</Alert>
          )}
          <StyledTextField
            fullWidth
            label="Nome *"
            value={addForm.name || ''}
            onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
            margin="normal"
            required
          />
          <StyledTextField
            fullWidth
            label="Descrição *"
            value={addForm.description || ''}
            onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
            margin="normal"
            multiline
            rows={3}
            required
          />
          <StyledTextField
            fullWidth
            label="Preço *"
            type="number"
            value={addForm.price || ''}
            onChange={(e) => setAddForm({ ...addForm, price: parseFloat(e.target.value) || 0 })}
            margin="normal"
            required
            inputProps={{ min: 0, step: 0.01 }}
          />
          
          {/* Image Upload Section */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Imagem do Presente
            </Typography>
            
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Formatos aceitos: JPG, PNG, GIF. Tamanho máximo: 5MB. As imagens serão automaticamente otimizadas.
            </Typography>
            
            {/* Image Preview */}
            <ImagePreview onClick={() => {
              console.log('Add image preview clicked, triggering file input...');
              const fileInput = document.getElementById('add-image-upload') as HTMLInputElement;
              if (fileInput) {
                console.log('Add file input found, clicking...');
                fileInput.click();
              } else {
                console.error('Add file input not found!');
              }
            }}>
              {addImagePreview ? (
                <CardMedia
                  component="img"
                  image={addImagePreview}
                  alt="Preview"
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <Box sx={{ textAlign: 'center' }}>
                  <CloudUploadIcon sx={{ fontSize: 40, color: '#ccc' }} />
                  <Typography variant="body2" color="textSecondary">
                    Clique para adicionar imagem
                  </Typography>
                </Box>
              )}
            </ImagePreview>

            {/* Upload Button */}
            <Box sx={{ display: 'inline-block', mb: 2 }}>
              <input
                id="add-image-upload"
                type="file"
                accept="image/*"
                onChange={handleAddImageUpload}
                style={{ display: 'none' }}
              />
              <AdminButton
                variant="contained"
                startIcon={addUploadingImage ? <CircularProgress size={16} color="inherit" /> : <CloudUploadIcon />}
                disabled={addUploadingImage}
                onClick={() => {
                  console.log('Add upload button clicked, triggering file input...');
                  const fileInput = document.getElementById('add-image-upload') as HTMLInputElement;
                  if (fileInput) {
                    console.log('Add file input found, clicking...');
                    fileInput.click();
                  } else {
                    console.error('Add file input not found!');
                  }
                }}
                sx={{ cursor: 'pointer' }}
              >
                {addUploadingImage ? 'Enviando...' : 'Escolher Imagem'}
              </AdminButton>
            </Box>

            {/* URL Input as alternative */}
            <StyledTextField
              fullWidth
              label="URL da Imagem (alternativa)"
              value={addForm.image_url || ''}
              onChange={(e) => {
                setAddForm({ ...addForm, image_url: e.target.value });
                setAddImagePreview(e.target.value);
              }}
              margin="normal"
              helperText="Cole aqui uma URL de imagem se preferir ou use o botão acima para fazer upload"
            />

            {/* Upload Status */}
            {addUploadingImage && (
              <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={16} />
                <Typography variant="body2" color="textSecondary">
                  Enviando imagem...
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)} disabled={addLoading}>
            Cancelar
          </Button>
          <AdminButton 
            onClick={handleAddGift} 
            variant="contained"
            disabled={addLoading || addUploadingImage}
          >
            {addLoading ? <CircularProgress size={20} /> : 'Adicionar'}
          </AdminButton>
        </DialogActions>
      </Dialog>
    </GiftContainer>
  );
};

export default GiftManagement; 