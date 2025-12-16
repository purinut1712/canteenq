import { useEffect, useState } from 'react';
import api from '../api';

export default function CustomerOrders({ userId }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'พร้อมรับ':
        // ✅ สีเขียว (พร้อมรับ) - กระพริบ
        return { 
            color: '#1e7e34', 
            backgroundColor: '#e2f0e4', 
            fontWeight: 'bold', 
            animation: 'blink 1s infinite' 
        }; 
      case 'กำลังทำ':
        // ✅ สีส้ม/เหลือง (กำลังทำ)
        return { 
            color: '#ffc107', 
            backgroundColor: '#fff7e6', 
            fontWeight: 'bold' 
        }; 
      case 'รับแล้ว':
      case 'เสร็จสิ้น': 
      case 'เสร็จ':      // ✅ เพิ่ม case 'เสร็จ'
      case 'สำเร็จ':    
        // สีเทาเข้ม (รับแล้ว/เสร็จสิ้น)
        return { 
            color: '#4a5749ff', 
            backgroundColor: '#dee2e6', 
            fontWeight: 'normal' 
        }; 
      case 'รอทำ':
        // ✅ สีฟ้า (รอทำ)
        return { 
            color: '#007bff', 
            backgroundColor: '#e6f2ff', 
            fontWeight: 'bold' 
        }; 
      case 'ยกเลิก': 
        // สีแดง (ยกเลิก)
        return { 
            color: '#dc3545', 
            backgroundColor: '#f8d7da', 
            fontWeight: 'bold' 
        };
      default:
        // 🚨 สถานะที่ไม่ตรงกับรายการ 
        return { 
            color: '#6f42c1', 
            backgroundColor: '#f3e8ff', 
            fontWeight: 'bold' 
        }; 
    }
  };

  const fetchOrders = async () => {
    // ✅ การเช็ค userId ที่ทำให้เกิด Error เมื่อไม่ได้รับค่า
    if (!userId) { 
      setError('ไม่พบ ID ผู้ใช้ กรุณาเข้าสู่ระบบใหม่');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      // เรียก API ดึงประวัติการสั่งซื้อด้วย userId
      const res = await api.get(`/api/orders/customer/${userId}`); 
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      setError('ไม่สามารถดึงประวัติการสั่งซื้อได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // 🔔 ระบบแจ้งเตือนสถานะ: ดึงข้อมูลใหม่ทุกๆ 5 วินาที
    const intervalId = setInterval(fetchOrders, 5000); 

    return () => clearInterval(intervalId); // Cleanup function
  }, [userId]);

  if (loading) return <p style={{ textAlign: 'center', marginTop: '50px', fontSize: '1.5em' }}>กำลังโหลดประวัติการสั่งซื้อ...</p>;
  if (error) return <p style={{ textAlign: 'center', marginTop: '50px', color: 'red', fontSize: '1.5em' }}>❌ {error}</p>;

  const getTotal = (items) => items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', margin: '30px 0', fontSize: '2.5em' }}>
        ประวัติและสถานะการสั่งซื้อ
      </h1>

      {/* CSS สำหรับ Animation */}
      <style>{`
        @keyframes blink {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>

      {orders.length === 0 ? (
        <p style={{ textAlign: 'center', fontSize: '1.2em', color: '#888', padding: '60px' }}>
          คุณยังไม่มีประวัติการสั่งซื้อ
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map((order, index) => (
            <div key={order._id} style={{
              backgroundColor: 'white',
              padding: '25px',
              borderRadius: '15px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
              // เน้นขอบซ้ายด้วยสีสถานะพร้อมรับ
              borderLeft: `5px solid ${order.status === 'พร้อมรับ' ? '#28a745' : '#ccc'}` 
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, fontSize: '1.3em', color: '#333' }}>
                  คำสั่งซื้อ #{orders.length - index} 
                </h3>
                {/* สถานะพร้อมใช้ getStatusStyle() ที่ปรับปรุงแล้ว */}
                <span style={{ 
                    fontSize: '1.2em', 
                    padding: '8px 15px', 
                    borderRadius: '8px', 
                    ...getStatusStyle(order.status) // ✅ ใช้ฟังก์ชันที่ปรับปรุง
                }}>
                  สถานะ: {order.status}
                </span>
              </div>
              
              <ul style={{ listStyle: 'none', padding: 0, margin: '15px 0' }}>
                {order.items.map((item) => (
                  <li key={item._id} style={{ padding: '5px 0', borderBottom: '1px dotted #eee', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{item.name} (x{item.quantity})</span>
                    <span>{item.price * item.quantity} บาท</span>
                  </li>
                ))}
              </ul>
              
              <div style={{ borderTop: '2px solid #eee', paddingTop: '10px', marginTop: '10px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.3em' }}>
                <span>ยอดรวม:</span>
                <span style={{ color: '#e91e63' }}>{getTotal(order.items)} บาท</span>
              </div>
              <p style={{ margin: '10px 0 0 0', fontSize: '0.9em', color: '#999' }}>
                สั่งเมื่อ: {new Date(order.createdAt).toLocaleString('th-TH')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}