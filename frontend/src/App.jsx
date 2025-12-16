import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';

import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import OrderSuccess from './pages/OrderSuccess';
import ShopOrders from './pages/ShopOrders';
import AdminMenu from './pages/AdminMenu';
import CustomerOrders from './pages/CustomerOrders'; 
import { useCart } from './context/CartContext';

// Protected Route สำหรับผู้ที่ต้อง login ก่อน
function ProtectedRoute({ children, role }) {
  if (!role) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Protected Route เฉพาะร้านค้า (role = 'shop')
function ShopOnlyRoute({ children, role }) {
  if (role !== 'shop') {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const [role, setRoleState] = useState(localStorage.getItem('role') || null);
  const [userId, setUserIdState] = useState(localStorage.getItem('userId') || null); 
  const { addToCart } = useCart();

  const handleSetRole = (newRole, newUserId = null) => {
    if (newRole) {
      localStorage.setItem('role', newRole);
      setRoleState(newRole);
      
      if (newUserId) {
        localStorage.setItem('userId', newUserId);
        setUserIdState(newUserId);
      }
    } else {
      // Logout
      localStorage.removeItem('role');
      localStorage.removeItem('userId'); 
      setRoleState(null);
      setUserIdState(null); 
    }
  };


  return (
    <BrowserRouter>
      <Navbar role={role} setRole={handleSetRole} /> 

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login setRole={handleSetRole} />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/menu"
          element={
            <ProtectedRoute role={role}>
              <Menu addToCart={addToCart} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute role={role}>
              <Cart userId={userId} /> 
            </ProtectedRoute>
          }
        />

        <Route
          path="/order-success"
          element={
            <ProtectedRoute role={role}>
              <OrderSuccess />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/order-history"
          element={
            <ProtectedRoute role={role}>
              <CustomerOrders userId={userId} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/shop/orders"
          element={
            <ShopOnlyRoute role={role}>
              <ShopOrders />
            </ShopOnlyRoute>
          }
        />

        <Route
          path="/admin/menu"
          element={
            <ShopOnlyRoute role={role}>
              <AdminMenu />
            </ShopOnlyRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;