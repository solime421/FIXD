import express from 'express';
import privatePortfolioController from '../controllers/privatePortfolioController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET all portfolio images for the authenticated freelancer
router.get('/', verifyToken, privatePortfolioController.getPortfolioImages);

// POST a new portfolio image
router.post('/', verifyToken, privatePortfolioController.addPortfolioImage);

// DELETE a portfolio image by ID
router.delete('/:id', verifyToken, privatePortfolioController.deletePortfolioImage);

export default router;