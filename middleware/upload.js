const multer = require('multer');
const path = require('path');

// Store images in public/images
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/images'),
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, '-')); // timestamp + clean filename
  }
});

// File filter: only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true); // accept file
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, gif) are allowed'));
  }
};

// Limit file size to 3MB
const limits = { fileSize: 3 * 1024 * 1024 }; // 3MB

const upload = multer({ storage, fileFilter, limits });

module.exports = upload;
