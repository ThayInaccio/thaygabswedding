import { Router } from 'express';
import * as rsvpController from '../controllers/rsvp.controller';

const router = Router();

// Get guest statistics
router.get('/stats', rsvpController.getGuestStats);

// Search for a guest by name
router.get('/search', rsvpController.findGuestByName);

// Create new RSVP
router.post('/', rsvpController.createRsvp);

// Get all RSVPs
router.get('/', rsvpController.getAllRsvps);

// Get RSVP by ID
router.get('/:id', rsvpController.getRsvpById);

// Update RSVP
router.patch('/:id', rsvpController.updateRsvp);

// Delete RSVP
router.delete('/:id', rsvpController.deleteRsvp);

export default router; 