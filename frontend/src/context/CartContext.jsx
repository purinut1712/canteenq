import { createContext, useContext, useState } from 'react';
import api from '../api';

const CartContext = createContext();

// Hook ที่ใช้ในคอมโพเนนต์
export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
        const storedCart = localStorage.getItem('cart');
        return storedCart ? JSON.parse(storedCart) : [];
    } catch (e) {
        return [];
    }
  });

  const addToCart = (menu) => {
    const exist = cart.find(i => i._id === menu._id);
    if (exist) {
      setCart(cart.map(i =>
        i._id === menu._id
          ? { ...i, quantity: i.quantity + 1 }
          : i
      ));
    } else {
      setCart([...cart, { ...menu, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id); 
      return;
    }
    setCart(cart.map(item =>
      item._id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(i => i._id !== id));
  };

  const checkout = async (userId) => { 
    if (!userId) {
        throw new Error('User ID is missing for checkout.'); 
    }
    await api.post('/api/orders', { items: cart, userId: userId });
    setCart([]);
    localStorage.removeItem('cart'); 
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      updateQuantity,
      removeFromCart,
      checkout,
    }}>
      {children}
    </CartContext.Provider>
  );
}