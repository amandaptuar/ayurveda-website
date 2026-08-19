import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';

const CartContext = createContext({});

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user, setShowLoginModal } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [user]);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          quantity,
          product_id,
          selected_size,
          products (
            id,
            name,
            price,
            image_url
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      setCartItems(data || []);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1, selectedSize = null) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    try {
      // Check if item already exists (unique constraint is user_id + product_id)
      const existingItem = cartItems.find(item => item.product_id === productId);

      if (existingItem) {
        const { error } = await supabase
          .from('cart_items')
          .update({ 
            quantity: existingItem.quantity + quantity,
            selected_size: selectedSize || existingItem.selected_size 
          })
          .eq('id', existingItem.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('cart_items')
          .insert([
            { user_id: user.id, product_id: productId, quantity, selected_size: selectedSize }
          ]);
        
        if (error) throw error;
      }
      
      toast.success("Added to cart");
      fetchCart(); // Refresh cart
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', cartItemId);
        
      if (error) throw error;
      fetchCart();
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId);
        
      if (error) throw error;
      toast.success("Removed from cart");
      fetchCart();
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error("Failed to remove item");
    }
  };

  const clearCart = async () => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);
        
      if (error) throw error;
      setCartItems([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const cartTotal = cartItems.reduce((total, item) => {
    const itemPrice = item.selected_size?.price ? Number(item.selected_size.price) : Number(item.products?.price);
    return total + (itemPrice * item.quantity);
  }, 0);

  const value = {
    cartItems,
    loading,
    cartTotal,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    fetchCart,
    appliedCoupon,
    setAppliedCoupon
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
