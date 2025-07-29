import React, { useEffect, useState } from "react";
import { FaClock, FaBoxOpen } from "react-icons/fa";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch("http://localhost:5000/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to fetch orders");
        }

        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error(" Order fetch error:", err);
        setError(err.message || "Something went wrong");
      }
    };

    fetchOrders();
  }, []);

  const indexOfLast = currentPage * ordersPerPage;
  const indexOfFirst = indexOfLast - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
  };

  if (error) {
    return <p className="text-red-500 p-4"> {error}</p>;
  }

  return (
    <div className="p-6 text-gray-800">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FaBoxOpen className="text-blue-600" /> Your Orders
      </h1>

      {orders.length === 0 ? (
        <p className="text-gray-600">You haven't placed any orders yet.</p>
      ) : (
        <>
          {currentOrders.map((order, index) => (
            <div
              key={order._id || index}
              className="border p-4 mb-4 rounded shadow bg-white"
            >
              <p className="font-semibold mb-2 text-lg">Order #{indexOfFirst + index + 1}</p>
              {order.cartItems.map((item, i) => (
                <div key={i} className="ml-2 mb-1 text-sm">
                  <span className="font-medium">{item.title}</span> — ₹{item.price}
                </div>
              ))}
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <FaClock /> Placed on: {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          ))}

          {totalPages > 1 && (
            <div className="flex justify-center mt-4 gap-2 flex-wrap">
              {[...Array(totalPages).keys()].map((num) => (
                <button
                  key={num}
                  onClick={() => handlePageChange(num + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === num + 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  } hover:bg-blue-500 hover:text-white transition duration-200`}
                >
                  {num + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrderHistory;
