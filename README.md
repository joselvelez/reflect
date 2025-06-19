# 🪞 Reflect

Reflect is an open-source, full-stack Next.js application for AI-powered communication analysis for co-parents.

## Features
- Clerk Authentication
- Message logging (text + screenshots with OCR)
- AI analysis (detect manipulation, toxicity)
- Response suggestions
- BYO AI keys (OpenAI, Anthropic, Groq)
- Self-hosted with simple Railway deployment

## Deployment
1. Clone the repo
2. Configure `.env` with your keys
3. Run:
```
pnpm install
pnpm prisma db push
pnpm dev
```
4. Done ✅

## License
AGPL-3.0
