import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

//POST
//Allows a client to leave a review for a freelancer after an order is complete.
export const leaveReview = async (req, res) => {
  try {
    // Ensure that only clients can submit reviews.
    if (req.user.role !== 'client') {
      return res.status(403).json({ message: "Only clients can leave reviews." });
    }
    
    // pretpostavljamo da front salje keys u camelCase-u.
    // the front should send exactly these parameters.
    const { orderId, revieweeId, rating, comment } = req.body;

    // Create the review
    const review = await prisma.review.create({
      data: {
        orderId,
        reviewerId: req.user.id,  // Derived from token
        revieweeId,
        rating,
        comment,
      },
    });
    res.status(201).json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to leave review." });
  }
};

const reviewController = { leaveReview };
export default reviewController;