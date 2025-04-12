import express from 'express';
import reviewController from '../controllers/reviewController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Client leaves a review for a freelancer
router.post('/', verifyToken, reviewController.leaveReview);

export default router;