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
const ordersRouter = require('./routes/orders'); 

const app = express();


// ✅ โค้ดที่ใส่เพิ่มเพื่ออนุญาตทุก Origin ชั่วคราว (เพื่อแก้ไขปัญหา Login)
app.use(cors({ origin: '*' })); 

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

// 🛑 ถ้าคุณแยก orders ไปที่ routes/orders.js ให้ uncomment บรรทัดนี้:
app.use('/api/orders', ordersRouter); 



// =========================================================
// 4. SERVER START
// =========================================================
// ใช้ Port จาก Environment Variable หรือใช้ 5001 เป็น Default
const PORT = process.env.PORT || 5001; 

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));