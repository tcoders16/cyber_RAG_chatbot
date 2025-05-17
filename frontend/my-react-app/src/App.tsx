// src/App.tsx
'use client';

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import AboutChatbot from "./components/AboutChatBot";

function App() {
  return (
    <Router>
      <div
        className="min-h-screen flex flex-col bg-gradient-to-br from-[#0d0d0d] via-[#0a0f2a] to-[#1a0025] text-white"
        style={{ fontFamily: 'Poppins, sans-serif' }}
      >
        {/* Navigation Bar */}
        <header className="backdrop-blur-sm bg-[#1c1c2a]/60 border-b border-[#333] px-6 py-4 flex justify-between items-center shadow-md">
          <h1
            className="text-2xl tracking-wider"
            style={{ fontFamily: 'Orbitron, sans-serif', color: '#00e0ff' }}
          >
            Compliance Chatbot
          </h1>
          <nav className="space-x-6 text-sm font-medium">
            <Link to="/" className="text-white hover:text-[#00e0ff] transition">
              Home
            </Link>
            <Link to="/about-chatbot" className="text-white hover:text-[#00e0ff] transition">
              About
            </Link>
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about-chatbot" element={<AboutChatbot />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;