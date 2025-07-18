import { Router } from 'express';
import * as rsvpController from '../controllers/rsvp.controller';

const router = Router();

router.get('/search', rsvpController.findGuestByName);
router.post('/', rsvpController.createRsvp);
router.get('/', async (req, res) => {
  if (req.query.stats === 'true') {
    return rsvpController.getGuestStats(req, res);
  }
  return rsvpController.getAllRsvps(req, res);
});
router.get('/:id', rsvpController.getRsvpById);
router.patch('/:id', rsvpController.updateRsvp);
router.delete('/:id', rsvpController.deleteRsvp);

export default router; 