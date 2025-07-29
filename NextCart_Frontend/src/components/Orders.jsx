import React, { useEffect, useState } from "react";
import { FaClipboardList } from "react-icons/fa";

const Orders = () => {
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
        console.error("Failed to fetch orders", err);
        setError(err.message || "Something went wrong");
      }
    };

    fetchOrders();
  }, []);

  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const displayedOrders = orders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 text-gray-800">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FaClipboardList className="text-blue-600" /> Order History
      </h1>

      {error ? (
        <p className="text-red-600 bg-red-100 p-4 rounded">{error}</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-600">You haven&apos;t placed any orders yet.</p>
      ) : (
        <>
          {displayedOrders.map((order, idx) => (
            <div
              key={order._id || idx}
              className="border border-gray-300 rounded shadow-sm p-4 mb-4 bg-white"
            >
              <h2 className="font-semibold mb-2 text-blue-700">
                Order #{order._id.slice(-6).toUpperCase()}
              </h2>

              <div className="space-y-1">
                {order.cartItems.map((item, i) => (
                  <div key={i} className="text-sm flex justify-between">
                    <span>{item.title}</span>
                    <span className="font-medium text-gray-700">₹{item.price}</span>
                  </div>
                ))}
              </div>

              <p className="text-sm text-gray-500 mt-2">
                Placed on: {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          ))}

          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded-md border text-sm ${
                    page === currentPage
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Orders;
