import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default api;

// File upload service
export const uploadImage = async (file: File): Promise<{ url: string; filename: string }> => {
  try {
    console.log('Starting image upload to:', `${API_BASE_URL}/upload`);
    console.log('File details:', {
      name: file.name,
      size: file.size,
      type: file.type
    });
    
    const formData = new FormData();
    formData.append('image', file);

    console.log('FormData created, sending request...');

    // Use axios instance instead of fetch for consistent error handling
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Upload successful:', response.data);
    
    return {
      url: response.data.data.url,
      filename: response.data.data.filename
    };
  } catch (error: any) {
    console.error('Error uploading image:', error);
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      code: error.code
    });
    
    // If it's a network error (backend not available), provide a helpful message
    if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
      throw new Error('Servidor não está disponível. Verifique se o backend está rodando.');
    }
    
    throw new Error(error.response?.data?.message || error.message || 'Erro ao fazer upload da imagem');
  }
};

export const registerPurchase = async (gift_id: string, guest_id: string, price: number) => {
  try {
    const response = await api.post('/purchases', { gift_id, guest_id, price });
    return response.data.data;
  } catch (error: any) {
    console.error('Error registering purchase:', error);
    throw new Error(error.response?.data?.error || 'Erro ao registrar compra');
  }
};

export const fetchAllPurchases = async () => {
  try {
    const response = await api.get('/purchases');
    return response.data.data;
  } catch (error: any) {
    console.error('Error fetching purchases:', error);
    throw new Error(error.response?.data?.error || 'Erro ao buscar compras');
  }
}; 