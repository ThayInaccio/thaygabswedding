import pool from '../config/db.config';
import { v4 as uuidv4 } from 'uuid';

export type PurchaseStatus = 'waiting_confirmation' | 'confirmed' | 'rejected';

export interface Purchase {
  id: string;
  gift_id: string;
  guest_id: string;
  price: number;
  status: PurchaseStatus;
  created_at: Date;
  confirmed_at?: Date | null;
}

export class PurchaseModel {
  static async create(purchaseData: Omit<Purchase, 'id' | 'created_at' | 'confirmed_at' | 'status'>): Promise<Purchase> {
    const id = uuidv4();
    const query = `
      INSERT INTO purchases (id, gift_id, guest_id, price)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [id, purchaseData.gift_id, purchaseData.guest_id, purchaseData.price];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findAll(): Promise<Purchase[]> {
    const query = 'SELECT * FROM purchases ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id: string): Promise<Purchase | null> {
    const query = 'SELECT * FROM purchases WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async updateStatus(id: string, status: PurchaseStatus): Promise<Purchase | null> {
    let query, values;
    if (status === 'confirmed') {
      query = 'UPDATE purchases SET status = $2, confirmed_at = NOW() WHERE id = $1 RETURNING *';
      values = [id, status];
    } else {
      query = 'UPDATE purchases SET status = $2 WHERE id = $1 RETURNING *';
      values = [id, status];
    }
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  static async findByStatus(status: PurchaseStatus): Promise<Purchase[]> {
    const query = 'SELECT * FROM purchases WHERE status = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [status]);
    return result.rows;
  }
} 