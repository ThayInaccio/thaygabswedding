import { Router } from 'express';
import * as giftsController from '../controllers/gifts.controller';

const router = Router();

// Create new gift
router.post('/', giftsController.createGift);

// Get all gifts
router.get('/', giftsController.getAllGifts);

// Get gift by ID
router.get('/:id', giftsController.getGiftById);

// Update gift
router.put('/:id', giftsController.updateGift);

// Reserve gift
router.put('/:id/reserve', giftsController.reserveGift);

// Unreserve gift
router.put('/:id/unreserve', giftsController.unreserveGift);

// Delete gift
router.delete('/:id', giftsController.deleteGift);

export default router; 