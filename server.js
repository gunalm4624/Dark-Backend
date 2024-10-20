const express = require('express');
const Razorpay = require('razorpay');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const port =process.env.PORT || 3000;

// Use environment variables for Razorpay keys
const razorpayKeyId = process.env.RAZORPAY_KEY_ID || 'rzp_live_NJhjg5FQ7waeGc';
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || 'KGhgrLHMzE3fQOhmr54FYevk';

// Configure CORS
const allowedOrigins = [
  'http://localhost:4200',
  'http://localhost:55409',
  'http://darkstudioweb.in',
  'https://darkstudioweb.in'  // Make sure this is included
];

app.use(cors({
  origin:"*",
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(bodyParser.json());

const razorpay = new Razorpay({
  key_id: razorpayKeyId,
  key_secret: razorpayKeySecret,
});

app.post('/createOrder', async (req, res) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  console.log('Received create order request with amount:', amount);

  const options = {
    amount: amount * 100, // Convert amount to paise
    currency: "INR",
    receipt: "receipt#" + Date.now(),
  };

  try {
    const order = await razorpay.orders.create(options);
    console.log('Order created:', order);
    res.json({ orderId: order.id, amount });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/success', async (req, res) => {
  try {
    // You may want to handle additional logic here (like saving payment details)
    res.send("Payment successful");
  } catch (error) {
    console.error('Error processing payment success:', error);
    res.status(500).send({ error: error.message });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
