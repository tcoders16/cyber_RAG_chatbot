import { configDotenv } from 'dotenv';
configDotenv();
import fs from 'fs';
import pdf from 'pdf-parse';
import { OpenAI } from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';
import chalk from 'chalk';

// === Developer Banner ===
console.log(chalk.bold.cyan("\n🔐 Omkumar Solanki's Cyber RAG Bot Initializing...\n"));


// OpenAI and Pinecone Clients
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Pinecone Client

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

// Pinecone Index

console.log("Connecting to Pinecone...");
const index = pc.index(process.env.PINECONE_INDEX_NAME);


function chunkText(text, chunkSize = 500) {
  console.log("Chunking text...");
  const sentences = text.split('. ');
  const chunks = [];
  let chunk = "";

  for (const sentence of sentences) {
    if ((chunk + sentence).length < chunkSize) {
      chunk += sentence + ". ";
    } else {
      chunks.push(chunk.trim());
      chunk = sentence + ". ";
    }
  }

  if (chunk) chunks.push(chunk.trim());
  console.log(`Created ${chunks.length} chunks.`);
  return chunks;
}

async function uploadPdfToPinecone(pdfPath) {
  try {
    console.log("Reading PDF:", pdfPath);
    const buffer = fs.readFileSync(pdfPath);

    console.log("Extracting text from PDF...");
    const data = await pdf(buffer);

    const chunks = chunkText(data.text);
    const vectors = [];

    console.log("Creating embeddings and preparing vectors...");
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];

      const embeddingRes = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: chunk,
      });

      vectors.push({
        id: `chunk-${i}`,
        values: embeddingRes.data[0].embedding,
        metadata: { text: chunk },
      });

      if ((i + 1) % 5 === 0 || i === chunks.length - 1) {
        console.log(`Processed ${i + 1}/${chunks.length} chunks`);
      }
    }

    console.log(chalk.green("Uploading vectors to Pinecone..."));
    await index.namespace('ns1').upsert(vectors);
    console.log(chalk.green(`Uploaded ${vectors.length} chunks from ${pdfPath}`));
  } catch (err) {
    console.error(chalk.red("Error during PDF upload:"), err.message);
  }
}

uploadPdfToPinecone('./data.pdf');