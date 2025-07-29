import React from "react";
import { Link } from "react-router-dom";
import {
  FaMicrophone,
  FaComments,
  FaChartLine,
  FaUsers
} from "react-icons/fa";

const Home = () => {
  return (
    <div className="text-gray-800">
      
      <section className="bg-gradient-to-r from-indigo-400 to-blue-800 text-white px-4 py-10 sm:px-8 md:px-16 lg:px-24 xl:px-32 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-snug">
          Welcome to NextCart!
        </h1>
        <p className="text-base sm:text-lg md:text-xl mb-6 flex flex-wrap items-center justify-center gap-2">
          Smarter Shopping, Powered by AI <FaMicrophone className="inline text-white text-xl" />
        </p>
        <Link to="/products">
          <button className="bg-white text-blue-600 font-semibold px-6 py-2 rounded hover:bg-gray-100 transition">
            Shop Now
          </button>
        </Link>
      </section>

  
      <section className="py-10 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
          <div className="p-4 rounded-lg shadow hover:shadow-md transition bg-white">
            <h3 className="text-lg sm:text-xl font-bold mb-2 flex justify-center items-center gap-2">
              <FaMicrophone className="text-blue-500 text-xl" /> AI Voice Search
            </h3>
            <p className="text-gray-700 text-sm sm:text-base">
              Find products quickly using your voice – just say what you need.
            </p>
          </div>
          <div className="p-4 rounded-lg shadow hover:shadow-md transition bg-white">
            <h3 className="text-lg sm:text-xl font-bold mb-2 flex justify-center items-center gap-2">
             <FaComments className="text-blue-500" /> Smart AI Chatbot
            </h3>
            <p className="text-gray-700 text-sm sm:text-base">
              Get instant help, product suggestions, and support with our intelligent shopping assistant.
            </p>
          </div>
          <div className="p-4 rounded-lg shadow hover:shadow-md transition bg-white">
            <h3 className="text-lg sm:text-xl font-bold mb-2 flex justify-center items-center gap-2">
              <FaChartLine className="text-blue-500 text-xl" /> Admin Dashboard
            </h3>
            <p className="text-gray-700 text-sm sm:text-base">
              Manage orders, inventory, and track AI-based sales prediction.
            </p>
          </div>
        </div>
      </section>

      
      <section className="bg-gray-100 py-10 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 text-center">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 flex justify-center items-center gap-2">
          <FaUsers className="text-indigo-600 text-xl" /> Trusted by Shoppers Across India
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-gray-700 max-w-3xl mx-auto">
          With powerful AI features and a smooth shopping experience, Ai-Cart makes
          shopping smarter, faster, and easier than ever.
        </p>
      </section>
    </div>
  );
};

export default Home;
