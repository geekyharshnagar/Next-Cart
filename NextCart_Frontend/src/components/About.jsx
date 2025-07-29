import React from "react";
import {
  FaRocket,
  FaMicrophone,
  FaComments,
  FaChartLine,
  FaUserShield,
  FaLaptopCode,
  FaServer,
  FaDatabase,
  FaBrain,
  FaGlobe
} from "react-icons/fa";

const About = () => {
  return (
    <div className="text-gray-800">
      <section className="bg-gradient-to-r from-indigo-400 to-blue-800 text-white text-center py-10 px-4 md:px-6 lg:px-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">About NextCart</h1>
        <p className="text-base sm:text-lg md:text-xl max-w-4xl mx-auto">
          Revolutionizing the online shopping experience with AI-powered tools and a seamless user interface.
        </p>
      </section>

      <section className="py-10 px-4 sm:px-6 md:px-20 bg-white text-center">
        <h2 className="text-2xl font-semibold mb-4 flex justify-center items-center gap-2">
          <FaRocket className="text-indigo-600" /> Our Vision
        </h2>
        <p className="text-base sm:text-lg max-w-4xl mx-auto text-gray-700 mb-6">
          NextCart is more than an e-commerce platform. It’s a smart assistant for buyers,
          a powerful dashboard for sellers, and a real-world implementation of AI in online
          retail. Our mission is to deliver intelligent, accessible, and intuitive online shopping.
        </p>
      </section>

      <section className="bg-gray-50 py-10 px-4 sm:px-6 md:px-20">
        <h2 className="text-2xl font-semibold text-center mb-8">What Makes NextCart Unique</h2>
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto">
          {[
            {
              icon: <FaMicrophone className="text-blue-500" />,
              title: "Voice Search",
              desc: "Use natural speech to find products instantly."
            },
            {
              icon: <FaComments className="text-blue-500" />,
              title: "Smart AI Chatbot",
              desc: "Get instant help, product suggestions, and support with our intelligent shopping assistant."
            },
            {
              icon: <FaChartLine className="text-blue-500" />,
              title: "Smart Admin Dashboard",
              desc: "Admins get real-time order control, low stock alerts, and sales prediction."
            },
            {
              icon: <FaUserShield className="text-blue-500" />,
              title: "Role-Based Access",
              desc: "Supports Super Admins, Admins, and Users for secure access control."
            }
          ].map((feature, idx) => (
            <div key={idx}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                {feature.icon} {feature.title}
              </h3>
              <p className="text-gray-700">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-10 px-4 sm:px-6 md:px-20 bg-white text-center">
        <h2 className="text-2xl font-semibold mb-4 flex justify-center items-center gap-2">
          <FaLaptopCode className="text-indigo-600" /> Tech Stack
        </h2>
        <p className="text-base sm:text-lg text-gray-700 max-w-3xl mx-auto mb-6">
          NextCart was built with cutting-edge tools and technologies:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left max-w-3xl mx-auto">
          <div>
            <h4 className="font-bold flex items-center gap-2">
              <FaGlobe /> Frontend
            </h4>
            <p>React, Vite, Tailwind CSS</p>
          </div>
          <div>
            <h4 className="font-bold flex items-center gap-2">
              <FaServer /> Backend
            </h4>
            <p>Node.js, Express.js</p>
          </div>
          <div>
            <h4 className="font-bold flex items-center gap-2">
              <FaDatabase /> Database
            </h4>
            <p>MongoDB Atlas</p>
          </div>
          <div>
            <h4 className="font-bold flex items-center gap-2">
              <FaBrain /> AI & APIs
            </h4>
            <p>Replicate, OpenAI (ChatGPT), UPI Suggestions</p>
          </div>
        </div>
      </section>

      <section className="bg-indigo-50 text-center py-10 px-4 sm:px-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-2 flex justify-center items-center gap-2">
          <FaRocket className="text-indigo-600" /> Built for Real-World Impact
        </h2>
        <p className="text-base sm:text-lg text-gray-700 max-w-4xl mx-auto">
          This project demonstrates full-stack development, AI integration, role-based
          architecture, and a user-first approach — perfect for professional portfolios
          and production-level deployment.
        </p>
      </section>
    </div>
  );
};

export default About;
