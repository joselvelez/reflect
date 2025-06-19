import { NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'
import { auth } from '@clerk/nextjs'
import { analyzeMessage } from '@/src/lib/ai'

export async function POST(req: Request) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { messageId } = await req.json()

  const message = await prisma.message.findUnique({
    where: { id: messageId, userId }
  })

  if (!message) return NextResponse.json({ error: 'Message not found' }, { status: 404 })

  const userApiKey = await prisma.aPIKey.findFirst({
    where: { userId, provider: 'openai' }
  })

  if (!userApiKey) return NextResponse.json({ error: 'No API key configured' }, { status: 400 })

  const result = await analyzeMessage({
    message: message.content,
    apiKey: userApiKey.key,
    provider: 'openai'
  })

  const analysis = await prisma.analysis.create({
    data: {
      messageId: message.id,
      result
    }
  })

  return NextResponse.json(analysis)
}
