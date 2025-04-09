import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


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
        location: true,
        billingInfo: true,
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
    const userId = req.user.id;
    // Expect only the profilePicture field in the request body
    const { profilePicture } = req.body;
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { profilePicture },
    });
    
    // Return the updated user data
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

//Updates the location
export const updateLocation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { location } = req.body; // e.g. { city: "New York", country: "USA" }
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { location },
    });
    
    //returns
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};


// Updates the billing information
export const updateBillingInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { billingInfo } = req.body; // e.g. { cardNumber: "**** **** **** 1234", expiry: "12/25", cvv: "***" }
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { billingInfo },
    });
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

const privateProfileController = {
  getPersonalProfile,
  updatePersonalData,
  updateProfilePicture,
  updateLocation,
  updateBillingInfo,
};

export default privateProfileController;