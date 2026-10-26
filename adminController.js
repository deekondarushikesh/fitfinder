const Admin = require('../models/Admin');
const Design = require('../models/Design');
const fs = require('fs');
const path = require('path');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid admin credentials' });
    }

    const isPasswordMatch = await admin.matchPassword(password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: 'Invalid admin credentials' });
    }

    res.status(200).json({
      message: 'Admin login successful',
      adminId: admin._id,
      email: admin.email,
    });
  } catch (error) {
    res.status(500).json({ message: 'Admin login failed', error: error.message });
  }
};

exports.addDesign = async (req, res) => {
  try {
    const { title, category } = req.body;

    if (!title || !category) {
      return res.status(400).json({ message: 'Title and category are required' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    // Convert image to base64
    const imageData = fs.readFileSync(req.file.path);
    const base64Image = imageData.toString('base64');
    const imageUrl = `data:${req.file.mimetype};base64,${base64Image}`;

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    const design = new Design({
      title,
      category,
      imageUrl,
    });

    await design.save();
    res.status(201).json({ message: 'Design added successfully', design });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add design', error: error.message });
  }
};

exports.getAllDesigns = async (req, res) => {
  try {
    const designs = await Design.find();
    res.status(200).json({ designs });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch designs', error: error.message });
  }
};

exports.deleteDesign = async (req, res) => {
  try {
    const { id } = req.params;

    const design = await Design.findByIdAndDelete(id);
    if (!design) {
      return res.status(404).json({ message: 'Design not found' });
    }

    res.status(200).json({ message: 'Design deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete design', error: error.message });
  }
};
