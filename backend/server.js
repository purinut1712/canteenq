const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Order = require('./models/Order');
const User = require('./models/User'); 
const menuRouter = require('./routes/menu');
const authRouter = require('./routes/auth');  

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection (ใช้ URL เดิมที่คุณให้มา)
mongoose.connect(
  'mongodb+srv://purinutkrut_db_user:FWrwLe27O9DvCcSI@canteenq.ukeqyuk.mongodb.net/canteenq' 
)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// ================== ROUTES ==================

// Test Route
app.get('/', (req, res) => res.send('Backend running'));

// Use Routers
app.use('/api/menu', menuRouter);
app.use('/api/auth', authRouter);  

// 1. ORDERS: Fetch ALL orders (for Shop - No populate)
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order
      .find()
      .sort({ createdAt: -1 }); 

    res.json(orders);
  } catch (err) {
    console.error('Error fetching all orders:', err);
    res.status(500).json({ message: err.message });
  }
});


// 2. ORDERS: Customer History (Filtered by userId)
app.get('/api/orders/customer/:userId', async (req, res) => {
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


// 3. ORDERS: Create new order (Ensure userId is saved)
app.post('/api/orders', async (req, res) => {
  try {
    const { items, userId } = req.body; 
    
    if (!userId) {
      return res.status(400).json({ message: 'Missing user ID for order.' }); 
    }
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order items are required.' });
    }

    const order = new Order({ 
      items: items, 
      userId: userId, 
      status: 'รอทำ' 
    });
    
    await order.save();
    console.log('Order created:', order);
    res.json(order);
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ message: err.message });
  }
});


// 4. UPDATE ORDER STATUS
app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: 'Status is required' });

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ message: err.message });
  }
});


// 5. DELETE order
app.delete('/api/orders/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted' });
  } catch (err) {
    console.error('Error deleting order:', err);
    res.status(500).json({ message: err.message });
  }
});

// ROUTER ENDPOINTS
// /api/auth/* is handled in auth.js
// /api/menu/* is handled in menu.js (CRUD)
// /api/orders (get all, create, update status, delete) are handled above and in orders.js (ถ้าคุณแยกไฟล์ orders.js ออกมา)

// ตรวจสอบ: เนื่องจากคุณมี orders.js อยู่แล้ว แต่โค้ดใน server.js ก็มี API เกี่ยวกับ orders ด้วย 
// เพื่อให้โค้ดสะอาด ควรสลับไปใช้ orders.js ที่คุณส่งมา:
// app.use('/api/orders', require('./routes/orders')); 
// แต่ถ้าใช้ตามโค้ด server.js นี้ก็ทำงานได้โดยไม่ใช้ orders.js 
// ผมขอใช้ตามโค้ด server.js นี้ก่อนเพื่อให้แน่ใจว่า API ครบถ้วน

// ✅ การแก้ไขสำคัญ: ใช้ Port จาก Environment Variable
const PORT = process.env.PORT || 5001; 

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));