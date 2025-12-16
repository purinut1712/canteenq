const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import Models
const Order = require('./models/Order');
const User = require('./models/User'); 
// (ถ้ามี Menu Model ก็ Import ด้วย)

// Import Routers
const menuRouter = require('./routes/menu');
const authRouter = require('./routes/auth');  
// ถ้าคุณแยก orders ไปที่ routes/orders.js ก็ใช้บรรทัดนี้:
// const ordersRouter = require('./routes/orders'); 

const app = express();

// =========================================================
// 1. CORS CONFIGURATION (แก้ไขสำคัญสำหรับ Deploy)
// =========================================================

// ✅ แทนที่ URL นี้ด้วย URL จริงของ Frontend Vercel ของคุณ
const FRONTEND_URL = 'https://canteenq.vercel.app'; // <--- แก้ไขตรงนี้

const allowedOrigins = [
    FRONTEND_URL, 
    'http://localhost:5173', // สำหรับการทดสอบในเครื่อง (ถ้าใช้ Vite)
    'http://localhost:3000', // สำหรับการทดสอบในเครื่อง (ถ้าใช้ CRA)
];

const corsOptions = {
  origin: (origin, callback) => {
    // อนุญาตถ้าไม่มี Origin (เช่น postman) หรือ Origin อยู่ในรายการที่อนุญาต
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error('CORS blocked access from:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // ถ้ามีการส่ง cookie/header เช่น Authorization
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// =========================================================
// 2. MongoDB CONNECTION
// =========================================================
mongoose.connect(
  // URL เดิมที่คุณใช้:
  'mongodb+srv://purinutkrut_db_user:FWrwLe27O9DvCcSI@canteenq.ukeqyuk.mongodb.net/canteenq' 
)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));


// =========================================================
// 3. ROUTES DEFINITION
// =========================================================

// Test Route
app.get('/', (req, res) => res.send('CanteenQ Backend running'));

// Use Routers
app.use('/api/menu', menuRouter);
app.use('/api/auth', authRouter);  

// ถ้าคุณใช้ routes/orders.js ให้ uncomment บรรทัดนี้:
// app.use('/api/orders', ordersRouter); 

// (ถ้าคุณไม่ได้ใช้ ordersRouter.js และต้องการให้ API orders อยู่ใน server.js เหมือนเดิม)
// 1. ORDERS: Fetch ALL orders (for Shop)
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }); 
    res.json(orders);
  } catch (err) {
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
    res.status(500).json({ message: err.message });
  }
});


// 3. ORDERS: Create new order
app.post('/api/orders', async (req, res) => {
  try {
    const { items, userId } = req.body; 
    
    if (!userId || !items || items.length === 0) {
      return res.status(400).json({ message: 'Missing user ID or order items.' }); 
    }

    const order = new Order({ 
      items: items, 
      userId: userId, 
      status: 'รอทำ' 
    });
    
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// 4. UPDATE ORDER STATUS
app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
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
    res.status(500).json({ message: err.message });
  }
});


// =========================================================
// 4. SERVER START
// =========================================================
// ✅ ใช้ Port จาก Environment Variable หรือใช้ 5001 เป็น Default
const PORT = process.env.PORT || 5001; 

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));