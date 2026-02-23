<div align="center">
<h1>🏠 AI Property Risk Analysis System</h1>
<p>AI-Powered Land & Property Document Risk Evaluation Platform</p>
</div>

---

#  Overview

The **AI Property Risk Analysis System** is a full-stack web application that analyzes land and property-related documents such as:

- Sale Deeds  
- Encumbrance Certificates (EC)  
- Ownership Records  

The system extracts document content, processes it using a locally hosted AI model, and generates:

- 📄 Risk Summary  
- ⚖️ Ownership, Legal, Financial & Structural Risk Classification  
- 📊 Risk Visualization Charts  
- 🕒 Property Event Timeline  

---

# System Architecture

Frontend (React + TypeScript)  
⬇  
Backend (Node.js + Express)  
⬇  
Local AI Engine (Ollama LLM)  
⬇  
Structured Risk Assessment Output  

---

#  Tech Stack

**Frontend**
- React
- TypeScript
- Vite
- Charting Library (for Risk Visualization)

**Backend**
- Node.js
- Express.js

**AI Engine**
- Ollama (Locally Hosted Large Language Model)

**Security**
- AES Encryption for sensitive processing
- Environment-based configuration
- Secure server-side AI execution

---

# Security Features

- Sensitive data encrypted before processing  
- No API keys exposed in frontend  
- AI runs locally (no external data transmission)  
- Environment variables protected via `.env`  

---

# How To Run Locally (Step-By-Step)

Follow these steps carefully.

---

## ✅ Step 1 — Install Prerequisites

Make sure the following are installed:

- Node.js (v18 or higher recommended)  
- Git  
- Ollama  

Download Ollama from:
https://ollama.com

---

## ✅ Step 2 — Clone the Repository

```bash
git clone https://github.com/your-username/ai-property-risk-analysis.git
cd ai-property-risk-analysis
```

---

## ✅ Step 3 — Install Dependencies

```bash
npm install
```

---

## ✅ Step 4 — Setup Environment Variables

Create a `.env` file in the root folder.

You can copy from `.env.example`:

```bash
copy .env.example .env
```

Inside `.env`, add your encryption key:

```
ENCRYPTION_KEY=your_secure_secret_key_here
```

---

## ✅ Step 5 — Setup Ollama Model

After installing Ollama, pull the required AI model:

```bash
ollama pull llama3
```

You can verify it works by running:

```bash
ollama run llama3
```

Make sure Ollama is running locally on:

```
http://localhost:11434
```

---

## ✅ Step 6 — Start the Application

Run:

```bash
npm run dev
```

You should see:

```
🚀 Secure Server running at http://localhost:4000
```

---

## ✅ Step 7 — Open in Browser

Open:

```
http://localhost:4000
```

Upload a property document and the system will generate a risk analysis report.

---

# 📂 Project Structure

```
src/                  → Frontend source files  
server.ts             → Backend server  
.env.example          → Environment configuration template  
package.json          → Project dependencies  
```

---

# Risk Categories Explained

The system evaluates four primary risk categories:

- **Ownership Risk** → Multiple transfers, disputed ownership  
- **Legal Risk** → Court cases, legal notices  
- **Financial Risk** → Loans, mortgages, unpaid dues  
- **Structural Risk** → Physical property issues (if applicable)  

Each category is analyzed and visualized through charts.

---

#  Important Notes

- Ollama must be running locally before starting the server.
- The AI model runs completely offline.
- This project is built for academic and research purposes.

---

