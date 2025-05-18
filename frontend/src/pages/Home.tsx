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
          Cybersecurity RAG Chatbot (GPT + Pinecone)
        </h1>

        {/* Architecture Highlight */}
        <div className="bg-[#121212] border border-[#333] text-center text-sm sm:text-base text-gray-100 rounded-xl px-6 py-4 mb-6 shadow-lg leading-relaxed">
          ⚙️ Built using <strong>OpenAI Embeddings</strong>, <strong>Pinecone Vector DB</strong>, and <strong>GPT-3.5</strong> via a Retrieval-Augmented Generation (RAG) pipeline.  
          Your input is embedded, matched against NIST CSF v2.0 chunks, and answered contextually by GPT with zero hallucination.
        </div>

        {/* Subheading for Engineers */}
        <p className="text-center text-sm text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
          This assistant demonstrates a full-stack AI pipeline: document chunking → vector embedding → semantic retrieval → context-constrained LLM completion.  
          Built for compliance, but extensible to any domain-specific RAG system. Explore its NLP workflow, vector indexing strategy, or prompt design by asking how it works.
        </p>

        {/* Chat Interface */}
        <ChatBox />
      </div>

      {/* Footer Section */}
      <footer className="text-center text-gray-400 text-sm border-t border-gray-800 py-6">
        <p className="mb-1">
          🔍 Uses OpenAI embeddings (1536-d) for semantic similarity. Queries Pinecone for top-k context and routes it to GPT-3.5. Answers are strictly context-bounded.
        </p>
      </footer>
    </div>
  );
}