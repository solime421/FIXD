import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
//import path, {dirname} from 'path' 
//import { fileURLToPath } from 'url'

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
//import checkoutRoutes from './routes/checkout.js';


const app = express();
app.use(express.json()); //It tells your Express app to automatically understand JSON data sent in requests

//SOCKET.IO

// Create HTTP server from our Express app
const server = http.createServer(app);
// Initialize Socket.IO on the HTTP server with permissive CORS (adjust as needed)
const io = new SocketIOServer(server, {
  cors: { origin: '*' }
});
// Make the io instance globally available
global.io = io;

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('User connected via Socket.IO:', socket.id);

  // Listen for a client joining a chat room
  socket.on('joinRoom', (chatId) => {
    console.log(`Socket ${socket.id} joining room ${chatId}`);
    socket.join(String(chatId));
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});



// ----------- Figuring Out Where Your Files Are
// Essentialy it help us naviage the folder directory from within our code gets the current file name
/*
const __filename = fileURLToPath(import.meta.url);
*/
// Gets the folder name that contains the current file (so we know where we are in the project) 
/*
const __dirname = dirname(__filename);
*/


// ----------- Tell Express Where Your Public Files Are
// Tells express to serve all the filles from the public folder as static assets/files. 
//Hey Express, if someone asks for a CSS, JS, image file, look in the public folder and send it from there.”
/*
app.use(express.static(path.join(__dirname, '../public')));
*/

// ----------- Handle the Homepage
// When someone goes to the homepage /, send them the index.html file from the public folder.”
/*
app.get('/', (req, res)=>{
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})
*/


// ----------- Register API routes
app.use('/api/auth', authRoutes);
//This means that all routes defined in the authRoutes file will automatically have /api/auth prefixed to their URL.
app.use('/api/publicProfiles', publicProfilesRoutes);
app.use('/api/privateProfiles', privateProfilesRoutes);
app.use('/api/privateFreelancerProfiles', privateFreelancerProfilesRoutes); 
app.use('/api/search', searchRoutes);
app.use('/api/reviews', reviewRoutes);  // post review
app.use('/api/chats', chatsRoutes);
app.use('/api/offers', offersRoutes);
app.use('/api/orders', ordersRoutes);
//app.use('/api/checkout', checkoutRoutes);


// ----------- Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));