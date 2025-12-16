// src/pages/ShopOrders.jsx
import { useEffect, useState } from 'react';
import api from '../api';
import Toast from '../components/Toast';  // เพิ่ม Toast

export default function ShopOrders() {
  const [orders, setOrders] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);  // เพิ่ม state สำหรับ Toast

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // อัปเดตทุก 10 วินาที
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/api/orders');
      // เรียงจากใหม่ไปเก่า
      const sortedOrders = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(sortedOrders);
    } catch (err) {
      console.error(err);
    }
  };

  const changeStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/api/orders/${orderId}/status`, { status: newStatus });
      
      // แสดง Toast สวย ๆ แทน alert
      const statusText = newStatus === 'กำลังทำ' ? 'เริ่มทำออเดอร์แล้ว' : 'ทำออเดอร์เสร็จเรียบร้อย';
      setToastMessage(`✅ ${statusText}!`);

      fetchOrders(); // รีเฟรชรายการ
    } catch (err) {
      setToastMessage('❌ อัปเดตสถานะไม่สำเร็จ');
    }
  };

  // ส่วนนี้ยังคงอยู่ เผื่อใช้ที่อื่น แต่จะไม่ถูกใช้ในส่วนแสดงผล
  const pendingCount = orders.filter(o => o.status !== 'เสร็จ').length; 

  const getStatusStyle = (status) => {
    switch (status) {
      case 'รอทำ':
        return { bg: '#fff3e0', text: '#ff9800', border: '#ffcc80' };
      case 'กำลังทำ':
        return { bg: '#fff8e1', text: '#ffc107', border: '#ffe082' };
      case 'เสร็จ':
        return { bg: '#e8f5e8', text: '#4caf50', border: '#a5d6a7' };
      default:
        return { bg: '#f5f5f5', text: '#666', border: '#ddd' };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('th-TH', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{
        textAlign: 'center',
        margin: '40px 0',
        fontSize: '2.8em',
        color: '#333',
        fontWeight: 'bold',
      }}>
        ออเดอร์ทั้งหมด
        {/* ลบส่วนแสดงจำนวนออเดอร์ที่รอดำเนินการ (pendingCount) ออกจากตรงนี้ */}
      </h1>

      {orders.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '100px 20px',
          color: '#888',
          fontSize: '1.6em',
        }}>
          <div style={{ fontSize: '4em', marginBottom: '20px' }}>😴</div>
          <p>ยังไม่มีออเดอร์ในขณะนี้</p>
          <p style={{ fontSize: '1.2em', color: '#aaa' }}>รอลูกค้ามาสั่งอาหารกันเถอะ!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          {orders.map(order => {
            const statusStyle = getStatusStyle(order.status);
            const total = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

            return (
              <div
                key={order._id}
                style={{
                  backgroundColor: statusStyle.bg,
                  border: `3px solid ${statusStyle.border}`,
                  borderRadius: '20px',
                  padding: '30px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                  flexWrap: 'wrap',
                  gap: '10px',
                }}>
                  <h2 style={{
                    margin: 0,
                    fontSize: '2em',
                    color: statusStyle.text,
                    fontWeight: 'bold',
                  }}>
                    {order.status}
                  </h2>
                  <p style={{
                    margin: 0,
                    fontSize: '1.1em',
                    color: '#555',
                    backgroundColor: 'rgba(255,255,255,0.7)',
                    padding: '8px 16px',
                    borderRadius: '20px',
                  }}>
                    🕒 สั่งเมื่อ: {formatDate(order.createdAt)}
                  </p>
                </div>

                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  padding: '20px',
                  marginBottom: '20px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                }}>
                  {order.items.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '12px 0',
                        borderBottom: i < order.items.length - 1 ? '1px dashed #ddd' : 'none',
                      }}
                    >
                      <span style={{ fontSize: '1.3em' }}>
                        {item.name} × {item.quantity}
                      </span>
                      <span style={{ fontSize: '1.3em', fontWeight: 'bold', color: '#d32f2f' }}>
                        {item.price * item.quantity} บาท
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '15px',
                }}>
                  <div style={{
                    fontSize: '1.8em',
                    fontWeight: 'bold',
                    color: '#1976d2',
                    backgroundColor: '#e3f2fd',
                    padding: '12px 24px',
                    borderRadius: '16px',
                  }}>
                    ยอดรวม: {total} บาท
                  </div>

                  <div style={{ display: 'flex', gap: '15px' }}>
                    {order.status === 'รอทำ' && (
                      <button
                        onClick={() => changeStatus(order._id, 'กำลังทำ')}
                        style={actionButton('#ff9800', '#ffa000')}
                      >
                        เริ่มทำออเดอร์
                      </button>
                    )}
                    {order.status === 'กำลังทำ' && (
                      <button
                        onClick={() => changeStatus(order._id, 'เสร็จ')}
                        style={actionButton('#4caf50', '#388e3c')}
                      >
                        ทำเสร็จแล้ว
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Toast แจ้งผลการอัปเดตสถานะ */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
}

const actionButton = (bgColor, hoverColor) => ({
  padding: '18px 36px',
  fontSize: '1.4em',
  fontWeight: 'bold',
  backgroundColor: bgColor,
  color: 'white',
  border: 'none',
  borderRadius: '16px',
  cursor: 'pointer',
  boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
  transition: 'all 0.3s ease',
});