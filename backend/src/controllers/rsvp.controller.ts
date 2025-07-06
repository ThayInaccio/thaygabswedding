import { Request, Response } from 'express';
import { RSVPModel } from '../models/rsvp.model';

export const findGuestByName = async (req: Request, res: Response) => {
  try {
    const { name } = req.query;

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ success: false, error: 'Name query parameter is required.' });
    }

    const guests = await RSVPModel.findByName(name);
    res.status(200).json(guests);
  } catch (error) {
    console.error('Error finding guest by name:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

export const getGuestStats = async (req: Request, res: Response) => {
  try {
    const stats = await RSVPModel.getGuestStats();
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching guest stats:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const createRsvp = async (req: Request, res: Response) => {
  try {
    const { name, email, attending, numberOfGuests, dietaryRestrictions, message, confirmed } = req.body;

    // Validate required fields - only name is required
    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Name is required'
      });
    }

    // Set defaults for optional fields
    const rsvpData = {
      name: name.trim(),
      email: email?.trim() || null,
      attending: attending !== undefined ? attending : true,
      numberOfGuests: numberOfGuests || 1,
      dietaryRestrictions: dietaryRestrictions || '',
      message: message || '',
      confirmed: confirmed !== undefined ? confirmed : null
    };

    // Only check for existing RSVP if email is provided
    if (rsvpData.email) {
      const existingRSVP = await RSVPModel.findByEmail(rsvpData.email);
      if (existingRSVP) {
        return res.status(409).json({
          success: false,
          error: 'An RSVP already exists for this email address'
        });
      }
    }

    const rsvp = await RSVPModel.create(rsvpData);

    res.status(201).json({
      success: true,
      data: rsvp,
      message: 'RSVP submitted successfully'
    });
  } catch (error: any) {
    console.error('Error creating RSVP:', error);
    
    // Handle specific database constraint errors
    if (error.code === '23505' && error.constraint === 'rsvps_email_key') {
      return res.status(500).json({
        success: false,
        error: 'Database constraint error: Email field has unique constraint. Please run the database fix script.'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const getAllRsvps = async (req: Request, res: Response) => {
  try {
    const rsvps = await RSVPModel.findAll();
    res.json({
      success: true,
      data: rsvps
    });
  } catch (error) {
    console.error('Error fetching RSVPs:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const getRsvpById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const rsvp = await RSVPModel.findById(id);
    
    if (!rsvp) {
      return res.status(404).json({
        success: false,
        error: 'RSVP not found'
      });
    }

    res.json({
      success: true,
      data: rsvp
    });
  } catch (error) {
    console.error('Error fetching RSVP:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const updateRsvp = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { confirmed } = req.body;

    if (confirmed === undefined) {
      return res.status(400).json({ success: false, error: 'Confirmation status is required.' });
    }

    const rsvp = await RSVPModel.update(id, { confirmed });
    
    if (!rsvp) {
      return res.status(404).json({
        success: false,
        error: 'RSVP not found'
      });
    }

    res.json({
      success: true,
      data: rsvp,
      message: 'RSVP updated successfully'
    });
  } catch (error) {
    console.error('Error updating RSVP:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const deleteRsvp = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await RSVPModel.delete(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'RSVP not found'
      });
    }

    res.json({
      success: true,
      message: 'RSVP deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting RSVP:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}; 