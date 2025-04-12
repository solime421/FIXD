// src/routes/freelancers.js
import express from 'express';
import reviewController from '../controllers/reviewController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET reviews for a specific freelancer.
// This route will be accessed as: GET /api/freelancers/:id/reviews
router.get('/:id/reviews', verifyToken, reviewController.getFreelancerReviews);

//Put orders here as well


// Export the router
export default router;
