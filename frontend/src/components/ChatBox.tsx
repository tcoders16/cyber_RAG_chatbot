import { useEffect, useRef, useState } from 'react';

type Message = {
  text: string;
  role: 'user' | 'bot';
};

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [showVectorDetails, setShowVectorDetails] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input;
    setMessages(prev => [...prev, { text: userText, role: 'user' }]);
    setInput('');

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}`, {
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
      className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 flex flex-col min-h-[100dvh]"
      style={{ backgroundColor: '#0d0d0d', fontFamily: 'Poppins, sans-serif', color: 'white' }}
    >
      {/* Header */}
      <div className="mb-4">
        <h2
          className="text-2xl sm:text-3xl md:text-4xl tracking-wide mb-1 text-center"
          style={{ fontFamily: 'Orbitron, sans-serif', color: '#00e0ff' }}
        >
          Cyber Compliance Assistant
        </h2>
        <p className="text-sm text-center text-gray-400">
          Ask about NIST CSF v2.0 or the chatbot's architecture and creator.
        </p>
      </div>

      {/* Vector toggle */}
      <div className="text-xs text-gray-300 mb-4 bg-[#121212] p-3 rounded border border-[#333]">
        <button
          className="mb-2 underline text-[#00e0ff]"
          onClick={() => setShowVectorDetails(!showVectorDetails)}
        >
          {showVectorDetails ? 'Hide' : 'Show'} How Vector Search Works
        </button>
        {showVectorDetails && (
          <div className="font-mono space-y-2 text-xs">
            <p>Your question is embedded into a 1536-dimension vector using OpenAI, compared with NIST CSF chunks in Pinecone.</p>
            <p>Pinecone returns the best-matching text chunks, which are then passed to GPT for the final answer.</p>
            <pre className="bg-[#1a1a1a] p-3 rounded border border-gray-600 text-[#00ff90] overflow-x-auto">
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

      {/* Suggestions */}
      <div className="bg-[#0a0a0a] text-white text-xs p-3 rounded-md border border-[#333] mb-4 font-mono max-h-32 overflow-auto">
        <p className="mb-1 font-semibold text-[#00e0ff]">Try these:</p>
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

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-sm mb-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg w-fit max-w-[90%] sm:max-w-lg leading-relaxed ${
              msg.role === 'user'
                ? 'ml-auto bg-[#001d3d] text-[#00e0ff]'
                : msg.text.includes('Unable to answer')
                ? 'bg-[#1a1a1a] text-[#00ff90]'
                : 'bg-[#2e2e2e] text-[#00ff90]'
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Input box */}
      <div className="flex flex-col sm:flex-row gap-3 mt-auto">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask a question..."
          className="flex-1 bg-[#101010] text-white border border-[#333] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00e0ff]"
          style={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px', lineHeight: '1.5' }}
        />
        <button
          onClick={handleSend}
          className="w-full sm:w-auto px-6 py-2 rounded-lg text-black font-semibold shadow hover:brightness-125 transition"
          style={{ backgroundColor: '#00e0ff', fontFamily: 'Orbitron, sans-serif' }}
        >
          Send
        </button>
      </div>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-xs sm:text-sm pt-6 mt-4">
        Developed by <span className="text-[#00e0ff]" style={{ fontFamily: 'Orbitron' }}>Omkumar Solanki</span>
      </footer>
    </div>
  );
}