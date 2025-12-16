// src/pages/Cart.jsx (ใช้ props userId เหมือนเดิม)
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';

// ✅ รับ userId เป็น props
export default function Cart({ userId }) { 
  const { cart, updateQuantity, removeFromCart, checkout } = useCart();
  const navigate = useNavigate();
  const [itemToDelete, setItemToDelete] = useState(null);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const submit = async () => {
    if (cart.length === 0) {
        alert('ตะกร้าสินค้าว่างเปล่า กรุณาเพิ่มรายการอาหารก่อนสั่งซื้อ');
        return;
    }
    // ✅ เช็ค userId ก่อนสั่งซื้อ
    if (!userId) {
        alert('ไม่พบ ID ผู้ใช้ กรุณาเข้าสู่ระบบใหม่');
        return;
    }

    try {
      // ✅ ส่ง userId ไปด้วย
      await checkout(userId); 
      navigate('/order-success');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้';
      alert(`เกิดข้อผิดพลาดในการสั่งซื้อ: ${errorMessage}`);
      console.error('Checkout error:', err);
    }
  };

  const openDeleteModal = (itemId) => {
    setItemToDelete(itemId);
  };

  const closeDeleteModal = () => {
    setItemToDelete(null);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      removeFromCart(itemToDelete);
      closeDeleteModal();
    }
  };
  
  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity > 0) {
      updateQuantity(itemId, newQuantity);
    }
  };


  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>ตะกร้าสินค้า</h1>

      {cart.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '80px 20px',
          color: '#888',
        }}>
          <p style={{ fontSize: '2em', marginBottom: '30px' }}>
            🛒 ตะกร้ายังว่างอยู่
          </p>
          <p style={{ fontSize: '1.4em', marginBottom: '40px' }}>
            มาดูเมนูอาหารอร่อย ๆ กันเถอะ!
          </p>
          <Link to="/menu">
            <button style={{
              padding: '18px 40px',
              fontSize: '1.4em',
              fontWeight: 'bold',
              backgroundColor: '#ff9800',
              color: 'white',
              border: 'none',
              borderRadius: '15px',
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(255,152,0,0.3)',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 12px 30px rgba(255,152,0,0.4)'}
            onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 8px 20px rgba(255,152,0,0.3)'}
            >
              ไปเลือกเมนูอาหาร
            </button>
          </Link>
        </div>
      ) : (
        <>
          {cart.map(item => (
            <div
              key={item._id}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '20px',
                border: '1px solid #ddd',
                borderRadius: '12px',
                marginBottom: '15px',
                backgroundColor: '#fff',
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
              }}
            >
              <img
                src={item.image || 'https://via.placeholder.com/120?text=อาหาร'}
                alt={item.name}
                style={{
                  width: '120px',
                  height: '120px',
                  objectFit: 'cover',
                  borderRadius: '12px',
                  marginRight: '20px',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                }}
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/120?text=ไม่มีรูป';
                }}
              />

              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 8px 0' }}>{item.name}</h3>
                <p style={{ margin: 0, color: '#555' }}>
                  ราคา {item.price} บาท
                </p>
              </div>

              {/* ปุ่มปรับจำนวน */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginRight: '40px' }}>
                <button
                  onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                  style={qtyButtonStyle}
                >
                  –
                </button>
                <span style={{ fontSize: '1.3em', fontWeight: 'bold', minWidth: '40px', textAlign: 'center' }}>
                  {item.quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                  style={qtyButtonStyle}
                >
                  +
                </button>
              </div>

              {/* ราคารวม + ปุ่มลบ อยู่ในบรรทัดเดียวกัน (ต่อท้ายราคา) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <p style={{ 
                  margin: 0, 
                  fontSize: '1.4em', 
                  fontWeight: 'bold',
                  color: '#d32f2f',
                  whiteSpace: 'nowrap'
                }}>
                  {item.price * item.quantity} บาท
                </p>

                {/* ปุ่ม "ลบ" */}
                <button
                  onClick={() => openDeleteModal(item._id)}
                  style={{
                    padding: '10px 18px',
                    backgroundColor: '#ff4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '0.95em',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 10px rgba(255,68,68,0.2)',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#e63333';
                    e.currentTarget.style.boxShadow = '0 6px 15px rgba(255,68,68,0.3)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#ff4444';
                    e.currentTarget.style.boxShadow = '0 4px 10px rgba(255,68,68,0.2)';
                  }}
                >
                  ลบ
                </button>
              </div>
            </div>
          ))}

          <div style={{
            textAlign: 'right',
            fontSize: '1.8em',
            fontWeight: 'bold',
            margin: '40px 0 20px',
            padding: '20px',
            backgroundColor: '#e7f5ff',
            borderRadius: '12px',
            color: '#1976d2',
          }}>
            ยอดรวมทั้งหมด: {total} บาท
          </div>

          <button onClick={submit} style={{
            width: '100%',
            padding: '18px',
            fontSize: '1.4em',
            fontWeight: 'bold',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
          }}>
            ยืนยันสั่งซื้อ
          </button>
        </>
      )}

      {/* Modal ยืนยันการลบ */}
      {itemToDelete && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }} onClick={closeDeleteModal}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            textAlign: 'center',
            maxWidth: '400px',
            width: '90%',
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '1.5em', color: '#333' }}>
              ยืนยันการลบ?
            </h3>
            <p style={{ color: '#666', marginBottom: '30px' }}>
              คุณต้องการลบรายการนี้ออกจากตะกร้าใช่หรือไม่?
            </p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button onClick={closeDeleteModal} style={{
                padding: '12px 24px',
                fontSize: '1.1em',
                backgroundColor: '#f0f0f0',
                color: '#333',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
              }}>
                ยกเลิก
              </button>
              <button onClick={confirmDelete} style={{
                padding: '12px 24px',
                fontSize: '1.1em',
                fontWeight: 'bold',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
              }}>
                ลบเลย
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const qtyButtonStyle = {
  width: '40px',
  height: '40px',
  fontSize: '1.4em',
  backgroundColor: '#f0f0f0',
  border: '1px solid #ccc',
  borderRadius: '8px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};