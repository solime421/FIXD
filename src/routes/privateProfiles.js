import express from 'express';
import privateProfileController from '../controllers/privateProfileController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { uploadSingle } from '../middleware/upload.js';

const router = express.Router();

// Get personal profile of the authenticated user
router.get('/me', verifyToken, privateProfileController.getPersonalProfile);

// Update personal data (name, profile picture, phone, email)
router.post('/personal-data', verifyToken, privateProfileController.updatePersonalData);

// Update only the profile picture
router.post('/profile-picture', verifyToken, uploadSingle, privateProfileController.updateProfilePicture);

// Update location
router.post('/location', verifyToken, privateProfileController.updateLocation);

export default router;