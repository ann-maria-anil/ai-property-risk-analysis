import express from "express";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import { encrypt, decrypt } from "./src/encryption";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 4000;

  app.use(express.json({ limit: "50mb" }));

  // ==============================
  // SECURE OLLAMA ANALYSIS ROUTE
  // ==============================

  app.post("/api/analyze", async (req, res) => {
    let { documentsText } = req.body;

    if (!documentsText) {
      return res.status(400).json({ error: "No documents text provided" });
    }

    try {
      // 🔒 STEP 1: Encrypt immediately when received
      const encryptedPayload = encrypt(documentsText);

      // 🔓 STEP 2: Decrypt only inside secure execution block
      const decryptedText = decrypt(
        encryptedPayload.encryptedData,
        encryptedPayload.iv,
        encryptedPayload.authTag
      );

      const prompt = `
You are a professional property legal verification AI.

Analyze the following property documents and generate a structured JSON verification report.

Documents Content:
${decryptedText}

Return ONLY valid JSON in this format:

{
  "propertySummary": "string",
  "ownershipTimeline": [
    {
      "year": "string",
      "event": "string",
      "party": "string",
      "details": "string"
    }
  ],
  "risks": [
    {
      "type": "Legal | Financial | Structural | Ownership",
      "severity": "Low | Medium | High",
      "description": "string",
      "recommendation": "string"
    }
  ],
  "riskScore": number,
  "categoryScores": {
    "Legal": number,
    "Financial": number,
    "Structural": number,
    "Ownership": number
  },
  "legalStatus": "string",
  "surveyDetails": "string"
}
`;

      const response = await axios.post(
        process.env.OLLAMA_URL || "http://localhost:11434/api/generate",
        {
          model: "llama3",
          prompt: prompt,
          stream: false,
        }
      );

      const rawText = response.data.response;

      // Extract clean JSON from LLaMA output
      const jsonStart = rawText.indexOf("{");
      const jsonEnd = rawText.lastIndexOf("}");
      const cleanJson = rawText.substring(jsonStart, jsonEnd + 1);

      const result = JSON.parse(cleanJson);

      // 🧹 Clear sensitive data from memory
      documentsText = null as any;

      res.json(result);

    } catch (error: any) {
      console.error("Secure Ollama Error:",error.response?.data || error.message);
      res.status(500).json({
        error: "Failed to analyze documents securely.LLama model overload",
      });
    }
  });

  // ==============================
  // VITE DEV SERVER
  // ==============================

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });

    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Secure Server running at http://localhost:${PORT}`);
  });
}

startServer();