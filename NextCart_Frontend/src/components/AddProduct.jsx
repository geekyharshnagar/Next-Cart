import React, { useState } from "react";
import axios from "axios";

const AddProduct = () => {
  const [product, setProduct] = useState({
    title: "",
    price: "",
    image: "",
    description: "",
    category: "",
    quantity: "",
  });
  const [imageFile, setImageFile] = useState(null);

  const getUsernameFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return "";
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.name || "";
    } catch {
      return "";
    }
  };

  const handleGenerateDescription = async () => {
    try {
      const { title, category } = product;
      const features = `${title}, ${category}`;
      const response = await axios.post("http://localhost:5000/api/generate", {
        title,
        category,
        features,
      });
      setProduct({ ...product, description: response.data.description });
    } catch (err) {
      alert("Failed to generate description.");
      console.error("AI Description Error:", err);
    }
  };

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const username = getUsernameFromToken();

    const formData = new FormData();
    formData.append("title", product.title);
    formData.append("price", product.price);
    formData.append("description", product.description);
    formData.append("category", product.category);
    formData.append("quantity", product.quantity);
    formData.append("createdBy", username);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      await axios.post("http://localhost:5000/api/products", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert(" Product added successfully!");
      setProduct({
        title: "",
        price: "",
        image: "",
        description: "",
        category: "",
        quantity: "",
      });
      setImageFile(null);
    } catch (err) {
      console.error(" Error adding product:", err);
      alert("Failed to add product.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 w-full max-w-2xl mx-auto bg-white shadow-md rounded-lg"
    >
      <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 text-gray-800">
        Add New Product
      </h2>

      <div className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={product.title}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={product.price}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-2 border border-gray-300 rounded"
        />

        {imageFile && (
          <img
            src={URL.createObjectURL(imageFile)}
            alt="Preview"
            className="w-40 h-40 object-cover rounded mx-auto"
          />
        )}

        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={product.quantity}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={product.category}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={product.description}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded min-h-[100px]"
        ></textarea>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleGenerateDescription}
            className="w-full sm:w-auto bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
          >
            Generate Description with AI
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Add Product
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddProduct;
