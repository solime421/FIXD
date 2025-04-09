import express from 'express';
import privateFreelancerProfileController from '../controllers/privateFreelancerProfileController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET freelancer details (About Me, country, urgent service, etc.)
router.get('/details', verifyToken, privateFreelancerProfileController.getFreelancerDetails);

// Update About Me section (aboutMeSmall, aboutMeDetailed, countryOfOrigin)
router.post('/about-me', verifyToken, privateFreelancerProfileController.updateAboutMeSection);

// Toggle urgent service setting
router.post('/urgent-service', verifyToken, privateFreelancerProfileController.toggleUrgentService);

export default router;