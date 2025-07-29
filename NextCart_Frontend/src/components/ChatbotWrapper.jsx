import React, { useState, useEffect } from 'react';
import Chatbot from './Chatbot'; 
import {
  FaRobot
} from "react-icons/fa";
const ChatbotWrapper = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCloud, setShowCloud] = useState(true);

  const toggleChatbot = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCloud((prev) => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 h-96 bg-white shadow-xl border border-gray-300 rounded-xl z-40 overflow-hidden">
          <Chatbot />
        </div>
      )}

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-2">
        {showCloud && !isOpen && (
          <div className="bg-white text-sm text-gray-800 px-4 py-2 rounded-lg shadow-lg animate-fade-in-out">
            Hello! Need any help?
          </div>
        )}

        <span className='mx-2'><button
          onClick={toggleChatbot}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
        >
          <FaRobot className="text-2xl " /> Chatbot Help
        </button>
        </span>
      </div>
    </>
  );
};

export default ChatbotWrapper;
