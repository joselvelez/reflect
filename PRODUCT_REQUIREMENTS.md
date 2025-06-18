# Reflect – Product Requirements Document (PRD)

## 🏗️ Purpose
Reflect empowers separated or divorced parents to communicate with mindfulness, clarity, and safety. It enables users to log conversations, detect manipulative or abusive patterns, and receive AI-generated suggestions for objective, constructive responses.

## 🧠 Problem
- High-conflict co-parenting often involves manipulation, gaslighting, and toxic behaviors.
- Users need a tool to help interpret emotionally charged messages objectively.
- No current solutions exist that combine AI analysis, message journaling, and response suggestions for this purpose.

## 🎯 Solution
A web-based application that:
- Logs text or screenshot-based messages.
- Analyzes message tone, patterns of abuse/manipulation.
- Suggests thoughtful and constructive responses.
- Supports tagging of events and behavioral patterns.
- Keeps full conversation history with sequential context.

## 🏛️ Core Features

### 1. Message Intake
- Input as:
  - Text (manual input)
  - Screenshots (OCR processed)
- Stored chronologically in conversation threads.

### 2. AI Analysis
- Detect:
  - Manipulation
  - Gaslighting
  - Emotional abuse patterns
  - Tone and sentiment
- Models are user-configurable (OpenAI, Anthropic, Groq, etc.).
- Support per-user API keys (BYO-AI).

### 3. Suggested Responses
- AI proposes reply options:
  - Calm, objective
  - Avoids escalation
  - Maintains legal safety and clarity

### 4. Tagging & Tracking
- User-created tags:
  - "Manipulation"
  - "Abuse"
  - "Important Date"
- AI-suggested tags based on detected patterns.

### 5. Response Logging
- User logs their actual replies.
- Responses are analyzed and added to the conversation chain.

### 6. Privacy & Deployment
- Fully self-hosted.
- Default deployment template for Railway.
- Data never touches Reflect servers — runs on the user’s infrastructure.
- Enforced privacy and data ownership.

## 🚀 Tech Stack

- **Frontend:** Next.js (React) + Clerk (Auth)
- **Backend:** NestJS (Node) + Prisma (MongoDB)
- **Database:** MongoDB (Railway default or user choice)
- **AI Providers:** BYO (OpenAI, Anthropic, Groq, etc.)
- **OCR:** Tesseract.js (local) or hosted API

## 📜 Non-Goals
- Not a replacement for legal counsel.
- Not a public SaaS offering — designed for self-hosting.

## 🛠️ Roadmap (v1.0)
- [ ] Message intake (text + screenshot OCR)
- [ ] AI analysis MVP (toxicity, manipulation detection)
- [ ] Suggested response engine
- [ ] Basic tagging
- [ ] User API key management
- [ ] Clerk auth + user accounts
- [ ] Deployment template for Railway

---

## 🧭 Future Ideas
- Data visualization for communication patterns over time.
- Exportable reports for legal or therapy use.
- Multi-party support (group chats, legal monitors, therapists).
- Optional integrations with external OCR APIs.
