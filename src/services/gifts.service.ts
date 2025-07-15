import api from './api';
import type { Gift } from '../types';

export const getAllGifts = async (): Promise<Gift[]> => {
  try {
    const response = await api.get('/gifts');
    return response.data.data || [];
  } catch (error: any) {
    console.error('Error fetching gifts:', error);
    if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
      throw new Error('Servidor não está disponível. Verifique se o backend está rodando.');
    }
    throw new Error(error.response?.data?.message || 'Erro ao carregar presentes');
  }
};

export const getGiftById = async (id: string): Promise<Gift> => {
  try {
    const response = await api.get(`/gifts/${id}`);
    return response.data.data;
  } catch (error: any) {
    console.error('Error fetching gift:', error);
    throw new Error(error.response?.data?.message || 'Erro ao carregar presente');
  }
};

export const reserveGift = async (id: string, reservedBy: string): Promise<Gift> => {
  try {
    const response = await api.put(`/gifts/${id}/reserve`, { reservedBy });
    return response.data.data;
  } catch (error: any) {
    console.error('Error reserving gift:', error);
    throw new Error(error.response?.data?.message || 'Erro ao reservar presente');
  }
};

export const unreserveGift = async (id: string): Promise<Gift> => {
  try {
    const response = await api.put(`/gifts/${id}/unreserve`);
    return response.data.data;
  } catch (error: any) {
    console.error('Error unreserving gift:', error);
    throw new Error(error.response?.data?.message || 'Erro ao cancelar reserva');
  }
};

export const addGift = async (giftData: Omit<Gift, 'id' | 'created_at'>): Promise<Gift> => {
  try {
    const response = await api.post('/gifts', giftData);
    return response.data.data;
  } catch (error: any) {
    console.error('Error adding gift:', error);
    throw new Error(error.response?.data?.message || 'Erro ao adicionar presente');
  }
};

export const updateGift = async (id: string, giftData: Partial<Gift>): Promise<Gift> => {
  try {
    const response = await api.patch(`/gifts/${id}`, giftData);
    return response.data.data;
  } catch (error: any) {
    console.error('Error updating gift:', error);
    throw new Error(error.response?.data?.message || 'Erro ao atualizar presente');
  }
};

export const deleteGift = async (id: string): Promise<void> => {
  try {
    const response = await api.delete(`/gifts/${id}`);
    return response.data.data;
  } catch (error: any) {
    console.error('Error deleting gift:', error);
    throw new Error(error.response?.data?.message || 'Erro ao deletar presente');
  }
}; 