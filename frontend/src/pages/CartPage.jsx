import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import instance from "../utils/axiosConfig";

const CartPage = () => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const deliveryFee = 5; // Fixed delivery fee
  const [removeItemError, setRemoveItemError] = useState(null); // State for remove item error

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { data } = await instance.get("/cart");
        setCartItems(data.items);
      } catch (err) {
        console.log(err);
        setError("Failed to load cart items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchCart();
  }, [user]);

  const handleQuantityChange = async (item, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const updateUrl = `/cart/`;
      await instance.put(updateUrl, {
        itemId: item.item._id,
        quantity: newQuantity,
      });
      const cartResponse = await instance.get("/cart");
      setCartItems(cartResponse.data.items);
    } catch (err) {
      console.error("Failed to update quantity:", err);
      console.error("Error Response Data:", err.response?.data);
      setError("Failed to update quantity. Please try again.");
    }
  };

  const handleRemoveItem = async (itemId) => {
    setRemoveItemError(null); // Reset remove item error state
    try {
      await instance.delete(`/cart/remove/${itemId}`);
      const cartResponse = await instance.get("/cart");
      setCartItems(cartResponse.data.items);
    } catch (err) {
      console.log(err);
      setRemoveItemError("Failed to remove item. Please try again."); // Set specific error for remove item
    }
  };

  const handleClearCart = async () => {
    try {
      await instance.delete("/cart/clear");
      setCartItems([]);
    } catch (err) {
      console.log(err);
      setError("Failed to clear cart. Please try again.");
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = subtotal + deliveryFee;

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Your cart is empty
        </h2>
        <Link
          to="/items"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>
      {removeItemError && ( // Display remove item error message if it exists
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h3 className="font-semibold">Something went wrong!</h3>
          </div>
          <p className="mt-2 text-sm">{removeItemError}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items Section */}
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="flex flex-col md:flex-row gap-6 p-4 border rounded-lg shadow-sm"
            >
              <img
                src={item?.item?.image}
                alt={item?.item?.name}
                className="w-32 h-32 object-cover rounded-lg"
              />

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {item?.item?.name}
                  </h3>
                  <button
                    onClick={() => handleRemoveItem(item.item._id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-gray-600 mt-1">
                  LKR {item?.item?.price.toFixed(2)}
                </p>

                <div className="flex items-center mt-4">
                  <button
                    onClick={() =>
                      handleQuantityChange(item, item.quantity - 1)
                    }
                    className="px-3 py-1 border rounded-l bg-gray-100 hover:bg-gray-200"
                    disabled={item.quantity === 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-1 border-t border-b">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      handleQuantityChange(item, item.quantity + 1)
                    }
                    className="px-3 py-1 border rounded-r bg-gray-100 hover:bg-gray-200"
                  >
                    +
                  </button>
                </div>

                <div className="mt-4">
                  <p className="text-lg font-semibold">
                    Subtotal: LKR{" "}
                    {(item?.item?.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm h-fit sticky top-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Order Summary
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">
                Subtotal ({cartItems.length} items)
              </span>
              <span className="font-semibold">LKR {subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Fee</span>
              <span className="font-semibold">
                LKR {deliveryFee.toFixed(2)}
              </span>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>LKR {total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <Link
              to="/checkout"
              className="block w-full bg-green-600 text-white py-3 px-6 rounded-lg text-center hover:bg-green-700 transition-colors"
            >
              Proceed to Checkout
            </Link>

            <button
              onClick={handleClearCart}
              className="w-full bg-gray-100 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear Cart
            </button>

            <Link
              to="/items"
              className="block w-full text-center text-blue-600 hover:text-blue-700"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
