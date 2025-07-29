import React from "react";
import axios from "axios";
import {
  FaUser,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaInfoCircle,
  FaCheck,
  FaTimes,
  FaBox
} from "react-icons/fa";

const OrderCard = ({ order, token, onStatusUpdate }) => {
  const handleStatusChange = async (status) => {
    try {
      const res = await axios.patch(
        `/api/orders/${order._id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(` Order status updated to ${status}`);
      onStatusUpdate(); 
    } catch (err) {
      console.error(" Failed to update status", err);
      alert(" Failed to update status");
    }
  };

  return (
    <div className="border rounded-xl shadow-md bg-white p-4 mb-6 transition-all hover:shadow-lg">
      <div className="space-y-1">
        <p className="flex items-center gap-2 text-gray-700">
          <FaUser className="text-blue-600" />
          <strong>User:</strong> {order.user.email}
        </p>
        <p className="flex items-center gap-2 text-gray-700">
          <FaMapMarkerAlt className="text-green-600" />
          <strong>Shipping:</strong> {order.shipping.address}, {order.shipping.pincode}
        </p>
        <p className="flex items-center gap-2 text-gray-700">
          <FaMoneyBillWave className="text-emerald-500" />
          <strong>Payment:</strong> {order.paymentMethod}
        </p>
        <p className="flex items-center gap-2 text-gray-700">
          <FaInfoCircle className="text-purple-500" />
          <strong>Status:</strong> {order.orderStatus || order.status}
        </p>
      </div>

      <div className="mt-4 space-y-3">
        {order.cartItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-4 bg-gray-50 p-2 rounded-md">
            <img src={item.image} alt={item.title} className="w-16 h-16 rounded object-cover" />
            <div>
              <p className="font-semibold flex items-center gap-1 text-gray-800">
                <FaBox className="text-indigo-500" /> {item.title}
              </p>
              <p className="text-sm text-gray-600">₹{item.price}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-3">
        <button
          onClick={() => handleStatusChange("Accepted")}
          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded flex items-center gap-1"
        >
          <FaCheck /> Accept
        </button>
        <button
          onClick={() => handleStatusChange("Cancelled")}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1"
        >
          <FaTimes /> Cancel
        </button>
      </div>
    </div>
  );
};

export default OrderCard;
