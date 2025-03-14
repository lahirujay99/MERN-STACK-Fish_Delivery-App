import { createContext, useContext, useState } from "react";
import instance from "../utils/axiosConfig"; // Import your axios instance

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // Updated clearCart function to call backend
  const clearCart = async () => {
    try {
      await instance.delete('/cart/clear'); // Call your backend endpoint to clear the cart
      setCartItems([]); // After successful backend clear, clear frontend state
      console.log("Cart cleared successfully (frontend and backend)");
    } catch (error) {
      console.error("Error clearing cart from backend:", error);
      // Handle error if cart clearing fails on backend (optional: display error to user)
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);