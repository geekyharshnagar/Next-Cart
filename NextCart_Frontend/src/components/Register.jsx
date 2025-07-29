import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
    adminCode: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password || !formData.role) {
      return alert("Please fill in all fields");
    }

    if ((formData.role === "admin" || formData.role === "superadmin") && !formData.adminCode) {
      return alert("Admin code is required to register as admin or superadmin");
    }


    try {
      await axios.post("http://localhost:5000/api/auth/register", formData);
      alert(" Registered successfully!");

      setFormData({
        username: "",
        email: "",
        password: "",
        role: "user",
        adminCode: "",
      });

      navigate("/login");
    } catch (err) {
  alert(err.response?.data?.error || "Registration failed");
}

  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Register to NextCart</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="w-full border px-3 py-2"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border px-3 py-2"
        />
        <input
          type="text"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full border px-3 py-2"
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full border px-3 py-2"
        >
          <option value="user">Register as User</option>
          <option value="admin">Register as Admin</option>
          <option value="superadmin">Register as Super Admin</option>
        </select>

        {(formData.role === "admin" || formData.role === "superadmin") && (
          <input
            type="text"
            name="adminCode"
            placeholder="Enter Admin Access Code"
            value={formData.adminCode}
            onChange={handleChange}
            className="w-full border px-3 py-2"
          />
        )}

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
