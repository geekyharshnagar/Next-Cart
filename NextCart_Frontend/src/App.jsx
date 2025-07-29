import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Products from "./components/Products";
import Cart from "./components/Cart";
import LowStockProducts from "./components/LowStockProducts";
import Login from "./components/Login";
import About from "./components/About";
import Register from "./components/Register";
import AddProduct from "./components/AddProduct";
import Orders from "./components/Orders";
import Profile from "./components/Profile";
import SalesPredictor from "./components/SalesPredictor";
import EditProduct from "./components/EditProduct";
import DescriptionGenerator from "./components/DescriptionGenerator";
import ChatbotWrapper from "./components/ChatbotWrapper";
import OrderRequests from './components/OrderRequests';
import SuperAdminPanel from "./components/SuperadminPanel";
import { useAuth } from "./context/AuthContext";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

const SuperAdminRoute = ({ children }) => {
  const { user } = useAuth();
  return user?.role === "superadmin" ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  return user?.isAdmin ? children : <Navigate to="/login" />;
};


function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={ <Home />} />
        <Route path="/products" element={<PrivateRoute> <Products /> </PrivateRoute>} />
        <Route path="/cart" element={<PrivateRoute> <Cart /> </PrivateRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/register" element={<Register />} />
        <Route path="/add-product" element={<AdminRoute> <AddProduct /> </AdminRoute>} />
        <Route path="/orders" element={<PrivateRoute> <Orders /> </PrivateRoute>} />
        <Route path="/editproduct/:id" element={<AdminRoute> <EditProduct /> </AdminRoute>} />
        <Route path="/admin/low-stock" element={<AdminRoute> <LowStockProducts /> </AdminRoute>} />
        <Route path="/admin/sales-predictor" element={<AdminRoute> <SalesPredictor /> </AdminRoute>} />
        <Route path="/admin/order-requests" element={<AdminRoute> <OrderRequests /> </AdminRoute>} />
        <Route path="/generate-description" element={<AdminRoute> <DescriptionGenerator /> </AdminRoute>} />

        <Route
          path="/profile"
          element={<PrivateRoute><Profile /></PrivateRoute>}
        />
        <Route
  path="/superadmin-panel"
  element={
    <PrivateRoute>
    <SuperAdminRoute>
      <SuperAdminPanel />
    </SuperAdminRoute>
    </PrivateRoute>
  }
/>

      </Routes>

      <ChatbotWrapper />
    </>
  );
}

export default App;
