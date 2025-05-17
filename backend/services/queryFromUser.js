import { configDotenv } from 'dotenv';
configDotenv();
import OpenAI from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';
import readline from 'readline';



const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});


const index = pc.index(process.env.PINECONE_INDEX_NAME);




/**
 * Checks whether a user's question is about:
 * - the assistant itself (YES_META)
 * - cybersecurity compliance (YES_COMPLIANCE)
 * - or something unrelated (NO)
 */
async function isLogicalComplianceQuestion(prompt) {
  const validationPrompt = `The user is talking to a cybersecurity compliance assistant trained on the NIST Cybersecurity Framework. The assistant can only answer:

1. Questions about cybersecurity compliance (e.g., policies, controls, procedures, logging, access control)
2. Questions about itself (e.g., who made you, how to use you, what are you built on, or anything referencing the developer such as "Om", "Omkumar", or "Omkumar Vijaysinh Solanki")

Evaluate the user's question: "${prompt}"

Return YES_META if it’s about the chatbot. Return YES_COMPLIANCE if it’s about cybersecurity compliance. Return NO if it is completely unrelated.`;

  const res = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'Return YES_META, YES_COMPLIANCE, or NO' },
      { role: 'user', content: validationPrompt },
    ],
    max_tokens: 2,
    temperature: 0,
  });

  return res.choices[0].message.content.trim();
}

/**
 * Main function to process the user's question and return a smart reply.
 * This is what you call from your Express route.
 */
export async function queryFromUser(userQuestion) {
  try {
    console.log("\n=== Incoming question ===");
    console.log("User:", userQuestion);

    // Step 1: Check if it's a valid meta/compliance question
    const validationResult = await isLogicalComplianceQuestion(userQuestion);

    // Step 2: If not relevant at all
    if (validationResult === 'NO') {
      return "This question is not related to cybersecurity compliance or the assistant itself. Please rephrase your question.";
    }

    // Step 3: Answer questions about the assistant (meta)
    if (validationResult === 'YES_META') {
      const metaResponse = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `
You are a domain-specific AI assistant designed to answer questions about your own purpose, capabilities, and usage.

The chatbot was created by Omkumar Vijaysinh Solanki — a full-stack developer (iOS, Web3, AI/ML).

You were built using:
- OpenAI for language understanding
- Pinecone for vector search
- Designed to assist with interpreting the NIST Cybersecurity Framework (CSF) Version 2.0

Respond clearly and professionally.
LinkedIn: https://www.linkedin.com/in/omkumar-solanki-atluxuarywxtchbusinessmandeveloper2/
GitHub: https://github.com/tcoders16
            `
          },
          { role: 'user', content: userQuestion }
        ],
        temperature: 0.5,
        max_tokens: 300,
      });

      const metaAnswer = metaResponse.choices[0].message.content;
      return metaAnswer;
    }

    // Step 4: Handle cybersecurity compliance questions
    // Convert user question to embedding
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: userQuestion,
    });

    const embeddedVector = embeddingResponse.data[0].embedding;

    // Query Pinecone for top 5 relevant context matches
    const pineconeResults = await index.namespace("ns1").query({
      vector: embeddedVector,
      topK: 5,
      includeMetadata: true,
    });

    // Concatenate matched text chunks
    const context = pineconeResults.matches.map(m => m.metadata.text).join("\n");

    // Send context + question to OpenAI for a grounded answer
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `
You are a cybersecurity compliance assistant trained to answer questions using ONLY the context provided from the NIST CSF Version 2.0.

Guidelines:
- If context is insufficient, say:
"Unable to answer: The required information is not available in the provided NIST CSF context."
- If valid, reply with:
"Answer: YES" or "Answer: NO"
- Follow up with brief justification and list relevant sections.

Always end with:
Based on: NIST Cybersecurity Framework (CSF) Version 2.0  
Document ID: NIST CSWP 29
          `
        },
        {
          role: "user",
          content: `
Context:
---------------
${context}
---------------
Question:
"${userQuestion}"
          `
        }
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    const answer = completion.choices[0].message.content;
    return answer;

  } catch (err) {
    console.error("Error inside queryFromUser:", err.message);
    return "An error occurred while processing your request.";
  }
}