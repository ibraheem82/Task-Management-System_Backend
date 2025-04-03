import multer from 'multer';

// Set up Multer storage in memory
const storage = multer.memoryStorage(); 
const upload = multer({ storage }).single('image'); // 'image' is the field name

export default upload;
