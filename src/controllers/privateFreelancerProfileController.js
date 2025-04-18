import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

//GET 
export const getFreelancerDetails = async (req, res) => {
  try {
    // guard code - might delete
    if (req.user.role !== 'freelancer') {
      return res.status(403).json({ message: "Only freelancers can access freelancer details." });
    }

    const userId = req.user.id;
    const details = await prisma.freelancerDetails.findUnique({
      where: { userId },
      select: {
        aboutMeSmall: true,
        aboutMeDetailed: true,
        countryOfOrigin: true,
        urgentServiceEnabled: true,
        depositAmount: true,
      },
    });
    if (!details) {
      return res.status(404).json({ message: "Freelancer details not found." });
    }
    res.json(details);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

//UPDATE about me section
export const updateAboutMeSection = async (req, res) => {
  try {
    // guard code - might delete
    if (req.user.role !== 'freelancer') {
      return res.status(403).json({ message: "Only freelancers can update the About Me section." });
    }

    const userId = req.user.id;
    const { aboutMeSmall, aboutMeDetailed, countryOfOrigin } = req.body;
    const updatedDetails = await prisma.freelancerDetails.update({
      where: { userId },
      data: { aboutMeSmall, aboutMeDetailed, countryOfOrigin },
    });
    
    res.json(updatedDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

//UPDATE/TOOGGLE urgent services
export const toggleUrgentService = async (req, res) => {
  try {
    // guard code - might delete
    if (req.user.role !== 'freelancer') {
      return res.status(403).json({ message: "Only freelancers can toggle urgent service." });
    }
    
    const userId = req.user.id;
    const { urgentServiceEnabled } = req.body; // Expected to be true or false
    const updatedDetails = await prisma.freelancerDetails.update({
      where: { userId },
      data: { urgentServiceEnabled }, //send the value from the front - MIGHT CHANGE
    });
    res.json(updatedDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};


//Update deposit amount
export const updateDepositAmount = async (req, res) => {
  try {
    // Ensure only freelancers can update deposit information.
    if (req.user.role !== 'freelancer') {
      return res.status(403).json({ message: "Only freelancers can update deposit information." });
    }
    const userId = req.user.id;
    const { depositAmount } = req.body;
    const updatedDetails = await prisma.freelancerDetails.update({
      where: { userId },
      data: { depositAmount },
    });
    res.json({ depositAmount: updatedDetails.depositAmount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

const privateFreelancerProfileController = {
  getFreelancerDetails,
  updateAboutMeSection,
  toggleUrgentService,
  updateDepositAmount,
};

export default privateFreelancerProfileController;