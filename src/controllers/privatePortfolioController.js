import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { uploadToCloudinary } from '../lib/cloudinary.js';

// GET all portfolio images
export const getPortfolioImages = async (req, res) => {
  try {
    if (req.user.role !== 'freelancer')
      return res.status(403).json({ message: "Only freelancers can access portfolio images." });

    const freelancerId = req.user.id;
    const images = await prisma.portfolioImage.findMany({
      where: { freelancerId },
      select: { id: true, imageUrl: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
    return res.json(images);

  } catch (error) {
    console.error("getPortfolioImages error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

// POST a new portfolio image
export const addPortfolioImage = async (req, res) => {
  try {
    // 1) Role guard
    if (req.user.role !== 'freelancer') {
      return res.status(403).json({ message: "Only freelancers can add portfolio images." });
    }

    // 2) Ensure we got a file from multer
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    // 3) Cloudinary upload with its own error handling
    let imageUrl;
    try {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    } catch (cloudErr) {
      console.error("Cloudinary upload failed:", cloudErr);
      return res
        .status(502)
        .json({ message: "Image upload failed.", detail: cloudErr.message });
    }

    // 4) Save URL into portfolioImage table
    const newImage = await prisma.portfolioImage.create({
      data: { freelancerId: req.user.id, imageUrl },
      select: { id: true, imageUrl: true, createdAt: true },
    });

    return res.status(201).json(newImage);

  } catch (err) {
    // 5) Catch any other unexpected errors
    console.error("addPortfolioImage error:", err);
    return res.status(500).json({ message: "Server error.", detail: err.message });
  }
};

// DELETE a portfolio image
export const deletePortfolioImage = async (req, res) => {
  try {
    if (req.user.role !== 'freelancer')
      return res.status(403).json({ message: "Only freelancers can delete portfolio images." });

    const freelancerId = req.user.id;
    const imageId      = parseInt(req.params.id, 10);

    const image = await prisma.portfolioImage.findUnique({ where: { id: imageId } });
    if (!image || image.freelancerId !== freelancerId)
      return res.status(404).json({ message: "Portfolio image not found or access denied." });

    const deleted = await prisma.portfolioImage.delete({ where: { id: imageId } });
    return res.json(deleted);

  } catch (error) {
    console.error("deletePortfolioImage error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

export default {
  getPortfolioImages,
  addPortfolioImage,
  deletePortfolioImage,
};
