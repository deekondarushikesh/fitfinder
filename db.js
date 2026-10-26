const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI =  "mongodb://127.0.0.1:27017/virtual_try_on";
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
