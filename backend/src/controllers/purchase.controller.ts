import { Request, Response } from 'express';
import { PurchaseModel, PurchaseStatus } from '../models/purchase.model';

export const createPurchase = async (req: Request, res: Response) => {
  try {
    const { gift_id, guest_id, price } = req.body;
    if (!gift_id || !guest_id || !price) {
      return res.status(400).json({ success: false, error: 'gift_id, guest_id, and price are required' });
    }
    const purchase = await PurchaseModel.create({ gift_id, guest_id, price });
    res.status(201).json({ success: true, data: purchase });
  } catch (error) {
    console.error('Error creating purchase:', error);
    res.status(500).json({ success: false, error: 'Error creating purchase' });
  }
};

export const getAllPurchases = async (_req: Request, res: Response) => {
  try {
    const purchases = await PurchaseModel.findAll();
    res.json({ success: true, data: purchases });
  } catch (error) {
    console.error('Error fetching purchases:', error);
    res.status(500).json({ success: false, error: 'Error fetching purchases' });
  }
};

export const updatePurchaseStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!id || !status) {
      return res.status(400).json({ success: false, error: 'id and status are required' });
    }
    if (!['waiting_confirmation', 'confirmed', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }
    const updated = await PurchaseModel.updateStatus(id, status as PurchaseStatus);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Purchase not found' });
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating purchase status:', error);
    res.status(500).json({ success: false, error: 'Error updating purchase status' });
  }
}; 