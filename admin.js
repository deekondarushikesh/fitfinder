const express = require('express');
const multer = require('multer');
const { login, addDesign, getAllDesigns, deleteDesign } = require('../controllers/adminController');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'backend/uploads');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + '-' + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.post('/login', login);
router.post('/design/add', upload.single('image'), addDesign);
router.get('/design/all', getAllDesigns);
router.delete('/design/:id', deleteDesign);

module.exports = router;
