const AboutChatbot = () => {
  return (
    <div
      className="bg-gradient-to-br from-[#0d0d0d] via-[#0a0f2a] to-[#1a0025] min-h-screen text-white"
      style={{ fontFamily: 'Poppins, sans-serif' }}
    >
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">

        <h1
          className="text-4xl font-bold text-center"
          style={{ fontFamily: 'Orbitron, sans-serif', color: '#00e0ff' }}
        >
          Cybersecurity Compliance Chatbot — Technical Overview
        </h1>

        {/* Section: What this chatbot does */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold" style={{ fontFamily: 'Orbitron', color: '#00e0ff' }}>
            What this chatbot does
          </h2>
          <p className="text-gray-300 leading-relaxed">
            This chatbot provides AI-powered responses specifically about the NIST Cybersecurity Framework (CSF) Version 2.0. It enables developers and compliance teams to ask natural language questions and receive contextually accurate answers, grounded in official documentation.
          </p>
        </div>

        {/* Section: How it works */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold" style={{ fontFamily: 'Orbitron', color: '#00e0ff' }}>
            How it works (RAG-based retrieval)
          </h2>
          <p className="text-gray-300 leading-relaxed">
            This chatbot follows a <strong>Retrieval-Augmented Generation (RAG)</strong> architecture combining OpenAI embeddings, Pinecone vector search, and GPT-3.5 to generate grounded responses:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-gray-300">
            <li><strong>Chunking</strong>: The NIST CSF PDF is split into semantic paragraph-level chunks</li>
            <li><strong>Embedding</strong>: Each chunk is converted into a 1536-dimensional vector using OpenAI’s <code>text-embedding-3-small</code> model</li>
            <li><strong>Storage</strong>: Vectors + metadata are stored in Pinecone for similarity-based querying</li>
            <li><strong>Retrieval</strong>: User input is embedded and matched with top-k similar chunks</li>
            <li><strong>Completion</strong>: Retrieved content is used as context for GPT-3.5 to answer accurately</li>
          </ul>
        </div>

        {/* Section: Why this matters */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold" style={{ fontFamily: 'Orbitron', color: '#00e0ff' }}>
            Why this matters
          </h2>
          <ul className="list-disc pl-6 space-y-1 text-gray-300">
            <li>⚡ Enables fast, document-backed cybersecurity Q&A</li>
            <li>📘 Reduces the need to manually read large PDFs</li>
            <li>🧠 Ideal for devs, compliance teams, DevSecOps engineers, and CISOs</li>
          </ul>
        </div>

        {/* Section: ChatGPT role */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold" style={{ fontFamily: 'Orbitron', color: '#00e0ff' }}>
            What is ChatGPT’s role?
          </h2>
          <p className="text-gray-300 leading-relaxed">
            ChatGPT is used purely for language generation. It does not hallucinate new answers because it is constrained to only respond using the retrieved context from Pinecone. This ensures factual accuracy.
          </p>
        </div>

        {/* Section: Pinecone data */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold" style={{ fontFamily: 'Orbitron', color: '#00e0ff' }}>
            How Pinecone stores and returns data
          </h2>

          <p className="text-gray-300">Each embedded chunk is stored with an ID, vector array, and its original paragraph as metadata:</p>
          <pre className="bg-[#1a1a1a] text-sm p-4 rounded-md overflow-x-auto border border-gray-600 text-[#00ff90]" style={{ fontFamily: 'Fira Code, monospace' }}>
{`{
  id: "chunk_015",
  values: [0.025, -0.043, 0.112, ...],
  metadata: {
    text: "Access control includes the processes, policies, and technologies..."
  }
}`}
          </pre>

          <p className="text-gray-300 mt-2">Query results look like this:</p>
          <pre className="bg-[#1a1a1a] text-sm p-4 rounded-md overflow-x-auto border border-gray-600 text-[#00e0ff]" style={{ fontFamily: 'Fira Code, monospace' }}>
{`[
  {
    score: 0.912,
    metadata: {
      text: "Access control ensures only authorized users..."
    }
  },
  {
    score: 0.847,
    metadata: {
      text: "Authentication and authorization mechanisms are part of..."
    }
  }
]`}
          </pre>
        </div>

        {/* Section: RAG backend code */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold" style={{ fontFamily: 'Orbitron', color: '#00e0ff' }}>
            Backend RAG Logic (Node.js)
          </h2>
          <p className="text-gray-300">Here's how the RAG process works step-by-step:</p>
          <pre className="bg-[#1a1a1a] text-xs p-4 rounded-md overflow-x-auto border border-gray-600 text-[#00ff90]" style={{ fontFamily: 'Fira Code, monospace' }}>
{`// Step 1: Embed the user's question
const embedding = await openai.embeddings.create({
  model: "text-embedding-3-small",
  input: userQuestion,
});

// Step 2: Query Pinecone
const results = await pinecone.index("cybersecvectordb")
  .namespace("ns1")
  .query({
    vector: embedding.data[0].embedding,
    topK: 5,
    includeMetadata: true,
  });

// Step 3: Collect context
const context = results.matches.map(m => m.metadata.text).join("\n");

// Step 4: Ask GPT with context
const completion = await openai.chat.completions.create({
  model: "gpt-3.5-turbo",
  messages: [
    {
      role: "system",
      content: 'You are a compliance assistant. Use only the context below. If it's missing, say so.',
    },
    {
      role: "user",
      content: 'Context:\n$ {context}\n\nQuestion: $ {userQuestion}',
    },
  ],
  temperature: 0.3,
});`}
          </pre>
        </div>

        {/* Section: PDF viewer */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold" style={{ fontFamily: 'Orbitron', color: '#00e0ff' }}>
            View the NIST CSF PDF (v2.0)
          </h2>
          <iframe
            src="/data.pdf"
            title="NIST CSF v2.0"
            className="w-full h-[700px] border border-gray-700 rounded-md"
          />
          <p className="text-sm mt-2 text-gray-400">
            Source: <a href="https://www.nist.gov/cyberframework" className="underline" style={{ color: '#00e0ff' }} target="_blank" rel="noreferrer">NIST Cybersecurity Framework Official Site</a>
          </p>
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm border-gray-800 pt-8 pb-4">
          <p className="mb-1">This chatbot is a live demo of RAG using OpenAI + Pinecone, ideal for building compliant, secure, and factual assistants.</p>
        </footer>
      </div>
    </div>
  );
};

export default AboutChatbot;