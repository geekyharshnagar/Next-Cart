import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {
  FaBox,
  FaUserAlt,
  FaMapMarkerAlt,
  FaCreditCard,
  FaSearch,
  FaCheck,
  FaShippingFast,
  FaTruck,
  FaTimes,
} from "react-icons/fa";

const OrderRequests = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 4;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAdminOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/orders/admin", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
      } catch (err) {
        console.error(" Error fetching admin orders:", err.message);
      }
    };

    fetchAdminOrders();
  }, [token]);

  const getNextStatus = (current) => {
    switch (current) {
      case "Pending":
        return "Accepted";
      case "Accepted":
        return "Shipped";
      case "Shipped":
        return "Delivered";
      default:
        return current;
    }
  };

  const updateStatus = async (orderId, itemId, currentStatus) => {
    const newStatus = getNextStatus(currentStatus);
    try {
      await axios.patch(
        `http://localhost:5000/api/orders/${orderId}/item/${itemId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? {
                ...order,
                cartItems: order.cartItems.map((item) =>
                  item._id === itemId ? { ...item, status: newStatus } : item
                ),
              }
            : order
        )
      );
    } catch (error) {
      console.error(" Failed to update item status:", error.response?.data || error.message);
    }
  };

  const cancelOrderItem = async (orderId, itemId) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/orders/${orderId}/item/${itemId}/status`,
        { status: "Cancelled" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? {
                ...order,
                cartItems: order.cartItems.map((item) =>
                  item._id === itemId ? { ...item, status: "Cancelled" } : item
                ),
              }
            : order
        )
      );
    } catch (error) {
      console.error(" Cancel failed:", error.response?.data || error.message);
    }
  };

  const filteredOrders = orders.filter((order) =>
    order.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLast = currentPage * ordersPerPage;
  const indexOfFirst = indexOfLast - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-blue-700">
        <FaBox /> Order Requests
      </h2>

      <div className="mb-5 relative w-full sm:w-1/2">
        <FaSearch className="absolute top-3 left-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search by user email..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="pl-10 pr-4 py-2 border rounded w-full"
        />
      </div>

      {currentOrders.length === 0 ? (
        <p className="text-gray-500">No matching orders found.</p>
      ) : (
        currentOrders.map((order) => (
          <div key={order._id} className="border p-4 mb-6 rounded-lg shadow bg-white">
            <p className="font-semibold mb-1 flex items-center gap-2">
              <FaUserAlt className="text-blue-500" /> {order.userEmail}
            </p>
            <p className="flex items-center gap-2 text-sm mb-1">
              <FaMapMarkerAlt className="text-gray-600" />
              {order.shipping?.address || "N/A"}
            </p>
            <p className="flex items-center gap-2 text-sm mb-4">
              <FaCreditCard className="text-green-600" />
              {order.paymentMethod}
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {order.cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border p-3 rounded-md bg-gray-50"
                >
                  <img src={item.image} alt={item.title} className="w-24 h-24 object-cover rounded" />
                  <div className="flex-1">
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-gray-600 text-sm">₹{item.price}</p>
                    <p className="text-xs text-gray-500 mb-1">
                      {item.category} — {item.description}
                    </p>
                    <p className="text-sm">
                      Status:{" "}
                      <span
                        className={`font-semibold ${
                          item.status === "Accepted"
                            ? "text-green-600"
                            : item.status === "Cancelled"
                            ? "text-red-600"
                            : item.status === "Shipped"
                            ? "text-blue-600"
                            : item.status === "Delivered"
                            ? "text-purple-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {item.status || "Pending"}
                      </span>
                    </p>

                 
                    {item.status !== "Delivered" && item.status !== "Cancelled" && (
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => updateStatus(order._id, item._id, item.status)}
                          className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                        >
                          {item.status === "Pending" && <FaCheck />}
                          {item.status === "Accepted" && <FaShippingFast />}
                          {item.status === "Shipped" && <FaTruck />}
                          {item.status === "Pending"
                            ? "Accept"
                            : item.status === "Accepted"
                            ? "Mark Shipped"
                            : item.status === "Shipped"
                            ? "Mark Delivered"
                            : ""}
                        </button>
                        <button
                          onClick={() => cancelOrderItem(order._id, item._id)}
                          className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                        >
                          <FaTimes /> Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

    
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2 flex-wrap">
          {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`px-3 py-1 rounded border text-sm ${
                currentPage === num
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-blue-100"
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderRequests;
