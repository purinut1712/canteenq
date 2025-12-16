import axios from 'axios';

export default axios.create({
  // ✅ ต้องแก้ไขบรรทัดนี้หลังได้ URL จาก Render แล้ว
  // ตัวอย่าง: baseURL: 'https://canteenq-api-xxxx.onrender.com' 
  baseURL: 'http://localhost:5001' // <-- ให้แทนที่ด้วย URL จริง
});