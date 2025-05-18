import { useState } from 'react';

type Message = {
  text: string;
  role: 'user' | 'bot';
};

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [showVectorDetails, setShowVectorDetails] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input;
    setMessages(prev => [...prev, { text: userText, role: 'user' }]);
    setInput('');

    try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userText }),
        });

      const data = await res.json();
      setMessages(prev => [...prev, { text: data.reply, role: 'bot' }]);
    } catch (err) {
      console.error('Server error:', err);
      setMessages(prev => [...prev, { text: 'Could not reach the server.', role: 'bot' }]);
    }
  };

  return (
    <div
      className="max-w-4xl mx-auto p-6 rounded-2xl border border-[#1a1a1a] shadow-2xl flex flex-col h-[90vh]"
      style={{ backgroundColor: '#0d0d0d', fontFamily: 'Poppins, sans-serif', color: 'white' }}
    >
      {/* Header */}
      <div className="mb-4">
        <h2
          className="text-3xl tracking-wide mb-1"
          style={{ fontFamily: 'Orbitron, sans-serif', color: '#00e0ff' }}
        >
          Cyber Compliance Assistant
        </h2>
        <p className="text-sm text-gray-400">
          Ask about NIST CSF v2.0 or the chatbot's architecture and creator.
        </p>
      </div>

      {/* Toggle vector explanation */}
      <div className="text-xs text-gray-300 mb-4 bg-[#121212] p-3 rounded border border-[#333] overflow-y-auto">
        <button
          className="mb-2 underline"
          onClick={() => setShowVectorDetails(!showVectorDetails)}
          style={{ color: '#00e0ff' }}
        >
          {showVectorDetails ? 'Hide' : 'Show'} How Vector Search Works
        </button>
        {showVectorDetails && (
          <div className="text-gray-300 text-xs font-mono space-y-2">
            <p>
              Your question is converted into a 1536-dimension vector using OpenAI's embedding model and
              compared with stored NIST CSF chunks using Pinecone.
            </p>
            <p>
              Pinecone returns top matching chunks. ChatGPT answers using only that context.
            </p>
            <pre className="bg-[#1a1a1a] p-3 rounded overflow-x-auto border border-gray-700 text-[#00ff90]">
{`{
  id: "chunk_103",
  values: [0.123, -0.045, ...],
  metadata: {
    text: "Access control ensures only authorized users..."
  }
}`}
            </pre>
          </div>
        )}
      </div>

      {/* Suggestions - Scrollable */}
      <div className="bg-black text-white text-xs p-3 rounded-md border border-[#333] mb-4 font-mono overflow-auto max-h-32">
        <p className="mb-1 font-semibold" style={{ color: '#00e0ff' }}>Try these:</p>
        <pre className="whitespace-pre-wrap">
{`1. What is access control in the NIST Cybersecurity Framework?
2. How does NIST define vulnerability management?
3. What controls are part of the Identify function?
4. What are the guidelines for audit logging in NIST?
5. How does NIST CSF handle third-party risk?
6. Who created this chatbot?
7. What is your architecture?
8. Do you use ChatGPT or OpenAI?
9. Are you trained only on NIST CSF documents?
10. What is a Pinecone vector store?`}
        </pre>
      </div>

      {/* Chat history - Scrollable */}
      <div className="flex-1 overflow-y-auto mb-4 pr-2 space-y-3 scrollbar-thin scrollbar-thumb-[#333] scrollbar-track-black text-sm">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg w-fit max-w-lg leading-relaxed ${
              msg.role === 'user'
                ? 'ml-auto bg-[#001d3d] text-[#00e0ff] shadow-md'
                : msg.text.includes('Unable to answer')
                ? 'bg-[#1a1a1a] text-[#00ff90]'
                : 'bg-[#2e2e2e] text-[#00ff90]'
            }`}
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-3 mt-auto">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask a question..."
          className="flex-1 bg-black text-white border border-gray-700 p-3 rounded-lg focus:outline-none focus:ring-2"
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '14px',
            lineHeight: '1.5',
            caretColor: '#00e0ff',
            borderColor: '#333',
          }}
        />
        <button
          onClick={handleSend}
          className="px-6 py-2 rounded-lg hover:brightness-125 transition text-black"
          style={{ backgroundColor: '#00e0ff', fontFamily: 'Orbitron, sans-serif' }}
        >
          Send
        </button>
      </div>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm pt-4">
        Developed by <span style={{ fontFamily: 'Orbitron', color: '#00e0ff' }}>Omkumar Solanki</span>
      </footer>
    </div>
  );
}