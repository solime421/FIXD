import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// GET all specialties
export const getSpecialties = async (req, res) => {
  try {
    // Ensure that the requester is a freelancer
    if (req.user.role !== 'freelancer') {
      return res.status(403).json({ message: "Only freelancers can access specialties." });
    }
    const freelancerId = req.user.id; //got it (decoded) from auth middleware
    const specialties = await prisma.specialty.findMany({
      where: { freelancerId },
      select: { id: true, specialty: true },
      orderBy: { id: 'asc' },
    });
    res.json(specialties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};


// POST a new specialty
export const addSpecialty = async (req, res) => {
  try {
    // Ensure that the requester is a freelancer.
    if (req.user.role !== 'freelancer') {
      return res.status(403).json({ message: "Only freelancers can add specialties." });
    }
    const freelancerId = req.user.id;
    const { specialty } = req.body;

    /* Optionally enforce a maximum of 5 specialties.
    // kao varijant ali cu ovo da uradim najvrv u frontu
    const count = await prisma.specialty.count({
      where: { freelancerId },
    });
    if (count >= 5) {
      return res.status(400).json({ message: "Maximum specialties reached." });
    }
    */

    const newSpecialty = await prisma.specialty.create({
      data: {
        freelancerId,
        specialty,
      },
      select: { id: true, specialty: true },
    });
    res.status(201).json(newSpecialty);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};


//DELETE a specialty
export const deleteSpecialty = async (req, res) => {
  try {
    // Ensure that the requester is a freelancer
    if (req.user.role !== 'freelancer') {
      return res.status(403).json({ message: "Only freelancers can delete specialties." });
    }
    const freelancerId = req.user.id;
    const specialtyId = parseInt(req.params.id);

    // Verify if the speciality exists or if it belongs to the freelancer that made the request
    const specialty = await prisma.specialty.findUnique({ where: { id: specialtyId } });
    if (!specialty || specialty.freelancerId !== freelancerId) {
      return res.status(404).json({ message: "Specialty not found or access denied." });
    }

    const deletedSpecialty = await prisma.specialty.delete({
      where: { id: specialtyId },
    });
    res.json(deletedSpecialty);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};


const privateSpecialityController = {
  getSpecialties,
  addSpecialty,
  deleteSpecialty,
};

export default privateSpecialityController;