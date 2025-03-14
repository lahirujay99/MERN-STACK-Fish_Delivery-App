import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import instance from "../utils/axiosConfig";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await instance.get("/orders/me");
        setOrders(response.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err.response?.data?.message || "Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    } else {
      setLoading(false); // If no user, not loading
    }
  }, [user]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Please sign in to view your orders.
        </h2>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          No orders placed yet.
        </h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="border rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">
              Order ID: {order._id}
            </h2>
            <p className="text-gray-600 mb-2">
              Order Date:{" "}
              {new Date(order.createdAt).toLocaleDateString()}{" "}
              {new Date(order.createdAt).toLocaleTimeString()}
            </p>
            <h3 className="font-semibold mb-2">Items:</h3>
            <ul className="list-disc list-inside mb-4">
              {order.items.map((item) => (
                <li key={item._id} className="mb-1">
                  {item.item ? item.item.name : "Item Deleted"} - Quantity: {item.quantity} - Price: LKR {item.price.toFixed(2)}
                </li>
              ))}
            </ul>
            <div className="font-semibold">
              Total Amount: LKR {order.totalAmount.toFixed(2)}
            </div>
            <div className="mt-2">
              Status: <span className="font-medium">{order.orderStatus}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;