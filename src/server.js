require('dotenv').config();
const express = require('express');
//import path, {dirname} from 'path' 
//import { fileURLToPath } from 'url'

// ----------- All routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const freelancersRoutes = require('./routes/freelancers');
const chatsRoutes = require('./routes/chats');
const offersRoutes = require('./routes/offers');
const ordersRoutes = require('./routes/orders');
const checkoutRoutes = require('./routes/checkout');
const reviewRoutes = require('./routes/reviews');

const app = express();
app.use(express.json()); //It tells your Express app to automatically understand JSON data sent in requests


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
//You're telling Express to mount the authRoutes router at the /api/auth path. This means that all routes defined in the authRoutes file will automatically have /api/auth prefixed to their URL.
app.use('/api/users', userRoutes);
app.use('/api/freelancers', freelancersRoutes);
app.use('/api/chats', chatsRoutes);
app.use('/api/offers', offersRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/reviews', reviewRoutes);

// ----------- Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
