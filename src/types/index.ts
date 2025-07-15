export interface RSVP {
  id?: string;
  name: string;
  email: string;
  attending: boolean;
  numberOfGuests: number;
  dietaryRestrictions?: string;
  message?: string;
  createdAt?: Date;
}

export interface Gift {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  is_reserved: boolean;
  reserved_by?: string;
  reserved_at?: Date;
  created_at?: Date;
  status?: 'available' | 'reserved' | 'purchased';
  pix_code?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
} 