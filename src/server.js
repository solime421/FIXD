import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
//import path, {dirname} from 'path' 
//import { fileURLToPath } from 'url'

// ----------- Importing all routes
import authRoutes from './routes/auth.js';
import publicProfilesRoutes from './routes/publicProfiles.js';
import privateProfilesRoutes from './routes/privateProfiles.js';
import privateFreelancerProfilesRoutes from './routes/privateFreelancerProfiles.js';
import privatePortfolioRoutes from './routes/privatePortfolio.js';
//import privateSpecialtiesRoutes from './routes/privateSpecialties.js';



/* UNCOMENT ONE BY ONE
import chatsRoutes from './routes/chats.js';
import offersRoutes from './routes/offers.js';
import ordersRoutes from './routes/orders.js';
import checkoutRoutes from './routes/checkout.js';
import reviewRoutes from './routes/reviews.js';
*/



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
app.use('/api/publicProfiles', publicProfilesRoutes);
app.use('/api/privateProfiles', privateProfilesRoutes);
app.use('/api/privateFreelancerProfiles', privateFreelancerProfilesRoutes); 
app.use('/api/privatePortfolio', privatePortfolioRoutes);
//app.use('/api/privateSpecialties', privateSpecialtiesRoutes);

//This means that all routes defined in the authRoutes file will automatically have /api/auth prefixed to their URL.



/*  UNCOMENT ONE BY ONE
app.use('/api/freelancers', freelancersRoutes);
app.use('/api/chats', chatsRoutes);
app.use('/api/offers', offersRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/reviews', reviewRoutes);
*/



// ----------- Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
