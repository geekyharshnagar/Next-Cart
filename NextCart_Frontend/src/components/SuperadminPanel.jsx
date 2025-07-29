import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaUserShield, FaSearch, FaUserCheck, FaUserSlash } from "react-icons/fa";

const SuperadminPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const adminsPerPage = 10;

  useEffect(() => {
    if (!user) return;
    if (!user.isSuperAdmin) {
      alert("Access Denied: Superadmin only");
      navigate("/products");
    }
  }, [user]);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/superadmin/all-admins", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setAdmins(res.data);
        setLoading(false);
      } catch (err) {
        console.error(" Failed to fetch admins", err);
        setLoading(false);
      }
    };
    fetchAdmins();
  }, []);

  const handleRemoveAdmin = async (adminId) => {
    if (!window.confirm("Are you sure you want to remove admin rights?")) return;
    try {
      await axios.put(
        `http://localhost:5000/api/superadmin/remove-admin/${adminId}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setAdmins((prev) =>
        prev.map((admin) =>
          admin._id === adminId ? { ...admin, isAdmin: false, isSuperAdmin: false } : admin
        )
      );
      alert("Admin rights removed successfully");
    } catch (err) {
      console.error(" Failed to remove admin", err);
      alert("Something went wrong");
    }
  };

  const filteredAdmins = admins.filter((admin) =>
    admin.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAdmins.length / adminsPerPage);
  const startIndex = (currentPage - 1) * adminsPerPage;
  const currentAdmins = filteredAdmins.slice(startIndex, startIndex + adminsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  if (loading) return <div className="text-center mt-10 text-lg">Loading admins...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white shadow-lg p-6 md:p-8 rounded-lg">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-purple-700 flex items-center justify-center gap-2">
        <FaUserShield /> Super Admin Panel
      </h2>

      <div className="mb-6 flex items-center gap-3">
        <FaSearch className="text-gray-500" />
        <input
          type="text"
          placeholder="Search by email"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="p-2 border rounded w-full"
        />
      </div>

      {currentAdmins.length === 0 ? (
        <p className="text-gray-600 text-center">No admins found.</p>
      ) : (
        <ul className="space-y-4">
          {currentAdmins.map((admin) => (
            <li
              key={admin._id}
              className="border p-4 rounded shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3"
            >
              <div className="w-full">
                <p className="font-semibold text-base md:text-lg break-words">{admin.email}</p>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  Role:{" "}
                  {admin.isSuperAdmin ? (
                    <span className="text-red-600 font-medium flex items-center gap-1">
                      <FaUserShield /> Superadmin
                    </span>
                  ) : admin.isAdmin ? (
                    <span className="text-blue-600 font-medium flex items-center gap-1">
                      <FaUserCheck /> Admin
                    </span>
                  ) : (
                    <span className="text-green-600 font-medium">User</span>
                  )}
                </p>
              </div>

              {(admin.isAdmin || admin.isSuperAdmin) ? (
                <button
                  onClick={() => handleRemoveAdmin(admin._id)}
                  className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <FaUserSlash /> Remove
                </button>
              ) : (
                <span className="text-green-600 font-semibold flex items-center gap-1 text-sm">
                  <FaUserCheck /> Already User
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 flex-wrap gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => handlePageChange(idx + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === idx + 1
                  ? "bg-purple-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {idx + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default SuperadminPanel;
