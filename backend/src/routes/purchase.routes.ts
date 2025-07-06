import { Router } from 'express';
import { createPurchase, getAllPurchases, updatePurchaseStatus } from '../controllers/purchase.controller';

const router = Router();

// Register a purchase
router.post('/', createPurchase);

// List all purchases
router.get('/', getAllPurchases);

// Update purchase status (admin)
router.patch('/:id/status', updatePurchaseStatus);

export default router; 