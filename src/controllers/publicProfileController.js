import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

//GET
export const getPublicProfile = async (req, res) => {
  try {
    const requestedUserId = parseInt(req.params.id); // i get it form url
    const currentUser = req.user; // Populated by auth middleware

    // ----------- GET basic user data
    const requestedUser = await prisma.user.findUnique({
      where: { id: requestedUserId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        role: true,
        profilePicture: true,
        phone: true,
        location: true,
      },
    });
    
    // guard code
    if (!requestedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    // ----------- FREELANCER
    if (requestedUser.role === 'freelancer') {
      const freelancerDetails = await prisma.freelancerDetails.findUnique({
        where: { userId: requestedUserId },
        select: {
          aboutMeSmall: true,
          aboutMeDetailed: true,
          countryOfOrigin: true,
          memberSince: true,
          urgentServiceEnabled: true,
        },
      });

      // GET portfolio images
      const portfolio = await prisma.portfolioImage.findMany({
        where: { freelancerId: requestedUserId },
        select: { imageUrl: true },
      });

      // GET specialties
      const specialties = await prisma.specialty.findMany({
        where: { freelancerId: requestedUserId },
        select: { specialty: true },
      });

      // Compute rating: average of all reviews
      const allReviews = await prisma.review.findMany({
        where: { revieweeId: requestedUserId },
        select: { rating: true },
      });
      const rating =
        allReviews.length > 0
          ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
          : 0;

      // GET full reviews for display
      const reviews = await prisma.review.findMany({
        where: { revieweeId: requestedUserId },
        select: {
          rating: true,
          comment: true,
          createdAt: true,
          reviewer: { select: { firstName: true, lastName: true } },
        },
        orderBy: { createdAt: 'desc' },
      });

      // phoneVisible true/false depending if urgentServiceEnabled is enabled by the freelancer
      const phoneVisible = freelancerDetails && freelancerDetails.urgentServiceEnabled;

      //canMessage - true if client / false if freelancer
      const canMessage = currentUser.role === 'client';

      return res.json({
        id: requestedUser.id,
        firstName: requestedUser.firstName,
        lastName: requestedUser.lastName,
        profilePicture: requestedUser.profilePicture,
        location: requestedUser.location, 
        rating, // Computed average rating
        phone: phoneVisible ? requestedUser.phone : undefined, // Conditionally return phone number
        phoneVisible,                     // Added flag: returns true if phone should be shown
        aboutMeSmall: freelancerDetails?.aboutMeSmall,
        aboutMeDetailed: freelancerDetails?.aboutMeDetailed,
        countryOfOrigin: freelancerDetails?.countryOfOrigin,
        memberSince: freelancerDetails?.memberSince,
        urgentServiceEnabled: freelancerDetails?.urgentServiceEnabled,
        portfolio,
        specialties,
        reviews,
        canMessage, // true if requester is client, false otherwise
      });
    }

		// ----------- CLIENT
		if (requestedUser.role === 'client') {
    // Since only freelancers can access client profiles, we assume that currentUser.role === 'freelancer'.
    // Retrieve previous orders between this client (requestedUser) and the current freelancer (currentUser)
		  const previousOrders = await prisma.order.findMany({
		    where: {
		      clientId: requestedUserId,
		      freelancerId: currentUser.id,
		    },
		    select: {
		      id: true,
		      offerName: true,
		      status: true,
		      depositPaid: true,
		      createdAt: true,
		    },
		    orderBy: { createdAt: 'desc' },
		  });
		
		  return res.json({
		    id: requestedUser.id,
		    firstName: requestedUser.firstName,
		    lastName: requestedUser.lastName,
		    profilePicture: requestedUser.profilePicture,
		    previousOrders,
		  });
		}

    // ----------- Fallback in case the role is not recognized
    res.status(400).json({ message: "Invalid user role." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

export default { getPublicProfile };
