import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("only image files are allowed"), false);
    }
    cb(null, true);
  },
});

const MAX_FILE_SIZE = 25 * 1024 * 1024;

// middleware/upload.js
const resourceUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
  
    const allowedMimeTypes = [
    
      'application/pdf',
      
      'application/vnd.ms-powerpoint',     
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      
      'application/msword',                     
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
    
      'text/plain',                             
    
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error('Unsupported file type'), false);
    }
    cb(null, true);
  }
});

export const uploadResource = resourceUpload.single("file");

export default upload;
