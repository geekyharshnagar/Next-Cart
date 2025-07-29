import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { FaChartLine } from "react-icons/fa";


import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SalesPredictor = () => {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [salesData, setSalesData] = useState([]);

  
  useEffect(() => {
    const fetchTitles = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products/titles");
        const options = res.data.map((p) => ({
          value: p._id,
          label: p.title,
        }));
        setProducts(options);
      } catch (err) {
        console.error(" Error fetching product titles:", err);
      }
    };
    fetchTitles();
  }, []);

  
  useEffect(() => {
    const fetchPrediction = async () => {
      if (!selected) return;
      try {
        const res = await axios.get(`http://localhost:5000/api/sales-predict?productId=${selected.value}`);
        setSalesData(res.data);
      } catch (err) {
        console.error(" Prediction fetch error:", err);
      }
    };
    fetchPrediction();
  }, [selected]);


  const chartData = {
    labels: salesData.map((item) => item.week),
    datasets: [
      {
        label: `Predicted Sales for ${selected?.label || "Product"}`,
        data: salesData.map((item) => item.sales),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };


  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: "AI-Predicted Weekly Sales",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        <FaChartLine/> AI Sales Predictor
      </h2>

      <div className="mb-6">
        <Select
          options={products}
          value={selected}
          onChange={setSelected}
          placeholder="🔍 Select a product..."
          isSearchable
          className="text-black"
        />
      </div>

      {Array.isArray(salesData) && salesData.length > 0 ? (
        <div className="bg-white rounded shadow p-4">
          <Line data={chartData} options={chartOptions} />
        </div>
      ) : selected ? (
        <p className="text-center text-red-500 mt-4">
          No prediction data available or invalid format.
        </p>
      ) : null}
    </div>
  );
};

export default SalesPredictor;