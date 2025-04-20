import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { uploadSingle } from '../middleware/upload.js';
import privatePortfolioController from '../controllers/privatePortfolioController.js';

const router = express.Router();

// GET all portfolio images for the authenticated freelancer
router.get('/', verifyToken, privatePortfolioController.getPortfolioImages);

// multer middleware handles the file under field name “image”
// POST a new portfolio image
router.post('/', verifyToken, uploadSingle, privatePortfolioController.addPortfolioImage);

// DELETE a portfolio image by ID
router.delete('/:id', verifyToken, privatePortfolioController.deletePortfolioImage);

export default router;