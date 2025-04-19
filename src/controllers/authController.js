import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


// --------- Register
export const register = async (req, res) => {
  try {
    const { email, firstName, lastName, phone, password, role } = req.body;

    const lowerRole = role.toLowerCase();

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Hash password - salt is = 10
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        firstName: firstName,
        lastName: lastName,
        phone,
        passwordHash,
        role: lowerRole,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        profilePicture: true,
      },
    });

    // If freelancer, initialize freelancerDetails
    if (lowerRole === 'freelancer') {
      await prisma.freelancerDetails.create({
        data: { userId: user.id },
      });
    }

    // Create JWT token
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};


// --------- Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid login informations." });
    }
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid login information." });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ user: { id: user.id, email: user.email, role: user.role, profilePicture: user.profilePicture }, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

export const getMe = async (req, res) => {
  try {
    const me = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        role: true,
        profilePicture: true,
      },
    });
    if (!me) return res.status(404).json({ message: 'User not found.' });
    res.json(me);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error.' });
  }
};


const authController = { register, login, getMe };
export default authController;