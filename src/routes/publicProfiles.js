import express from 'express';
import publicProfileController from '../controllers/publicProfileController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:id', verifyToken, publicProfileController.getPublicProfile);

export default router;