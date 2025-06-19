import { NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'
import { auth } from '@clerk/nextjs'

export async function GET() {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const messages = await prisma.message.findMany({ where: { userId } })
  return NextResponse.json(messages)
}

export async function POST(req: Request) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const message = await prisma.message.create({
    data: {
      content: body.content,
      type: body.type || 'text',
      userId,
      tags: body.tags || []
    }
  })
  return NextResponse.json(message)
}
