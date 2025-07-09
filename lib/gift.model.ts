import pool from './db.config';
import { v4 as uuidv4 } from 'uuid';

export interface Gift {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  is_reserved: boolean;
  reserved_by?: string;
  reserved_at?: Date;
  created_at: Date;
}

export class GiftModel {
  static async create(giftData: Omit<Gift, 'id' | 'created_at'>): Promise<Gift> {
    const id = uuidv4();
    const query = `
      INSERT INTO gifts (id, name, description, price, image_url, is_reserved, reserved_by, reserved_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    
    const values = [
      id,
      giftData.name,
      giftData.description,
      giftData.price,
      giftData.image_url || null,
      giftData.is_reserved,
      giftData.reserved_by || null,
      giftData.reserved_at || null,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findAll(): Promise<Gift[]> {
    const query = 'SELECT * FROM gifts ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id: string): Promise<Gift | null> {
    const query = 'SELECT * FROM gifts WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async update(id: string, giftData: Partial<Gift>): Promise<Gift | null> {
    const fields = Object.keys(giftData).filter(key => key !== 'id' && key !== 'created_at');
    const values = Object.values(giftData).filter((_, index) => fields[index]);
    
    if (fields.length === 0) return null;

    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const query = `UPDATE gifts SET ${setClause} WHERE id = $1 RETURNING *`;
    
    const result = await pool.query(query, [id, ...values]);
    return result.rows[0] || null;
  }

  static async reserve(id: string, reservedBy: string): Promise<Gift | null> {
    const query = `
      UPDATE gifts 
      SET is_reserved = true, reserved_by = $2, reserved_at = NOW()
      WHERE id = $1 AND is_reserved = false
      RETURNING *
    `;
    
    const result = await pool.query(query, [id, reservedBy]);
    return result.rows[0] || null;
  }

  static async unreserve(id: string): Promise<Gift | null> {
    const query = `
      UPDATE gifts 
      SET is_reserved = false, reserved_by = NULL, reserved_at = NULL
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM gifts WHERE id = $1';
    const result = await pool.query(query, [id]);
    return !!(result && result.rowCount && result.rowCount > 0);
  }
} 