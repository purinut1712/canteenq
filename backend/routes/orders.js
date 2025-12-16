const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// create order
router.post('/', async (req, res) => {
  // Logic การสร้าง Order
  const { items, userId } = req.body;
  // ... (ควรเพิ่มการตรวจสอบ userId และ items เหมือนใน server.js)
  const order = new Order(req.body);
  await order.save();
  res.json(order);
});

// get all orders
router.get('/', async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

// update status
router.put('/:id/status', async (req, res) => { // เปลี่ยน route เป็น /:id/status เพื่อให้ชัดเจน
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  res.json(order);
});

// get customer orders (ควรแยกไปอยู่ที่นี่เพื่อให้ router สะอาด)
router.get('/customer/:userId', async (req, res) => { 
    try {
        const orders = await Order
            .find({ userId: req.params.userId })
            .sort({ createdAt: -1 }); 
        res.json(orders);
    } catch (err) {
        console.error('Error fetching customer orders:', err);
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;