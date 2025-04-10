import express from 'express';
import privateSpecialityController from '../controllers/privateSpecialityController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET all specialties
router.get('/', verifyToken, privateSpecialityController.getSpecialties);

// POST a new specialty
router.post('/', verifyToken, privateSpecialityController.addSpecialty);

// DELETE a specialty by ID
router.delete('/:id', verifyToken, privateSpecialityController.deleteSpecialty);

export default router;