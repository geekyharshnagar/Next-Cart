import React, { useState } from "react";
import axios from "axios";
import {
  FaBrain,
} from "react-icons/fa";

const DescriptionGenerator = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [features, setFeatures] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!title || !category || !features) {
      return alert("Please fill all fields.");
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/generate", {
        title,
        category,
        features,
      });
      setDescription(res.data.description);
    } catch (err) {
      console.error(" Generation Error:", err);
      alert("Failed to generate description.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow p-6 rounded mt-8">
      <h2 className="text-2xl font-semibold mb-4"><FaBrain/> AI Description Generator</h2>

      <input
        type="text"
        placeholder="Product Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full mb-3 p-2 border rounded"
      />

      <input
        type="text"
        placeholder="Product Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full mb-3 p-2 border rounded"
      />

      <textarea
        placeholder="Key Features (comma separated)"
        value={features}
        onChange={(e) => setFeatures(e.target.value)}
        className="w-full mb-3 p-2 border rounded"
      ></textarea>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Generating..." : "Generate Description"}
      </button>

      {description && (
        <div className="mt-4">
          <h3 className="font-bold text-gray-700 mb-2">Generated Description:</h3>
          <p className="p-3 border bg-gray-100 rounded text-sm">{description}</p>
        </div>
      )}
    </div>
  );
};

export default DescriptionGenerator;
