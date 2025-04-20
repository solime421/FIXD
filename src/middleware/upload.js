import multer from 'multer';

// store the file in memory, because we'll stream it to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

// this is the actual Express middleware function
export const uploadSingle = upload.single('image');
