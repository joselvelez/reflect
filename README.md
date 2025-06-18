# Reflect

Reflect is an open-source, privacy-first tool designed to help divorced or separated parents navigate high-conflict co-parenting dynamics. It provides an AI-assisted interface to analyze message exchanges, identify manipulative or toxic patterns, and suggest calm, productive responses.

🚀 Overview
Reflect helps separated or divorced parents communicate more mindfully and safely by:

✅ Logging and analyzing messages (text or screenshots)

✅ Detecting manipulation, toxicity, and abuse patterns

✅ Suggesting objective and emotionally healthy responses

✅ Empowering users to track communication history and tag important behaviors

Users bring their own AI API keys (BYO-AI).
Default deployment target: Railway (cheap and simple self-hosting).

## Architecture

```mermaid
  graph TD
    A[User Browser (Next.js Frontend - Reflect)] -->|HTTPS with Clerk Auth| B[NestJS API (Backend)]
    
    B --> C[MongoDB Database]
    B --> D[AI Providers (OpenAI, Anthropic, Groq - BYO API Keys)]
    B --> E[File Storage (e.g., Railway Blob Storage, S3, etc)]
    B --> F[OCR Service (e.g., Tesseract or Hosted API)]
    
    C --> G[Message Logs]
    C --> H[User Settings (API Keys, Preferences)]
    C --> I[AI Analyses & Tags]
```
## ✅ Features
🔐 Clerk-based Authentication (Next.js & NestJS)

📥 Message Intake: Text + Screenshots (with OCR)

🧠 AI Analysis Pipeline: User-selectable AI provider + model

🏷️ Tagging: Track manipulation patterns, dates, important messages

🤖 Response Suggestions: AI generates thoughtful, non-toxic reply suggestions

💾 Full Audit History: Logs all messages, analyses, and user responses

## 🌱 Deployment
The default deployment target is Railway for simplicity and low cost.

Quickstart:
Fork this repo

Deploy backend and frontend on Railway (example templates coming soon)

Setup Clerk for auth

Bring your own AI API keys (OpenAI, Anthropic, etc)

Done ✅

## 🪪 License
This project is licensed under the GNU Affero General Public License v3 (AGPL-3.0).

Full license details

## 📚 Documentation
Product Requirements Document (PRD)

## 🤝 Contributing
We welcome PRs for:

New AI provider integrations

Improved analysis pipelines

UI/UX enhancements

Additional deployment templates

## 🛑 Disclaimer
Reflect is not a substitute for legal, psychological, or medical advice.
Use with care in high-conflict or legally sensitive situations.
