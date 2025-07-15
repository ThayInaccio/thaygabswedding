import { Request, Response } from 'express';
import { GiftModel } from '../models/gift.model';

export const createGift = async (req: Request, res: Response) => {
  try {
    const { name, description, price, image_url, pix_code } = req.body;

    // Validate required fields
    if (!name || !description || !price) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, description, price'
      });
    }

    const gift = await GiftModel.create({
      name,
      description,
      price: parseFloat(price),
      image_url: image_url || '',
      is_reserved: false,
      pix_code: pix_code || null
    });

    res.status(201).json({
      success: true,
      data: gift,
      message: 'Gift created successfully'
    });
  } catch (error) {
    console.error('Error creating gift:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const getAllGifts = async (req: Request, res: Response) => {
  try {
    const gifts = await GiftModel.findAll();
    res.json({
      success: true,
      data: gifts
    });
  } catch (error) {
    console.error('Error fetching gifts:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const getGiftById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const gift = await GiftModel.findById(id);
    
    if (!gift) {
      return res.status(404).json({
        success: false,
        error: 'Gift not found'
      });
    }

    res.json({
      success: true,
      data: gift
    });
  } catch (error) {
    console.error('Error fetching gift:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const updateGift = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Ensure pix_code is passed if present
    if (typeof updateData.pix_code === 'undefined' && typeof req.body.pix_code !== 'undefined') {
      updateData.pix_code = req.body.pix_code;
    }

    const gift = await GiftModel.update(id, updateData);
    
    if (!gift) {
      return res.status(404).json({
        success: false,
        error: 'Gift not found'
      });
    }

    res.json({
      success: true,
      data: gift,
      message: 'Gift updated successfully'
    });
  } catch (error) {
    console.error('Error updating gift:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const reserveGift = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reservedBy } = req.body;

    if (!reservedBy) {
      return res.status(400).json({
        success: false,
        error: 'reservedBy is required'
      });
    }

    const gift = await GiftModel.reserve(id, reservedBy);
    
    if (!gift) {
      return res.status(404).json({
        success: false,
        error: 'Gift not found or already reserved'
      });
    }

    res.json({
      success: true,
      data: gift,
      message: 'Gift reserved successfully'
    });
  } catch (error) {
    console.error('Error reserving gift:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const unreserveGift = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const gift = await GiftModel.unreserve(id);
    
    if (!gift) {
      return res.status(404).json({
        success: false,
        error: 'Gift not found'
      });
    }

    res.json({
      success: true,
      data: gift,
      message: 'Gift unreserved successfully'
    });
  } catch (error) {
    console.error('Error unreserving gift:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const deleteGift = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await GiftModel.delete(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Gift not found'
      });
    }

    res.json({
      success: true,
      message: 'Gift deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting gift:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}; 