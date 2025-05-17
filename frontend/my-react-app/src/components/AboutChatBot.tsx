import React from 'react';

const AboutChatbot = () => {
  return (
    <div
      className="bg-gradient-to-br from-[#0d0d0d] via-[#0a0f2a] to-[#1a0025] min-h-screen text-white"
      style={{ fontFamily: 'Poppins, sans-serif' }}
    >
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1
          className="text-4xl mb-10 text-center tracking-wide"
          style={{ color: '#00e0ff', fontFamily: 'Orbitron, sans-serif' }}
        >
          Cybersecurity Compliance Chatbot
        </h1>

        {/* What it does */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2" style={{ fontFamily: 'Orbitron', color: '#00e0ff' }}>
            What this chatbot does
          </h2>
          <p className="text-gray-300">
            This chatbot answers questions about the NIST Cybersecurity Framework (CSF) Version 2.0.
            You can ask about access control, logging, policies, or even who built this chatbot.
            It only responds to relevant, compliance-related questions.
          </p>
        </section>

        {/* How it works */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2" style={{ fontFamily: 'Orbitron', color: '#00e0ff' }}>
            How it works (RAG-based retrieval)
          </h2>
          <p className="text-gray-300 mb-3">
            The chatbot uses a technique called <strong>Retrieval-Augmented Generation (RAG)</strong>.
            It retrieves relevant chunks from a vector database and uses those chunks to answer the question through GPT.
          </p>
          <ul className="list-disc ml-6 text-gray-300 space-y-2">
            <li>NIST CSF v2.0 PDF is split into paragraph-level "chunks"</li>
            <li>Each chunk is converted into a vector using OpenAI's embedding model</li>
            <li>Vectors are stored in <strong>Pinecone</strong> for fast similarity search</li>
            <li>
              When a question is asked:
              <ul className="list-disc ml-6 mt-1">
                <li>The question is also embedded into a vector</li>
                <li>Pinecone finds the closest matching document chunks</li>
                <li>These chunks are fed into GPT-3.5 along with your question</li>
                <li>GPT answers based only on the retrieved content</li>
              </ul>
            </li>
          </ul>
        </section>

        {/* Why it matters */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2" style={{ fontFamily: 'Orbitron', color: '#00e0ff' }}>
            Why this matters
          </h2>
          <ul className="list-disc ml-6 text-gray-300 space-y-1">
            <li>Manual compliance reading is slow and error-prone</li>
            <li>This bot gives instant answers from NIST documentation</li>
            <li>Ideal for DevSecOps, security auditors, CISOs, and students</li>
          </ul>
        </section>

        {/* What is ChatGPT */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2" style={{ fontFamily: 'Orbitron', color: '#00e0ff' }}>
            What is ChatGPT's role?
          </h2>
          <p className="text-gray-300">
            ChatGPT is used only as a language generator. It receives extracted context from Pinecone and is instructed:
            <em>“Only answer based on this context.”</em> This ensures the response is grounded and accurate.
          </p>
        </section>

        {/* Pinecone data format */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2" style={{ fontFamily: 'Orbitron', color: '#00e0ff' }}>
            How Pinecone stores and returns data
          </h2>

          <p className="text-gray-300 mb-4">Each chunk is stored with its vector and text metadata:</p>
          <div className="bg-[#1a1a1a] text-sm p-4 rounded-md mb-4 overflow-x-auto border border-gray-600">
            <pre className="text-[#00ff90]">
{`{
  id: "chunk_015",
  values: [0.025, -0.043, 0.112, ...],
  metadata: {
    text: "Access control includes the processes, policies, and technologies..."
  }
}`}
            </pre>
          </div>

          <p className="text-gray-300 mb-2">
            Pinecone query result format:
          </p>
          <div className="bg-[#1a1a1a] text-sm p-4 rounded-md overflow-x-auto border border-gray-600">
            <pre className="text-[#00e0ff]">
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
        </section>

        {/* RAG Backend Code Block */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4" style={{ fontFamily: 'Orbitron', color: '#00e0ff' }}>
            Sample Backend Code for Retrieval-Augmented Generation
          </h2>
          <div className="bg-[#1a1a1a] text-xs p-4 rounded-md overflow-x-auto border border-gray-600 text-[#00ff90] font-mono leading-relaxed">
            <pre>
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
      content: \`You are a compliance assistant. Use only the context below. If it's missing, say so.\`,
    },
    {
      role: "user",
      content: \`Context:\n\${context}\n\nQuestion: \${userQuestion}\`,
    },
  ],
  temperature: 0.3,
});`}
            </pre>
          </div>
        </section>

        {/* PDF Viewer */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-2" style={{ fontFamily: 'Orbitron', color: '#00e0ff' }}>
            View the NIST CSF PDF (v2.0)
          </h2>
          <iframe
            src="/data.pdf"
            title="NIST CSF v2.0"
            className="w-full h-[700px] border border-gray-700 rounded-md"
          />
          <p className="text-sm mt-2 text-gray-400">
            Source: {" "}
            <a
              href="https://www.nist.gov/cyberframework"
              className="underline"
              style={{ color: '#00e0ff' }}
              target="_blank"
              rel="noreferrer"
            >
              NIST Cybersecurity Framework Official Site
            </a>
          </p>
        </section>



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
    </div>
  );
};

export default AboutChatbot;