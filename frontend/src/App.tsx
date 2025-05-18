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
        <header className="sticky top-0 z-50 backdrop-blur-sm bg-[#1c1c2a]/70 border-b border-[#333] px-6 py-4 flex justify-between items-center shadow-md">
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

        {/* Main Content Area */}
        <main className="flex-1 w-full px-4 py-10 sm:px-6 lg:px-12">
          <div className="max-w-screen-lg mx-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about-chatbot" element={<AboutChatbot />} />
            </Routes>
          </div>
        </main>

        {/* Optional Footer (remove if not needed) */}
        <footer className="text-center text-gray-500 text-sm border-t border-[#333] py-4">
          <p>
            © {new Date().getFullYear()} Built by{" "}
            <span className="text-[#00e0ff]" style={{ fontFamily: 'Orbitron' }}>
              Omkumar Solanki
            </span>
          </p>
        </footer>
      </div>
    </Router>
  );
}

export default App;



// const App = () => {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0d0d0d] via-[#0a0f2a] to-[#1a0025] text-white">
//       <div className="p-8 sm:p-12 md:p-16 bg-[#121212] rounded-2xl shadow-2xl border border-[#2a2a2a] max-w-lg w-full text-center">
//         <h1
//           className="text-3xl sm:text-4xl font-bold mb-4"
//           style={{ fontFamily: 'Orbitron, sans-serif', color: '#00e0ff' }}
//         >
//           Hello World 🌐
//         </h1>
//         <p className="text-gray-300 text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
//           Welcome to your cool-looking starter component. Make something awesome!
//         </p>
//       </div>
//     </div>
//   );
// };

// export default App;
