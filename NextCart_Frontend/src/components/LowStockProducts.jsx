import React, { useEffect, useState } from "react";
import {
  FaExclamationTriangle,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
const LowStockProducts = () => {
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  useEffect(() => {
    const fetchLowStock = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch("http://localhost:5000/api/products/low-stock", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        const productsArray = Array.isArray(data) ? data : data.products || [];
        if (res.ok) {
          setLowStockProducts(productsArray);
        } else {
          setError(data.message || "Failed to fetch low stock products");
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong while fetching low stock items.");
      } finally {
        setLoading(false);
      }
    };

    fetchLowStock();
  }, []);

  const totalPages = Math.ceil(lowStockProducts.length / itemsPerPage);
  const paginatedData = lowStockProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <div className="p-6 text-center text-lg">Loading low stock products...</div>;
  if (error) return <div className="p-6 text-center text-red-600 font-semibold">{error}</div>;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-red-600 mb-6 text-center">
       < FaExclamationTriangle/> Low Stock Products (Less than 5)
      </h2>

      {paginatedData.length === 0 ? (
        <p className="text-center text-gray-600">No low stock products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedData.map((product) => (
            <div
              key={product._id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition p-4 flex flex-col items-center text-center"
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-40 object-contain mb-3 rounded"
              />
              <h3 className="text-lg font-semibold text-gray-800">{product.title}</h3>
              <p className="text-sm mt-1 text-gray-600">
                Category: <span className="font-medium">{product.category}</span>
              </p>
              <p
                className={`text-sm font-semibold mt-1 ${
                  product.quantity <= 2 ? "text-red-600" : "text-orange-500"
                }`}
              >
                Quantity: {product.quantity}
              </p>
            </div>
          ))}
        </div>
      )}

      
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
          >
             <FaArrowLeft/>
          </button>
          <span className="text-gray-700 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
          >
            <FaArrowRight/>
          </button>
        </div>
      )}
    </div>
  );
};

export default LowStockProducts;
