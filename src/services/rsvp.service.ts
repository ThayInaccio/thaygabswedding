import api from './api';
import type { RSVP, ApiResponse } from '../types';

export interface Guest {
  id: string;
  name: string;
  email: string;
  attending: boolean;
  numberOfGuests: number;
  dietaryRestrictions?: string;
  message?: string;
  created_at: string;
  confirmed: boolean | null;
}

export interface GuestStats {
  totalGuests: number;
  confirmedGuests: number;
  declinedGuests: number;
  pendingGuests: number;
  totalRSVPs: number;
  confirmedRSVPs: number;
  declinedRSVPs: number;
  pendingRSVPs: number;
}

export const rsvpService = {
  // Submit RSVP
  submitRSVP: async (rsvpData: Omit<RSVP, 'id' | 'createdAt'>): Promise<ApiResponse<RSVP>> => {
    try {
      const response = await api.post('/rsvp', rsvpData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to submit RSVP');
    }
  },

  // Get all RSVPs (for admin purposes)
  getAllRSVPs: async (): Promise<Guest[]> => {
    try {
      const response = await api.get('/rsvp');
      return response.data.data || response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch RSVPs');
    }
  },

  // Get guest statistics
  getGuestStats: async (): Promise<GuestStats> => {
    try {
      const response = await api.get('/rsvp?stats=true');
      return response.data.data || response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch guest statistics');
    }
  },

  // Get RSVP by ID
  getRSVPById: async (id: string): Promise<Guest> => {
    try {
      const response = await api.get(`/rsvp/${id}`);
      return response.data.data || response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch RSVP');
    }
  },

  // Update RSVP
  updateRSVP: async (id: string, rsvpData: Partial<Guest>): Promise<Guest> => {
    try {
      const response = await api.patch(`/rsvp/${id}`, rsvpData);
      return response.data.data || response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update RSVP');
    }
  },

  // Delete RSVP
  deleteRSVP: async (id: string): Promise<boolean> => {
    try {
      const response = await api.delete(`/rsvp/${id}`);
      return response.data.success;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete RSVP');
    }
  },

  // Create new RSVP (admin)
  createRSVP: async (rsvpData: Omit<Guest, 'id' | 'created_at'>): Promise<Guest> => {
    try {
      const response = await api.post('/rsvp', rsvpData);
      return response.data.data || response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create RSVP');
    }
  },
};

export const findGuestByName = async (name: string): Promise<Guest[]> => {
  try {
    const response = await api.get(`/rsvp/search?name=${encodeURIComponent(name)}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to search guests');
  }
};

export const updateRsvp = async (id: string, data: { confirmed: boolean }): Promise<Guest> => {
  try {
    const response = await api.patch(`/rsvp/${id}`, data);
    return response.data.data || response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update RSVP');
  }
}; 