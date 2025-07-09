import pool from './db.config';
import { v4 as uuidv4 } from 'uuid';

export interface RSVP {
  id: string;
  name: string;
  email: string;
  attending: boolean;
  numberOfGuests: number;
  dietaryRestrictions?: string;
  message?: string;
  created_at: Date;
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

export class RSVPModel {
  static async create(rsvpData: Omit<RSVP, 'id' | 'created_at'>): Promise<RSVP> {
    const id = uuidv4();
    const query = `
      INSERT INTO rsvps (id, name, email, attending, number_of_guests, dietary_restrictions, message, confirmed)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    
    const values = [
      id,
      rsvpData.name,
      rsvpData.email,
      rsvpData.attending,
      rsvpData.numberOfGuests,
      rsvpData.dietaryRestrictions || null,
      rsvpData.message || null,
      rsvpData.confirmed,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findAll(): Promise<RSVP[]> {
    const query = 'SELECT * FROM rsvps ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  }

  static async findByEmail(email: string): Promise<RSVP | null> {
    if (!email || email.trim() === '') {
      return null;
    }
    const query = 'SELECT * FROM rsvps WHERE email = $1';
    const result = await pool.query(query, [email.trim()]);
    return result.rows[0] || null;
  }

  static async update(id: string, rsvpData: Partial<Omit<RSVP, 'id' | 'created_at'>>): Promise<RSVP | null> {
    const keys = Object.keys(rsvpData);
    const values = Object.values(rsvpData);
    
    if (keys.length === 0) return null;

    const setClause = keys.map((key, index) => `${key} = $${index + 2}`).join(', ');
    const query = `UPDATE rsvps SET ${setClause} WHERE id = $1 RETURNING *`;
    
    const result = await pool.query(query, [id, ...values]);
    return result.rows[0] || null;
  }

  static async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM rsvps WHERE id = $1';
    const result = await pool.query(query, [id]);
    return !!(result && result.rowCount && result.rowCount > 0);
  }

  static async findByName(name: string): Promise<RSVP[]> {
    const query = 'SELECT * FROM rsvps WHERE name ILIKE $1 ORDER BY name';
    const { rows } = await pool.query(query, [`%${name}%`]);
    return rows;
  }

  static async findById(id: string): Promise<RSVP | null> {
    const query = 'SELECT * FROM rsvps WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
  }

  static async getGuestStats(): Promise<GuestStats> {
    const query = `
      SELECT 
        COUNT(*) as total_rsvps,
        COUNT(CASE WHEN confirmed = true THEN 1 END) as confirmed_rsvps,
        COUNT(CASE WHEN confirmed = false THEN 1 END) as declined_rsvps,
        COUNT(CASE WHEN confirmed IS NULL THEN 1 END) as pending_rsvps,
        COALESCE(SUM(number_of_guests), 0) as total_guests,
        COALESCE(SUM(CASE WHEN confirmed = true THEN number_of_guests ELSE 0 END), 0) as confirmed_guests,
        COALESCE(SUM(CASE WHEN confirmed = false THEN number_of_guests ELSE 0 END), 0) as declined_guests,
        COALESCE(SUM(CASE WHEN confirmed IS NULL THEN number_of_guests ELSE 0 END), 0) as pending_guests
      FROM rsvps
    `;
    
    const { rows } = await pool.query(query);
    const stats = rows[0];
    
    return {
      totalGuests: parseInt(stats.total_guests) || 0,
      confirmedGuests: parseInt(stats.confirmed_guests) || 0,
      declinedGuests: parseInt(stats.declined_guests) || 0,
      pendingGuests: parseInt(stats.pending_guests) || 0,
      totalRSVPs: parseInt(stats.total_rsvps) || 0,
      confirmedRSVPs: parseInt(stats.confirmed_rsvps) || 0,
      declinedRSVPs: parseInt(stats.declined_rsvps) || 0,
      pendingRSVPs: parseInt(stats.pending_rsvps) || 0,
    };
  }
} 