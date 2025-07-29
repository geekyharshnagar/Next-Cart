import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, isAuthReady } = useAuth();
  const [cart, setCart] = useState([]);
  const [isCartReady, setIsCartReady] = useState(false);

  
  useEffect(() => {
    if (!isAuthReady) return;

    const userId = user?.id; 
    
    if (userId) {
     
      const cartKey = `cart_${userId}`;
      const storedCart = localStorage.getItem(cartKey);
      
      try {
        const parsedCart = storedCart ? JSON.parse(storedCart) : [];
        setCart(parsedCart);
      } catch (error) {
        console.error("Error parsing cart data:", error);
        localStorage.removeItem(cartKey);
        setCart([]);
      }
    } else {
   
      setCart([]);
    }
    
    setIsCartReady(true);
  }, [isAuthReady, user?.id]); 

 
  useEffect(() => {
    if (!isCartReady) return;
    
    const userId = user?.id; 
    if (!userId) return;

    const cartKey = `cart_${userId}`;
    try {
      localStorage.setItem(cartKey, JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [cart, user?.id, isCartReady]);

  const addToCart = (product) => {
    const userId = user?.id; 
    
    if (!userId) {
      console.warn("Cannot add to cart: User not logged in");
      return;
    }

    setCart((prev) => {
     
      const existingIndex = prev.findIndex(item => item._id === product._id);
      
      if (existingIndex >= 0) {
        
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], ...product };
        return updated;
      } else {
       
        const newCart = [...prev, product];
       
        return newCart;
      }
    });
  };

  const removeFromCart = (productId) => {
    const userId = user?.id; 
    if (!userId) {
      console.warn("Cannot remove from cart: User not logged in");
      return;
    }

    setCart((prev) => prev.filter((item) => item._id !== productId));
  };

  const clearCart = ({ removeFromStorage = true } = {}) => {
    setCart([]);
    
    const userId = user?.id; 
    if (userId && removeFromStorage) {
      const cartKey = `cart_${userId}`;
      localStorage.removeItem(cartKey);
    }
  };

  const getCartItemsCount = () => {
    return cart.length;
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.price || 0;
      const quantity = item.quantity || 1;
      return total + (price * quantity);
    }, 0);
  };

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        addToCart, 
        removeFromCart, 
        clearCart, 
        getCartItemsCount,
        getCartTotal,
        isCartReady 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);