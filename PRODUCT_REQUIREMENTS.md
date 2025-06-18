Reflect – Product Requirements Document (PRD)
Version: 1.0
Date: June 18, 2025

1. Purpose
Reflect is a tool designed for divorced or separated co-parents to manage, analyze, and improve their communication. The app logs message exchanges (text or screenshots) and uses AI-driven analysis to help users:

Understand patterns of manipulation, gaslighting, or toxic communication.

Receive objective, emotionally intelligent suggestions on how to respond.

Maintain a clean, auditable record of communication history.

Reflect empowers users to navigate difficult communication with clarity, emotional control, and evidence-based insights.

2. Goals & Objectives
Goal	Description
✅ Message Clarity	Help users objectively analyze conversations.
✅ Behavior Pattern Detection	Identify manipulation, toxicity, gaslighting patterns.
✅ AI Response Assistance	Suggest emotionally intelligent, constructive responses.
✅ Privacy & Ownership	Users own 100% of their data — deployed on their infra.
✅ Low Barrier Deployment	Simple deployment using Railway, with BYO-AI APIs.

3. Key Features
3.1 Message Journal
Log messages manually as text or via screenshot upload.

Sequential timeline of message threads.

Attach timestamps, tags, and metadata.

3.2 AI-Driven Message Analysis
Detect patterns of:

Manipulation

Gaslighting

Passive aggression

Coercion

Stonewalling

Positive/reasonable communication

AI-generated summaries for each message.

Emotional tone analysis (anger, fear, guilt, etc.).

3.3 Suggested Responses
AI proposes response drafts based on:

De-escalation techniques.

Boundary setting.

Assertive but non-aggressive tone.

Option to edit or write own response.

Response logged in thread for continuity.

3.4 Tagging & Pattern Recognition
Tag messages manually or auto-tag via AI:

Important dates (court, school events, etc.).

High-conflict messages.

Toxic behavior patterns.

Tag filters in UI to review trends.

3.5 Multi-Model AI Support
Users can add multiple AI providers/API keys:

OpenAI, Groq, Anthropic, Ollama, etc.

Select AI model for each task (like Cursor or LM Studio).

Local inference (Ollama) or cloud APIs.

3.6 Data Ownership & Privacy
App is self-hosted by the user.

Fully open source.

Data stored only on user's database/server.

4. Functional Requirements
4.1 User Accounts (Optional V1)
(Optional in MVP) — Login with JWT-based authentication.

Local-only account tied to deployment (single user).

4.2 Message Management
CRUD for messages.

Upload screenshots or OCR text extraction.

Display threaded conversation.

4.3 AI API Management
Add, edit, delete API keys.

Test connection to AI provider.

Fetch available models per provider.

4.4 Analysis Engine
Trigger analysis on message creation.

Store analysis output as JSON tied to message ID.

Allow re-running analysis with different models.

4.5 Suggested Response Engine
Generate response suggestions.

Allow user to accept, edit, or discard suggestions.

Store chosen response in thread.

4.6 Storage Management
Store file uploads (screenshots, attachments) in Railway volume or external S3.

5. Non-Functional Requirements
Requirement	Description
Scalability	Single-user focus; scalable per deployment instance.
Performance	Sub-second UI; AI response depends on API latency.
Security	API keys encrypted in DB; HTTPS; JWT auth.
Privacy	No external hosting — 100% user-controlled.
Cost Efficiency	Railway Free/Starter tiers + BYO AI keys.

6. Tech Stack
Component	Technology
Frontend	Next.js + Tailwind + shadcn/ui
Backend	NestJS (TypeScript)
Database	PostgreSQL (Railway plugin)
Storage	Railway Volume or S3
AI Clients	OpenAI, Groq, Ollama, Anthropic
OCR	Tesseract (local) or Google Vision

7. Deployment Model
Default deployment: Railway.

Users deploy their own instance.

Includes backend (NestJS), frontend (Next.js), database, and file storage.

8. User Flow Example
   
```plaintext
1. User logs into Reflect.
2. Uploads a new message (text or screenshot with OCR).
3. App logs the message in chronological order.
4. AI runs analysis:
   - Labels tone, sentiment, and behavior patterns.
5. App suggests 1-3 response options.
6. User picks, edits, or ignores the suggestions.
7. User sends their response (logged in thread).
8. User can view pattern analysis over time.
```

9. Stretch Features (Future Roadmap)
Voice message transcription (Whisper).

Multi-user (invite lawyers, therapists, or mediators).

Export report PDFs for legal use.

Notification for detected high-conflict patterns.

AI training with user's prior message history for more personalized suggestions.

10. Success Metrics
✅ Successful deployment by a non-technical user on Railway.

✅ User logs at least one message, runs analysis, and generates a response.

✅ AI provider switching works smoothly.

✅ No data leaves user's server except AI API calls.

11. Risks & Mitigation
Risk	Mitigation
API key misuse or leaks	Encrypt keys in DB, show warnings in UI.
AI hallucination in suggestions	Provide disclaimers; allow user full control.
AI API downtime or costs	Support multiple providers and local models.
Deployment complexity for users	Railway one-click deploy with strong documentation.

12. Conclusion
Reflect is designed to serve a very real, underserved need for co-parents navigating difficult communication scenarios. With AI-powered clarity, privacy-first design, and simple deployment, Reflect empowers users to take control of their communication landscape without relying on centralized SaaS platforms.
