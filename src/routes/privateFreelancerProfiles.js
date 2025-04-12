import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import privateFreelancerProfileController from '../controllers/privateFreelancerProfileController.js';

// Import the sub-routers for portfolio images and specialties.
import privatePortfolioRoutes from './privatePortfolio.js';
import privateSpecialityRoutes from './privateSpeciality.js';

const router = express.Router();

// GET freelancer details (About Me, country, urgent service, deposit amount, etc.)
router.get('/details', verifyToken, privateFreelancerProfileController.getFreelancerDetails);

// POST update About Me section (aboutMeSmall, aboutMeDetailed, countryOfOrigin)
router.post('/about-me', verifyToken, privateFreelancerProfileController.updateAboutMeSection);

// POST toggle urgent service setting
router.post('/urgent-service', verifyToken, privateFreelancerProfileController.toggleUrgentService);

// POST update deposit amount
router.post('/deposit', verifyToken, privateFreelancerProfileController.updateDepositAmount);



// Portfolio Images: GET, POST, DELETE for portfolio images.
router.use('/portfolio', verifyToken, privatePortfolioRoutes);

// Specialties: GET, POST, DELETE for specialties.
router.use('/specialities', verifyToken, privateSpecialityRoutes);

export default router;
