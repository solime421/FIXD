import express from 'express';
import searchController from '../controllers/searchController.js';

const router = express.Router();

// Returns search results for freelancers based on the query parameter.
// Note: Redirection to the search results page should be handled on the front end.
router.get('/', searchController.searchFreelancers);

export default router;
