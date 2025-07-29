import React, { useEffect, useState } from "react";
import { FaTrashAlt,
 FaArrowLeft, FaArrowRight, FaBoxOpen, FaExclamationTriangle, FaClipboardList,FaUser,FaEnvelope } from "react-icons/fa";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [removedAccepted, setRemovedAccepted] = useState(
  localStorage.getItem("removedAccepted") === "true"
);

const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
const [deletePassword, setDeletePassword] = useState("");
const [deleting, setDeleting] = useState(false);




  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You are not logged in.");
      setLoading(false);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.id || payload._id;
      const wasRemoved = payload.isAdmin === false && payload.isSuperAdmin === false;
setUser({
  id: userId,
  email: payload.email,
  name: payload.name,
  isAdmin: payload.isAdmin,
  isSuperAdmin: payload.isSuperAdmin,
  removedBySuperAdmin: wasRemoved
});

      fetchOrders(1, token, userId);
    } catch (err) {
      console.error("Error decoding token", err);
      setError("Invalid token.");
      setLoading(false);
    }
  }, []);

  const fetchOrders = async (page = 1, tokenOverride, userIdOverride) => {
    const token = tokenOverride || localStorage.getItem("token");
    const userId = userIdOverride || user?.id;
    try {
      const res = await fetch(
        `http://localhost:5000/api/orders/user/${userId}?page=${page}&limit=3`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (res.ok) {
        setOrders(data.orders);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(data.currentPage || 1);
      } else {
        setError(data.message || "Failed to load orders.");
      }
    } catch (err) {
      console.error("Error fetching orders", err);
      setError("Could not load orders.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}` , {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        alert("Order deleted successfully");
        setOrders((prev) => prev.filter((order) => order._id !== orderId));
      } else {
        alert( "Failed to delete order");
      }
    } catch (err) {
      console.error("Delete failed", err);
      alert("Error deleting order");
    }
  };

  if (loading) return <div className="p-6 text-gray-600">Loading your profile...</div>;
  if (error) return <div className="p-6 text-red-600 font-semibold">{error}</div>;

  return (
    <div className="p-6">
     <h1 className="text-2xl font-bold mb-4 flex items-center space-x-2">
  <FaUser className="text-blue-600" />
  <span>Welcome, {user?.name || user?.email}</span>
</h1>

<p className="text-gray-700 mb-6 flex items-center space-x-2 px-1">
  <FaEnvelope className="text-gray-500" />
  <span>{user?.email}</span>
</p>

  


     {user.removedBySuperAdmin && !removedAccepted && (
  <div className="bg-red-100 text-red-700 border border-red-300 p-4 rounded-md mb-4">
    <p className="mb-2 font-semibold">
      <FaExclamationTriangle/> You were removed from admin by the Super Admin.
    </p>
    <button
      onClick={() => {
        localStorage.setItem("removedAccepted", "true");
        setRemovedAccepted(true);
      }}
      className="mt-2 px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
    >
      Accept
    </button>
  </div>
)}



     {user?.isAdmin === true && user?.isSuperAdmin !== true && (
  <div className="flex flex-col sm:flex-row gap-4 mb-6">
    <button
      onClick={() => (window.location.href = "/admin/order-requests")}
      className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition flex items-center gap-2"
    >
      <FaClipboardList /> Order Requests
    </button>
    <button
      onClick={() => (window.location.href = "/admin/low-stock")}
      className="bg-amber-400 text-white px-6 py-2 rounded hover:bg-yellow-600 transition flex items-center gap-2"
    >
      <FaExclamationTriangle /> Low Stock
    </button>
  </div>

  
)}

<div className="my-3 mx-3 ">
  <button
    onClick={() => setShowDeleteConfirm(true)}
    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
  >
    Delete My Account
  </button>

  {showDeleteConfirm && (
    <div className="mt-4 p-4 border rounded bg-red-50">
      <p className="mb-2 text-red-700 font-medium">Please enter your password to confirm account deletion:</p>
      <input
        type="password"
        value={deletePassword}
        onChange={(e) => setDeletePassword(e.target.value)}
        placeholder="Enter password"
        className="w-full p-2 border rounded mb-3"
      />
      <div className="flex gap-3">
        <button
          onClick={async () => {
            if (!deletePassword) return alert("Please enter your password.");
            setDeleting(true);
            try {
              const res = await fetch("http://localhost:5000/api/auth/delete-account", {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ password: deletePassword }),
              });
              const data = await res.json();
              if (res.ok) {
                alert("Your account has been deleted.");
                localStorage.clear();
                window.location.href = "/login";
              } else {
                alert("Failed to delete account.");
              }
            } catch (err) {
              console.error(err);
              alert("An error occurred.");
            } finally {
              setDeleting(false);
              setDeletePassword("");
            }
          }}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          disabled={deleting}
        >
          {deleting ? "Deleting..." : "Confirm Delete"}
        </button>
        <button
          onClick={() => {
            setShowDeleteConfirm(false);
            setDeletePassword("");
          }}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  )}
</div>


      <h2 className="text-xl font-semibold mb-4">📦 Your Orders</h2>

      {orders.length === 0 ? (
        <p className="text-gray-600">No orders placed yet.</p>
      ) : (
        <>
          {orders.map((order) => (
            <div
              key={order._id}
              className="relative border p-6 mb-6 rounded-xl shadow bg-yellow-50"
            >
              {!order.cartItems.some((item) =>
                ["Shipped", "Delivered", "Cancelled"].includes(item.status)
              ) && (
                <button
                  onClick={() => handleDeleteOrder(order._id)}
                  className="absolute top-4 right-4 text-red-600 hover:text-red-800"
                  title="Delete Order"
                >
                  <FaTrashAlt size={18} />
                </button>
              )}

              <div className="space-y-4">
                {order.cartItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-5">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-24 h-24 object-cover rounded border"
                    />
                    <div>
                      <p className="font-medium text-gray-800">{item.title}</p>
                      <p className="text-sm text-gray-600">₹{item.price}</p>
                      <p className="text-sm">
                        Status: <span className={
                          item.status === "Pending"
                            ? "text-yellow-600"
                            : item.status === "Shipped"
                            ? "text-blue-600"
                            : item.status === "Delivered"
                            ? "text-green-600"
                            : "text-red-600"
                        }>{item.status}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Placed on: {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>


                    
                  </div>
                ))}

              </div>
            </div>
          ))}
          

          

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={() => fetchOrders(currentPage - 1)}
                disabled={currentPage === 1}
                className="text-gray-700 hover:text-black disabled:text-gray-400"
              >
                <FaArrowLeft />
              </button>
              <span className="font-medium text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => fetchOrders(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="text-gray-700 hover:text-black disabled:text-gray-400"
              >
                <FaArrowRight />
              </button>
            </div>
          )}
        </>
      )}

      

    </div>
  );
};

export default Profile;
