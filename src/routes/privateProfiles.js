// src/routes/privateProfiles.js
import express from 'express';
import privateProfileController from '../controllers/privateProfileController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get personal profile of the authenticated user
router.get('/me', verifyToken, privateProfileController.getPersonalProfile);

// Update personal data (name, profile picture, phone, email)
router.post('/personal-data', verifyToken, privateProfileController.updatePersonalData);

// Update only the profile picture
router.post('/profile-picture', verifyToken, privateProfileController.updateProfilePicture);

// Update location
router.post('/location', verifyToken, privateProfileController.updateLocation);

// Update billing information
router.post('/billing', verifyToken, privateProfileController.updateBillingInfo);

export default router;