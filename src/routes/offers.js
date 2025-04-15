import express from 'express';
import offerController from '../controllers/offerController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/offers
// Freelancer sends an offer.
router.post('/', verifyToken, offerController.sendOffer);

// GET /api/offers/chat/:chatId
// Client views the latest pending offer for the specified chat.
router.get('/chat/:chatId', verifyToken, offerController.getOfferByChat);

// POST /api/offers/:id/accept
// Client accepts the offer with the given offer ID.
router.post('/:id/accept', verifyToken, offerController.acceptOffer);

export default router;