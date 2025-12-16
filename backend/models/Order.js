// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  items: [
    {
      _id: String,
      name: String,
      price: Number,
      quantity: Number
    }
  ],
  userId: { 
    type: String, 
    required: true 
  }, 
  status: {
    type: String,
    default: 'รอทำ'
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);