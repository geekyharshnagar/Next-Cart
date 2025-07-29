import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    title: "",
    price: "",
    image: "",
    description: "",
    category: "",
    quantity: "",
  });

  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Failed to fetch product:", err);
        alert("Error loading product.");
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("title", product.title);
    formData.append("price", product.price);
    formData.append("description", product.description);
    formData.append("category", product.category);
    formData.append("quantity", product.quantity);
    if (imageFile) formData.append("image", imageFile);

    try {
      await axios.put(`http://localhost:5000/api/products/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert(" Product updated successfully!");
      navigate("/"); 
    } catch (err) {
      console.error(" Error updating product:", err);
      alert("Failed to update product.");
    }
  };

  return (
    <div className="px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-700">
          Edit Product
        </h2>

        <input
          type="text"
          name="title"
          placeholder="Title"
          value={product.title}
          onChange={handleChange}
          className="block w-full p-2 border rounded"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={product.price}
          onChange={handleChange}
          className="block w-full p-2 border rounded"
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={product.quantity}
          onChange={handleChange}
          className="block w-full p-2 border rounded"
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={product.category}
          onChange={handleChange}
          className="block w-full p-2 border rounded"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full p-2 border rounded"
        />
        {product.image && !imageFile && (
          <img
            src={product.image}
            alt="Existing"
            className="w-32 h-32 object-cover border rounded"
          />
        )}
        {imageFile && (
          <img
            src={URL.createObjectURL(imageFile)}
            alt="Preview"
            className="w-32 h-32 object-cover border rounded"
          />
        )}

        <textarea
          name="description"
          placeholder="Description"
          value={product.description}
          onChange={handleChange}
          rows={4}
          className="block w-full p-2 border rounded"
        ></textarea>

        <button
          type="submit"
          className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
