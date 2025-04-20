import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { uploadToCloudinary } from '../lib/cloudinary.js';

//GET
export const getPortfolioImages = async (req, res) => {
  try {
    if (req.user.role !== 'freelancer') {
      return res.status(403).json({ message: "Only freelancers can access portfolio images." });
    }
    const freelancerId = req.user.id;
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
    if (req.user.role !== 'freelancer') {
      return res.status(403).json({ message: "Only freelancers can add portfolio images." });
    }
    const freelancerId = req.user.id;

    // Enforce a maximum of 9 images
    const count = await prisma.portfolioImage.count({ where: { freelancerId } });
    if (count >= 9) {
      return res.status(400).json({ message: "You can only have up to 9 portfolio images." });
    }

    // multer should have populated req.file.buffer
    if (!req.file?.buffer) {
      return res.status(400).json({ message: "No image file provided." });
    }

    // Upload to Cloudinary
    const imageUrl = await uploadToCloudinary(req.file.buffer);

    // Save record in DB
    const newImage = await prisma.portfolioImage.create({
      data: { freelancerId, imageUrl },
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
    if (req.user.role !== 'freelancer') {
      return res.status(403).json({ message: "Only freelancers can delete portfolio images." });
    }
    const freelancerId = req.user.id;
    const imageId = parseInt(req.params.id, 10);

    // Verify ownership
    const image = await prisma.portfolioImage.findUnique({ where: { id: imageId } });
    if (!image || image.freelancerId !== freelancerId) {
      return res.status(404).json({ message: "Portfolio image not found or access denied." });
    }

    // Delete
    const deletedImage = await prisma.portfolioImage.delete({ where: { id: imageId } });
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
