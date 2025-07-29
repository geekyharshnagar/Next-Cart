import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import {
  FaShoppingCart,
  FaTrash,
  FaMapMarkerAlt,
  FaCity,
  FaMoneyBillAlt,
  FaMobileAlt,
  FaCheckCircle,
} from "react-icons/fa";

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [upiPaid, setUpiPaid] = useState(false);

  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handlePincodeChange = async (e) => {
    const value = e.target.value;
    setPincode(value);
    if (value.length === 6) {
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${value}`);
        const data = await res.json();
        if (data[0].Status === "Success") {
          const cityName = data[0].PostOffice[0].District;
          setCity(cityName);
        } else {
          setCity("Invalid Pincode");
        }
      } catch (err) {
        console.error("Error fetching city:", err);
        setCity("Error fetching");
      }
    } else {
      setCity("");
    }
  };

  const placeOrder = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cartItems: cart,
          shipping: { pincode, city, address },
          paymentMethod,
        }),
      });

      if (res.ok) {
        clearCart();
        setOrderPlaced(true);
        setAddress("");
        setCity("");
        setPincode("");
      } else {
        const data = await res.json();
        alert(" Failed: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error(" Error placing order:", err);
      alert(" Something went wrong while placing order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2 text-gray-800">
        <FaShoppingCart className="text-blue-600" /> Your Cart
      </h1>

      {cart.length === 0 && !orderPlaced && (
        <p className="text-gray-600">Your cart is empty.</p>
      )}

      {cart.length > 0 && (
        <div className="space-y-6">
          {cart.map((item, index) => (
            <div
              key={index}
              className="border p-4 rounded shadow-md flex flex-col sm:flex-row gap-4 items-center"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-24 h-24 object-cover rounded-md"
              />
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-lg font-semibold text-gray-800">{item.title}</h2>
                <p className="text-sm text-gray-600 mb-1">
                  {item.description?.slice(0, 60)}...
                </p>
                <p className="text-blue-600 font-bold">₹{item.price}</p>
              </div>
              <div>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-2"
                >
                  <FaTrash /> Remove
                </button>
              </div>
            </div>
          ))}

          <div className="bg-gray-50 p-4 rounded shadow space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
              <FaMapMarkerAlt className="text-blue-600" /> Shipping Address
            </h2>

            <input
              type="text"
              value={pincode}
              onChange={handlePincodeChange}
              placeholder="Enter Pincode"
              maxLength={6}
              className="border rounded px-4 py-2 w-full"
              required
            />

            {city && (
              <p className="text-sm text-gray-700 flex items-center gap-1">
                <FaCity /> <span className="font-semibold">{city}</span>
              </p>
            )}

            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter Full Address"
              className="border rounded px-4 py-2 w-full"
              required
            />

            <div>
              <label className="font-medium mb-1 flex items-center gap-2">
                <FaMoneyBillAlt className="text-green-600" /> Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => {
                  setPaymentMethod(e.target.value);
                  setUpiPaid(false);
                }}
                className="border px-4 py-2 rounded w-full"
              >
                <option value="COD">Cash on Delivery</option>
                <option value="UPI">UPI</option>
              </select>

              {paymentMethod === "UPI" && (
                <div className="mt-3 bg-blue-50 border p-4 rounded text-sm space-y-2">
                  <p className="font-medium text-blue-800 flex items-center gap-2">
                    <FaMobileAlt /> Suggested UPI Apps:
                  </p>
                  <ul className="list-disc list-inside text-blue-700 ml-5">
                    <li>Google Pay</li>
                    <li>PhonePe</li>
                    <li>Paytm</li>
                    <li>BharatPe</li>
                  </ul>
                  <p className="text-gray-700">
                    Complete the payment manually using the above apps and then confirm below:
                  </p>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={upiPaid}
                      onChange={() => setUpiPaid(!upiPaid)}
                    />
                    I have completed the UPI payment
                  </label>
                </div>
              )}
            </div>

            <div className="text-right text-lg font-semibold text-gray-800">
              Total: ₹{total}
            </div>

            {!orderPlaced && (
              <div className="text-right">
                <button
                  onClick={placeOrder}
                  disabled={
                    loading ||
                    !pincode ||
                    city === "Invalid Pincode" ||
                    !address ||
                    (paymentMethod === "UPI" && !upiPaid)
                  }
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded disabled:opacity-50"
                >
                  {loading ? "Placing..." : "Place Order"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {orderPlaced && (
        <p className="mt-6 text-green-600 font-semibold text-center flex items-center justify-center gap-2">
          <FaCheckCircle /> Your order has been placed successfully! Go to Profile to view order.
        </p>
      )}
    </div>
  );
};

export default Cart;
