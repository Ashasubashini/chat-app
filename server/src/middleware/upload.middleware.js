import multer from "multer";

// Set up multer storage (memory storage since we upload directly to Cloudinary)
const storage = multer.memoryStorage();

const upload = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 } }).single('profilePic');


export default upload;
