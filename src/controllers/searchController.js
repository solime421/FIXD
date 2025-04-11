import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

//COME BACK TO CHECK RATING AFTER YOU DO THE REVIEW APIS

export const searchFreelancers = async (req, res) => {
  try {
    const { search, minDeposit, maxDeposit, urgentOnly } = req.query;

    // If no search term is provided, return an error.
    if (!search || search.trim() === "") {
      return res.status(400).json({ message: "A search term is required." });
    }

    // Base condition: only include users with role 'freelancer'
    const filters = { role: 'freelancer' };
    const andConditions = [];
    //andConditions is an array where i'm adding additional filtering conditions.

    // Set parameters in which the backend will search in.
    if (search && search.trim() !== "") {
      andConditions.push({
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { freelancerDetails: { aboutMeSmall: { contains: search, mode: 'insensitive' } } },
          { freelancerDetails: { aboutMeDetailed: { contains: search, mode: 'insensitive' } } },
          {
            freelancerDetails: {
              specialties: {
                some: {
                  specialty: { contains: search, mode: 'insensitive' },
                },
              },
            },
          },
        ],
      });
    }

    // If a deposit range is provided, add filtering based on depositAmount.
    if (minDeposit || maxDeposit) {
      const depositFilter = {};
      if (minDeposit) {
        depositFilter.gte = parseFloat(minDeposit);
        //greater than or equal to
      }
      if (maxDeposit) {
        depositFilter.lte = parseFloat(maxDeposit);
      }
      andConditions.push({
        freelancerDetails: { depositAmount: depositFilter },
      });
    }

    // If urgentOnly is "true", filter by urgentServiceEnabled = true.
    if (urgentOnly && urgentOnly.toLowerCase() === "true") {
      andConditions.push({
        freelancerDetails: { urgentServiceEnabled: true },
      });
    }

    // Combine the conditions.
    if (andConditions.length > 0) {
      filters.AND = andConditions;
    }

    // Execute the query using the constructed filters.
    const freelancers = await prisma.user.findMany({
      where: filters,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        profilePicture: true,
        freelancerDetails: {
          select: {
            aboutMeSmall: true,
            urgentServiceEnabled: true,
            depositAmount: true,
            portfolioImages: {
              orderBy: { createdAt: 'desc' },
              take: 1,
              select: { imageUrl: true },
            },
          },
        },
        reviewsReceived: {
          select: { rating: true },
        },
      },
    });

    // Compute average rating and extract portfolio image for each freelancer.
    const freelancersWithRating = freelancers.map((freelancer) => {
      const ratings = freelancer.reviewsReceived.map((r) => r.rating);
      const averageRating =
        ratings.length > 0 ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length : 0;
      
      const lastPortfolioImage =
        freelancer.freelancerDetails?.portfolioImages[0]?.imageUrl || null;

      return {
        id: freelancer.id,
        firstName: freelancer.firstName,
        lastName: freelancer.lastName,
        profilePicture: freelancer.profilePicture,
        aboutMeSmall: freelancer.freelancerDetails?.aboutMeSmall,
        urgentServiceEnabled: freelancer.freelancerDetails?.urgentServiceEnabled,
        depositAmount: freelancer.freelancerDetails?.depositAmount,
        rating: averageRating,
        lastPortfolioImage,
      };
    });

    // Sort freelancers by highest average rating first.
    freelancersWithRating.sort((a, b) => b.rating - a.rating);

    res.json(freelancersWithRating);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

const searchController = { searchFreelancers };
export default searchController;