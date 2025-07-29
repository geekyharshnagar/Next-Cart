import React, { useState } from "react";
import axios from "axios";
import {
  FaRobot,
  FaArrowRight,
} from "react-icons/fa";
const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await axios.post("http://localhost:5000/api/chat", {
        message: input,
      });

      setMessages([...newMessages, { sender: "bot", text: res.data.reply }]);
    } catch {
      setMessages([
        ...newMessages,
        { sender: "bot", text: "Sorry, something went wrong." },
      ]);
    }
  };

  return (
    <div className="bg-white w-full h-full shadow-lg rounded-lg flex flex-col">
      <div className="p-3 border-b font-bold bg-blue-600 text-white">
         <FaRobot className="text-2xl" /> AI Assistant
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded max-w-[90%] ${
              msg.sender === "user"
                ? "bg-blue-100 self-end text-right"
                : "bg-gray-100 self-start"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="p-3 border-t flex">
        <input
          className="flex-1 border rounded px-2 py-1 text-sm"
          placeholder="Type your question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="ml-2 text-blue-600 font-bold text-xl"
        >
          <FaArrowRight/>
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
