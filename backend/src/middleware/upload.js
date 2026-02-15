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

const resourceUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "image/png",
      "image/jpeg",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new Error("Only PDF, PPT, DOC, TXT, and images allowed"),
        false,
      );
    }
    cb(null, true);
  },
});

export const uploadResource = resourceUpload.single("file");

export default upload;
