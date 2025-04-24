import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { uploadSingle } from '../middleware/upload.js';
import privatePortfolioController from '../controllers/privatePortfolioController.js';

const router = express.Router();

// GET  /api/privateFreelancerProfiles/portfolio
router.get(
  '/',
  verifyToken,
  privatePortfolioController.getPortfolioImages
);

// POST /api/privateFreelancerProfiles/portfolio
// uploadSingle is already .single('image'), so it'll populate `req.file.buffer`
router.post(
  '/',
  verifyToken,
  uploadSingle,
  privatePortfolioController.addPortfolioImage
);

// DELETE /api/privateFreelancerProfiles/portfolio/:id
router.delete(
  '/:id',
  verifyToken,
  privatePortfolioController.deletePortfolioImage
);

export default router;