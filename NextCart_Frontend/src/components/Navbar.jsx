import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaPlus,
  FaUserCircle,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
  FaInfoCircle,
  FaBoxOpen,
  FaChartLine,
  FaCrown,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
  }, [user]);

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md px-4 sm:px-6 py-3 flex justify-between items-center flex-wrap">
      <Link to="/" className="text-2xl font-bold flex items-center gap-2 hover:opacity-90 mb-2 sm:mb-0">
        <img
  src="/logo.svg"
  alt="NextCart Logo"
  className="h-11 sm:h-11 md:h-13 w-auto"
/>
      </Link>

      <div className="flex flex-wrap items-center gap-4 text-sm sm:text-base justify-center sm:justify-end">
       { user && (<Link to="/products" className="flex items-center gap-1 hover:text-yellow-200 transition">
          <FaBoxOpen /> Products
        </Link>
)}

        <Link to="/" className="flex items-center gap-1 hover:text-yellow-200 transition">
          <FaInfoCircle /> Home
        </Link>

        <Link to="/about" className="flex items-center gap-1 hover:text-yellow-200 transition">
          <FaInfoCircle /> About
        </Link>

        {user &&  ( <Link to="/cart" className="flex items-center gap-1 hover:text-yellow-200 transition">
          <FaShoppingCart /> Cart
        </Link> 
        )}

        {user?.role === "superadmin" && (
          <Link
            to="/superadmin-panel"
            className="flex items-center gap-1 bg-purple-600 px-3 py-1 rounded hover:bg-purple-700 font-semibold transition"
          >
            <FaCrown /> Super Admin Panel
          </Link>
        )}

        {user?.isAdmin === true && user?.isSuperAdmin !== true && (
          <>
            <Link
              to="/add-product"
              className="flex items-center gap-1 hover:text-yellow-200 font-medium transition"
            >
              <FaPlus /> Add Product
            </Link>
            <Link
              to="/admin/sales-predictor"
              className="flex items-center gap-1 hover:text-yellow-200 font-medium transition"
            >
              <FaChartLine /> Sales Predictor
            </Link>
          </>
        )}

        {!user ? (
          <>
            <Link to="/login" className="flex items-center gap-1 hover:text-yellow-200 transition">
              <FaSignInAlt /> Login
            </Link>
            <Link
              to="/register"
              className="flex items-center gap-1 bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-100 transition font-semibold"
            >
              <FaUserPlus /> Register
            </Link>
          </>
        ) : (
          <>
            <Link to="/profile" className="text-xl hover:text-yellow-300 transition">
              <FaUserCircle />
            </Link>
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="flex items-center gap-1 hover:text-yellow-200 transition"
            >
              <FaSignOutAlt /> Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
