import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { uploadToCloudinary } from '../lib/cloudinary.js';


//GETS Personal Profile
export const getPersonalProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        profilePicture: true,
        phone: true,
        email: true,
        locationAddress: true,
        locationLat: true,
        locationLng: true,
        role: true,
      },
    });
    if (!user) return res.status(404).json({ message: "User not found." });
    
    // returns
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};



//Updates personal data (name, phone, email)
export const updatePersonalData = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, phone } = req.body;
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { firstName, lastName, phone }, //disable email editing in the front
    });
    
    // Return updated user data
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

//Updates profile picture
export const updateProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }
    // 1) Upload the file buffer to Cloudinary
    const url = await uploadToCloudinary(req.file.buffer);

    // 2) Save that URL into the user record
    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: { profilePicture: url },
      select: { profilePicture: true }
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};


export const updateLocation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { address, lat, lng } = req.body;

    // Validate presence and types
    if (
      typeof address !== 'string' ||
      typeof lat     !== 'number' ||
      typeof lng     !== 'number'
    ) {
      return res.status(400).json({
        message: 'Please provide { address: string, lat: number, lng: number }.'
      });
    }

    // Update the three location fields on your User record
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        locationAddress: address,
        locationLat: lat,
        locationLng: lng,
      },
      select: {
        id: true,
        locationAddress: true,
        locationLat: true,
        locationLng: true,
      },
    });

    return res.json(updated);
  } catch (error) {
    console.error('Error in updateLocation:', error);
    return res.status(500).json({ message: "Server error." });
  }
};


const privateProfileController = {
  getPersonalProfile,
  updatePersonalData,
  updateProfilePicture,
  updateLocation,
};

export default privateProfileController;