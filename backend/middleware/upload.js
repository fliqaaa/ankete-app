const multer = require('multer');
const path = require('path');

// konfiguracija shranjevanja
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // shrani v backend/uploads
    cb(null, path.join(__dirname, '..', 'uploads'));
  },

  filename: (req, file, cb) => {
    // unikaten filename
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});

// filtriranje (dovolimo samo slike)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Dovoljene so samo slike (jpg, png)'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;