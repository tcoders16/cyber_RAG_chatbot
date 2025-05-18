// src/pages/Home.tsx

import ChatBox from '../components/ChatBox';

export default function Home() {
  return (
    <div
      className="bg-gradient-to-br from-[#0d0d0d] via-[#0a0f2a] to-[#1a0025] min-h-screen text-white flex flex-col justify-between"
      style={{ fontFamily: 'Poppins, sans-serif' }}
    >
      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Page Title */}
        <h1
          className="text-4xl text-center mb-4 tracking-wide"
          style={{ fontFamily: 'Orbitron, sans-serif', color: '#00e0ff' }}
        >
          Lawyer Chat Assistant
        </h1>

        {/* Subheading Description */}
        <p className="text-center text-sm text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
          This AI-powered assistant helps you understand legal and cybersecurity compliance
          using the NIST Cybersecurity Framework (CSF) Version 2.0. You can ask questions
          about access control, risk management, policies, logging, incident response, and more.
          The chatbot retrieves real document-backed answers using vector search and GPT technology.
          You can also ask about the assistant’s design, technology, or its developer, Omkumar Solanki.
        </p>

        {/* Chat Interface */}
        <ChatBox />
      </div>

      {/* Footer Section */}
      <footer className="text-center text-gray-500 text-sm border-t border-gray-800 py-6">
        <p className="mb-1">This chatbot helps users understand cybersecurity and legal compliance topics through AI-powered conversation.</p>
        <p>
          Designed & Developed by{" "}
          <span style={{ fontFamily: 'Orbitron', color: '#00e0ff' }}>
            Omkumar Solanki
          </span>
        </p>
      </footer>
    </div>
  );
}