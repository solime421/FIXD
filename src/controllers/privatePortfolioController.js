import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


//GET
export const getPortfolioImages = async (req, res) => {
  try {
    // Ensure that the requester is a freelancer.
    if (req.user.role !== 'freelancer') {
      return res.status(403).json({ message: "Only freelancers can access portfolio images." });
    }
    const freelancerId = req.user.id; //populated by auth middleware
    const portfolioImages = await prisma.portfolioImage.findMany({
      where: { freelancerId },
      select: { id: true, imageUrl: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(portfolioImages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};


 // POST adds new image
export const addPortfolioImage = async (req, res) => {
  try {
    // Ensure that the requester is a freelancer.
    if (req.user.role !== 'freelancer') {
      return res.status(403).json({ message: "Only freelancers can add portfolio images." });
    }
    const freelancerId = req.user.id;
    const { imageUrl } = req.body;

    const newImage = await prisma.portfolioImage.create({
      data: {
        freelancerId,
        imageUrl,
      },
      select: { id: true, imageUrl: true, createdAt: true },
    });
    res.status(201).json(newImage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};


//DELETE /api/freelancer/portfolio/:id
export const deletePortfolioImage = async (req, res) => {
  try {
    // Ensure that the requester is a freelancer.
    if (req.user.role !== 'freelancer') {
      return res.status(403).json({ message: "Only freelancers can delete portfolio images." });
    }
    const freelancerId = req.user.id;
    const imageId = parseInt(req.params.id);

    // Checking in umage exists or if the user is the owner of the image
    const image = await prisma.portfolioImage.findUnique({ where: { id: imageId } });
    if (!image || image.freelancerId !== freelancerId) {
      return res.status(404).json({ message: "Portfolio image not found or access denied." });
    }

    const deletedImage = await prisma.portfolioImage.delete({
      where: { id: imageId },
    });
    res.json(deletedImage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

const privatePortfolioController = {
  getPortfolioImages,
  addPortfolioImage,
  deletePortfolioImage,
};

export default privatePortfolioController;
