import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FaMicrophone, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const getProductLimit = () => {
  const width = window.innerWidth;
  if (width >= 1280) return 16;
  if (width >= 1024) return 12;
  if (width >= 768) return 9;
  return 6;
};

const Products = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [addedItems, setAddedItems] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOrder, setSortOrder] = useState("");
  const [limit, setLimit] = useState(getProductLimit());
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [voiceFilterPrice, setVoiceFilterPrice] = useState(null);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [speechTimer, setSpeechTimer] = useState(null);


  const token = localStorage.getItem("token");
  let isAdmin = false;
  let userId = null;
  let isSuperAdmin = false;

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      isAdmin = payload.isAdmin;
      userId = payload.id;
      isSuperAdmin = payload.isSuperAdmin;
    } catch (err) {
      console.error("Invalid token");
    }
  }

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

const handleVoiceStart = () => {
  if (!browserSupportsSpeechRecognition) {
    return alert("Voice recognition not supported");
  }

  if (isVoiceActive) return;

  resetTranscript();
  setIsVoiceActive(true);

  SpeechRecognition.startListening({
    continuous: true,
    interimResults: true,
    language: "en-US",
  });

  if (speechTimer) clearTimeout(speechTimer);
};


useEffect(() => {
  if (!isVoiceActive || !transcript) return;

  if (speechTimer) clearTimeout(speechTimer);

  const timer = setTimeout(() => {
    SpeechRecognition.stopListening();
    setIsVoiceActive(false);
    handleVoiceSearch(transcript);
  }, 2000); 

  setSpeechTimer(timer);
}, [transcript]);


  const handleVoiceSearch = (text) => {
  const lower = text.toLowerCase().trim();

  const pricePattern = /(show|find|get|search|look)?\s*([\w\s]+?)\s*(under|below|less than|max)?\s*(\d{2,6})/i;
  const match = lower.match(pricePattern);

  if (match) {
    const searchTerm = match[2].trim();
    const maxPrice = parseInt(match[4]);

    setSearch(searchTerm);
    setCategory(searchTerm); 
    setVoiceFilterPrice(maxPrice);
    setPage(1);
  } else {
    setSearch(lower);
    setCategory("");
    setVoiceFilterPrice(null);
    setPage(1);
  }
};


  useEffect(() => {
    return () => {
      if (window.voiceTimeout) {
        clearTimeout(window.voiceTimeout);
      }
    };
  }, []);

  useEffect(() => {
    const handleResize = () => setLimit(getProductLimit());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [search, category, sortOrder, page, limit, voiceFilterPrice]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const fetchProducts = async () => {
    const params = { search, category, sort: sortOrder, maxPrice: voiceFilterPrice, page, limit };
    try {
      const res = await axios.get("http://localhost:5000/api/products", { params });
      setProducts(res.data.products || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedItems((prev) => [...prev, product._id]);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Delete this product?")) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchProducts();
      } catch (err) {
        console.error("Error deleting", err);
      }
    }
  };

  const toggleDescription = (productId) => {
    setExpandedDescriptions((prev) => ({ ...prev, [productId]: !prev[productId] }));
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <input
          type="text"
          placeholder=" Search..."
          className="w-full px-4 py-2 border rounded-lg focus:ring-blue-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="text"
          placeholder=" Category"
          className="w-full px-4 py-2 border rounded-lg focus:ring-blue-400"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <button
          onClick={handleVoiceStart}
          disabled={!browserSupportsSpeechRecognition || isVoiceActive}
          className={`flex items-center justify-center px-4 py-2 rounded transition-colors ${
            !browserSupportsSpeechRecognition
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : isVoiceActive
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <FaMicrophone className="mr-2" />
          {isVoiceActive ? 'Listening...' : 'Voice'}
        </button>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="px-3 py-2 border rounded"
        >
          <option value="">Sort by Price</option>
          <option value="asc">Low to High</option>
          <option value="desc">High to Low</option>
        </select>
      </div>

      {!browserSupportsSpeechRecognition && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
          <p className="text-yellow-800 text-sm">
            Voice recognition not supported in this browser. Please use Chrome, Edge, or Safari.
          </p>
        </div>
      )}

      {isVoiceActive && (
        <div className="mb-4 p-3 bg-blue-100 border border-blue-300 rounded-lg">
          <p className="text-blue-800 text-sm">
             Listening... {transcript && <span className="font-semibold">"{transcript}"</span>}
          </p>
          <p className="text-blue-600 text-xs mt-1">
            Try: "show laptops under 5000" or "find phones"
          </p>
        </div>
      )}

      {(search || category || voiceFilterPrice) && (
        <div className="mb-4 flex flex-wrap gap-2">
          {search && (
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              Search: {search}
            </span>
          )}
          {category && category !== search && (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Category: {category}
            </span>
          )}
          {voiceFilterPrice && (
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
              Max Price: ₹{voiceFilterPrice}
            </span>
          )}
          <button
            onClick={() => {
              setSearch("");
              setCategory("");
              setVoiceFilterPrice(null);
              setPage(1);
            }}
            className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm hover:bg-red-200"
          >
            Clear Filters
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product._id} className="bg-white p-4 rounded shadow hover:shadow-lg">
            <div className="relative w-full h-40 mb-2">
              <img src={product.image} alt={product.title} className="w-full h-full object-contain" />
              {product.quantity === 0 && (
                <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                  Unavailable
                </span>
              )}
            </div>
            <h2 className="font-bold text-lg truncate">{product.title}</h2>
            <p className="text-sm text-gray-500">{product.category}</p>
            <p className="text-sm text-gray-700 mt-1 line-clamp-2">
              {expandedDescriptions[product._id] ? product.description : product.description.slice(0, 100)}
            </p>
            {product.description.length > 100 && (
              <button
                onClick={() => toggleDescription(product._id)}
                className="text-blue-500 text-xs mt-1"
              >
                {expandedDescriptions[product._id] ? "Show less ▲" : "Read more ▼"}
              </button>
            )}
            <p className="text-green-700 font-semibold mt-2">₹{product.price}</p>
            <p className="text-xs text-gray-600">Qty: {product.quantity}</p>
            <div className="mt-3 flex space-x-2">
              {product.quantity > 0 && (
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={addedItems.includes(product._id)}
                  className={`flex-1 text-sm py-1.5 rounded ${addedItems.includes(product._id)
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                >
                  {addedItems.includes(product._id) ? "✔ Added" : "Add to Cart"}
                </button>
              )}
              {((isAdmin && product.createdBy?._id === userId) || isSuperAdmin) && (
                <>
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    className="text-sm py-1.5 px-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => navigate(`/editproduct/${product._id}`)}
                    className="text-sm py-1.5 px-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            <FaArrowLeft />
          </button>
          <span className="text-sm">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            <FaArrowRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default Products;
