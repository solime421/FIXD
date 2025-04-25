import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

// ----------- Importing all routes
import authRoutes from './routes/auth.js';
import publicProfilesRoutes from './routes/publicProfiles.js';
import privateProfilesRoutes from './routes/privateProfiles.js';
import privateFreelancerProfilesRoutes from './routes/privateFreelancerProfiles.js';
import searchRoutes from './routes/searchRoutes.js';
import reviewRoutes from './routes/reviews.js';
import chatsRoutes from './routes/chats.js';
import offersRoutes from './routes/offers.js';
import ordersRoutes from './routes/orders.js';

const app = express();

// Parse JSON bodies
app.use(express.json());

// Enable CORS for our Vite dev server
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// ----------- Register API routes
app.use('/api/auth', authRoutes);
app.use('/api/publicProfile', publicProfilesRoutes);
app.use('/api/privateProfiles', privateProfilesRoutes);
app.use('/api/privateFreelancerProfiles', privateFreelancerProfilesRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/chats', chatsRoutes);
app.use('/api/offers', offersRoutes);
app.use('/api/orders', ordersRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error.' });
});

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET','POST'],
    credentials: true
  }
});

global.io = io;

io.on('connection', socket => {
  console.log('User connected via Socket.IO:', socket.id);
  socket.on('joinRoom', chatId => {
    console.log(`Socket ${socket.id} joining room ${chatId}`);
    socket.join(String(chatId));
  });
  socket.on('disconnect', () => console.log('User disconnected:', socket.id));
});

// Use server.listen instead of app.listen to share HTTP server with Socket.IO
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
