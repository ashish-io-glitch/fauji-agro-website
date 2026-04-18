const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const Order = require('./models/Order');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Frontend
app.use(express.static(path.join(__dirname, '')));

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fauji_agro';
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB successfully!'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// API Route to submit order/enquiry
app.post('/api/orders', async (req, res) => {
  try {
    const { fullName, phone, email, productInterest, quantity, message } = req.body;
    
    if (!fullName || !phone || !email || !productInterest || !quantity) {
      return res.status(400).json({ success: false, error: 'Please fill out all required fields.' });
    }

    const newOrder = new Order({
      fullName,
      phone,
      email,
      productInterest,
      quantity,
      message
    });

    await newOrder.save();
    
    // Future Implementation: Nodemailer logic could be placed here to send an email notification

    res.status(201).json({ success: true, message: 'Your enquiry has been successfully submitted! We will contact you soon.' });
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).json({ success: false, error: 'Server error while submitting form.' });
  }
});

// Fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
