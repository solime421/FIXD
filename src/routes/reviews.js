import express from 'express';
import reviewController from '../controllers/reviewController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Leave a review (POST)
router.post('/', verifyToken, reviewController.leaveReview);

// Get reviews for the logged-in freelancer
router.get('/', verifyToken, reviewController.getFreelancerReviews);

export default router;
